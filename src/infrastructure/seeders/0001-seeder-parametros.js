'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  { id: '40c3ddc2-e839-451d-95c9-a259ea781751', grupo: 'CONFIG', codigo: 'TK', nombre: 'TIEMPO DEL TOKEN', descripcion: '240', estado: 'ACTIVO' },

  // Tipo de documento
  { id: '7f295982-6e6c-4424-b1f5-26c2dd21d5f2', grupo: 'TIPO_DOCUMENTO', codigo: 'CIEXT', nombre: 'CEDULA DE IDENTIDAD DE EXTRANJERO', estado: 'ACTIVO' },
  { id: '1d1866c6-4cc6-4957-a308-8638b8560355', grupo: 'TIPO_DOCUMENTO', codigo: 'CI', nombre: 'CEDULA DE IDENTIDAD', estado: 'ACTIVO' },
  { id: '37f9091a-86ee-4431-97b5-4e97917d14c6', grupo: 'TIPO_DOCUMENTO', codigo: 'PAS', nombre: 'PASAPORTE', estado: 'ACTIVO' },
  { id: '112e1cde-0ac1-465a-aa5e-64d7e2f6ae42', grupo: 'TIPO_DOCUMENTO', codigo: 'NIT', nombre: 'NUMERO DE IDENTIFICACION TRIBUTARIO', estado: 'ACTIVO' },
  { id: '83cf2636-ce74-4ef4-ab17-04c68d8fd89c', grupo: 'TIPO_DOCUMENTO', codigo: 'NITE', nombre: 'NUMERO DE IDENTIFICACION TRIBUTARIA EXTRANJERA', estado: 'ACTIVO' },

  // tipo de Accion
  { id: '7a49fe4e-3b87-44e6-9418-ffc8eebcd382', grupo: 'TIPO_ACCION', codigo: '1', nombre: 'CREACION', estado: 'ACTIVO' },
  { id: 'bb0d925b-4e16-47d0-ab18-eff8b9e81593', grupo: 'TIPO_ACCION', codigo: '2', nombre: 'MODIFICACION', estado: 'ACTIVO' },
  { id: '48c30b57-4392-4b54-b75f-719aa3e1ff79', grupo: 'TIPO_ACCION', codigo: '3', nombre: 'DERIVACION', estado: 'ACTIVO' },
  { id: '3094cf9d-ef48-40ca-bb6c-bd282623de3f', grupo: 'TIPO_ACCION', codigo: '4', nombre: 'DEVOLUCION', estado: 'ACTIVO' },
  { id: 'd605e824-818a-45a7-87c3-a2bbb2b3c4b7', grupo: 'TIPO_ACCION', codigo: '5', nombre: 'ARCHIVO', estado: 'ACTIVO' },
  { id: '119e3681-bfcf-49cc-8b0e-941367a0a048', grupo: 'TIPO_ACCION', codigo: '6', nombre: 'ELIMINACION', estado: 'ACTIVO' },

  // tipo de Solicitud
  { id: '77a71a7c-ae01-4d64-a471-07a97d0ba716', grupo: 'TIPO_SOLICITUD', codigo: 'BS', nombre: 'BIENES Y SERVICIOS', estado: 'ACTIVO' },
  { id: '8bdc028a-2e0b-4480-b5a6-936e405348ce', grupo: 'TIPO_SOLICITUD', codigo: 'PV', nombre: 'PASAJES Y VIÁTICOS', estado: 'ACTIVO' },
  { id: '04861093-c0af-4d35-96ca-2d4d31adefba', grupo: 'TIPO_SOLICITUD', codigo: 'FA', nombre: 'FONDOS EN AVANCE', estado: 'ACTIVO' },
  { id: '344f4f0e-c4e1-44bc-938e-2f3eb7bc923d', grupo: 'TIPO_SOLICITUD', codigo: 'CC', nombre: 'CAJA CHICA', estado: 'ACTIVO' },
  { id: '9e6762e1-a83f-49f3-9741-aa52114bb5ef', grupo: 'TIPO_SOLICITUD', codigo: 'PD', nombre: 'PAGO PROVEEDOR DIRECTO', estado: 'ACTIVO' },
  { id: 'b44b552f-3fe8-4c0c-951b-79c7e62d7dc2', grupo: 'TIPO_SOLICITUD', codigo: 'RB', nombre: 'REEMBOLSO', estado: 'ACTIVO' },
  { id: '7e8c1e38-809e-4f92-9582-f8cbfab8162a', grupo: 'TIPO_SOLICITUD', codigo: 'PE', nombre: 'PERSONAL EVENTUAL', estado: 'ACTIVO' },
  { id: 'bad7d65f-b4a8-4eeb-805b-17b468926813', grupo: 'TIPO_SOLICITUD', codigo: 'PP', nombre: 'PAGO DE PLANILLAS', estado: 'ACTIVO' },

  // tipo de Contratación
  { id: '8023ae82-40c5-4849-bceb-44f6506ecaec', grupo: 'TIPO_CONTRATACION', codigo: '1', nombre: 'CONTRATACION MENOR', estado: 'ACTIVO' },
  { id: 'b10057ad-41df-4062-b570-646d3d24daf5', grupo: 'TIPO_CONTRATACION', codigo: '2', nombre: 'APOYO NACIONAL A LA PRODUCCIÓN Y EMPLEO (ANPE)', estado: 'ACTIVO' },
  { id: '125a07f7-6cd7-4bbc-88e7-5a3914c9fde0', grupo: 'TIPO_CONTRATACION', codigo: '3', nombre: 'CONTRATACIÓN POR EXCEPCIÓN', estado: 'ACTIVO' },
  { id: '896d5d4b-652a-4a03-9bfc-518625f4aa4c', grupo: 'TIPO_CONTRATACION', codigo: '4', nombre: 'CONTRATACIÓN POR EMERGENCIA', estado: 'ACTIVO' },
  { id: '91baf8c8-41bb-4089-9b50-0aca77ce40ed', grupo: 'TIPO_CONTRATACION', codigo: '5', nombre: 'CONTRATACIÓN DIRECTA', estado: 'ACTIVO' },
  { id: '65d95d03-61f6-43a3-920b-5fd3313767cb', grupo: 'TIPO_CONTRATACION', codigo: '6', nombre: 'CONTRATACIÓN PÚBLICA', estado: 'ACTIVO' },
  { id: '2a98273b-b695-4c23-8d68-4f4a1c438ab7', grupo: 'TIPO_CONTRATACION', codigo: '7', nombre: 'OTRAS MODALIDADES', estado: 'ACTIVO' },

  // tipo de Adjudicación
  { id: 'c27673b7-b84f-42ef-a55d-d58a954899bc', grupo: 'TIPO_ADJUDICACION', codigo: '1', nombre: 'POR EL TOTAL', estado: 'ACTIVO' },
  { id: 'dc75a8f0-0237-4cb8-bf71-652696328e5c', grupo: 'TIPO_ADJUDICACION', codigo: '2', nombre: 'POR ITEMS', estado: 'ACTIVO' },
  { id: 'b80c018c-6ce3-4cd9-b650-544a2bb2eceb', grupo: 'TIPO_ADJUDICACION', codigo: '3', nombre: 'POR LOTES', estado: 'ACTIVO' },
  { id: '40a90d7f-5e58-40f3-b069-0d758ab21e22', grupo: 'TIPO_ADJUDICACION', codigo: '4', nombre: 'TRAMOS O PAQUETES', estado: 'ACTIVO' },
  { id: '8e31d005-ef2c-40b1-9efb-24610dd79e80', grupo: 'TIPO_ADJUDICACION', codigo: '5', nombre: 'OTROS', estado: 'ACTIVO' },

  // tipo de planilla
  { id: '11abee24-2aa1-4c4b-a447-0acdd51243b5', grupo: 'TIPO_PLANILLA', codigo: '0', nombre: 'NINGUNO', estado: 'ACTIVO' },
  { id: 'fdc6153a-1c29-4c29-8c8d-f08228f48c0f', grupo: 'TIPO_PLANILLA', codigo: '1', nombre: 'PERSONAL DE PLANTA - CERTIFICACIÓN POA', estado: 'ACTIVO' },
  { id: 'f99ad880-437b-4339-8ed6-aa2c59904118', grupo: 'TIPO_PLANILLA', codigo: '2', nombre: 'PERSONAL EVENTUAL - CERTIFICACIÓN PRESUPUESTARIA', estado: 'ACTIVO' },
  { id: '52aa8196-4d3c-4ed6-ad00-8ebff1c7250b', grupo: 'TIPO_PLANILLA', codigo: '3', nombre: 'PERSONAL DE REFRIGERIO - CERTIFICACIÓN POA', estado: 'ACTIVO' },
  { id: '368d6c4b-4be6-4b49-9b06-0cbcbf52c9e6', grupo: 'TIPO_PLANILLA', codigo: '4', nombre: 'PERSONAL DE SUBSIDIOS - CERTIFICACIÓN POA', estado: 'ACTIVO' },

  // tipo de responsable
  { id: '4d049bdc-c8f0-4397-b4ca-08029103aed4', grupo: 'TIPO_RESPONSABLE', codigo: '1', nombre: 'COMISION RECEPCIÓN', estado: 'ACTIVO' },
  { id: '04992709-09d0-4086-8a3a-6dff9c4b9a64', grupo: 'TIPO_RESPONSABLE', codigo: '2', nombre: 'FISCAL', estado: 'ACTIVO' },

  // tipo de servicio
  { id: 'df768dff-0339-41a9-804a-73e7c663bfb6', grupo: 'TIPO_SERVICIO', codigo: '1', nombre: 'CONSULTORES DE LINEA', estado: 'ACTIVO' },
  { id: 'cfa570b3-c094-4b6a-a466-d1c65684e74d', grupo: 'TIPO_SERVICIO', codigo: '2', nombre: 'CONSULTOR POR PRODUCTO', estado: 'ACTIVO' },
  { id: '860a88cb-4d4d-4a55-9a71-0cc18d3f97f4', grupo: 'TIPO_SERVICIO', codigo: '3', nombre: 'AGENCIAS DE VIAJE', estado: 'ACTIVO' },
  { id: '8e8cad67-fa16-4377-b797-068b28bbc83e', grupo: 'TIPO_SERVICIO', codigo: '4', nombre: 'ALQUILER DE EQUIPOS DE SONIDO', estado: 'ACTIVO' },
  { id: '8dd443cf-6d40-44ac-95db-7e729c23ceb1', grupo: 'TIPO_SERVICIO', codigo: '5', nombre: 'ALQUILER DE INMUEBLES', estado: 'ACTIVO' },

  // tipo de unidad
  { id: '9e000e89-3456-44da-8ac4-578c70011d3d', nombre: 'PIEZA', codigo: 'PZA.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },
  { id: '77db5e75-d5ea-4995-99bf-8a522d39b37f', nombre: 'FRASCO', codigo: 'FR.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },
  { id: 'e121f075-1823-4270-8da3-3a42fa18b64f', nombre: 'CAJA', codigo: 'CAJ.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },
  { id: '54f82ad0-32da-438b-9252-fb552342ceea', nombre: 'ROLLO', codigo: 'RO.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },
  { id: '7d2b9866-2d33-487c-9b69-aca283842e05', nombre: 'PAQUETE', codigo: 'PQT.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },
  { id: '9a289c82-f65f-469c-997e-6b1c5e3dec3b', nombre: 'BLOCK', codigo: 'BLK.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },
  { id: 'eeb7f627-b0dc-40f7-b85c-81bf3ab03797', nombre: 'BOLSA', codigo: 'B.', grupo: 'TIPO_UNIDAD', estado: 'ACTIVO' },

  // tipo de paso
  { id: 'f8dc02d6-a98c-4360-b849-24fa8c0bdcca', grupo: 'TIPO_PASO', codigo: '1', nombre: 'FORMULARIO', estado: 'ACTIVO' },
  { id: '19c09329-9d29-4836-9352-345fa14ee44e', grupo: 'TIPO_PASO', codigo: '2', nombre: 'DOCUMENTO', estado: 'ACTIVO' },

  { id: '27a90780-a7fa-46e0-a797-5c22b39dda9e', grupo: 'TIPO_DOCUMENTO_GENERAR', codigo: '1', nombre: 'POA', estado: 'ACTIVO' },
  { id: '14e58543-ee0c-46b1-8742-14ac4b0d30f5', grupo: 'TIPO_DOCUMENTO_GENERAR', codigo: '2', nombre: 'CERTIFICACION PRESUPUESTARIA', estado: 'ACTIVO' },
  { id: '22416230-d297-49b1-888d-e2058df9a977', grupo: 'TIPO_DOCUMENTO_GENERAR', codigo: '3', nombre: 'MEMORADUM DE VIAJE', estado: 'ACTIVO' },

  // tipo de cargo
  { id: 'fe278e1e-a60c-4bc9-be76-29b8ac5158f7', grupo: 'TIPO_CARGO', codigo: '1', nombre: 'TODOS', estado: 'ACTIVO' },
  { id: '03d8b373-ed99-4ba6-b36d-b9f50089776c', grupo: 'TIPO_CARGO', codigo: '2', nombre: 'DEPENDENCIA FUNCIONAL', estado: 'ACTIVO' },
  { id: 'ae0262f2-7450-408a-9045-22479b478131', grupo: 'TIPO_CARGO', codigo: '3', nombre: 'ESPECIFICO', estado: 'ACTIVO' },
  { id: 'd7081140-5863-40e5-8966-5853a0bc2602', grupo: 'TIPO_CARGO', codigo: '4', nombre: 'FORMULARIO', estado: 'ACTIVO' },
  { id: '410bcbec-b065-46cb-9f58-1b303e6dcc9e', grupo: 'TIPO_CARGO', codigo: '5', nombre: 'SOLICITANTE', estado: 'ACTIVO' },

  { id: '760f0dd0-59ef-4c6c-bdf5-1277992054b1', nombre: 'PERSONAL DE PLANTA', codigo: 'PP', grupo: 'TIPO_PUESTO', estado: 'ACTIVO' },
  { id: '760f0dd0-59ef-4c6c-bdf5-1277992054b2', nombre: 'PRESONAL EVENTUAL', codigo: 'PE', grupo: 'TIPO_PUESTO', estado: 'ACTIVO' },
  { id: '760f0dd0-59ef-4c6c-bdf5-1277992054b3', nombre: 'CONSULTOR DE LINEA', codigo: 'CL', grupo: 'TIPO_PUESTO', estado: 'ACTIVO' },
  { id: '760f0dd0-59ef-4c6c-bdf5-1277992054b4', nombre: 'OTRAS CONSULTORIAS', codigo: 'OTC', grupo: 'TIPO_PUESTO', estado: 'ACTIVO' },

  { id: '11ecd58b-c915-4fbe-9208-4f3b09d0c059', nombre: 'NUMERICO', codigo: 'NUM', grupo: 'TIPO_INDICADOR_META', estado: 'ACTIVO' },
  { id: '11ecd58b-c915-4fbe-9208-4f3b09d0c060', nombre: 'PORCENTUAL', codigo: 'PORC', grupo: 'TIPO_INDICADOR_META', estado: 'ACTIVO' },

  { id: '5f78b65c-d980-4f19-93a1-1e63c729ba64', nombre: 'AEREO', codigo: 'AER', grupo: 'TIPO_RUTA', estado: 'ACTIVO' },
  { id: '99ba968d-277f-4004-9ee0-ac3089f16ba6', nombre: 'TERRESTRE', codigo: 'TERR', grupo: 'TIPO_RUTA', estado: 'ACTIVO' },
  { id: '60f1478d-4f61-4bc0-bd1d-1a166004f3ed', nombre: 'AREA Y TERRESTRE', codigo: 'AYT', grupo: 'TIPO_RUTA', estado: 'ACTIVO' },

  { id: '8f4b10d9-037e-4034-a82b-43ee0513b242', nombre: 'DEPARTAMENTAL', codigo: 'DEP', grupo: 'TIPO_VIAJE', estado: 'ACTIVO' },
  { id: '1e554970-d583-4d47-9a4b-06859ac927fe', nombre: 'INTERDEPARTAMENTAL', codigo: 'IDEP', grupo: 'TIPO_VIAJE', estado: 'ACTIVO' },
  { id: 'f8ed554d-550f-4d89-ac92-41f263327aa7', nombre: 'FRANJA FRONTERA DEPARTAMENTAL', codigo: 'FFD', grupo: 'TIPO_VIAJE', estado: 'ACTIVO' },
  { id: 'efd6ca02-71b2-412c-a437-162316ac1fb4', nombre: 'CENTRO Y SUD AMÉRICA Y CARIBE', codigo: 'CSA', grupo: 'TIPO_VIAJE', estado: 'ACTIVO' },
  { id: '63449bf1-18a9-4eae-b8ae-aff164e27a95', nombre: 'NORTE AMERICA, EUROPA, ASIA, ÁFRICA, OCEANÍA', codigo: 'NUAAO', grupo: 'TIPO_VIAJE', estado: 'ACTIVO' },
  { id: '12468449-c67d-45f7-9c5d-7e2ee8831a7d', nombre: 'FRANJA FRONTERA INTERDEPARTAMENTAL', codigo: 'FFI', grupo: 'TIPO_VIAJE', estado: 'ACTIVO' },

  { id: 'd1ee31bc-ff9d-4c6f-8a10-be205d04fc1b', nombre: 'COMPLETO (100%)', codigo: 'COMPLETO', grupo: 'TIPO_PORCENTAJE', estado: 'ACTIVO' },
  { id: '7be8ec7f-7840-4704-9324-ebc047d57f03', nombre: 'CUANDO SEA CUBIERTO HOSPEDAJE O ALIMENTACIÓN (70%)', codigo: 'PARCIAL', grupo: 'TIPO_PORCENTAJE', estado: 'ACTIVO' },
  { id: '22b78ca0-d61a-4a07-a11e-1a4f6fba353e', nombre: 'CUANDO SEA CUBIERTO HOSPEDAJE Y ALIMENTACIÓN (25%)', codigo: 'CUARTO', grupo: 'TIPO_PORCENTAJE', estado: 'ACTIVO' },

  { id: 'bd744739-b96a-40b7-94f9-9ac11be35364', nombre: 'Preparar informe', codigo: 'PI', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '0ebfa669-6dd5-457e-838a-d5ae0802119a', nombre: 'Preparar respuesta para mi firma', codigo: 'PRF', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: 'd3166347-f375-4062-8cdf-958657df47a3', nombre: 'Elaborar resolucion', codigo: 'ER', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: 'f16927da-6557-489c-bc6b-47a46a3ac540', nombre: 'Proceder segun lo establecido', codigo: 'PSE', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: 'ee7c92cf-e383-4fab-a0ba-7f7ba2456f95', nombre: 'Hacer seguimiento', codigo: 'HS', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '7a666f87-51a4-4f15-9304-170a6c390508', nombre: 'Para su conocimiento', codigo: 'PC', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: 'a6225af9-fe86-47b5-acdb-501ac3deefd3', nombre: 'Agendar', codigo: 'A', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '1258b881-39df-48e4-8b89-7cdd51691a5f', nombre: 'Reunion en mi despacho', codigo: 'RD', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: 'a7cc5f4a-514c-4ca6-8702-cfbfaa539502', nombre: 'Circularizar', codigo: 'C', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '66dd7280-446d-478b-8546-3b32aa24f41c', nombre: 'Recomendar curso de acción', codigo: 'RCA', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '1eb584d5-5b92-4022-932e-e27cfcf0acfe', nombre: 'Acudir en mi representación', codigo: 'AR', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '27485a3a-4adb-4f31-9b51-6e0765bf0a3f', nombre: 'Archivar', codigo: 'ACH', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '0e4ac55c-d21d-483d-a424-80ac37b44c44', nombre: 'Coordinar con:', codigo: 'CCN', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },
  { id: '0e4ac55c-d21d-483d-a424-80ac37b44c45', nombre: 'Para su consideracion', codigo: 'PSCN', grupo: 'ACCION_DERIVACION', estado: 'ACTIVO' },

  { id: '8c55af21-3269-4fb4-8621-c46058cdafa5', nombre:'NOTA INTERNA', codigo:'NI',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '3fbd0819-a355-4c32-afc1-9ff4485b2d92', nombre:'NOTA EXTERNA', codigo:'NE',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: 'af94efae-0e34-453f-abc6-1d39b5d6373f', nombre:'INFORME', codigo:'INF',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '89dbd29c-c9b4-4bc9-a1d9-bfdeec3849e5', nombre:'COMUNICADO', codigo:'COM',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: 'ef140328-baf4-4ead-8f39-ab6734600a1b', nombre:'CIRCULAR', codigo:'CIR',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '201eeb44-fa21-4223-85f9-a01cc6a598a6', nombre:'INSTRUCTIVO', codigo:'INS',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '4840aa40-6a3a-4810-bc54-f25ac2ddb077', nombre:'MEMORANDUM', codigo:'ME',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '20c77e28-b9f0-4bcf-b4fc-84c4d7cdf591', nombre:'CERTIFICADO', codigo:'CERT',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: 'fdcea3aa-f971-4adf-9349-2f727c1662c0', nombre:'CARTA', codigo:'C',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '2db5dce1-3003-434e-9fee-940797f56d0e', nombre:'RESOLUCION MINISTERIAL', codigo:'RM',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '18d2e737-7ee1-4f4d-aa59-d1458c48802c', nombre:'RESOLUCION ADMINISTRATIVA', codigo:'RA',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '18d2e737-7ee1-4f4d-aa59-d1458c48802d', nombre:'CONTRATO', codigo:'RA',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '18d2e737-7ee1-4f4d-aa59-d1458c48802e', nombre:'MEMORIAL', codigo:'ME',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '5d693c15-f328-4ea3-b76d-1c0328b23527', nombre:'ACTA DE REUNION', codigo:'AR',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'},
  { id: '5d693c15-f328-4ea3-b76d-1c0328b23529', nombre:'FORMULARIO', codigo:'FORM',grupo:'CATEGORIA_FORMULARIO',estado:'ACTIVO'}

];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_parametro', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
