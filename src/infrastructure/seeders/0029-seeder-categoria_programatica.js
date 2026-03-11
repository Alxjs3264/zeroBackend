'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    programa    : 0,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '0-0-1 - Gestión Ministerial',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    programa    : 0,
    proyecto    : 0,
    actividad   : 2,
    descripcion : '0-0-2 - Apoyo Asesoramiento Administrativo',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    programa    : 0,
    proyecto    : 0,
    actividad   : 98,
    descripcion : '0-0-98 - Prevención, Control y Atención de la Emergencia de Salud Pública Provocada por el Coronavirus',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc04',
    programa    : 0,
    proyecto    : 0,
    actividad   : 99,
    descripcion : '0-0-99 - Participación y Control Social',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    programa    : 64,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '64-0-1 - Gestión Viceministerial de Justicia y Derechos Fundamentales',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    programa    : 64,
    proyecto    : 0,
    actividad   : 2,
    descripcion : '64-0-2 - Justicia y Derechos Fundamentales',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    programa    : 64,
    proyecto    : 0,
    actividad   : 3,
    descripcion : '64-0-3 - Desarrollo Constitucional',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    programa    : 64,
    proyecto    : 0,
    actividad   : 4,
    descripcion : '64-0-4 - Derecho Internacional',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    programa    : 64,
    proyecto    : 0,
    actividad   : 5,
    descripcion : '64-0-5 - Registro Capacitación y Régimen de Abogadas(os) Bolivianas(os)',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc10',
    programa    : 65,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '65-0-1 - Gestión Viceministerial de Justicia Indígena Originario Campesino',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    programa    : 65,
    proyecto    : 0,
    actividad   : 2,
    descripcion : '65-0-2 - Justicia Indígena Originario Campesino',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc12',
    programa    : 66,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '66-0-1 - Gestión Viceministerial de Defensa de los Derechos de Usuario y Consumidor',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    programa    : 66,
    proyecto    : 0,
    actividad   : 2,
    descripcion : '66-0-2 - Derechos de Usuario y Consumidor',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    programa    : 69,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '69-0-1 - Gestión Viceministerial de Transparenci y Lucha Contra la Corrupción',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    programa    : 69,
    proyecto    : 0,
    actividad   : 2,
    descripcion : '69-0-2 - Prevención, Promoción de Ética y Transparencia',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    programa    : 69,
    proyecto    : 0,
    actividad   : 3,
    descripcion : '69-0-3 - Lucha Contra la Corrupción',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    programa    : 90,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '90-0-1 - Gestión Viceministerial de Igualdad de Oportunidades',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    programa    : 90,
    proyecto    : 0,
    actividad   : 90,
    descripcion : '90-0-90 - Niña, Niño y Adolecente',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    programa    : 91,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '91-0-1 - Sistema Plurinacional de la Juventud',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    programa    : 92,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '92-0-1 - Prevención y Eliminación de Toda Forma de Violencia en Razón de Género y Generacional',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc21',
    programa    : 92,
    proyecto    : 0,
    actividad   : 3,
    descripcion : '92-0-3 - Apoyo a la Implementación de la Política Pública 1er año AECID',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    programa    : 92,
    proyecto    : 0,
    actividad   : 4,
    descripcion : '92-0-4 - Apoyo a la Implementación de la Política Pública 2do año AECID',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    programa    : 93,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '93-0-1 - Defensa de los Derechos de Personas con Discapacidad',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    programa    : 94,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '94-0-1 - Promoción y Ejercicio de los Derechos de las Personas Adultas Mayores',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    programa    : 95,
    proyecto    : 0,
    actividad   : 1,
    descripcion : '95-0-1 - Lucha Contra la Trata y Tráfico de Personas',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc26',
    programa    : 64,
    proyecto    : 0,
    actividad   : 8,
    descripcion : '64-0-8 Servicios Integrales de Justicia Plurinacional - SIJPLU - COSUDE',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc27',
    programa    : 64,
    proyecto    : 0,
    actividad   : 9,
    descripcion : '64-0-9 Área de Justicia y Análisis Normativo - COSUDE',
    estado      : 'ACTIVO'
  },
  {
    id          : 'b96c5719-24ec-4e39-857e-2948f845dc28',
    programa    : 92,
    proyecto    : 0,
    actividad   : 2,
    descripcion : '92-0-2 Empoderamiento a las Muejres Bolivianas Segunda Fase - AESID',
    estado      : 'ACTIVO'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('presupuesto_categoria_programatica', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
