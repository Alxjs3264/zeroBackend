'use strict';

const debug = require('debug')('app:controller:auth');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function NotificacionController (services) {
  const { TicketService, CargoService, AreaService, EntidadService } = services;

  async function getParametros (req, res) {
    try {

      const respuesta = {
        departamentos : await TicketService.getDepartamentos(),
        topicos       : await TicketService.getTopicos(),
        prioridades   : await TicketService.getPrioridades()
      }
      if (!respuesta) {
        throw new Error('No se encontro el usuario en los registros SRH');
      }      
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function crearTicket (req, res) {
    try {
      const datos = {
        ...req.body,
        // title: req.body.subject.replaceAll('\n', ' '),
        status_id: 1,
        sla_id: 1
      };
      const user = await TicketService.getUsuarios(req.user.usuario, true);
      // const user = await TicketService.getUsuarios('4859740', true);
      if (!user) {
        throw new Error('Su usuario no tiene permisos para crear tickets');
      }
      datos.user_id = user.user_id;

      const listaUnidades = await TicketService.getUnidades();
      const listaEntidades = await TicketService.getEntidades();

      const { unidad } = await CargoService.findOne({ id: req.user.idCargo });
      const unidadTicket = listaUnidades.items.find(u => u.value === unidad.sigla);

      const entidad = await EntidadService.findOne({ id: req.user.idEntidad });
      const entidadTicket = listaEntidades.items.find(e => e.value === entidad.sigla) ?? '89';
      
      datos.custom_fields = {
        unidad: unidadTicket
          ? JSON.stringify({ [unidadTicket.id]: unidadTicket.value })
          : JSON.stringify({ '90': 'OTROS' }),
        entidad: entidadTicket
          ? JSON.stringify({ [entidadTicket.id]: entidadTicket.value })
          : JSON.stringify({ '89': 'ENTIDAD EXTERNA' }),
        telefono: req.user.celular,
        oficina: '',
        hoja_ruta: ''
      }
      
      const ticket = await TicketService.addTicket(datos)
      
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, ticket));
    } catch (error) {
      console.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerUrlLogin (req, res) {
    try {
      const user = await TicketService.getUsuarios(req.user.usuario, true);
      if (!user) {
        throw new Error('Su usuario no tiene permisos para crear tickets');
      }
      
      const respuesta = await TicketService.obtenerUrlLogin(user.uuid);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    getParametros,
    crearTicket,
    obtenerUrlLogin
  };
};
