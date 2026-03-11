'use strict';

const debug = require('debug')('app:controller:auth');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const validate = require('validate.js');
const { ID_USUARIO_ADMINISTRADOR } = require('../../../../common/config/constants');
const { incluirOsTickets } = require('../../../../common/config/app');

module.exports = function setupUsuarioController (services) {
  const { UsuarioService, FlujoDerivacionService, AuthService, TicketService } = services;

  async function listar (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['listar:usuarios:entidad']);

      const respuesta = await UsuarioService.listarUsuarios(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarRemitentes (req, res) {
    try {
      const respuesta = await UsuarioService.listarRemitentes(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listadoReducido (req, res) {
    try {
      const respuesta = await UsuarioService.listadoReducido(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await UsuarioService.findOneEdicion(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function mostrar (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await UsuarioService.mostrar(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const respuesta = await UsuarioService.createOrUpdate(data);
      // if (incluirOsTickets) {
      //   const userTicket = await crearUsuarioTickets(data);
      //   if (userTicket.status !== 'Success') {
      //     console.error("ERROR USER TICKET: ", userTicket.data);
      //     // throw new Error(userTicket.data);
      //   }
      // }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearUsuarioTickets (user) {
    try {
      const { AuthRepository } = services._repositories
      const data = {
        name: `${user.nombres} ${user.primerApellido} ${user.segundoApellido}`,
        email: user.correoElectronico,
        password: await AuthRepository.codificarContrasena(user.numeroDocumento),
        timezone: 'America/La_Paz',
        phone: user.celular ?? user.telefono ?? '-',
        org_id: '0',
        nro_ci: user.numeroDocumento,
        default_email_id: '0',
        status: '1'
      }
      const response = await TicketService.addUser(data);
      return response
    } catch (error) {
      console.error(error);      
      throw error
    }
  }

  async function actualizar (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.id = req.params.id;
      const respuesta = await UsuarioService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cambiarContrasena (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      if (data.id.toString() !== req.user.idUsuario.toString()) {
        throw new Error('El identificacdor del usuario no corresponde al token de autenticación.');
      }
      const respuesta = await UsuarioService.cambiarContrasena(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await UsuarioService.eliminar(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function asignarRoles (req, res) {
    try {
      const respuesta = await UsuarioService.asignarRoles(req.body);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cantidadDocumentosPorUsuario (req, res) {
    try {
      const respuesta = await FlujoDerivacionService.cantidadDocumentosPorUsuario(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listaDocumentosPorUsuario (req, res) {
    try {
      const respuesta = await FlujoDerivacionService.listaDocumentosPorUsuario({ idUsuario: req.params.id, idPlantilla: req.query.idPlantilla });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listaFlujoDocumentalPendientePorUsuario (req, res) {
    try {
      const respuesta = await FlujoDerivacionService.listaFlujoDocumentalPendientePorUsuario({
        idUsuario : req.params.id,
        limit     : req.query.limit || 10,
        page      : req.query.page || 1
      });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizarHorarios (req, res) {
    try {
      const data = req.body;
      data.userUpdated = req.user.idUsuario;
      data.id = req.params.id;
      const respuesta = await UsuarioService.actualizarHorarios(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cambiarEstado (req, res) {
    try {
      const data = {
        id          : req.params.id,
        estado      : req.body.estado,
        userUpdated : req.user.idUsuario
      };

      const respuesta = await UsuarioService.cambiarEstado(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function verificarUsuario (req, res) {
    try {
      const datos = req.body.numerosDocumento;

      const respuesta = await UsuarioService.findByCi(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerDatosUsuario (req, res) {
    try {
      const datos = req.query.numeroDocumento;

      const respuesta = await UsuarioService.verificarCi(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearUsuario (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user?.idUsuario;

      const constraintsGeneral = {
        tipoDocumento     : { presence: { message: 'Es requerido' } },
        numeroDocumento   : { presence: { message: 'Es requerido' } },
        fechaNacimiento   : { presence: { message: 'Es requerido' } },
        nombres           : { presence: { message: 'Es requerido' } },
        primerApellido    : { presence: { message: 'Es requerido' } },
        segundoApellido   : { presence: { message: 'Es requerido' } },
        correoElectronico : { presence: { message: 'Es requerido' } },
        cargos            : { presence: { message: 'Es requerido' } },
        rol               : { presence: { message: 'Es requerido' } }
      };

      data.usuario = data.numeroDocumento;
      data.idEntidad = data.entidad?.id;
      data.tipoDocumento = data.tipoDocumento?.nombre;
      data.userCreated = ID_USUARIO_ADMINISTRADOR;

      const resultadoValidacion = await validate(data, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      const respuesta = await UsuarioService.crearUsuario(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function importar (req, res) {
    try {
      const data = req.body;
      const respuesta = await UsuarioService.importar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function cambiarTodasContrasenas (req, res) {
    try {
      // const data = req.body;
      const respuesta = await UsuarioService.cambiarTodasContrasenas();
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  
  async function sincronizar (req, res) {
    try {
      const nroDocumento = req.params.ci;
      const respuesta = await UsuarioService.sincronizar({ nroDocumento });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    importar,
    findOne,
    crearUsuario,
    obtenerDatosUsuario,
    verificarUsuario,
    cambiarEstado,
    actualizarHorarios,
    listarRemitentes,
    cambiarContrasena,
    asignarRoles,
    listar,
    listadoReducido,
    mostrar,
    crear,
    actualizar,
    eliminar,
    cantidadDocumentosPorUsuario,
    listaDocumentosPorUsuario,
    listaFlujoDocumentalPendientePorUsuario,
    cambiarTodasContrasenas,
    sincronizar
  };
};
