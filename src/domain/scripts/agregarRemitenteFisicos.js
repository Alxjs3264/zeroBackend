const db = require('../../infrastructure');
const { config, errors } = require('../../common');

async function AgregarRemitente () {
  const repositories = await db(config.db).catch(errors.handleFatalError);
  const {
    FlujoDocumentalRepository,
    UsuarioRepository,
    transaction
  } = repositories;

  const transaccion = await transaction.create();
  try {
    const gestionDocumental = await FlujoDocumentalRepository.findAll({ tipo: 'SIPFA', fechaDesde: '10/01/2023' });
    // console.log(gestionDocumental);
    for (const doc of gestionDocumental.rows) {
      if (doc.remitente) {
        // console.log('tiene remitente');
      } else {
        const datos = {};
        const usuario = await UsuarioRepository.findOne({ id: doc.userCreated });

        datos.remitente = `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;
        datos.id = doc.id;
        if (!doc.referencia) {
          datos.referencia = doc.documentos.length === 0 ? doc.solicitudPlantilla?.nombre : doc.documentos[doc.documentos.length - 1]?.asunto;
        }
        await FlujoDocumentalRepository.createOrUpdate(datos);
        console.log('remitente cambiado', datos.remitente);
      }
    }
    await transaction.commit(transaccion);
    console.log(`Script Finalizado registros cambiados: ${gestionDocumental.count}`);
  } catch (error) {
    await transaction.rollback(transaccion);
    console.log(error);
  }
}

AgregarRemitente();
