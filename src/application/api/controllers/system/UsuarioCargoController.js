'use strict';
const debug = require('debug')('app:controller:REPORTE');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupPermisoController (services) {
  const { UsuarioCargoService, AuthService } = services;

  async function listar (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['derivacion:usuarios:entidad']);

      const respuesta = await UsuarioCargoService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarReporte (req, res) {
    try {
      const datos = { ...req.query };

      await AuthService.verificarPermisoEntidades(req, ['reporte:usuarios:entidad']);
      const verOculto = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['reporte:ver-usuario-oculto'] });
      
      if (!verOculto) {
        const usuariosOcultos = await AuthService.verificarPermisos({ usuarios: [], permisos: ['reporte:permanecer-oculto'] });
        
        const ocultos = [];
        if (usuariosOcultos) {
          for (let rol of usuariosOcultos.roles) {
            ocultos.push(...rol.usuarios.map(u => u.id));
          }
        }

        datos.exclude = ocultos;
      }
      const respuesta = await UsuarioCargoService.listar(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const datos = req.body;
      datos.userCreated = req.user.idUsuario;
      const respuesta = await UsuarioCargoService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const datos = req.body;
      datos.userUpdated = req.user.idUsuario;
      datos.id = req.params.id;
      const respuesta = await UsuarioCargoService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const respuesta = await UsuarioCargoService.eliminar(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function mostrar (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await UsuarioCargoService.mostrar(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    listarReporte,
    crear,
    actualizar,
    eliminar,
    listar,
    mostrar
  };
};
