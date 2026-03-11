
const { Respuesta } = require('../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../lib/globals');
const DerivacionMiddleware = function (services) {
  const { FlujoDerivacionService } = services;
  function validarDerivacion () {
    return async function _middleware (req, res, next) {
      try {
        const derivacionActual =  await FlujoDerivacionService.findOne({
          id                    : req.params.id,
          idUsuarioDestinatario : req.user.idUsuario,
          idCargoDestinatario   : req.user.idCargo,
          estadoActual          : 'ACTIVO'
        });

        console.log(`INFO DERIVACION: ====>>>
        AND idUsuarioRemitente = ${derivacionActual.idUsuarioDestinatario}
        AND nombreRemitente = ${derivacionActual.nombreRemitente}
        AND idUsuarioDestinatario = ${derivacionActual.idUsuarioDestinatario}
        AND nombreDestinatario = ${derivacionActual.nombreDestinatario}
        AND copia = ${derivacionActual.flujoDocumental?.copia}
        AND tipoFlujo = ${derivacionActual.flujoDocumental?.tipo}
        AND idDerivacion = ${derivacionActual.id}
        AND idFlujo = ${derivacionActual.flujoDocumental?.id}
        AND idFlujoPadre = ${derivacionActual.flujoDocumental?.idFlujoPadre}
        AND idDocumento = ${derivacionActual.documento?.id}
        AND idDocumentoPadre = ${derivacionActual.documento?.idDocumentoPadre}
        AND estadoActual = ${derivacionActual.estadoActual}`);

        if (!derivacionActual) throw new Error('No tiene permitido derivar documentos que no se encuentran en su bandeja de pendientes');

        if (!derivacionActual.fechaRecepcion) throw new Error('No tiene permitido derivar documentos que no han sido recepcionados');

        console.log('==========>>>>>>>>>> SI TIENE PERMISOS PARA DERIVAR ');

        return next();
      } catch (error) {
        return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
      }
    };
  }

  return {
    validarDerivacion
  };
};

module.exports = function (services) {
  return new DerivacionMiddleware(services);
};
