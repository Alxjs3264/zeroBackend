'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('gestion_formulario');
    if (!tableDescription.configuracion_pagina) {
      const sql = `
      ALTER TABLE gestion_formulario ADD COLUMN configuracion_pagina JSONB DEFAULT '{
          "tamanioPagina": {
            "nombre": "CARTA",
            "ancho": "21.59",
            "alto": "27.94"
          },
          "margenIzquierdo": 4,
          "margenSuperior": 3,
          "margenDerecho": 3,
          "margenInferior": 3 }';`;
      return queryInterface.sequelize.query(sql);
    }
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
