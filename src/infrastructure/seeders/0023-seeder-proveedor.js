'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { saltRounds } = require('../../common/config/auth');
const { Ids } = require('../../common/config/constants');
const bcrypt = require('bcrypt');

// Datos de producción
let items = [
  {
    id                     : '40f8bdbe-8d89-493c-9617-ac832393f046',
    par_tipo_servicio      : '8e8cad67-fa16-4377-b797-068b28bbc83e',
    descripcion            : 'EMPRESA NACIONAL DE ELECTRICIDAD -ENDE',
    nit                    : '1023187029',
    direccion              : 'Calle Colombia Nº 655 Zona Central',
    correo_electronico     : '',
    representante_legal    : '',
    representante_legal_ci : '',
    banco_numero_cuenta    : '',
    estado                 : 'ACTIVO'
  },
  {
    id                     : '00a8972f-6d74-46aa-9b49-9db20999d99f',
    par_tipo_servicio      : 'cfa570b3-c094-4b6a-a466-d1c65684e74d',
    descripcion            : 'EMPRESA DE COMUNICACION SOCIAL EL DEBER S.A.',
    nit                    : '1028283031',
    direccion              : 'Av. 16 de Julio N° 1479 El Prado, Edif. San Pablo, Piso 1, Of. 108',
    correo_electronico     : '',
    representante_legal    : '',
    representante_legal_ci : '',
    banco_numero_cuenta    : '',
    estado                 : 'ACTIVO'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('administracion_proveedor', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
