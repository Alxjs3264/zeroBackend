'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = `
       ALTER TABLE sys_usuario ADD COLUMN IF NOT EXISTS horarios_atencion JSONB DEFAULT '[{"dia":"Lunes","periodos":[{"inicio":"00:00","fin":"23:59"}]},{"dia":"Martes","periodos":[{"inicio":"00:00","fin":"23:59"}]},{"dia":"Miercoles","periodos":[{"inicio":"00:00","fin":"23:59"}]},{"dia":"Jueves","periodos":[{"inicio":"00:00","fin":"23:59"}]},{"dia":"Viernes","periodos":[{"inicio":"00:00","fin":"23:59"}]},{"dia":"Sabado","periodos":[{"inicio":"00:00","fin":"23:59"}]},{"dia":"Domingo","periodos":[{"inicio":"00:00","fin":"23:59"}]}]';
    `;
    return queryInterface.sequelize.query(sql);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
