
'use strict';
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { CLASIFICACION_FLUJO, TIPOS_DERIVACIONES } = require('../../../../common/config/constants');
const { config } = require('../../../../common');
const { fileStoragePath } = require('../../../../common/config/app');
const fs = require('fs');
const DocumentoService = require('../../../../domain/services/gestion/DocumentoService');
const documento = require('../../../../infrastructure/models/gestion/documento');

module.exports = function setupFlujoDocumentalController (services) {
  const { FlujoDocumentalService, FlujoDerivacionService, AuthService } = services;

  async function listar (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['dashboard:flujos:entidad']);

      const respuesta = await FlujoDocumentalService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function libro (req, res) {
    try {
      req.query.userCreated = req?.query?.userCreated || req.user.idUsuario;
      const respuesta = await FlujoDocumentalService.listarFlujo(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function plantillaPDF (req, res) {
    try {
      req.query.id = req.params.id;
      // let documentoPdf = await FlujoDocumentalService.historial(req.query);
      const flujoDocumental = await FlujoDocumentalService.findOne({ id: req.params.id });
      // const folder = `${fileStoragePath}/documentos/temporales`
      // if (!fs.existsSync(folder)) {
      //   fs.mkdirSync(folder);
      // }
      // fs.writeFileSync(`${folder}/${req.params.id}.json`, JSON.stringify(documentoPdf));
      const respuesta = await FlujoDocumentalService.generarpdfisico(flujoDocumental);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
    /*try {
      const outPath = `${ARCHIVOS_PUBLICOS}/files/HOJA-PARA-SEGUIMIENTO-FISICO.pdf`;
      const respuesta = fs.readFileSync(outPath, 'base64');
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respu|esta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }*/
  }

  async function printBook (req, res) {
    try {
      req.body.userCreated = req.user.idUsuario;
      const respuesta = await FlujoDocumentalService.printBook(req.body);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const params = { id: req.params.id };
      const query = req.query;
      const respuesta = await FlujoDocumentalService.findOne(params, query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarDocumentos (req, res) {
    try {
      const id = req.params.id;
      const respuesta = await FlujoDocumentalService.listarDocumentos(id, req.user);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function vincular (req, res) {
    try {
      const datos = req.body;

      const datosViculacion = {
        id                : req.params.id,
        userUpdated       : req.user.idUsuario,
        codigoFlujo       : datos.codigoFlujo,
        vincular          : datos.vincular,
        fechaFinalizacion : datos.vincular ? new Date() : null,
        proveidoCierre    : datos.vincular ? datos.observacion : null,
        estado            : datos.vincular ? 'VINCULADO' : 'PENDIENTE'
      };

      const respuesta = await FlujoDerivacionService.registrarVinculacion(datosViculacion);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function desarchivar (req, res) {
    try {
      let flujoDocumental = await FlujoDocumentalService.findOne({ id: req.params.id });
      flujoDocumental = await FlujoDocumentalService.update({
        id                : flujoDocumental.id,
        userUpdated       : req.user.idUsuario,
        fechaFinalizacion : null,
        proveidoCierre    : null,
        concluido         : false,
        estado            : 'PENDIENTE',
        idCarpeta         : null
      });

      await FlujoDerivacionService.registrarDesarchivo(flujoDocumental, req.user, req.body);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, true));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function recuperarDerivacion (req, res) {
    try {
      const datos = {
        id: req.params.id,
        idUsuario: req.user.idUsuario,
        proveido: req.body.proveido,
        tipo: req.body.estado
      };

      const respuesta = await FlujoDocumentalService.recuperarDerivacion(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function datosConsolidadosFlujo (req, res) {
    try {
      const flujoDocumental = await FlujoDocumentalService.findOne({ codigoFlujo: req.params.hojaRuta });

      if (!flujoDocumental) throw new Error('La hoja de ruta especificada, no existe o no se puede encontrar.');

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, flujoDocumental.datosConsolidados));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function vinculadosPendientesFirma (req, res) {
    try {
      const respuesta = await FlujoDocumentalService.vinculadosPendientesFirma(req.params.id);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function historial (req, res) {
    try {
      req.query.id = req.params.id;
      let respuesta = await FlujoDocumentalService.historial(req.query);
      const esFlujoFisico = respuesta?.solicitudPlantilla?.docfisico || false;

      let tienePermisoPadre = true;

      if (respuesta.idFlujoPadre) {
        const flujoPadre = await FlujoDocumentalService.historial({ id: respuesta.idFlujoPadre });
        const participantesPadre = new Set();
        const parpdfticipantesPadre = new Set();
        for (const flujoDerivacion of flujoPadre.flujoDerivaciones) {
          if (flujoDerivacion.idUsuarioRemitente) parpdfticipantesPadre.add(flujoDerivacion.idUsuarioRemitente);
          if (flujoDerivacion.idUsuarioDestinatario) participantesPadre.add(flujoDerivacion.idUsuarioDestinatario);
        }

        if (flujoPadre.clasificacion === CLASIFICACION_FLUJO.CONFIDENCIAL) {
          const permisoPadre = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['ver:flujos:confidencial'] });

          tienePermisoPadre = participantesPadre.has(req.user.idUsuario) || permisoPadre;
        }
      } else {
        tienePermisoPadre = false;
      }

      const participantes = new Set();
      const historial = []
      // const docmentosPadre = respuesta.flujoDerivaciones.filter(f => f.documento.idDocumentoPadre).map(f => f.documento.idDocumentoPadre)
      for ( let index = 0; index < respuesta.flujoDerivaciones.length; index++) {
        const flujoDerivacion = respuesta.flujoDerivaciones[index]
        if (flujoDerivacion.idUsuarioRemitente) participantes.add(flujoDerivacion.idUsuarioRemitente);
        if (flujoDerivacion.idUsuarioDestinatario) participantes.add(flujoDerivacion.idUsuarioDestinatario);

        const documentoCopia = flujoDerivacion.documento.idDocumentoOriginal !== null && !['OBSERVADO','CANCELADO','INVALIDO'].includes(flujoDerivacion.documento.estado)

        if (flujoDerivacion.idUsuarioRemitente === flujoDerivacion.idUsuarioDestinatario && !documentoCopia) continue;

        const existe = historial.find(d => d.documento.cite === flujoDerivacion.documento.cite && d.verDocumento) || null
        const listaTipos = ['REMITENTE','VIA','DESTINATARIO','RECUPERADO']

        if (esFlujoFisico) listaTipos.push('PROVEIDO')

        const participe = flujoDerivacion?.documento?.configuracionDerivaciones?.find(u => u.idUsuario === req.user.idUsuario) || null
        const destinatarioParticipe = flujoDerivacion?.documento?.configuracionDerivaciones?.find(u => u.idUsuario === flujoDerivacion.idUsuarioDestinatario) || null
        const verDocumento = (existe === null && listaTipos.includes(flujoDerivacion.tipo) && destinatarioParticipe !== null)
        const previo = respuesta.flujoDerivaciones[index - 1] || null 
        const estadoFlujo = previo?.observacion ? 'OBSERVADO' : flujoDerivacion.estado
        const documentoRecuperado = flujoDerivacion?.tipo === 'RECUPERADO'
        const documentoRechazado = previo?.tipo === 'RECHAZADO'
        const documentoCancelado = previo?.tipo === 'CANCELADO'
        const documentoVinculado = previo?.tipo === 'VINCULADO'
        const documentoDesvinculado = flujoDerivacion?.nombreRemitente?.includes('DESVINCULACION')
        
        historial.push({
          idFlujoDerivacion: flujoDerivacion.id,
          editable  : participe ? true : false,
          verDocumento: verDocumento || documentoCopia,
          documento: {...flujoDerivacion.documento, configuracionDerivaciones: null},
          remitente: previo ? {
            fechaDerivacion: ['RECUPERADO'].includes(previo?.tipo) ? null : previo.fechaDerivacion,
            idUsuarioRemitente: previo.idUsuarioRemitente,
            idCargoRemitente: previo.idCargoRemitente,
            cargoRemitente: previo.cargoRemitente,
            nombreRemitente: previo.nombreRemitente,
            descripcion: ['RECUPERADO'].includes(previo?.tipo) ? null : previo.descripcion
          } : null,
          destinatario : {
            fechaRecepcion: flujoDerivacion.fechaRecepcion,
            idUsuarioDestinatario: flujoDerivacion.idUsuarioDestinatario || flujoDerivacion.idUsuarioRemitente,
            idCargoDestinatario: flujoDerivacion.idCargoDestinatario || flujoDerivacion.idCargoRemitente,
            cargoDestinatario: flujoDerivacion.cargoDestinatario || flujoDerivacion.cargoRemitente,
            nombreDestinatario: flujoDerivacion.idUsuarioDestinatario ? flujoDerivacion.nombreDestinatario : flujoDerivacion.nombreRemitente,
            tipo: destinatarioParticipe ? destinatarioParticipe.tipo : flujoDerivacion.tipo
          },
          estado: flujoDerivacion.tipo === 'ARCHIVADO' ? 'ARCHIVADO' : (documentoRechazado ? 'RECHAZADO' : estadoFlujo),
          observado: documentoRechazado || previo?.observacion || false,
          verIcono: true,
          esVisible: true
        })

        if (previo && [TIPOS_DERIVACIONES.DERIVAR_DOCUMENTO, TIPOS_DERIVACIONES.CREAR_DOCUMENTO].includes(previo.idAccion) && historial[historial.length - 2]?.estado === 'CREADO') {
          historial[historial.length - 1].estado = 'RECIBIDO'
          historial[historial.length - 1].remitente = null
          historial[historial.length - 1].esVisible = false
          continue
        }

        if (documentoCopia) {
          historial.push({
            idFlujoDerivacion: flujoDerivacion.id,
            editable  : false,
            verDocumento: false,
            documento: {...flujoDerivacion.documento, configuracionDerivaciones: null},
            remitente: null,
            destinatario : {
              fechaRecepcion: flujoDerivacion.fechaDerivacion,
              idUsuarioDestinatario: flujoDerivacion.idUsuarioRemitente,
              idCargoDestinatario: flujoDerivacion.idCargoRemitente,
              cargoDestinatario: flujoDerivacion.cargoRemitente,
              nombreDestinatario: flujoDerivacion.nombreRemitente,
              tipo: destinatarioParticipe ? destinatarioParticipe.tipo : flujoDerivacion.tipo
            },
            estado: 'DERIVADO CON COPIA',
            observado: false,
            verIcono: false,
            esVisible: true
          })
        }
        
        if (documentoVinculado) {
          // historial[historial.length - 2].esVisible = false
          if (historial[historial.length - 2]) historial[historial.length - 2].esVisible = false;
          historial[historial.length - 1].estado = previo?.tipo
          historial[historial.length - 1].destinatario.tipo = destinatarioParticipe?.tipo || 'PROVEIDO'
          // historial[historial.length - 1].verIcono = false
          if (historial[historial.length - 1].remitente) {
            historial[historial.length - 1].remitente.descripcion += ` (${previo?.nombreDestinatario || ''})`
         }
        }
        
        if (documentoRecuperado) {
          historial[historial.length - 1].destinatario.fechaRecepcion = null
          historial[historial.length - 1].destinatario.tipo = destinatarioParticipe?.tipo || 'PROVEIDO'
          historial[historial.length - 1].verIcono = false
          historial[historial.length - 1].esVisible = previo ? true : false
          historial.push({
            idFlujoDerivacion: flujoDerivacion.id,
            editable  : participe ? true : false,
            verDocumento: false,
            documento: {...flujoDerivacion.documento, configuracionDerivaciones: null},
            remitente: null,
            destinatario : {
              fechaRecepcion: flujoDerivacion.fechaRecepcion,
              idUsuarioDestinatario: flujoDerivacion.idUsuarioDestinatario,
              idCargoDestinatario: flujoDerivacion.idCargoDestinatario,
              cargoDestinatario: flujoDerivacion.cargoDestinatario,
              nombreDestinatario: flujoDerivacion.nombreDestinatario,
              tipo: destinatarioParticipe ? destinatarioParticipe.tipo : 'PROVEIDO'
            },
            estado: 'RECUPERADO',
            observado: true,
            verIcono: false,
            esVisible: true
          })
        }

        if (documentoCancelado) {
          historial[historial.length - 2].esVisible = false
          historial[historial.length - 1].observado = true
          historial[historial.length - 1].estado = previo?.tipo
        }


        if (documentoDesvinculado){
          historial.push({
            idFlujoDerivacion: flujoDerivacion.id,
            editable  : participe ? true : false,
            verDocumento: false,
            documento: {...flujoDerivacion.documento, configuracionDerivaciones: null},
            remitente: null,
            destinatario : {
              fechaRecepcion: flujoDerivacion.fechaRecepcion,
              idUsuarioDestinatario: flujoDerivacion.idUsuarioDestinatario,
              idCargoDestinatario: flujoDerivacion.idCargoDestinatario,
              cargoDestinatario: flujoDerivacion.cargoDestinatario,
              nombreDestinatario: flujoDerivacion.nombreDestinatario,
              tipo: destinatarioParticipe ? destinatarioParticipe.tipo : flujoDerivacion.tipo
            },
            estado: 'DESVINCULADO',
            observado: false,
            verIcono: false,
            esVisible: true
          })
        }

        if (!flujoDerivacion.idUsuarioRemitente && !flujoDerivacion.idCargoRemitente && flujoDerivacion.tipo === 'REMITENTE') {
          historial[historial.length - 1].destinatario.fechaRecepcion = null
          historial[historial.length - 1].verIcono = false
          historial.push({
            idFlujoDerivacion: flujoDerivacion.id,
            editable  : participe ? true : false,
            verDocumento: false,
            documento: {...flujoDerivacion.documento, configuracionDerivaciones: null},
            remitente: null,
            destinatario : {
              fechaRecepcion: flujoDerivacion.fechaRecepcion,
              idUsuarioDestinatario: flujoDerivacion.idUsuarioDestinatario,
              idCargoDestinatario: flujoDerivacion.idCargoDestinatario,
              cargoDestinatario: flujoDerivacion.cargoDestinatario,
              nombreDestinatario: flujoDerivacion.nombreDestinatario,
              tipo: destinatarioParticipe ? destinatarioParticipe.tipo : flujoDerivacion.tipo
            },
            estado: 'CREADO',
            observado: false,
            recuperado: false,
            verIcono: false,
            esVisible: true
          })
        }
      }

      respuesta.historial = historial.filter(h => h.esVisible);

      if (respuesta.clasificacion === CLASIFICACION_FLUJO.CONFIDENCIAL) {
        const tienePermiso = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['ver:flujos:confidencial'] });
        if (!(tienePermiso || tienePermisoPadre || participantes.has(req.user.idUsuario))) {
          respuesta = {
            codigoFlujo   : respuesta.codigoFlujo,
            estado        : respuesta.estado,
            concluido     : respuesta.concluido,
            clasificacion : respuesta.clasificacion
          };
        }
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      console.log(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function historialPdf (req, res) {
    try {
      const respuesta = await FlujoDocumentalService.historialPdf({
        ...req.query,
        id: req.params.id
      });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    historial,
    vinculadosPendientesFirma,
    datosConsolidadosFlujo,
    recuperarDerivacion,
    listarDocumentos,
    plantillaPDF,
    listar,
    findOne,
    libro,
    printBook,
    vincular,
    desarchivar,
    historialPdf
  };
};
