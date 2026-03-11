'use strict';

const {
  setTimestampsSeeder
} = require('../lib/util');

const { Ids } = require('../../common/config/constants');

// Datos de producción
let items = [
  // nivel 2
  { id: Ids.areas['DESPACHO MINISTERIAL'], nombre_area: 'DESPACHO MINISTERIAL', sigla: 'DESP', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE ASUNTOS ADMINISTRATIVOS'], nombre_area: 'DIRECCIÓN GENERAL DE ASUNTOS ADMINISTRATIVOS', sigla: 'DGGA', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE ASUNTOS JURIDICOS'], nombre_area: 'DIRECCIÓN GENERAL DE ASUNTOS JURIDICOS', sigla: 'DGAJ', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE PLANIFICACION'], nombre_area: 'DIRECCIÓN GENERAL DE PLANIFICACION', sigla: 'DGP', estado: 'ACTIVO' },
  { id: Ids.areas['VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES'], nombre_area: 'VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES', sigla: 'VJDF', estado: 'ACTIVO' },
  { id: Ids.areas['VICEMINISTERIO DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA'], nombre_area: 'VICEMINISTERIO DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA', sigla: 'VJIOC', estado: 'ACTIVO' },
  { id: Ids.areas['VICEMINISTERIO DE IGUALDAD DE OPORTUNIDADES'], nombre_area: 'VICEMINISTERIO DE IGUALDAD DE OPORTUNIDADES', sigla: 'VIO', estado: 'ACTIVO' },
  { id: Ids.areas['VICEMINISTERIO DE DEFENSA DE LOS DERECHOS DEL USUARIO Y DEL CONSUMIDOR'], nombre_area: 'VICEMINISTERIO DE DEFENSA DE LOS DERECHOS DEL USUARIO Y DEL CONSUMIDOR', sigla: 'VDDUC', estado: 'ACTIVO' },
  { id: Ids.areas['VICEMINISTERIO DE TRANSPARENCIA INSTITUCIONAL Y LUCHA CONTRA LA CORRUPCIÓN'], nombre_area: 'VICEMINISTERIO DE TRANSPARENCIA INSTITUCIONAL Y LUCHA CONTRA LA CORRUPCIÓN', sigla: 'VTILCC', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE COMUNICACION SOCIAL'], nombre_area: 'UNIDAD DE COMUNICACION SOCIAL', sigla: 'UCS', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE AUDITORIA INTERNA'], nombre_area: 'UNIDAD DE AUDITORIA INTERNA', sigla: 'UAI', estado: 'ACTIVO' },
  { id: Ids.areas['JEFATURA DE GABINETE'], nombre_area: 'JEFATURA DE GABINETE', sigla: 'JG', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE TRANSPARENCIA Y LUCHA CONTRA LA CORRUPCION'], nombre_area: 'UNIDAD DE TRANSPARENCIA Y LUCHA CONTRA LA CORRUPCION', sigla: 'UTLCC', estado: 'ACTIVO' },
  // nivel 3
  { id: Ids.areas['DIRECCION GENERAL DE DERECHO INTERNACIONAL'], nombre_area: 'DIRECCION GENERAL DE DERECHO INTERNACIONAL', sigla: 'DGDI', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCION GENERAL DE DESARROLLO CONSTITUCIONAL'], nombre_area: 'DIRECCION GENERAL DE DESARROLLO CONSTITUCIONAL', sigla: 'DGDC', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCION GENERAL DE JUSTICIA Y DERECHOS FUNDAMENTALES'], nombre_area: 'DIRECCION GENERAL DE JUSTICIA Y DERECHOS FUNDAMENTALES', sigla: 'DGJDF', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCION GENERAL DE REGISTRO PUBLICO DE LA ABOGACIA'], nombre_area: 'DIRECCION GENERAL DE REGISTRO PUBLICO DE LA ABOGACIA', sigla: 'DGRPA', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA'], nombre_area: 'DIRECCIÓN GENERAL DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA', sigla: 'DGJIOC', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE NIÑEZ Y PERSONAS ADULTAS MAYORES'], nombre_area: 'DIRECCIÓN GENERAL DE NIÑEZ Y PERSONAS ADULTAS MAYORES', sigla: 'DGNAM', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE PERSONAS CON DISCAPACIDAD'], nombre_area: 'DIRECCIÓN GENERAL DE PERSONAS CON DISCAPACIDAD', sigla: 'DGPCD', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE PREVENCION Y ELIMINACION DE TODA FORMA DE VIOLENCIA EN RAZON DE GENERO Y GENERACIONAL'], nombre_area: 'DIRECCIÓN GENERAL DE PREVENCION Y ELIMINACION DE TODA FORMA DE VIOLENCIA EN RAZON DE GENERO Y GENERACIONAL', sigla: 'DGPEFVGG', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCION PLURINACIONAL DE LA JUVENTUD'], nombre_area: 'DIRECCION PLURINACIONAL DE LA JUVENTUD', sigla: 'DJP', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCIÓN GENERAL DE DEFENSA DE LOS DERECHOS DEL USUARIO Y CONSUMIDOR'], nombre_area: 'DIRECCIÓN GENERAL DE DEFENSA DE LOS DERECHOS DEL USUARIO Y CONSUMIDOR', sigla: 'DGDDUC', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCION GENERAL DE LUCHA CONTRA LA CORRUPCION'], nombre_area: 'DIRECCION GENERAL DE LUCHA CONTRA LA CORRUPCION', sigla: 'DGLCC', estado: 'ACTIVO' },
  { id: Ids.areas['DIRECCION GENERAL DE PREVENCION, PROMOCION DE LA ETICA Y TRANSPARENCIA'], nombre_area: 'DIRECCION GENERAL DE PREVENCION, PROMOCION DE LA ETICA Y TRANSPARENCIA', sigla: 'DGPPET', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD ADMINISTRATIVA'], nombre_area: 'UNIDAD ADMINISTRATIVA', sigla: 'UA', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD FINANCIERA'], nombre_area: 'UNIDAD FINANCIERA', sigla: 'UF', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE RECURSOS HUMANOS'], nombre_area: 'UNIDAD DE RECURSOS HUMANOS', sigla: 'URH', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE GESTION JURIDICA'], nombre_area: 'UNIDAD DE GESTION JURIDICA', sigla: 'UGJ', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE ANALISIS JURIDICO'], nombre_area: 'UNIDAD DE ANALISIS JURIDICO', sigla: 'UAJ', estado: 'ACTIVO' },
  // nivel 4
  { id: Ids.areas['TECNOLOGIAS DE LA INFORMACION Y COMUNICACION'], nombre_area: 'AREA DE TECNOLOGIAS DE LA INFORMACION Y COMUNICACION', sigla: 'ATIC', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE SERVICIOS GENERALES E INFRAESTRUCTURA'], nombre_area: 'AREA DE SERVICIOS GENERALES E INFRAESTRUCTURA', sigla: 'ASGI', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE CONTRATACIONES'], nombre_area: 'AREA DE CONTRATACIONES', sigla: 'AC', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE ALMACENES'], nombre_area: 'AREA DE ALMACENES', sigla: 'AA', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE ACTIVOS FIJOS'], nombre_area: 'AREA DE ACTIVOS FIJOS', sigla: 'AAF', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE BIBLIOTECA Y ARCHIVO'], nombre_area: 'AREA DE BIBLIOTECA Y ARCHIVO', sigla: 'ABA', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE TESORERIA'], nombre_area: 'AREA DE TESORERIA', sigla: 'AT', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE CONTABILIDAD'], nombre_area: 'AREA DE CONTABILIDAD', sigla: 'AC', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE PRESUPUESTO'], nombre_area: 'AREA DE PRESUPUESTO', sigla: 'AP', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE SERVICIOS INTEGRALES DE JUSTICIA PLURINACIONAL'], nombre_area: 'UNIDAD DE SERVICIOS INTEGRALES DE JUSTICIA PLURINACIONAL', sigla: 'USIJP', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE JUSTICIA Y ANALISIS NORMATIVO'], nombre_area: 'AREA DE JUSTICIA Y ANALISIS NORMATIVO', sigla: 'AJAN', estado: 'ACTIVO' },
  { id: Ids.areas['AREA TRATA Y TRAFICO'], nombre_area: 'AREA TRATA Y TRAFICO', sigla: 'ATT', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE TRANVERSALIZACION DE DERECHOS DE LA NIÑEZ'], nombre_area: 'AREA DE TRANVERSALIZACION DE DERECHOS DE LA NIÑEZ', sigla: 'ATDN', estado: 'ACTIVO' },
  { id: Ids.areas['AREA DE TRANVERSALIZACION DEL ENFOQUE DE DERECHOS DE PERSONAS ADULTAS Y MAYORES'], nombre_area: 'AREA DE TRANVERSALIZACION DEL ENFOQUE DE DERECHOS DE PERSONAS ADULTAS Y MAYORES', sigla: 'ATEDPAM', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE EDUCACION Y DIFUSION'], nombre_area: 'UNIDAD DE EDUCACION Y DIFUSION', sigla: 'UED', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE POLITICAS PUBLICAS NORMAS Y PROYECTOS'], nombre_area: 'UNIDAD DE POLITICAS PUBLICAS NORMAS Y PROYECTOS', sigla: 'UPPNP', estado: 'ACTIVO' },
  { id: Ids.areas['AREA ASESORAMIENTO Y ATENCION AL USUARIO CONSUMIDOR'], nombre_area: 'AREA ASESORAMIENTO Y ATENCION AL USUARIO CONSUMIDOR', sigla: 'AAAUC', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE PARTICIPACION Y CONTROL SOCIAL Y ACCESO A LA INFORMACION'], nombre_area: 'UNIDAD DE PARTICIPACION Y CONTROL SOCIAL Y ACCESO A LA INFORMACION', sigla: 'UPCSAI', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE ETICA PUBLICA GESTION DE RIESGOS Y PROCESAMIENTOS DE LA INFORMACION'], nombre_area: 'UNIDAD DE ETICA PUBLICA GESTION DE RIESGOS Y PROCESAMIENTOS DE LA INFORMACION', sigla: 'UEPGRPI', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DE INVESTIGACION DE ACTOS DE CORRUPCION EN ENTIDADES PUBLICAS'], nombre_area: 'UNIDAD DE INVESTIGACION DE ACTOS DE CORRUPCION EN ENTIDADES PUBLICAS', sigla: 'UIACEP', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD RECUPERACION DE BIENES E INTELIGENCIA FINANCIERA'], nombre_area: 'UNIDAD RECUPERACION DE BIENES E INTELIGENCIA FINANCIERA', sigla: 'URBIF', estado: 'ACTIVO' },
  { id: Ids.areas['UNIDAD DEL SIIARBE (SISTEMA INTEGRADO DE INFORMACION ANTICORRUPCION Y RECUPERACION DE BIENES AL ESTADO)'], nombre_area: 'UNIDAD DEL SIIARBE (SISTEMA INTEGRADO DE INFORMACION ANTICORRUPCION Y RECUPERACION DE BIENES AL ESTADO)', sigla: 'USIIARBE', estado: 'ACTIVO' },
  { id: Ids.areas['INFRAESTRUCTURA Y MANTENIMIENTO'], nombre_area: 'INFRAESTRUCTURA Y MANTENIMIENTO', sigla: 'UIM', estado: 'ACTIVO'},
  { id: Ids.areas['REPRESENTACION DEPARTAMENTAL BENI'], nombre_area: 'REPRESENTACION DEPARTAMENTAL BENI', sigla: 'RDBEN', estado: 'ACTIVO'},
  { id: Ids.areas['REPRESENTACION DEPARTAMENTAL CHUQUISACA'], nombre_area: 'REPRESENTACION DEPARTAMENTAL CHUQUISACA', sigla: 'RDCHU', estado: 'ACTIVO'},
  { id: Ids.areas['REPRESENTACION DEPARTAMENTAL COCHABAMBA'], nombre_area: 'REPRESENTACION DEPARTAMENTAL COCHABAMBA', sigla: 'RDCBA', estado: 'ACTIVO'},
  { id: Ids.areas['REPRESENTACION DEPARTAMENTAL SANTA CRUZ'], nombre_area: 'REPRESENTACION DEPARTAMENTAL SANTA CRUZ', sigla: 'RDSCZ', estado: 'ACTIVO'},
  { id: Ids.areas['REPRESENTACION DEPARTAMENTAL TARIJA'], nombre_area: 'REPRESENTACION DEPARTAMENTAL TARIJA', sigla: 'RDTAR', estado: 'ACTIVO'},
  { id: Ids.areas['UNIDAD DE ADMISIÓN DE DENUNCIAS'], nombre_area: 'UNIDAD DE ADMISIÓN DE DENUNCIAS', sigla: 'UAD', estado: 'ACTIVO'},
  { id: Ids.areas['UNIDAD DE PROCESAMIENTO PENAL'], nombre_area: 'UNIDAD DE PROCESAMIENTO PENAL', sigla: 'UPP', estado: 'ACTIVO'},
  { id: Ids.areas['DERECHOS FUNDAMENTALES'], nombre_area: 'DERECHOS FUNDAMENTALES', sigla: 'DF', estado: 'ACTIVO'},
  { id: Ids.areas['UNIDAD DE DEFENSA DEL LITIGANTE'], nombre_area: 'UNIDAD DE DEFENSA DEL LITIGANTE', sigla: 'UDDL', estado: 'ACTIVO'},

];

/*
'INFRAESTRUCTURA Y MANTENIMIENTO'                                                                            : '28d0e4ec-7eeb-4a35-bd27-489aaa172118', // UNIDAD ADMINISTRATIVA
      // nivel externos
      'REPRESENTACION DEPARTAMENTAL BENI'                                                                          : '28d0e4ec-7eeb-4a35-bd27-489aaa172119',
      'REPRESENTACION DEPARTAMENTAL CHUQUISACA'                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172120',
      'REPRESENTACION DEPARTAMENTAL COCHABAMBA'                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172121',
      'REPRESENTACION DEPARTAMENTAL SANTA CRUZ'                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172122',
      'REPRESENTACION DEPARTAMENTAL TARIJA'                                                                        : '28d0e4ec-7eeb-4a35-bd27-489aaa172123',
      'UNIDAD DE ADMISIÓN DE DENUNCIAS'                                                                            : '28d0e4ec-7eeb-4a35-bd27-489aaa172124',
      'UNIDAD DE PROCESAMIENTO PENAL'                                                                              : '28d0e4ec-7eeb-4a35-bd27-489aaa172125',
      'DERECHOS FUNDAMENTALES '                                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172126',
      'UNIDAD DE DEFENSA DEL LITIGANTE'                                                                            : '28d0e4ec-7eeb-4a35-bd27-489aaa172127'
*/

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_area', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },

  down (queryInterface, Sequelize) {}
};
