'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DO $$
      DECLARE
        entidad RECORD;
        formulario RECORD;
      BEGIN
        FOR entidad IN SELECT * FROM sys_entidad LOOP
          FOR formulario IN SELECT * FROM gestion_formulario LOOP
              INSERT INTO sys_permisos_formulario (id, id_entidad, id_formulario, _user_created, _created_at) 
              VALUES(uuid_generate_v4(), entidad.id, formulario.id, '7171272e-b31b-4c34-9220-9f535c958c5c', NOW());
              UPDATE gestion_formulario SET migracion_dori = FALSE WHERE id = formulario.id;
            END LOOP;
        END LOOP;
      END $$;

      INSERT INTO sys_parametro (id, grupo, codigo, otros, nombre, descripcion, estado, _user_created, _created_at)
      VALUES
        (uuid_generate_v4(), 'SISTEMA', 'S-HFPA', NULL, 'HEADER Y FOOTER POR AREA', 'HABILITAR / DESHABILITAR LOS HEADERS Y FOOTERS DE LOS DOCUMENTOS, POR CADA AREA.', 'INACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'SISTEMA', 'S-BDC', NULL, 'BANDEJA DE COMPARTIDOS', 'HABILITAR / DESHABILITAR BANDEJA DE USUARIOS COMPARTIDOS.', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'USUARIOS_ENTIDAD', 'UE-S', NULL, 'SECRETARIA (O)', 'SECRETARIA (O) DEL MINISTERIO', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'USUARIOS_ENTIDAD', 'UE-MAE', NULL, 'MAXIMA AUTORIDAD EJECUTIVA (MAE)', 'MAXIMA AUTORIDAD EJECUTIVA (MAE) DE LA ENTIDAD', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'USUARIOS_ENTIDAD', 'UE-VU', NULL, 'VENTANILLA UNICA', 'PERSONAL DE VENTANILLA UNICA', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'SISTEMA', 'S-CDD', NULL, 'CORRECCION DE DOCUMENTOS', 'HABILITAR / DESHABILITAR LA OPCION DE PODER CORREGIR O NO CORREGIR DOCUMENTOS PASADOS', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'SISTEMA', 'S-SPR', NULL, 'SISTEMA POR ENTIDADES', 'HABILITA / DESHABILITA EL SISTEMA POR ENTIDADES', 'INACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'SISTEMA', 'S-BUE', NULL, 'BANDEJA USUARIOS EXTERNOS', 'HABILITA / DESHABILITA BANDEJA USUARIOS EXTERNOS', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        ('4ba3dc0d-35d7-4a89-9eb3-7ac95072d46f', 'TIPO_PUESTO', 'TPC', NULL, 'CIUDADANO', 'CIUDADANO', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'TIPO_CARGO', 'TC-CP', NULL, 'CAMPO DE FORMULARIIO', 'CAMPO DE FORMULARIIO', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW()),
        (uuid_generate_v4(), 'TIPO_CARGO', 'TC-DEP', NULL, 'DEPENDIENTES', 'DEPENDIENTES', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW());

      INSERT INTO sys_entidad (id, codigo, nombre, descripcion, sigla, email, web, direccion, telefono, estado, nivel, _user_created, _created_at)
      VALUES('ca7f17f1-1009-4fea-bff4-3350edc75f25', 1, 'ESTADO PLURINACIONAL DE BOLIVIA', 'ESTADO PLURINACIONAL DE BOLIVIA', 'EPB', 'soporte@justicia.gob.bo', 'justicia.gob.bo', 'Avenida 16 de julio Nº 1769', '2158900 ', 'ACTIVO', 1, '7171272e-b31b-4c34-9220-9f535c958c5c', NOW());

      INSERT INTO sys_area (id, nombre_area, sigla, id_entidad, tipo_header, tipo_footer, estado, _user_created, _created_at) 
      VALUES('590f451a-e626-4690-9373-73638f7243c0', 'ESTADO PLURINACIONAL DE BOLIVIA', 'EPDB', 'ca7f17f1-1009-4fea-bff4-3350edc75f25', 'AREA', 'AREA', 'ACTIVO', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW());

      INSERT INTO planificacion_cargo (id, nro_item, descripcion, id_tipo_puesto, estado, nivel, id_unidad_organizacional, ciudadano, _user_created, _created_at)
      VALUES('6e4f8fb5-7e77-41fb-ae4d-c084301d1d69', 'CIUDADANO-', 'CIUDADANO', '4ba3dc0d-35d7-4a89-9eb3-7ac95072d46f', 'ACTIVO', 'TERCERA', '590f451a-e626-4690-9373-73638f7243c0', TRUE, '7171272e-b31b-4c34-9220-9f535c958c5c', NOW());

      INSERT INTO planificacion_configuracion_cargo (id, id_cargo, id_dependencia_linea, id_dependencia_funcional, id_dependencia_formulario, id_dependencia_poai, id_aprueba_viaje, id_elabora_memorandum_viaje, id_unidad_organizacional, _user_created, _created_at)
      VALUES('2108c991-b8ad-4c63-b015-6fcaac377d74', '6e4f8fb5-7e77-41fb-ae4d-c084301d1d69', 'c404327e-cd83-4824-8837-0ac49bc67011', 'c404327e-cd83-4824-8837-0ac49bc67011', 'c404327e-cd83-4824-8837-0ac49bc67011', 'c404327e-cd83-4824-8837-0ac49bc67011', 'c404327e-cd83-4824-8837-0ac49bc67011', 'c404327e-cd83-4824-8837-0ac49bc67011', '590f451a-e626-4690-9373-73638f7243c0', '7171272e-b31b-4c34-9220-9f535c958c5c', NOW());

      ALTER TABLE public.sys_usuario ALTER COLUMN cargo DROP NOT NULL;
  `;
    return queryInterface.sequelize.query(sql);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
