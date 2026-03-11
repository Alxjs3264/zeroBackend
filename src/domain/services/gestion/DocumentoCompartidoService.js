const debug = require('debug')('app:service:FlujoDerivacion');
const { ErrorApp } = require('../../lib/error');
const moment = require('moment');

module.exports = function DocumentoCompartidoService (repositories) {
  const { DocumentoCompartidoRepository, DocumentoRepository, transaction } = repositories;

  async function findAll (params) {
    try {
      debug(params);
      const publicacion = await DocumentoCompartidoRepository.findAll(params);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params = {}) {
    debug('Mostrando flujo documental: ', params);
    try {
      const publicacion = await DocumentoCompartidoRepository.findOne(params);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const existeDocumento = await DocumentoRepository.findOne({ id: datos.idDocumento }, transaccion);

      if (!existeDocumento) throw new Error('El documeto no existe.');

      if (!existeDocumento.editable) throw new Error('El documeto no. en un estado editable, por lo que no se puede compartir.');

      await DocumentoRepository.createOrUpdate({ id: datos.idDocumento, compartido: datos.usuariosComparir?.length > 0 }, transaccion);
      const idsValidos = [];
      for (const compartir of datos.usuariosComparir) {
        const yaExiste = await DocumentoCompartidoRepository.findOne({ idUsuario: compartir.idUsuario, idDocumento: datos.idDocumento }, transaccion);
        let registro = {};
        if (yaExiste) {
          registro = await DocumentoCompartidoRepository.createOrUpdate({
            id            : yaExiste.id,
            aprobado      : yaExiste.aprobado,
            fechaAprobado : yaExiste.fechaAprobado ?  moment(yaExiste.fechaAprobado, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : null,
            visto         : yaExiste.visto,
            fechaVisto    : yaExiste.fechaVisto ? moment(yaExiste.fechaVisto, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : null,
            tipo          : compartir.tipo,
            detalle       : compartir,
            userUpdated   : datos.userCreated
          }, transaccion);
        }

        if (!yaExiste) {
          registro = await DocumentoCompartidoRepository.createOrUpdate({
            idDocumento     : datos.idDocumento,
            idUsuarioOrigen : datos.userCreated,
            idUsuario       : compartir.idUsuario,
            aprobado        : compartir.aprobado,
            tipo            : compartir.tipo,
            detalle         : compartir,
            userCreated     : datos.userCreated
          }, transaccion);
        }
        idsValidos.push(registro.id);
      }

      await DocumentoCompartidoRepository.eliminarOtros({ idsValidos, idDocumento: datos.idDocumento, userDeleted: datos.userCreated }, transaccion);

      if (!t) await transaction.commit(transaccion);
      return true;
    } catch (error) {
      if (!t)  await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearOActualizar (datos) {
    try {
      const documentoCompartido = await DocumentoCompartidoRepository.createOrUpdate(datos);
      return documentoCompartido;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function deleteItemCond (params) {
    try {
      const publicacion = await DocumentoCompartidoRepository.deleteItemCond(params);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    crearOActualizar,
    deleteItemCond,
    createOrUpdate,
    findOne,
    findAll
  };
};
