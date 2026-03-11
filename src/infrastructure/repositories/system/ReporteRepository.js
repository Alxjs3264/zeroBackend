'use strict';

module.exports = function ReporteRepository (models, Sequelize) {
  const { flujoDocumental } = models;
  const Op = Sequelize.Op;

  async function reporteGeneral (params = {}) {
    let whereConsulta = 'WHERE gfd._deleted_at IS NULL AND gfd2._deleted_at IS NULL AND gfd3._deleted_at IS NULL AND gd2._deleted_at IS NULL AND gd3._deleted_at IS NULL ';

    const limit = params.limit || 10;
    const offset = params.page ? parseInt((params.page - 1) * limit) : 0;

    const queryLimit = `LIMIT ${limit} OFFSET ${offset}`;

    if (params.hojaRuta) whereConsulta += `AND gfd.codigo_flujo ILIKE '%${params.hojaRuta}%' `;

    if (params.idArea) whereConsulta += `AND pc.id_unidad_organizacional = '${params.idArea}' `;

    if (params.idUsuarioCreacion) whereConsulta += `AND gfd2.id_usuario_destinatario = '${params.idUsuarioCreacion}' AND gfd.copia = FALSE`;

    if (params.idUsuarioDestinatario) whereConsulta += `AND gfd3.id_usuario_destinatario = '${params.idUsuarioDestinatario}' AND gfd3.estado_actual = 'ACTIVO' `;

    let query = `
      SELECT
        gfd.id AS id_flujo,
        gfd.codigo_flujo as "hoja_ruta",
        gfd.tipo,
        gfd.tipo_flujo,
        gfd.estado,
        gfd2.nombre_remitente AS "remitente_externo",
        gfd2.cargo_remitente AS "cargo_externo",
        gfd2.nombre_destinatario AS "funcionario_inicial",
        pc.descripcion AS "cargo_inicial",
        gd2.cite AS "cite_inicial",
        gd2.plantilla->> 'nombre'AS "documento_inicial",
        gfd3.nombre_remitente AS "ultimo_funcionario_remitente",
        CONCAT(TO_CHAR(gfd3.fecha_recepcion::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd3.fecha_recepcion::TIME, 'HH24:MI:ss')) AS fecha_recepcion,
        CONCAT(TO_CHAR(gfd3.fecha_derivacion::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd3.fecha_derivacion::TIME, 'HH24:MI:ss')) AS fecha_derivacion,
        gfd3.nombre_destinatario AS "ultimo_funcionario_destinatario",
        gd3.cite AS "cite_final",
        gd3.plantilla->> 'nombre' AS "documento_final"
      FROM gestion_flujo_documental as gfd
      INNER JOIN (
        SELECT gfd.id_flujo, MAX(_created_at) AS max_created_at, MIN(_created_at) AS min_created_at
        FROM gestion_flujo_derivacion gfd
        WHERE gfd._deleted_at IS NULL
        GROUP BY id_flujo
      ) pd ON gfd.id = pd.id_flujo
      INNER JOIN gestion_flujo_derivacion as gfd2 ON gfd.id = gfd2.id_flujo AND pd.min_created_at = gfd2._created_at
      INNER JOIN gestion_documento as gd2 ON gfd2.id_documento = gd2.id
      INNER JOIN sys_usuario as su ON gfd2.id_usuario_destinatario = su.id
      INNER JOIN sys_usuario_cargo as suc ON suc.id_usuario = su.id AND suc._deleted_at IS NULL
      INNER JOIN planificacion_cargo as pc ON suc.id_cargo = pc.id
      INNER JOIN gestion_flujo_derivacion AS gfd3 ON gfd.id = gfd3.id_flujo AND pd.max_created_at = gfd3._created_at
      INNER JOIN gestion_documento AS gd3 ON gfd3.id_documento = gd3.id
      ${whereConsulta} 
      ORDER BY gfd._created_at
    `;

    // const count = await flujoDocumental.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

    query += ` ${queryLimit} `;

    const rows = await flujoDocumental.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return { count: 100, rows };
  }

  async function reporteSolvencias (params = {}) {
    let whereConsulta = 'WHERE gfd._deleted_at IS NULL AND gfd2._deleted_at IS NULL AND gfd3._deleted_at IS NULL AND gd2._deleted_at IS NULL AND gd3._deleted_at IS NULL ';

    const limit = params.limit || 10;
    const offset = params.page ? parseInt((params.page - 1) * limit) : 0;

    const queryLimit = `LIMIT ${limit} OFFSET ${offset}`;

    if (params.hojaRuta) whereConsulta += `AND gfd.codigo_flujo ILIKE '%${params.hojaRuta}%' `;

    if (params.idArea) whereConsulta += `AND pc.id_unidad_organizacional = '${params.idArea}' `;

    if (params.idUsuarioCreacion) whereConsulta += `AND gfd2.id_usuario_destinatario = '${params.idUsuarioCreacion}' AND gfd.copia = FALSE`;

    if (params.idUsuarioDestinatario) whereConsulta += `AND gfd3.id_usuario_destinatario = '${params.idUsuarioDestinatario}' AND gfd3.estado_actual = 'ACTIVO' `;

    const queryCount = `
        SELECT COUNT(*) AS total
        FROM gestion_flujo_documental as gfd
        WHERE 
          gfd._deleted_at IS NULL 
          AND gfd.id_solicitud_plantilla  IN  ('832e819f-2439-48d2-b097-a43fbfabf629', '54a43c7b-db7d-4148-a7ad-b9dd3cdb6caf')
      `;

    let query = `
      SELECT
        gfd.id AS id,
        gfd.codigo_flujo as "hojaRuta",
        gfd.estado,
        gfd2.nombre_destinatario AS "remitenteInicial",
        gfd2.cargo_destinatario AS "cargoRemitente",
        gd2.cite AS "citeInicial",
        gd2.plantilla->> 'nombre'AS "documentoInicial",
        gfd3.nombre_destinatario AS "destinatarioFinal",
        gfd3.cargo_destinatario AS "cargoDestinatario",
        gd3.cite AS "citeFinal",
        gd3.plantilla->> 'nombre' AS "documentoFinal",
        gd3.cite AS "citeFinal",
        gd3.plantilla->> 'nombre'AS "documentoFinal",
        CONCAT(TO_CHAR(gfd3.fecha_recepcion::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd3.fecha_recepcion::TIME, 'HH24:MI:ss')) AS "fechaRecepcion",
        CONCAT(TO_CHAR(gfd3.fecha_derivacion::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd3.fecha_derivacion::TIME, 'HH24:MI:ss')) AS "fechaDerivacion"
      FROM gestion_flujo_documental as gfd
      INNER JOIN (
        SELECT gfd.id_flujo, MAX(_created_at) AS max_created_at, MIN(_created_at) AS min_created_at
        FROM gestion_flujo_derivacion gfd
        WHERE gfd._deleted_at IS NULL
        GROUP BY id_flujo
      ) pd ON gfd.id = pd.id_flujo
      LEFT JOIN gestion_flujo_derivacion as gfd2 ON gfd.id = gfd2.id_flujo AND pd.min_created_at = gfd2._created_at
      LEFT JOIN gestion_documento as gd2 ON gfd2.id_documento = gd2.id
      LEFT JOIN gestion_flujo_derivacion AS gfd3 ON gfd.id = gfd3.id_flujo AND pd.max_created_at = gfd3._created_at
      LEFT JOIN gestion_documento AS gd3 ON gfd3.id_documento = gd3.id
      WHERE 
        gfd._deleted_at IS NULL 
        AND gfd2._deleted_at IS NULL
        AND gfd3._deleted_at IS NULL 
        AND gd2._deleted_at IS NULL 
        AND gd3._deleted_at IS NULL 
        AND gfd.id_solicitud_plantilla  IN  ('832e819f-2439-48d2-b097-a43fbfabf629', '54a43c7b-db7d-4148-a7ad-b9dd3cdb6caf')
        ORDER BY gfd._created_at
    `;

    const [{ total }] = await flujoDocumental.sequelize.query(queryCount, { type: Sequelize.QueryTypes.SELECT });

    query += ` ${queryLimit} `;

    const rows = await flujoDocumental.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return { count: total, rows };
  }

  return {
    reporteSolvencias,
    reporteGeneral
  };
};
