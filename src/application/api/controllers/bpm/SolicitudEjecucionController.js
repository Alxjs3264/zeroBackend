
'use strict';
const debug = require('debug')('app:controller:formulario');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const axios = require('axios');
const { app } = require('../../../../common/config');

module.exports = function setupSolicitudPlantillaController (services) {
  const {
    SolicitudEjecucionService, FlujoDocumentalService,
    SolicitudPlantillaService,
    FlujoDerivacionService,
    UsuarioService,
    AuthService,
    ComponenteService,
    PasoService,
    DocumentoService,
    FormularioService,
    UsuarioCargoService
  } = services;

  async function findAll (req, res) {
    try {
      const respuesta = await SolicitudEjecucionService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await SolicitudEjecucionService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function createItem (req, res) {
    try {
      const data = req.body;
      debug('creando formulario');
      data.userCreated = req.user.idUsuario;
      const respuesta = await SolicitudEjecucionService.createOrUpdate(data);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function updateItem (req, res) {
    try {
      const data = req.body;
      debug('actualizando formulario');
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await SolicitudEjecucionService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function deleteItem (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando formulario');
      const respuesta = await SolicitudEjecucionService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findPasoActual (req, res) {
    try {
      const respuesta = await SolicitudEjecucionService.findPasoActual(req.params.id, req.user.idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function pasosSiguientes (req, res) {
    try {
      const idFlujoDocumental = req.params.id;
      const _existeFlujoDocumental = await FlujoDocumentalService.findOne({ id: idFlujoDocumental });

      if (!_existeFlujoDocumental) throw new Error('No se encontró el flujo documental');

      const { configuracion: nodos } = await SolicitudPlantillaService.findOne({ id: _existeFlujoDocumental.idSolicitudPlantilla });

      const pasosSiguientesFinal = [];
      for (const pasoActual of _existeFlujoDocumental.pasosActuales) {
        await SolicitudEjecucionService.pasosSiguientes({
          idFlujoDocumental : idFlujoDocumental,
          idUsuario         : req.user.idUsuario,
          idPaso            : pasoActual.idPaso,
          idPasoOrigen      : pasoActual.idPaso,
          nodos,
          pasosSiguientesFinal
        });
      }

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, pasosSiguientesFinal));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function pasosObservaciones (req, res) {
    try {
      const idFlujoDocumental = req.params.id;
      const respuesta = await SolicitudEjecucionService.pasosObservaciones(idFlujoDocumental, req.user.idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function pasosCancelables (req, res) {
    try {
      const idFlujoDocumental = req.params.id;
      const respuesta = await SolicitudEjecucionService.pasosCancelables(idFlujoDocumental, req.user.idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function getDatosUsuario (idUsuario) {
    const usuario = await UsuarioService.mostrar(idUsuario);

    if (!usuario) throw new Error('El usuario no se encuentra o no existe.');

    return {
      id      : usuario.id,
      nombre  : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      idCargo : usuario.cargoUsuario?.id,
      cargo   : usuario.cargoUsuario.descripcion
    };
  }

  async function cancelarFlujo (req, res) {
    try {
      const datos = {
        id          : req.params.id,
        idUsuario   : req.user.idUsuario,
        idPaso      : req.body.idPaso,
        idDocumento : req.body.idDocumento,
        motivo      : req.body.motivo
      };

      datos.remitente = await getDatosUsuario(req.user.idUsuario);

      datos.informacionComplementaria = {
        remitente    : datos.remitente,
        destinatario : { nombreDestinatario: 'CANCELADO' },
        descripcion  : req.body.motivo
      };

      const respuesta = await SolicitudEjecucionService.cancelarFlujo(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cancelarFlujoNuevo (req, res) {
    try {
      const datos = {
        id          : req.params.id,
        idUsuario   : req.user.idUsuario,
        idPaso      : req.body.idPaso,
        idDocumento : req.body.idDocumento,
        motivo      : req.body.motivo
      };

      datos.remitente = await getDatosUsuario(req.user.idUsuario);

      datos.informacionComplementaria = {
        remitente    : datos.remitente,
        destinatario : { nombreDestinatario: 'CANCELADO' },
        descripcion  : req.body.motivo
      };

      const respuesta = await SolicitudEjecucionService.cancelarFlujoNuevo(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function ejecutarInteroperabilidad (req, res) {
    try {
      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      const datos = {
        id        : req.params.id,
        idUsuario : req.user.idUsuario,
        token     : req.user.token,
        ...req.body
      };

      await ComponenteService.interoperabilidadDerivacion(datos.idDocumento, req.user.idUsuario, null);

      const derivacionActual = await FlujoDerivacionService.findOne({ id: datos.idDerivacion, estadoActual: 'ACTIVO' });

      if (!derivacionActual) throw new Error('No se encontro la derivacion actual.');

      datos.tipo = derivacionActual.tipo;

      const usuarioActual = await UsuarioService.findOne(req.user.idUsuario);

      if (!usuarioActual) throw new Error('El usuario actual no se encuentra habilitado o no esta registrado');

      const linkRedireccion = await SolicitudEjecucionService.ejecutarPasoIOP(datos, usuarioActual);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, linkRedireccion));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function documentosAdjuntos (req, res) {
    try {
      const respuesta = await SolicitudEjecucionService.documentosAdjuntos(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFlujo (req, res) {
    try {
      const datos = req.body;

      const respuesta = [];

      if (datos.idSolicitudPlantilla) {
        let idPaso = null;
        if (datos.idSolicitudPlantilla) {
          const paso = await PasoService.findOne({ idFormulario: datos.idDocumentoPlantilla, idSolicitudPlantilla: datos.idSolicitudPlantilla });

          if (!paso) throw new Error('No existe el paso solicitado');

          idPaso = paso.id;
        }

        let idFlujoOriginal = null;

        if (datos.hojaRutaOriginal) {
          const _existeFlujoDocumental = await FlujoDocumentalService.findOne({ codigoFlujo: datos.hojaRutaOriginal });

          if (!_existeFlujoDocumental) throw new Error(`No existe la HR ${datos.hojaRutaOriginal}`);

          idFlujoOriginal = _existeFlujoDocumental.id;
        }

        const { rows: remintentes } = await UsuarioCargoService.listar({ numeroDocumento: datos.usuarioRemitente });

        if (!remintentes[0]) throw new Error(`No se encuentra el usuario con el CI: ${datos.usuarioRemitente}`);

        const usuarioRemitente = remintentes[0];
        usuarioRemitente.seleccionadoAutomatico = true;
        usuarioRemitente.visiblePdf = true;
        usuarioRemitente.seleccionado = true;

        const usuariosDestinatarios = [];

        for (const numeroDocumento of datos.usuariosDestinatarios) {
          const { rows: destinatarios } = await UsuarioCargoService.listar({ numeroDocumento });

          if (!destinatarios[0]) throw new Error(`No se encuentra el usuario con el CI: ${numeroDocumento}`);

          const usuarioDestinatario = destinatarios[0];
          usuarioDestinatario.seleccionadoAutomatico = true;
          usuarioDestinatario.visiblePdf = true;
          usuarioDestinatario.seleccionado = true;

          usuariosDestinatarios.push(usuarioDestinatario);
        }

        const usuariosComparir = [];
        if (Array.isArray(datos.compartirDocumento)) {
          for (const usuarioCompartir of datos.compartirDocumento) {
            const { rows: usuario } = await UsuarioCargoService.listar({ numeroDocumento: usuarioCompartir.numeroDocumento });

            if (!usuario[0]) throw new Error(`No se encuentra el usuario con el CI: ${usuarioCompartir.numeroDocumento}`);

            usuario[0].tipo = usuarioCompartir.tipo;
            usuario[0].aprobado = false;

            usuariosComparir.push(usuario[0]);
          }
        }

        for (const usuarioDestinatario of usuariosDestinatarios) {
          const documentoPlantilla = await FormularioService.listarpor({ id: datos.idDocumentoPlantilla });

          if (!documentoPlantilla) throw new Error('No existe el formulario indicado');

          const { configuracion, name } = documentoPlantilla.configuracion_json.find(x => x.type === 'derivacion');

          if (datos.valoresIniciales) {
            console.log('==========_DESDE_CREACION_EXTERNA_UNO_==========');
            console.log(usuarioRemitente, usuarioDestinatario);

            console.log('==========_DESDE_CREACION_EXTERNA_DOS_==========');
            console.log(datos.usuarioRemitente, datos.usuariosDestinatarios);

            const esDiferente = usuarioRemitente.idUsuario !== usuarioDestinatario.idUsuario || usuarioRemitente.idCargo !== usuarioDestinatario.idCargo;

            console.log('==========_SON_IGUALES_==========');
            console.log(esDiferente);

            const valorDerivacion = {
              name,
              value: {
                de   : configuracion.configDe.multiple ? [usuarioRemitente] : usuarioRemitente,
                via  : configuracion.configVia.multiple ? [] : null,
                para : esDiferente ? (configuracion.configPara.multiple ? [usuarioDestinatario] : usuarioDestinatario) : (configuracion.configPara.multiple ? [] : null)
              }
            };

            if (datos.asunto)  valorDerivacion.value.referencia = datos.asunto;
            datos.valoresIniciales.push(valorDerivacion);
          }

          const id = await SolicitudEjecucionService.createOrUpdate({
            idSolicitudPlantilla : datos.idSolicitudPlantilla,
            idPasoSeleccionado   : idPaso,
            userCreated          : usuarioRemitente.idUsuario,
            asunto               : datos.asunto || null,
            idFlujoOriginal,
            valoresIniciales     : datos.valoresIniciales,
            usuariosComparir     : usuariosComparir
          });

          const { flujoDocumental } = await FlujoDerivacionService.findOne({ id });
          respuesta.push({
            id       : flujoDocumental.id,
            hojaRuta : flujoDocumental.codigoFlujo
          });
        }
      }

      if (datos.idDocumentoPlantilla && !datos.idSolicitudPlantilla) {
        const plantilla = await FormularioService.listarpor({ id: datos.idDocumentoPlantilla });

        for (const element of plantilla.configuracion_json) {
          element.value = { uid: element.uid, type: element.type, name: element.name, valores: element.value ?? element.defaultValue ?? '' };
        }

        if (datos.configuracionJson) {
          for (const valor of datos.configuracionJson) {
            const indexComponente = plantilla.configuracion_json.findIndex(x => x.name === valor.name);
            if (indexComponente || indexComponente === 0) {
              plantilla.configuracion_json[indexComponente].value.valores = valor.value;
            }
          }
        }

        if (!plantilla) throw new Error('No existe la plantilla solicitada');

        for (const numeroDocumento of datos.usuariosCreacion) {
          const usuario = await UsuarioService.findByCi(numeroDocumento);

          if (!usuario[0]) throw new Error(`No se encuentra el usuario con el CI: ${numeroDocumento}`);
          const datos = {
            userCreated    : usuario[0].id,
            idCargo        : usuario[0].idCargo,
            usuario        : usuario[0].usuario,
            plantillaValor : [],
            plantilla
          };

          const id = await DocumentoService.createOrUpdate(datos, true);
          const flujoDerivacionActual = await FlujoDerivacionService.findOne({ id });
          respuesta.push({
            id       : flujoDerivacionActual.id,
            hojaRuta : flujoDerivacionActual.codigoFlujo
          });
        }
      }

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function vincularFlujos (req, res) {
    try {
      const { vinculaciones, codigoFlujoOriginal } = req.body;

      const _existeFlujoOriginal = await FlujoDocumentalService.findOne({ codigoFlujo: codigoFlujoOriginal });

      if (!_existeFlujoOriginal) throw new Error(`No existe el flujo con la HR ${codigoFlujoOriginal}`);

      for (const vinculacion of vinculaciones) {
        const _existeFlujoDocumental = await FlujoDocumentalService.findOne({ codigoFlujo: vinculacion.codigoFlujo });

        if (!_existeFlujoDocumental) throw new Error(`No existe el flujo con la HR ${codigoFlujoOriginal}`);

        const existeUsuario = await UsuarioService.findByCi({ numeroDocumento: vinculacion.numeroDocumento });

        const flujoDocumental = {
          id                : _existeFlujoDocumental.id,
          idFlujoPadre      : _existeFlujoOriginal.id,
          userUpdated       : existeUsuario.id,
          fechaFinalizacion : new Date(),
          proveidoCierre    : vinculacion.proveidoCierre || `VINCULADO A LA HOJA DE RUTA ${_existeFlujoDocumental.codigoFlujo}`,
          estado            : 'VINCULADO'
        };

        const datos = {
          codigoFlujo : codigoFlujoOriginal,
          observacion : 'Se vincula la Hoja de ruta de forma automatica'
        };

        const flujoActualizado = await FlujoDocumentalService.update(flujoDocumental);
        await FlujoDerivacionService.registrarVinculacion(flujoActualizado, datos, existeUsuario.id, true);
      }

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, true));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crearFlujo,
    vincularFlujos,
    ejecutarInteroperabilidad,
    documentosAdjuntos,
    cancelarFlujo,
    cancelarFlujoNuevo,
    pasosCancelables,
    pasosObservaciones,
    pasosSiguientes,
    findPasoActual,
    findAll,
    findOne,
    createItem,
    updateItem,
    deleteItem
  };
};
