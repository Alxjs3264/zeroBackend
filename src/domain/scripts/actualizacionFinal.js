const db = require('../../infrastructure');
const { config, errors } = require('../../common');
const fs = require('fs');
const fspromises = require('fs/promises');

(async function () {
  const repositories = await db(config.db).catch(errors.handleFatalError);
  const {
    UsuarioRepository
  } = repositories;
  const { CargoRepository } = repositories.planificacion;

  try {

    const cargos = 'usuarios.json';
    const data = await fspromises.readFile(cargos, 'utf8');
    let cargoActualizar = JSON.parse(data);
    cargoActualizar = cargoActualizar.filter(c => c.cargoNuevo !== '');

    for (const cargo of cargoActualizar) {
      try {
        await CargoRepository.createOrUpdate({
          id          : cargo.id,
          nroItem     : cargo.itemNuevo + '',
          descripcion : cargo.cargoNuevo
        });
      } catch (error) {
        console.log(error);
      }
    }
    console.log('total, ', cargoActualizar.length);

    return;
  } catch (error) {
    console.error(error.message);
  }
})();
