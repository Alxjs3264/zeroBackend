'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_parametro', [
      {
        id            : '86b48ba7-88d3-4c74-b51c-7e3d557c8d34',
        grupo         : 'TIPO_CARGO',
        codigo        : 'TC-DEP',
        otros         : null,
        nombre        : 'DEPENDIENTES',
        descripcion   : 'DEPENDIENTES',
        estado        : 'ACTIVO',
        _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
        _user_updated : null,
        _user_deleted : null,
        _created_at   : '2022-11-28T14:47:37.843Z',
        _updated_at   : null,
        _deleted_at   : null
      }
    ], {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },
  down: function (queryInterface, Sequelize) {}
};
