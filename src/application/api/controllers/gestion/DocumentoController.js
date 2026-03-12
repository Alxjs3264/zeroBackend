'use strict';
const debug = require('debug')('app:controller:documento');
const path = require('path');
const ejs = require('ejs');
const { config } = require('../../../../common');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const fs = require('fs');
const { fileStoragePath } = require('../../../../common/config/app');
const { CODIGO_PARAMETRO_HEADER_FOOTER_ENTIDADES, CLASIFICACION_FLUJO, BITACORA } = require('../../../../common/config/constants');
const { log } = require('console');

module.exports = function setupComponenteController (services) {
  const {
    DocumentoService,
    AprobacionDocumentosService,
    CorrelativoService,
    FlujoDerivacionService,
    UsuarioService,
    DocumentoCompartidoService,
    CargoService,
    AreaService,
    ParametroService,
    FlujoDocumentalService,
    SolicitudPlantillaService,
    FormularioService,
    AuthService
  } = services;

  async function findAll (req, res) {
    try {
      const respuesta = await DocumentoService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listar (req, res) {
    try {
      const respuesta = await DocumentoService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function superBuscador (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['buscar:flujos:entidad']);

      const respuesta = await DocumentoService.superBuscador(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function superBuscadorDocumentos (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['buscar:flujos:entidad']);
      const datos = req.query;
      datos.usuario = req.user.idUsuario;
      datos.roles = req.user.idRoles;

      const respuesta = await DocumentoService.superBuscadorDocumentos(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function superBuscadorTramites (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['buscar:flujos:entidad']);

      const respuesta = await DocumentoService.superBuscadorTramites(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const { id } = req.params;
      let respuesta = await DocumentoService.findOne({ id });

      if (respuesta?.flujoDocumental?.id) {
        const flujoDocumental = await FlujoDocumentalService.findOne({ id: respuesta?.flujoDocumental?.id });
        const { clasificacion, flujoDerivaciones } = flujoDocumental;

        let tienePermisoPadre = true;

        if (respuesta.idFlujoPadre) {
          const flujoPadre = await FlujoDocumentalService.historial({ id: respuesta.idFlujoPadre });
          const participantesPadre = new Set();
          for (const flujoDerivacion of flujoPadre.flujoDerivaciones) {
            if (flujoDerivacion.idUsuarioRemitente) participantesPadre.add(flujoDerivacion.idUsuarioRemitente);
            if (flujoDerivacion.idUsuarioDestinatario) participantesPadre.add(flujoDerivacion.idUsuarioDestinatario);
          }

          if (flujoPadre.clasificacion === CLASIFICACION_FLUJO.CONFIDENCIAL) {
            const permisoPadre = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['ver:flujos:confidencial'] });

            tienePermisoPadre = participantesPadre.has(req.user.idUsuario) || permisoPadre;
          }
        }

        const participantes = new Set();
        for (const flujoDerivacion of flujoDerivaciones) {
          if (flujoDerivacion.idUsuarioRemitente) participantes.add(flujoDerivacion.idUsuarioRemitente);
          if (flujoDerivacion.idUsuarioDestinatario) participantes.add(flujoDerivacion.idUsuarioDestinatario);
        }

        if (respuesta.docconfidencial) {
          const tienePermiso = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['ver:documento:confidencial'] });
          const esParticipante = respuesta.configuracionDerivaciones.find(c => c.idUsuario === req.user.idUsuario);
          respuesta.docconfidencial = !(participantes.has(req.user.idUsuario) || tienePermiso || esParticipante);
        }

        if (clasificacion === CLASIFICACION_FLUJO.CONFIDENCIAL) {
          const tienePermiso = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['ver:flujos:confidencial'] });

          if (!participantes.has(req.user.idUsuario) && !tienePermiso  && !tienePermisoPadre) {
            respuesta = {
              codigoFlujo   : flujoDocumental.codigoFlujo,
              estado        : flujoDocumental.estado,
              concluido     : flujoDocumental.concluido,
              clasificacion : 'CONDIFENCIAL'
            };
          }
        }
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarpor (req, res) {
    try {
      const respuesta = await DocumentoService.listarpor({ ...req.query });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      data.idCargo = req.user.idCargo;
      data.usuario = req.user;
      const respuesta = await DocumentoService.createOrUpdate(data);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const existeDocumento = await DocumentoService.findOne({ id: data.id });
      if (!existeDocumento) throw new Error('No existe el documento');
      const flujoDocumental = await FlujoDocumentalService.findOne({ id: existeDocumento.idFlujo });
      let flujoFisico = false;
      if (flujoDocumental && flujoDocumental?.idSolicitudPlantilla) {
        const SolicitudPlantilla = await SolicitudPlantillaService.findOne({ id: flujoDocumental?.idSolicitudPlantilla || null });
        flujoFisico = SolicitudPlantilla?.docfisico || false;
      }

      if (existeDocumento.estado === 'OBSERVADO') throw new Error('No se puede editar un documento observado');

      const existeDerivacionInactivo = await FlujoDerivacionService.findOne({ idDocumento: data.id, estadoActual: 'INACTIVO' });

      if (existeDerivacionInactivo && !flujoFisico) throw new Error('El documento ya fue derivado y no puede ser modificado');

      if (existeDocumento.compartido) {
        const documentoQueCompartio = await DocumentoCompartidoService.findOne({ idDocumento: data.id, idUsuarioOrigen: req.user.idUsuario });

        const compartidoConUsuario = await DocumentoCompartidoService.findOne({ idDocumento: data.id, idUsuario: req.user.idUsuario });

        if (!compartidoConUsuario || !documentoQueCompartio) {
          if (compartidoConUsuario) {
            if (compartidoConUsuario.tipo !== 'EDITOR') throw new Error('El documento no fue compartido con usted como editor o cambiaron sus permisos.');
          }
        }
      }

      const respuesta = await DocumentoService.createOrUpdate(data, false);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      console.log(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function despachar (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.despachar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (err) {
      return res.status(err.httpCode || HttpCodes.userError).json(new Respuesta(err.message, Finalizado.FAIL));
    }
  }

  async function aceptar (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.aceptar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivar (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.derivar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function vistoBuenoCreacion (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.vistoBuenoCreacion(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function vistoBuenoDerivacion (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.vistoBuenoDerivacion(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function observar (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.observar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function observarFlujoFisico (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      data.idDocumento = req.params.id;
      const respuesta = await DocumentoService.observarFlujoFisico(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function correccionFlujoFisico (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      data.idDocumento = req.params.id;
      const respuesta = await DocumentoService.correccionFlujoFisico(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function getObservacionFlujoFisico (req, res) {
    try {
      const data = req.body;
      data.usuario = req.user;
      data.idDocumento = req.params.id;
      const respuesta = await DocumentoService.getObservacionFlujoFisico(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function subsanarObservacion (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.subsanarObservacion(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cerrar (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.solicitudCerrar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function archivar (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.usuario = req.user;
      const respuesta = await DocumentoService.solicitudArchivar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPdf (req, res) {
    try {
      const documentoPdf = await DocumentoService.findOne({ id: req.params.id });
      const folder = `${fileStoragePath}/documentos/temporales`;
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
      fs.writeFileSync(`${folder}/${req.params.id}.json`, JSON.stringify(documentoPdf));
      let respuesta = null;
      if (documentoPdf.estado == 'EN CORRECCION' || documentoPdf.editable) {
        respuesta = await DocumentoService.generarPdf(req.params.id, true, req.user.idUsuario, true);
      } else {
        respuesta = await DocumentoService.generarPdf(req.params.id);
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPlantillaWord (req, res) {
    try {
      const respuesta = await DocumentoService.generarPlantillaWord(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function establecerPlantillaPdf (req, res) {
    try {
      const data = {
        ...req.body,
        userUpdated: req.user.idUsuario,
        id: req.params.id
      }
      const respuesta = await DocumentoService.establecerPlantillaPdf(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function getContenidoHeaderFooter (documento) {
    const { idArea } = documento.configuracionDerivaciones.find(x => x.inicial);

    const area = await AreaService.findOne({ id: idArea });

    return { contenidoHeader: area.contenidoHeader, contenidoFooter: area.contenidoFooter };
  }

  async function generarHeaderPdfCustom (idDocumento) {
    const { rootPath } = config.app;
    let documento = {};
    let contenidoHeader = '';

    if (idDocumento !== 'no-document') {
      const contenidoDocumento = fs.readFileSync(`${fileStoragePath}/documentos/temporales/${idDocumento}.json`);
      documento = JSON.parse(contenidoDocumento);

      ({ contenidoHeader } = await getContenidoHeaderFooter(documento));
    }

    const params = {
      documento: documento,
      contenidoHeader
    };

    if (['OBSERVADO', 'CANCELADO', 'INVALIDO'].includes(documento?.estado)) {
      params.waterDraft = fs.readFileSync(path.resolve('public/images/marca_borrador.png'), 'base64');
    }

    const headerHtml = await ejs.renderFile(path.resolve(`${rootPath}/../../views/headerDocumentoCustom.ejs`), params);
    return headerHtml;
  }

  async function generarHeaderPdfGeneric (idDocumento) {
    const { rootPath } = config.app;
    let documento = {};
    let sepdavi1;
    let sepdavi2;
    let logo = 'sepdavi.png';
    let dimension = 'height="100"';
    let idCargo = null;
    if (idDocumento !== 'no-document') {
      const contenidoDocumento = fs.readFileSync(`${fileStoragePath}/documentos/temporales/${idDocumento}.json`);
      documento = JSON.parse(contenidoDocumento);

      // documento = await DocumentoService.findOne({ id: req.params.id });
      if (documento.plantilla.nombre.includes('VJDF')) { logo = 'logoVJDF.png'; }
      if (documento.plantilla.nombre.includes('VJIOC')) { logo = 'logoVJIOC.png'; }
      if (documento.plantilla.nombre.includes('VIO')) { logo = 'logoVIO.png'; }
      if (documento.plantilla.nombre.includes('VDDUC')) { logo = 'logoVDDUC.png'; }
      if (documento.plantilla.nombre.includes('VTILCC')) { logo = 'logoVTILCC.png'; }
      const de = documento.plantilla?.configuracion_json?.find(x => x.type === 'derivacion').value.valores.de;
      if (Array.isArray(de)) {
        const user = de.pop();
        idCargo = user.idCargo;
        if (user.usuario.idEntidad === 'eff93c2b-9c4c-4155-8062-f737ce5525d3') {
          dimension = 'height="90"';
          logo = 'conalpedis.png';
        }
        if (user.usuario.idEntidad === 'a8b56926-0820-4361-9859-911b4e64a9d5') {
          dimension = 'height="100"';
          logo = 'sepmud.png';
        }
        if (user.usuario.idEntidad === '6f732b79-0356-4aa6-bba6-254d09fff9d4') {
          dimension = 'height="120"';
          logo = 'sepdavi.png';
          const sep1 = path.resolve('public/images/sep1.png');
          const sep2 = path.resolve('public/images/sep2.png');

          sepdavi1 = fs.readFileSync(sep1, 'base64');
          sepdavi2 = fs.readFileSync(sep2, 'base64');
        }
      } else {
        if (de.usuario.idEntidad === 'eff93c2b-9c4c-4155-8062-f737ce5525d3') {
          dimension = 'height="90"';
          logo = 'conalpedis.png';
        }
        if (de.usuario.idEntidad === 'a8b56926-0820-4361-9859-911b4e64a9d5') {
          dimension = 'height="100"';
          logo = 'sepmud.png';
        }
        // if (de.usuario.idEntidad === '7965b520-c30b-4e8c-a349-ba2d8bb5d466') {
        //   dimension = 'height="150"';
        //   logo = 'sepdavi.jpg';
        // }
      }
    }

    let outPath = path.resolve(`public/images/${logo}`);
    if (!fs.existsSync(outPath)) {
      outPath = path.resolve('public/images/logo_oficial-ministerio_de_la_presidencia.png');
    }
    const image = fs.readFileSync(outPath, 'base64');

    const params = {
      documento       : documento,
      logo            : image,
      dimension       : dimension,
      altoPagina      : (documento?.plantilla?.configuracionPagina?.margenSuperior || 3)  + 'cm',
      fondoChacana    : documento?.plantilla?.mostrarFondoPdf ?? false,
      fechaLiteral    : documento?.plantilla?.fechaLiteralPdf ?? false,
      formatoEspecial : documento?.plantilla?.formatoCitePdf,
      sepdavi1,
      sepdavi2

    };

    if (!params.documento.cite) {
      params.documento.fechaDocumento = ((new Date()).toISOString().split('T')[0]).split('-').reverse().join('-');
    }

    if (['OBSERVADO', 'CANCELADO', 'INVALIDO'].includes(documento?.estado)) {
      params.waterDraft = fs.readFileSync(path.resolve('public/images/marca_borrador.png'), 'base64');
    }
    const formatoFechaLiteral = (fechaStr) => {
      const fecha = fechaStr ? new Date(fechaStr + ' 23:59:59') : new Date();
      const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
      return fecha.toLocaleDateString('es-ES', opciones);
    };

    if (documento?.plantilla?.mostrarFondoPdf) {
      params.imagenFondoChacana = fs.readFileSync(path.resolve('public/images/chacana_fondo.png'), 'base64');
    }

    if (documento?.plantilla?.fechaLiteralPdf) {
      const cargo = idCargo ? await CargoService.findOne({ id: idCargo }) : null;
      const fechaDocumento = formatoFechaLiteral(params.documento.fechaDocumento.split('-').reverse().join('-'));
      params.formatoFechaLiteral = cargo && cargo.ciudad
        ? `${cargo.ciudad}, ${fechaDocumento}`
        : formatoFechaLiteral(documento?.cite ? fechaDocumento : null);
    }

    const headerHtml = await ejs.renderFile(path.resolve(`${rootPath}/../../views/headerDocumento.ejs`), params);
    fs.writeFileSync('encabezado.html', headerHtml);

    return headerHtml;
  }
  async function generarHeaderPdfGenericfisico (idDocumento, verCodigo = true) {
    const { rootPath } = config.app;
    let documento = {};
    let logo = 'logo_oficial-ministerio_de_la_presidencia.png';
    let dimension = 'width="100"';
    if (idDocumento !== 'no-document') {
      documento = await DocumentoService.findOne({ id: idDocumento });
      if (documento.plantilla.nombre.includes('VJDF')) { logo = 'logoVJDF.png'; }
      if (documento.plantilla.nombre.includes('VJIOC')) { logo = 'logoVJIOC.png'; }
      if (documento.plantilla.nombre.includes('VIO')) { logo = 'logoVIO.png'; }
      if (documento.plantilla.nombre.includes('VDDUC')) { logo = 'logoVDDUC.png'; }
      if (documento.plantilla.nombre.includes('VTILCC')) { logo = 'logoVTILCC.png'; }
      const user = await UsuarioService.findOne(documento.flujoDocumental.userCreated);
      if (user.usuario.idEntidad === 'eff93c2b-9c4c-4155-8062-f737ce5525d3') {
        dimension = 'height="90"';
        logo = 'conalpedis.png';
      }
      if (user.usuario.idEntidad === 'a8b56926-0820-4361-9859-911b4e64a9d5') {
        dimension = 'height="100"';
        logo = 'sepmud.png';
      }
      if (user.usuario.idEntidad === '7965b520-c30b-4e8c-a349-ba2d8bb5d466') {
        dimension = 'width="400"';
        logo = 'logo_sepdavi.png';
      }
    }

    let outPath = path.resolve(`public/images/${logo}`);
    if (!fs.existsSync(outPath)) {
      outPath = path.resolve('public/images/logo_oficial-ministerio_de_la_presidencia.png');
    }
    const image = fs.readFileSync(outPath, 'base64');

    const headerHtml = await ejs.renderFile(path.resolve(`${rootPath}/../../views/headerDocumentofisico.ejs`), {
      documento : documento,
      logo      : image,
      dimension : dimension,
      verCodigo : verCodigo
    });

    return headerHtml;
  }

  async function generarHeaderPdf (req, res) {
    try {
      console.log('DESDE HEADER = ', req.params.id);
      const idDocumento = req.params.id;
      let parametroGeneracionPdf = null;
      try {
        parametroGeneracionPdf = await ParametroService.findOne({ codigo: CODIGO_PARAMETRO_HEADER_FOOTER_ENTIDADES, estado: 'ACTIVO' });
        console.log('PARAMETRO NO ENCONTRADO, PROCEDER CON HEADER CUSTOM');
      } catch (error) {
        console.log('PARAMETRO NO ENCONTRADO, PROCEDER CON HEADER GENERIC');
      }

      let respuesta = '';

      if (parametroGeneracionPdf) respuesta =  await generarHeaderPdfCustom(idDocumento);

      if (!parametroGeneracionPdf) respuesta = await generarHeaderPdfGeneric(idDocumento);
      return res.send(respuesta);
    } catch (error) {
      console.log('ERROR HEADER ============== ', error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarHeaderPdfisico (req, res) {
    try {
      console.log('DESDE HEADER = ', req.params.id);
      const idDocumento = req.params.id;
      let parametroGeneracionPdf = null;
      try {
        parametroGeneracionPdf = await ParametroService.findOne({ codigo: CODIGO_PARAMETRO_HEADER_FOOTER_ENTIDADES, estado: 'ACTIVO' });
        console.log('PARAMETRO NO ENCONTRADO, PROCEDER CON HEADER CUSTOM');
      } catch (error) {
        console.log('PARAMETRO NO ENCONTRADO, PROCEDER CON HEADER GENERIC');
      }

      let respuesta = '';

      let withCodigoFlujo = true;
      if (req.query.codigo === 'date') {
        withCodigoFlujo = false;
      }

      if (parametroGeneracionPdf) respuesta =  await generarHeaderPdfCustom(idDocumento);

      if (!parametroGeneracionPdf) respuesta = await generarHeaderPdfGenericfisico(idDocumento, withCodigoFlujo);
      return res.send(respuesta);
    } catch (error) {
      console.log('ERROR HEADER ============== ', error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarFooterPdf (req, res) {
    try {
      console.log('DESDE FOOTER = ', req.query.id);
      const idDocumento = req.query.id;
      let parametroGeneracionPdf = null;
      try {
        parametroGeneracionPdf = await ParametroService.findOne({ codigo: CODIGO_PARAMETRO_HEADER_FOOTER_ENTIDADES, estado: 'ACTIVO' });
        console.log('PARAMETRO NO ENCONTRADO, PROCEDER CON FOOTER CUSTOM');
      } catch (error) {
        console.log('PARAMETRO NO ENCONTRADO, PROCEDER CON FOOTER GENERIC');
      }

      let respuesta = '';

      if (parametroGeneracionPdf) respuesta =  await generarFooterPdfCustom(idDocumento);

      if (!parametroGeneracionPdf) respuesta = await generarFooterPdfGeneric(idDocumento);
      return res.send(respuesta);
    } catch (error) {
      console.log('ERROR FOOTER ============== ', error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarFooterPdfCustom (idDocumento) {
    const { rootPath, FRONTEND_VERIFICAR } = config.app;
    const contenidoDocumento = fs.readFileSync(`${fileStoragePath}/documentos/temporales/${idDocumento}.json`);
    const documento = JSON.parse(contenidoDocumento);

    const entidad = '';
    const { contenidoFooter } = await getContenidoHeaderFooter(documento);

    const footerHtml = await ejs.renderFile(path.resolve(`${rootPath}/../../views/footerDocumentoCustom.ejs`), {
      frontVerificarUrl : `${FRONTEND_VERIFICAR}?cite=${documento.cite}`,
      tipo              : documento.plantilla.idCategoria,
      fechaDocumento    : documento.fechaDocumento,
      contenidoFooter
    });
    return footerHtml;
  }

  async function generarFooterPdfGeneric (idDocumento) {
    const { rootPath, FRONTEND_VERIFICAR } = config.app;
    const contenidoDocumento = fs.readFileSync(`${fileStoragePath}/documentos/temporales/${idDocumento}.json`);
    const documento = JSON.parse(contenidoDocumento);
    const documentoBuscar = await DocumentoService.findOne({ id: idDocumento });
    const docFisico = documentoBuscar?.flujoDocumental?.solicitudPlantilla?.docfisico ?? false;
    let entidad = 'SERVICIO PLURINACIONAL DE ASISTENCIA A LA VÍCTIMA';
    let ubicacion = 'Av. Mariscal Santa Cruz Esquina Calle Colombia, Edif. Cámara Nacional de Comercio Nº 1392, Piso 14.';
    let contacto = '+591 (2) 233 41 41';
    let subcontenido = 'www.sepdavi.gob.bo';
    const permite_confidencial = documento.plantilla?.permite_confidencial;
    const de = documento.plantilla?.configuracion_json?.find(x => x.type === 'derivacion').value.valores.de;
    const user = Array.isArray(de) ? de.pop() : de;
    if (user.usuario.idEntidad === 'a8b56926-0820-4361-9859-911b4e64a9d5') {
      entidad = 'Sepmud';
    }
    if (user.usuario.idEntidad === '7965b520-c30b-4e8c-a349-ba2d8bb5d466') {
      entidad = 'SEPDAVI'
      ubicacion = 'Av. Mariscal Santa Cruz Esquina Calle Colombia, Edif. Cámara Nacional de Comercio Nº 1392, Piso 14';
      contacto = '+591 (2) 233 41 41';
      subcontenido = 'La Paz - Bolivia';
    }

    const footerHtml = await ejs.renderFile(path.resolve(`${rootPath}/../../views/footerDocumento.ejs`), {
      frontVerificarUrl : `${FRONTEND_VERIFICAR}?cite=${documento.cite}`,
      tipo              : documento.plantillaPdf ? '' : documento.plantilla.idCategoria,
      fechaDocumento    : documento.fechaDocumento,
      cite              : documento.cite,
      entidad,
      ubicacion,
      contacto,
      subcontenido,
      permite_confidencial,
      docFisico
    });
    return footerHtml;
  }

  async function generarPdfDocumento (req, res) {
    try {
      const respuesta = await DocumentoService.generarPdfDocumento(req.params);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function subirArchivo (req, res) {
    try {
      const { files } = req;
      const { backendUrl } = config.app;
      if (files) {
        // eslint-disable-next-line no-unreachable-loop
        for (const key in files) {
          const file = files[key];
          const filename = `file-${Date.now()}.${file.name.split('.').pop()}`;
          const filepath = `files/documentos/uploads/${filename}`;
          await file.mv(path.join(process.cwd(), filepath));
          if (!fs.existsSync(path.join(process.cwd(), filepath))) {
            return res.status(HttpCodes.userError).json(new Respuesta('Se produjo un error al subir el archivo.', Finalizado.FAIL));
          }
          return res.status(200).send(new Respuesta('OK', Finalizado.OK, `${backendUrl}files/${filename}`));
        }
      } else {
        return res.status(HttpCodes.userError).json(new Respuesta('Debe enviar por lo menos un archivo.', Finalizado.FAIL));
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function vistaArchivo (req, res) {
    const { file } = req.params;
    try {
      const { contentType, respuesta } = await DocumentoService.vistaFile(file);
      res.contentType(contentType);
      res.send(respuesta);
      // return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(400).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function cantidadExtra (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await DocumentoService.cantidadExtra({ id });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await DocumentoService.deleteItem({ id, userDeleted: req.user.idUsuario });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function verificar (req, res) {
    try {
      const { fileStoragePath } = config.app;
      const { cite } = req.query;

      const respuesta = await DocumentoService.findOne({ cite, idDocumentoOriginal: 'NULL', buscarEstado: ['OBSERVADO', 'CANCELADO', 'BORRADOR'] });

      if (!respuesta) throw new Error('No existe ningun documento con el cite buscado');

      const documento = {
        asunto          : respuesta.asunto,
        estado          : respuesta.estado,
        flujoDocumental : respuesta.flujoDocumental
      };
      const locationFile = `/documentos/generados/pdf/${respuesta.id}.pdf`;
      const outPath = path.resolve(`${fileStoragePath}${locationFile}`);
      documento.pdf = fs.readFileSync(outPath, 'base64');
      const { rows } = await AprobacionDocumentosService.listar({ idDocumento: respuesta.id });
      documento.firmas = rows;
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, documento));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarCite (req, res) {
    try {
      const respuesta = await DocumentoService.findOne({ id: req.params.id });
      // if (respuesta.estado !== 'BORRADOR') {
      //   return res.status(400).send(new Respuesta('El Documento debe estar en estado BORRADOR', Finalizado.FAIL, null));
      // }
      if (respuesta.cite) return res.status(400).send(new Respuesta('El Documento ya cuenta con cite', Finalizado.FAIL, null));

      const formulario = await FormularioService.listarpor({ id: respuesta.plantilla.id });

      let idUnidadOrganizacional = null;
      if (formulario.permiteCiteDiferente && formulario.idAreaCite) {
        idUnidadOrganizacional = formulario.idAreaCite;
      } else {
        const cargo = await CargoService.findOne({ id: req.user.idCargo });
        idUnidadOrganizacional = cargo.idUnidadOrganizacional;
      }

      const idCategoria = respuesta.plantilla.citeCategoria ? respuesta.plantilla.idCategoria : null;

      const _existeUsuario = await UsuarioService.mostrar(req.user.idUsuario);

      if (!_existeUsuario)  throw new Error('No existe el usuario.');

      const { entidad } = _existeUsuario;

      const citeDocumento = await CorrelativoService.generarCodigoDocumento(
        entidad.id,
        idUnidadOrganizacional,
        respuesta.plantilla.id,
        idCategoria,
        req.user.idUsuario,
        respuesta.plantilla.citeInstitucional || false
      );

      await DocumentoService.createOrUpdate({
        id             : respuesta.id,
        cite           : citeDocumento,
        // idFlujo        : flujo.id,
        asunto         : respuesta.asunto,
        fechaDocumento : new Date()
      }, false);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, citeDocumento));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizarFechaDocumento (req, res) {
    try {
      const data = {
        id             : req.params.id,
        fechaDocumento : req.body.fechaDocumento,
        userUpdated    : req.user.idUsuario
      };
      const respuesta = await DocumentoService.actualizarFechaDocumento(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function valoresDocumento (req, res) {
    try {
      const respuesta = await DocumentoService.valoresDocumento({ cite: req.params.cite });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function correccionDocumento (req, res) {
    try {
      const datos = {
        idDocumento : req.params.id,
        idUsuario   : req.user.idUsuario
      };

      const respuesta = await DocumentoService.correccionDocumento(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cambiarDocumento (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DocumentoService.cambiarDocumento(data, req.user.idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cancelarDocumento (req, res) {
    try {
      const data = req.body;
      data.idDocumentoCancelar = req.params.id;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DocumentoService.cancelarDocumento(data, req.user.idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function verFirmas (req, res) {
    try {
      const respuesta = await DocumentoService.verFirmas(req.params);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function agregarPalabrasClave (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await DocumentoService.agregarPalabrasClave(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function borrarPalabrasClave (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await DocumentoService.borrarPalabrasClave(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function verAdjuntos (req, res) {
    try {
      const respuesta = await DocumentoService.verAdjuntos(req.params);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function registroDescarga (req, res) {
    try {
      const accion = BITACORA.ACCION_DESCARGAR_DOCUMENTO;
      const respuesta = await DocumentoService.registroBitacoraDocumento({ ...req.params, idUsuario: req.user.idUsuario, accion });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function registroVisualizacion (req, res) {
    try {
      const accion = BITACORA.ACCION_VISUALIZAR_DOCUMENTO;
      const respuesta = await DocumentoService.registroBitacoraDocumento({ ...req.params, idUsuario: req.user.idUsuario, accion });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    cancelarDocumento,
    cambiarDocumento,
    crear,
    findAll,
    correccionDocumento,
    valoresDocumento,
    actualizarFechaDocumento,
    superBuscador,
    eliminar,
    findOne,
    listar,
    listarpor,
    actualizar,
    aceptar,
    derivar,
    vistoBuenoCreacion,
    vistoBuenoDerivacion,
    observar,
    observarFlujoFisico,
    correccionFlujoFisico,
    getObservacionFlujoFisico,
    subsanarObservacion,
    archivar,
    cerrar,
    despachar,
    generarPdf,
    generarHeaderPdf,
    generarHeaderPdfisico,
    generarFooterPdf,
    generarPdfDocumento,
    subirArchivo,
    cantidadExtra,
    vistaArchivo,
    verificar,
    generarCite,
    verFirmas,
    verAdjuntos,
    superBuscadorDocumentos,
    superBuscadorTramites,
    registroDescarga,
    registroVisualizacion,
    agregarPalabrasClave,
    borrarPalabrasClave,
    generarPlantillaWord,
    establecerPlantillaPdf
  };
};
