'use strict';

const {
  setTimestampsSeeder
} = require('../lib/util');
const { Ids } = require('../../common/config/constants');

// Datos de producción
let items = [
  { id: 'b4ddef98-b084-4380-b108-4f28d5a07c5d', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba566a' },
  { id: 'b4ddef98-b084-4380-b108-4f28d5a07c50', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba566f' },
  { id: 'b4ddef98-b084-4380-b108-4f28d5a07c5f', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba5667' },
  { id: 'ead6d883-f0a2-4806-9797-270d8c1bf35f', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '039a897a-76dd-44c1-b3d7-9682df8f5342' },
  { id: '196387cb-ac7a-4aac-89ed-3b75f6efc78b', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '61d6d53b-ac65-41ac-bc54-3228f548f40a' },
  { id: '72a9a41e-998b-4ada-80b3-354dc0dccd0e', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: 'ef6b99d0-0834-4d1e-86b0-207111744f98' },
  { id: '67fcd676-938d-4c86-9b7f-e79508243c0c', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '6dc27435-bb49-48c8-b98d-ed9024d10ec5' },
  { id: '49dc495f-8594-4c30-9308-5769f2067b66', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: 'a0882ff9-0d95-4d60-835d-85624f7a3469' },
  { id: '2b2d7ace-34e4-45bf-96ab-a2654679788e', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: Ids.menus.Formularios },
  { id: 'e553ab5a-2e7e-4fe6-8017-9fb521a1c4f9', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '22c3f8db-8414-49e3-87bf-455d326170b2' },
  { id: '1d3caea7-5cac-4a27-8fde-f7516b468d18', id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_menu: '7914cf8c-39b2-4561-ac2e-3cef07d8925e' },

  { id: '9d820d21-c52e-44b8-92c4-1649cabe4217', id_rol: Ids.roles.ministro, id_menu: Ids.menus.Dashboard },
  { id: 'fd386bbe-d1fd-4633-bf2e-2e26b0b3a746', id_rol: Ids.roles.viceministro, id_menu: Ids.menus.Dashboard },
  { id: 'c4c62e55-72c8-469a-93a3-e80eb60cfe0a', id_rol: Ids.roles.directores, id_menu: Ids.menus.Dashboard },
  { id: '471593c2-0198-4dee-8021-6ca4affaaf2e', id_rol: Ids.roles['jefes de unidad'], id_menu: Ids.menus.Dashboard },
  { id: 'e4849f3f-cb2b-4a6a-9863-abc3b3563c6b', id_rol: Ids.roles.secretaria, id_menu: Ids.menus.Dashboard },
  { id: '196f0543-8a5d-4f1a-8dc2-2203a1700ada', id_rol: Ids.roles.autoridades, id_menu: Ids.menus.Dashboard },
  { id: '200f9f6a-b1a0-4b6b-9d56-d854359bd644', id_rol: Ids.roles['personal mjti'], id_menu: Ids.menus.Dashboard },
  { id: '200f9f6a-b1a0-4b6b-9d56-d854359bd645', id_rol: Ids.roles['personal mjti'], id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba5667' },
  // { id: '200f9f6a-b1a0-4b6b-9d56-d854359bd646', id_rol: Ids.roles['personal mjti'], id_menu: '22c3f8db-8414-49e3-87bf-455d326170b2' },
  { id: '200f9f6a-b1a0-4b6b-9d56-d854359bd647', id_rol: Ids.roles['personal mjti'], id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba566f' },

  { id: 'b4ddef98-b084-4380-b108-4f28d5a07c5a', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba566a' },
  { id: 'b4ddef98-b084-4380-b108-4f28d5a07c5e', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba5667' },
  { id: '31a61eea-2f8b-4f18-a8f9-3cb1358f24af', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: '039a897a-76dd-44c1-b3d7-9682df8f5342' },
  { id: '6076b70c-8058-4231-82fa-33ab9cfb3538', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: '61d6d53b-ac65-41ac-bc54-3228f548f40a' },
  { id: '92c82599-2712-41a4-8fa3-8c423e6eb986', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: 'ef6b99d0-0834-4d1e-86b0-207111744f98' },
  { id: '6e45058f-c66c-4c05-b332-9ba6dc6528ad', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: '6dc27435-bb49-48c8-b98d-ed9024d10ec5' },
  { id: '638063dd-f1bc-4d9f-95c6-948e795c4703', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: 'a0882ff9-0d95-4d60-835d-85624f7a3469' },
  { id: 'a94ec95c-ca7d-4d92-ac9b-02453c70ac31', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: Ids.menus.Formularios },
  // { id: 'ccfe07a5-b182-4c1c-af53-900355689dd6', id_rol: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_menu: '22c3f8db-8414-49e3-87bf-455d326170b2' },

  { id: '65276143-babb-4199-917f-5e71bbc33afd', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba566a' },
  { id: '65276143-babb-4199-917f-5e71bbc33afe', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '6190597f-7fa6-4c39-bcc9-7a1441ba5667' },
  { id: '84bb5e21-146f-48d0-bd78-1c6f9a15a4cb', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '039a897a-76dd-44c1-b3d7-9682df8f5342' },
  { id: 'e4b0203a-0c44-4fa7-ae3f-3cd8da89c95c', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '61d6d53b-ac65-41ac-bc54-3228f548f40a' },
  { id: '898525b1-1683-4053-a7b2-937bd0e71b8a', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: 'ef6b99d0-0834-4d1e-86b0-207111744f98' },
  { id: 'fef5ac29-4025-4c39-8272-c8eb4e8d1bd4', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '6dc27435-bb49-48c8-b98d-ed9024d10ec5' },
  { id: '2417a40f-4726-4898-bddb-6d747c4c0105', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: 'a0882ff9-0d95-4d60-835d-85624f7a3469' },
  { id: '177b9a6f-1b0d-4a13-944c-d598822bd1b2', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: Ids.menus.Formularios },
  // { id: '16ca2cb8-c3e1-4af7-aaf0-8e6c9dee4ed8', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '22c3f8db-8414-49e3-87bf-455d326170b2' },
  { id: '19c2a1de-a67a-406e-8888-7f1b29ced9e8', id_rol: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_menu: '7914cf8c-39b2-4561-ac2e-3cef07d8925e' }

];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_rol_menu', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },

  down (queryInterface, Sequelize) {}

};
