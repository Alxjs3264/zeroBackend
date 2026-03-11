'use strict';
const uuids = [
  '40c3ddc2-e839-451d-95c9-a259ea781751',
  '481d6322-3e09-4393-977e-829de11a114b',
  '1763736d-aa9c-409a-8b34-a4203527c334',
  'a324a8cc-9ad2-47fa-b846-1208d7c22db4',
  '8257c696-a852-4a97-a1ad-4c1b9876325b',
  'd6e7a1df-74ae-4c43-80c4-37a24c6d648b',
  'a4aaff33-11c8-4bc8-ada9-d9f24e708baf'
]
module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = `
      UPDATE sys_parametro
      SET configuracion_sistema = true
      WHERE id IN ('${uuids.join('\',\'')}');`;
    return queryInterface.sequelize.query(sql);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
