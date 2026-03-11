'use strict';

const debug = require('debug')('app:service:rol');
const Service = require('../Service');

module.exports = function utilService (repositories, helpers, res) {
  const {
    FlujoDerivacionRepository,
    FlujoDocumentalRepository,
    DocumentoRepository,
    UsuarioRepository,
    FormularioRepository,
    ComponenteService,
    UsuarioExternoRepository,
    ParametroRepository,
    transaction
  } = repositories;

  const { CargoRepository } = repositories.planificacion;

  const CorrelativoService = require('../gestion/CorrelativoService')(repositories, helpers, null);

  const { generarAprobacion } = require('../system/AprobacionDocumentosService')(repositories, helpers, res);

  function calcularNumeroHR (codigoFlujo) {
    const hr = codigoFlujo.split('-');
    hr.splice(1, 1);
    return hr.join('-');
  }

  async function getDatosUsuario (idUsuario) {
    const usuario = await UsuarioRepository.findOne({ id: idUsuario });
    if (!usuario) throw new Error('El usuario no existe');
    return {
      id      : usuario.id,
      nombre  : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      idCargo : usuario.cargoUsuario?.id,
      cargo   : usuario.cargoUsuario.descripcion

    };
  }

  async function verificarHojaRutaCite (datos, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      let { id, documento, flujoDocumental } = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);

      const cargo = await CargoRepository.findOne({ id: documento.configuracionDerivaciones[documento.configuracionDerivaciones.length - 1].idCargo }, transaccion);

      if (!flujoDocumental) {
        const { codigoFlujo, codigoUnicoFlujo } = await CorrelativoService.generarCodigos({
          idUsuario    : datos.userUpdated,
          flujo        : !datos.migracion,
          idFormulario : documento?.plantilla?.id || null,
          documento    : false,
          userCreated  : datos.userCreated || datos.userUpdated
        }, transaccion);

        let datosFlujo = {
          referencia     : documento.asunto,
          codigoFlujo    : codigoFlujo,
          numeroHr       : codigoUnicoFlujo,
          cargoRemitente : datos.remitente.cargo,
          remitente      : datos.remitente.nombre,
          userCreated    : datos.userCreated || datos.userUpdated,
          areaDestinoId  : cargo.unidad.id,
          areaDestino    : cargo.unidad.nombreArea
        };

        if (datos.externo) {
          datosFlujo.cargoRemitente = datos.externo.cargo;
          datosFlujo.remitente = datos.externo.nombreCompleto;
          datosFlujo.areaRemitente = datos.externo.procedencia;
          datosFlujo.tipoFlujo = 'EXTERNO';

          const datosConsulta = {
            nombreCompleto : datos.externo.nombreCompleto.toUpperCase().trim(),
            cargo          : datos.externo.cargo.toUpperCase().trim(),
            procedencia    : datos.externo.procedencia.toUpperCase().trim()
          };

          const existe = await UsuarioExternoRepository.findOne({ nombreCompleto: datosConsulta.nombreCompleto }, transaccion);

          if (!existe) {
            datosConsulta.userCreated = datos.userCreated || datos.userUpdated;
            await UsuarioExternoRepository.createOrUpdate(datosConsulta);
          }

          if (existe?.nombreCompleto === datos.externo.nombreCompleto.toUpperCase().trim()) {
            datosConsulta.id = existe.id;
            datosConsulta.userUpdated = datos.userCreated || datos.userUpdated;
            await UsuarioExternoRepository.createOrUpdate(datosConsulta);
          }

          await FlujoDerivacionRepository.createOrUpdate({ id: id, nombreRemitente: datos.externo.nombreCompleto, cargoRemitente: datos.externo.cargo }, transaccion);
        }

        if (datos.migracion) {
          datosFlujo = datos.migracion;
          datosFlujo.userCreated = datos.userCreated || datos.userUpdated;
        };

        flujoDocumental = await FlujoDocumentalRepository.createOrUpdate(datosFlujo, transaccion);

        await FlujoDerivacionRepository.createOrUpdate({ id: datos.id, idFlujo: flujoDocumental.id }, transaccion);
      }

      let crearCite = true;
      if (documento.plantilla.postergarCite) {
        const ultimoUsuario = documento.configuracionDerivaciones[documento.configuracionDerivaciones.length - 1];
        crearCite = datos.idUsuario === ultimoUsuario?.idUsuario && datos.generarCitePostergado;
      }

      let codigoDocumento = documento.cite ?? null;

      if (!documento.cite && crearCite) {
        let isValido = false;
        while (!isValido) {
          const resultado = await CorrelativoService.generarCodigos({
            idUsuario         : datos.userUpdated,
            idFormulario      : documento.plantilla.id,
            idCategoria       : documento.plantilla.citeCategoria ? documento.plantilla.idCategoria : null,
            documento         : true,
            flujo             : false,
            userCreated       : datos.userCreated || datos.userUpdated,
            citeInstitucional : documento.plantilla.citeInstitucional || false
          }, transaccion);
          codigoDocumento = resultado.codigoDocumento ?? null;
          const existeCite = await DocumentoRepository.findOne({ cite: codigoDocumento }, transaccion);
          if (!existeCite || !codigoDocumento) isValido = true;
        }
      }
      const objectDocument = {
        id          : documento.id,
        cite        : codigoDocumento,
        hojaRuta    : flujoDocumental.codigoFlujo,
        idFlujo     : flujoDocumental.id,
        estado      : 'DERIVADO',
        editable    : false,
        userUpdated : datos.userCreated || datos.userUpdated
      };
      if (documento.cite !== codigoDocumento || !documento.fechaDocumento) {
        objectDocument.fechaDocumento = new Date();
      }
      documento = await DocumentoRepository.createOrUpdate(objectDocument, transaccion);

      if (!t) await transaction.commit(transaccion);
      return { documento, flujoDocumental };
    } catch (error) {
      console.error(error);
      if (!t) await transaction.rollback(transaccion);
      throw error;
    }
  }

  async function registrarAprobacionCiudadania ({ documento, idUsuario, token, tipo }, documentoFisico = false, t = null) {
    let linkRedireccion = null;
    const estadoIOP = await ParametroRepository.findOne({ grupo: 'CONFIG-IOP', codigo: 'IOP' });
    if (['REMITENTE', 'DESTINATARIO', 'VIA', 'RECUPERADO'].includes(tipo) && documento.estado !== 'CERRADO' && !documentoFisico) {
      try {
        ({ linkRedireccion } = await generarAprobacion({
          documento,
          idUsuario      : idUsuario,
          descripcion    : documento.asunto,
          urlRedireccion : '',
          token          : token
        }, t, estadoIOP.estado === 'ACTIVO'));
      } catch (error) {
        if (estadoIOP.estado === 'ACTIVO') {
          throw error;
        }
        linkRedireccion = 'app/error-firma';
        console.log('==========_ERROR_DESDE_APROBACION==========');
        console.log(error);
      }
      await DocumentoRepository.createOrUpdate({ id: documento.id, linkFirma: linkRedireccion }, t);
    }

    return linkRedireccion;
  }

  async function evaluarReglasExportacion (documento, flujoDocumental, idUsuario,  t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const idFormularioPlantilla = documento.plantilla?.id;
      const { configuracionExportacion, sigla } = await FormularioRepository.findOne({ id: idFormularioPlantilla });
      const datosConsolidados = flujoDocumental.datosConsolidados;

      datosConsolidados.HOJA_RUTA = flujoDocumental.codigoFlujo;
      datosConsolidados[`${sigla}-CITE`] = documento.cite;
      datosConsolidados[`${sigla}-FECHA_DOCUMENTO`] = documento.fechaDocumento;

      for (const regla of configuracionExportacion) {
        const reglaCompatible = { valorOrigen: regla.campo.subCampo, campoOrigen: regla.campo.id };
        datosConsolidados[`${sigla}-${regla.nombre}`] = await ComponenteService.getValorCampo(
          documento?.plantilla?.configuracion_json,
          reglaCompatible,
          documento, idUsuario);
      }
      await FlujoDocumentalRepository.createOrUpdate({ id: flujoDocumental.id, datosConsolidados }, transaccion);
      if (!t) await transaction.commit(transaccion);
      return { documento, flujoDocumental };
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
    }
  }

  return {
    calcularNumeroHR,
    evaluarReglasExportacion,
    registrarAprobacionCiudadania,
    getDatosUsuario,
    verificarHojaRutaCite
  };
};
