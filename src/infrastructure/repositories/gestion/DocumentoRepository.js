'use strict';

const Repository = require('../Repository');
const log = require('log4js').getLogger();
const moment = require('moment');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function documentoRepository (models, Sequelize) {
  const {
    documento,
    archivoAdjunto,
    usuario,
    flujoDocumental,
    PasoActual,
    SolicitudPlantilla,
    entidad
  } = models;

  const Op = Sequelize.Op;

  async function superBuscador (params = {}) {
    const queryPaginacion = ` LIMIT ${params.limit} OFFSET ${parseInt((params.page - 1) * params.limit)}`;
    let queryWhere = '';
    let queryDocumento =  '';
    let queryDerivacion = '';
    let queryEntidad = '';

    if (params.hojaRuta) queryWhere += ` AND gfd.codigo_flujo ILIKE '%${params.hojaRuta}%'`;
    if (params.tipo) queryWhere += ` AND gfd.tipo = '${params.tipo}'`;
    if (params.idSolicitudPlantilla) queryWhere += ` AND gfd.id_solicitud_plantilla = '${params.idSolicitudPlantilla}'`;
    if (params.estadoFlujo) queryWhere += ` AND gfd.estado = '${params.estadoFlujo}'`;
    if (params.referencia) queryWhere += ` AND gfd.referencia ILIKE '%${params.referencia}%'`;
    if (params.fechaInicio) queryWhere += ` AND gfd._created_at::date >= '${params.fechaInicio}'`;
    if (params.fechaFin) queryWhere += ` AND gfd._created_at::date <= '${params.fechaFin}'`;
    if (params.remitenteExterno) queryWhere += ` AND gfd.remitente = '${params.remitenteExterno}'`;
    if (params.userCreated) queryWhere += ` AND gfd._user_created = '${params.userCreated}'`;
    if (params.idUsuarioDestinatario) queryDerivacion += ` AND ugfd.id_usuario_destinatario = '${params.idUsuarioDestinatario}'`;

    if (params.cite || params.estadoDocumento || params.palabrasClave) {
      queryDocumento = 'INNER JOIN gestion_documento AS gd ON gd.id_flujo = gfd.id AND gd._deleted_at IS NULL ';
      if (params.cite) queryDocumento += ` AND gd.cite ILIKE '%${params.cite}%'`;
      if (params.estadoDocumento) queryDocumento += ` AND gd.estado = '${params.estadoDocumento}'`;
      if (params.palabrasClave) {
        queryDocumento += Array.isArray(params.palabrasClave) ? `AND (${params.palabrasClave.map(x => `gd.palabras_clave ILIKE '%${x}%'`).join(' OR ')})` : `AND gd.palabras_clave ILIKE '%${params.palabrasClave}%'`;
      }
    }

    if (params.idEntidad) {
      queryEntidad = `INNER JOIN gestion_entidad_flujo_documental AS gefd ON gfd.id = gefd.id_flujo_documental AND gefd.id_entidad = '${params.idEntidad}'`;
    }

    const query = `
      SELECT 
      DISTINCT(gfd.id),
        gfd.codigo_flujo AS "codigoFlujo",
        gfd.tipo,
        gfd.referencia,
        gfd.estado,
        gfd.concluido,
        CONCAT(TO_CHAR(gfd._created_at::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd._created_at::TIME, 'HH24:MI:ss')) AS "createdAt",
        gfd._created_at,
        ugfd.nombre_destinatario AS "nombreDestinatarioFinal",
        ugfd.cargo_destinatario AS "cargoDestinatarioFinal",
        CONCAT(TO_CHAR(ugfd.fecha_recepcion::DATE, 'DD-MM-YYYY'), ' ', to_char(ugfd.fecha_recepcion::TIME, 'HH24:MI:ss')) AS "fechaRecepcionFinal",
        CONCAT(TO_CHAR(ugfd.fecha_derivacion::DATE, 'DD-MM-YYYY'), ' ', to_char(ugfd.fecha_derivacion::TIME, 'HH24:MI:ss')) AS "fechaDerivacionFinal",
        ugfd.descripcion AS "descripcionFinal",
        ugd.cite AS "citeFinal",
        CONCAT(su.nombres, ' ', su.primer_apellido, ' ', su.segundo_apellido) AS "usuarioCreacion",
        sc.nombre AS "carpeta"
      FROM (
        SELECT derivaciones.id_flujo, MAX(derivaciones._created_at) AS _max_created_at
        FROM (
          SELECT flujo.id AS id_flujo, gfd2._created_at
          FROM (
            SELECT gfd.id, gfd._created_at
            FROM gestion_flujo_documental gfd
            ${queryDocumento}
            WHERE gfd._deleted_at IS NULL ${queryWhere}
            ORDER BY gfd._created_at DESC
            ) flujo
            INNER JOIN gestion_flujo_derivacion as gfd2 ON flujo.id = gfd2.id_flujo
        ) derivaciones 
        GROUP BY derivaciones.id_flujo
        ) derivaciones 
        INNER JOIN gestion_flujo_derivacion as ugfd ON ugfd.id_flujo = derivaciones.id_flujo AND ugfd._created_at = derivaciones._max_created_at ${queryDerivacion}
        INNER JOIN gestion_flujo_documental as gfd ON gfd.id = derivaciones.id_flujo 
        ${queryEntidad}
        INNER JOIN gestion_documento as ugd ON ugd.id = ugfd.id_documento
        INNER JOIN sys_usuario as su ON gfd._user_created = su.id
        LEFT JOIN sys_carpeta as sc ON sc.id = gfd.id_carpeta
        ORDER BY gfd._created_at DESC 
        ${queryPaginacion}
    `;

    const queryCount = `
      SELECT 
      count(DISTINCT(gfd.id))
      FROM (
        SELECT id_flujo, MAX(derivaciones._created_at) AS _max_created_at
        FROM (
          SELECT flujo.id AS id_flujo, gfd2._created_at
          FROM (
            SELECT gfd.id, gfd._created_at
            FROM gestion_flujo_documental gfd
            ${queryDocumento}
            WHERE gfd._deleted_at IS NULL ${queryWhere}
            ORDER BY gfd._created_at DESC
          ) flujo
          INNER JOIN gestion_flujo_derivacion as gfd2 ON flujo.id = gfd2.id_flujo
        ) derivaciones 
        GROUP BY derivaciones.id_flujo
      ) derivaciones 
      INNER JOIN gestion_flujo_derivacion as ugfd ON ugfd.id_flujo = derivaciones.id_flujo AND ugfd._created_at = derivaciones._max_created_at ${queryDerivacion}
      INNER JOIN gestion_flujo_documental as gfd ON gfd.id = derivaciones.id_flujo
      ${queryEntidad}
      INNER JOIN gestion_documento as ugd ON ugd.id = ugfd.id_documento
      INNER JOIN sys_usuario as su ON gfd._user_created = su.id
      LEFT JOIN sys_carpeta as sc ON sc.id = gfd.id_carpeta
    `;

    const result = await flujoDocumental.options.sequelize.query(query, { type: flujoDocumental.sequelize.QueryTypes.SELECT, Sequelize });
    const result2 = await flujoDocumental.options.sequelize.query(queryCount,  { type: flujoDocumental.sequelize.QueryTypes.SELECT, Sequelize });
    return {
      rows  : result,
      count : result2[0].count
    };
  }

  async function superBuscadorDocumentos (params = {}) {
    const queryPaginacion = ` LIMIT ${params.limit} OFFSET ${parseInt((params.page - 1) * params.limit)}`;
    let queryWhere = '';
    const queryDocumento =  '';
    let joinRemitente = '';
    const joinReferencia = '';
    const queryConfiguracion = '';
    const queryDerivacion = '';
    const queryEntidad = '';
    if (params.cite) queryWhere += ` AND gd.cite ILIKE '%${params.cite}%'`;
    if (params.tipoDocumento) queryWhere += ` AND gd.id_formulario::uuid = '${params.tipoDocumento}'`;
    if (params.fechaDocumento) queryWhere += ` AND gd.fecha_documento = '${params.fechaDocumento}'`;
    if (!params.fechaDocumento) {
      if (params.fechaInicio) queryWhere += ` AND gd.fecha_documento >= '${params.fechaInicio}'`;
      if (params.fechaFin) queryWhere += ` AND gd.fecha_documento <= '${params.fechaFin}'`;
    }
    if (params.unidadRemitente || params.usuarioGenerador || params.cargo) {
      joinRemitente = `JOIN (
        select
        gd.id,
        (objeto->>'idCargo')::uuid as id_cargo_remitente,
        (objeto->>'idUsuario')::uuid as id_usuario_remitente,
        (objeto->>'idArea')::uuid as id_area_remitente
        from gestion_documento gd
        cross join lateral jsonb_array_elements(gd.configuracion_derivaciones) AS objeto
        where gd."_deleted_at" is null
        and objeto->>'tipo' = 'REMITENTE'
      ) as tmp_remitente ON tmp_remitente.id = gd.id`;
      if (params.unidadRemitente) {
        queryWhere += ` AND tmp_remitente.id_area_remitente = '${params.unidadRemitente}'`;
      }
      if (params.usuarioGenerador) {
        queryWhere += ` AND tmp_remitente.id_usuario_remitente = '${params.usuarioGenerador}'`;
      }
      if (params.cargo) {
        queryWhere += ` AND tmp_remitente.id_cargo_remitente = '${params.cargo}'`;
      }
    }
    if (params.remitenteExterno) queryWhere += ` AND gfd.remitente = '${params.remitenteExterno}'`;
    if (params.palabrasClave) {
      queryWhere += Array.isArray(params.palabrasClave)
        ? `AND (${params.palabrasClave.map(x => `gd.palabras_clave ILIKE '%${x}%'`).join(' OR ')})`
        : `AND gd.palabras_clave ILIKE '%${params.palabrasClave}%'`;
    }
    if (params.estadoFlujo) {
      queryWhere += `AND gd.estado = '${params.estadoFlujo}'`;
    } else {
      queryWhere += 'AND gd.estado in (\'CERRADO\',\'DERIVADO\',\'ARCHIVADO\',\'EN CORRECCION\')';
    }
    if (params.referencia) {
      // joinReferencia = `JOIN (
      //   select gd1.id, ((objeto->>'value')::jsonb->>'valores')::jsonb->>'referencia' as referencia
      //   from gestion_documento gd1
      //   cross join lateral jsonb_array_elements((gd1.plantilla->>'configuracion_json')::jsonb) AS objeto
      //   where objeto->>'type' = 'derivacion' and gd1._deleted_at is null
      // ) as tmp_referencia ON tmp_referencia.id = gd.id`;
      // queryWhere += ` AND tmp_referencia.referencia ILIKE '%${params.referencia}%'`;
      queryWhere += ` AND gd.asunto ilike '%${params.referencia}%'`;
    }
    const base = `
      FROM gestion_documento gd
      JOIN gestion_flujo_documental gfd ON gfd.id = gd.id_flujo
      ${joinRemitente}
      ${joinReferencia}
      AND gfd._deleted_at is null
      where gd._deleted_at is null AND gd.id_documento_original is NULL
      ${queryWhere}
    `;
    const query = `
      SELECT
      DISTINCT(gd.id),
      gd.cite,
      gd.fecha_documento,
      gd.plantilla,
      gd.configuracion_derivaciones,
      gd.estado,
      gd.id_flujo,
      gfd.codigo_flujo,
      gd.docconfidencial,
      gfd.clasificacion,
      gd._created_at
      ${base}
      ORDER BY gd._created_at DESC
      ${queryPaginacion}
    `;
    const queryCount = `
      SELECT COUNT(DISTINCT(gd.id)) ${base}
    `;
    const result = await flujoDocumental.options.sequelize.query(query, { type: flujoDocumental.sequelize.QueryTypes.SELECT, Sequelize });
    const resultCount = await flujoDocumental.options.sequelize.query(queryCount,  { type: flujoDocumental.sequelize.QueryTypes.SELECT, Sequelize });
    return {
      rows  : result,
      count : resultCount[0].count
    };
  }

  async function superBuscadorTramites (params = {}) {
    const queryPaginacion = ` LIMIT ${params.limit} OFFSET ${parseInt((params.page - 1) * params.limit)}`;
    let queryWhere = '';
    let queryDocumento =  '';
    const queryDerivacion = '';
    const queryEntidad = '';

    if (params.hojaRuta) queryWhere += ` AND gfd.codigo_flujo ILIKE '%${params.hojaRuta}%'`;
    if (params.usuarioGenerador) queryWhere += ` AND gfd._user_created = '${params.usuarioGenerador}'`;
    if (params.estadoFlujo) queryWhere += ` AND gfd.estado = '${params.estadoFlujo}'`;
    if (params.idSolicitud) queryWhere += ` AND gfd.id_solicitud_plantilla::uuid = '${params.idSolicitud}'`;
    if (params.referencia) queryWhere += ` AND gfd.referencia ILIKE '%${params.referencia}%'`;

    // if(params.unidadRemitente) {
    //   queryDocumento += `AND gd._deleted_at IS NULL AND `
    // }

    // if (params.hojaRuta && params.unidadRemitente) {
    //   queryWhere += ` AND gfd.codigo_flujo ILIKE '%${params.hojaRuta}%' AND gfd.codigo_flujo ILIKE '%${params.unidadRemitente}%'`;
    // } else {
    //   if (params.unidadRemitente) queryWhere += ` AND gfd.codigo_flujo ILIKE '%${params.unidadRemitente}%'`;
    // }

    // if (params.tipo) queryWhere += ` AND gfd.tipo = '${params.tipo}'`;
    // if (params.idSolicitudPlantilla) queryWhere += ` AND gfd.id_solicitud_plantilla = '${params.idSolicitudPlantilla}'`;
    // if (params.referencia) queryWhere += ` AND gfd.referencia ILIKE '%${params.referencia}%'`;
    if (!params.fechaDocumento) {
      if (params.fechaInicio) queryWhere += ` AND gfd._created_at::date >= '${params.fechaInicio}'`;
      if (params.fechaFin) queryWhere += ` AND gfd._created_at::date <= '${params.fechaFin}'`;
    }
    if (params.remitenteExterno) queryWhere += ` AND gfd.remitente = '${params.remitenteExterno}'`;
    // if (params.idUsuarioDestinatario) queryDerivacion += ` AND ugfd.id_usuario_destinatario = '${params.idUsuarioDestinatario}'`;

    if (params.cite || params.estadoDocumento || params.palabrasClave || params.fechaDocumento || params.tipoDocumento) {
      queryDocumento = 'INNER JOIN gestion_documento AS gd ON gd.id_flujo = gfd.id AND gd._deleted_at IS NULL ';
      if (params.cite) queryDocumento += ` AND gd.cite ILIKE '%${params.cite}%'`;
      // if (params.estadoDocumento) queryDocumento += ` AND gd.estado = '${params.estadoDocumento}'`;
      if (params.palabrasClave) {
        queryDocumento += Array.isArray(params.palabrasClave) ? `AND (${params.palabrasClave.map(x => `gd.palabras_clave ILIKE '%${x}%'`).join(' OR ')})` : `AND gd.palabras_clave ILIKE '%${params.palabrasClave}%'`;
      }
      if (params.fechaDocumento) queryWhere += ` AND gd.fecha_documento::date = '${params.fechaDocumento}'`;
      if (params.tipoDocumento) queryWhere += ` AND gd.id_formulario::uuid = '${params.tipoDocumento}'`;
    }
    if (params.unidadRemitente) queryWhere += ` AND gfd.codigo_flujo ILIKE '%${params.unidadRemitente}%'`;

    // if (params.unidadRemitente) {
    //   queryEntidad = `INNER JOIN gestion_entidad_flujo_documental AS gefd ON gfd.id = gefd.id_flujo_documental AND gefd.id_entidad = '${params.unidadRemitente}'`;
    // }

    // const query = `
    //   SELECT
    //   DISTINCT(gfd.id),
    //     gfd.codigo_flujo AS "codigoFlujo",
    //     gfd.tipo,
    //     gfd.referencia,
    //     gfd.estado,
    //     gfd.id_solicitud_plantilla AS "idSolicitudPlantilla",
    //     bsp.nombre AS "nombreSolicitud",
    //     gfd.concluido,
    //     CONCAT(TO_CHAR(gfd._created_at::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd._created_at::TIME, 'HH24:MI:ss')) AS "createdAt",
    //     gfd._created_at,
    //     ugfd.nombre_destinatario AS "nombreDestinatarioFinal",
    //     ugfd.cargo_destinatario AS "cargoDestinatarioFinal",
    //     CONCAT(TO_CHAR(ugfd.fecha_recepcion::DATE, 'DD-MM-YYYY'), ' ', to_char(ugfd.fecha_recepcion::TIME, 'HH24:MI:ss')) AS "fechaRecepcionFinal",
    //     CONCAT(TO_CHAR(ugfd.fecha_derivacion::DATE, 'DD-MM-YYYY'), ' ', to_char(ugfd.fecha_derivacion::TIME, 'HH24:MI:ss')) AS "fechaDerivacionFinal",
    //     ugfd.descripcion AS "descripcionFinal",
    //     ugd.fecha_documento AS "FechaDocumento",
    //     ugd.configuracion_derivaciones AS "configuracionDerivaciones",
    //     CONCAT(su.nombres, ' ', su.primer_apellido, ' ', su.segundo_apellido) AS "usuarioCreacion"
    //   FROM (
    //     SELECT derivaciones.id_flujo, MAX(derivaciones._created_at) AS _max_created_at
    //     FROM (
    //       SELECT flujo.id AS id_flujo, gfd2._created_at
    //       FROM (
    //         SELECT gfd.id, gfd._created_at
    //         FROM gestion_flujo_documental gfd
    //         ${queryDocumento}
    //         WHERE gfd._deleted_at IS NULL ${queryWhere}
    //         ORDER BY gfd._created_at DESC
    //         ) flujo
    //         INNER JOIN gestion_flujo_derivacion as gfd2 ON flujo.id = gfd2.id_flujo
    //     ) derivaciones
    //     GROUP BY derivaciones.id_flujo
    //     ) derivaciones
    //     INNER JOIN gestion_flujo_derivacion as ugfd ON ugfd.id_flujo = derivaciones.id_flujo AND ugfd._created_at = derivaciones._max_created_at ${queryDerivacion}
    //     INNER JOIN gestion_flujo_documental as gfd ON gfd.id = derivaciones.id_flujo
    //     ${queryEntidad}
    //     INNER JOIN gestion_documento as ugd ON ugd.id = ugfd.id_documento
    //     INNER JOIN sys_usuario as su ON gfd._user_created = su.id
    //     INNER JOIN bpm_solicitud_plantilla as bsp ON gfd.id_solicitud_plantilla = bsp.id
    //     ORDER BY gfd._created_at DESC
    //     ${queryPaginacion}
    // `;

    const query = `
      SELECT 
        gfd.id,
        gfd.codigo_flujo AS "codigoFlujo",
        gfd.tipo,
        gfd.referencia,
        gfd.estado,
        gfd.id_solicitud_plantilla AS "idSolicitudPlantilla",
        bsp.nombre AS "nombreSolicitud",
        gfd.concluido,
        CONCAT(TO_CHAR(gfd._created_at::DATE, 'DD-MM-YYYY'), ' ', to_char(gfd._created_at::TIME, 'HH24:MI:ss')) AS "createdAt",
        gfd._created_at,
        gd.configuracion_derivaciones as "configuracionDerivaciones",
        gfd._user_created,
        CONCAT(su.nombres, ' ', su.primer_apellido, ' ', su.segundo_apellido) AS "usuarioCreacion"
      FROM
        gestion_flujo_documental as gfd
        INNER JOIN (
          SELECT 
              gd.*
          FROM 
              gestion_documento AS gd
          INNER JOIN (
              SELECT 
                  id_flujo, 
                  MIN(_created_at) AS min_created_at
              FROM 
                  gestion_documento
              WHERE 
                  _deleted_at IS NULL
              GROUP BY 
                  id_flujo
          ) AS subquery
          ON 
              gd.id_flujo = subquery.id_flujo 
              AND gd._created_at = subquery.min_created_at
          WHERE 
              gd._deleted_at IS NULL
      ) AS gd
      ON 
          gfd.id = gd.id_flujo
        INNER JOIN sys_usuario as su ON gfd._user_created = su.id
        LEFT JOIN bpm_solicitud_plantilla as bsp ON gfd.id_solicitud_plantilla = bsp.id
        WHERE gfd._deleted_at is NULL
        ${queryWhere}
        ORDER BY  gfd._created_at DESC
        ${queryPaginacion}
    `;

    // const queryCount = `
    //   SELECT
    //   count(DISTINCT(gfd.id))
    //   FROM (
    //     SELECT id_flujo, MAX(derivaciones._created_at) AS _max_created_at
    //     FROM (
    //       SELECT flujo.id AS id_flujo, gfd2._created_at
    //       FROM (
    //         SELECT gfd.id, gfd._created_at
    //         FROM gestion_flujo_documental gfd
    //         ${queryDocumento}
    //         WHERE gfd._deleted_at IS NULL ${queryWhere}
    //         ORDER BY gfd._created_at DESC
    //       ) flujo
    //       INNER JOIN gestion_flujo_derivacion as gfd2 ON flujo.id = gfd2.id_flujo
    //     ) derivaciones
    //     GROUP BY derivaciones.id_flujo
    //   ) derivaciones
    //   INNER JOIN gestion_flujo_derivacion as ugfd ON ugfd.id_flujo = derivaciones.id_flujo AND ugfd._created_at = derivaciones._max_created_at ${queryDerivacion}
    //   INNER JOIN gestion_flujo_documental as gfd ON gfd.id = derivaciones.id_flujo
    //   ${queryEntidad}
    //   INNER JOIN gestion_documento as ugd ON ugd.id = ugfd.id_documento
    //   INNER JOIN sys_usuario as su ON gfd._user_created = su.id
    // `;

    const queryCount = `
        SELECT
        count(*) FROM (
          SELECT  DISTINCT ON (gfd.id)
            gfd.id
          FROM
            gestion_flujo_documental as gfd
            INNER JOIN gestion_documento as ugd ON ugd.id_flujo = gfd.id ${queryDocumento}
            INNER JOIN sys_usuario as su ON gfd._user_created = su.id
            LEFT JOIN bpm_solicitud_plantilla as bsp ON gfd.id_solicitud_plantilla = bsp.id
            WHERE gfd._deleted_at is NULL
            ${queryWhere}
            ORDER BY gfd.id, gfd._created_at DESC 
          ) AS counter
      `;

    const result = await flujoDocumental.options.sequelize.query(query, { type: flujoDocumental.sequelize.QueryTypes.SELECT, Sequelize });
    const result2 = await flujoDocumental.options.sequelize.query(queryCount,  { type: flujoDocumental.sequelize.QueryTypes.SELECT, Sequelize });
    return {
      rows  : result,
      // count : 10
      count : result2[0].count
    };
  }

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'asunto',
      'cite',
      'userCreated',
      'plantilla',
      'plantillaValor',
      'fechaDocumento',
      'docconfidencial',
      'estado',
      'createdAt'
    ];

    query.include = [
      {
        model      : flujoDocumental,
        as         : 'flujoDocumental',
        attributes : [
          'id',
          'codigoFlujo',
          'tipoFlujo',
          'idFlujoPadre',
          'estado'
        ]
      }
    ];

    query.where = {};

    if (params.remitenteDe) query.where.remitenteDe = params.remitenteDe;
    if (params.destinatarioEspecifico) query.where.destinatarioEspecifico = params.destinatarioEspecifico;
    if (params.ciDestinatarioEspecifico) query.include[3].where = { numeroDocumento: params.ciDestinatarioEspecifico };
    if (params.areaDestino) query.include[4].where = { nombreArea: params.areaDestino };
    if (params.estado) query.where.estado = Array.isArray(params.estado) ? { [Op.in]: params.estado } : params.estado;
    if (params.destinatarioArea) query.where.destinatarioArea = params.destinatarioArea;
    if (params.citeDocumentoPadre) query.include[5].where = { cite: params.citeDocumentoPadre };
    if (params.idFlujo) query.where.idFlujo = params.idFlujo;
    if (params.id) query.where.id = params.id;
    if (params.asunto) query.where.asunto = { [Op.iLike]: `%${params.asunto}%` };
    if (params.userCreated) query.where.userCreated = params.userCreated;
    if (params.cite) query.where.cite = { [Op.iLike]: `%${params.cite}%` };
    if (params.via) query.include[6].where = { idUsuario: params.via };

    if (params.viaCi) query.include[6].where = { numeroDocumento: params.viaCi };
    if (params.categoria) {
      query.where.estado = 'ARCHIVADO';
      query.include[2].where = { categoria: params.categoria };
    }

    if (params.search) {
      query.where[Op.or] =  [
        { cite: { [Op.iLike]: `%${params.search}%` } },
        { asunto: { [Op.iLike]: `%${params.search}%` } }
      ];
    }

    const result = await documento.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}, t) {
    const query = {};
    query.where = {};

    if (t) query.transaction = t;

    query.order = [['createdAt', 'DESC']];

    query.include = [
      {
        model   : flujoDocumental,
        as      : 'flujoDocumental',
        include : [
          {
            model : PasoActual,
            as    : 'pasosActuales'
          },
          {
            attributes : ['id', 'codigo', 'nombre', 'descripcion', 'docfisico'],
            model      : SolicitudPlantilla,
            as         : 'solicitudPlantilla'
          }
        ]
      }
    ];

    if (params.id) query.where.id = params.id;
    if (params.idFlujo) query.where.idFlujo = params.idFlujo;
    if (params.plantilla) query.where.plantilla = params.plantilla;
    if (params.cite) query.where.cite = params.cite;

    if (params.idDocumentoPadre === 'NULL') query.where.idDocumentoPadre = null;
    if (params.buscarEstado) {
      query.where.estado = {
        [Op.notIn]: params.buscarEstado
      };
    }
    if (params.idDocumentoOriginal === 'NULL') query.where.idDocumentoOriginal = null;

    const result = await documento.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function findOneFilterId (params = {}, t) {
    const query = {};
    query.where = {};

    if (t) query.transaction = t;

    query.order = [['createdAt', 'DESC']];

    query.include = [
      {
        model   : flujoDocumental,
        as      : 'flujoDocumental',
        include : [
          {
            model : PasoActual,
            as    : 'pasosActuales'
          }
        ]
      }
    ];

    if (params.id) {
      query.where.id = params.id;
    }

    if (params.idFlujo) {
      query.where.idFlujo = params.idFlujo;
    }

    if (params.plantilla) {
      query.where.plantilla = params.plantilla;
    }

    if (params.idNot) {
      query.where.id = { [Op.ne]: params.idNot };
    }

    if (params.cite) {
      query.where.cite = params.cite;
    }

    if (params.idDocumentoPadre) {
      query.where.idDocumentoPadre = params.idDocumentoPadre;
    }

    const result = await documento.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function cantidadExtra (params = {}) {
    const query = getQuery(params);

    query.subQuery = false;
    query.distinct = true;

    query.attributes = [
      'id',
      [Sequelize.literal('(SELECT COUNT(*)::integer FROM gestion_referencia_documento WHERE gestion_referencia_documento.id_documento = documento.id AND _deleted_at IS NULL)'), 'cantidadReferencias'],
      [Sequelize.literal('(SELECT COUNT(*)::integer FROM gestion_archivo_adjunto WHERE gestion_archivo_adjunto.id_documento = documento.id AND _deleted_at IS NULL)'), 'cantidadAdjuntos'],
      [Sequelize.literal('(SELECT COUNT(*)::integer FROM sys_aprobacion_documentos WHERE sys_aprobacion_documentos.id_documento = documento.id AND _deleted_at IS NULL)'), 'cantidadFirmas']

    ];

    query.where = {};
    if (params.id) {
      query.where.id = params.id;
    }

    const result = await documento.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function findByFlujoDocumental (idFlujoDocumental) {
    const query = {
      where : { idFlujo: idFlujoDocumental },
      order : [['createdAt', 'ASC']]
    };

    query.attributes = [
      'id',
      'cite',
      'fechaDocumento',
      'estado',
      [Sequelize.json('plantilla.nombre'), 'nombrePlantilla']
    ];

    query.include = [
      {
        attributes : ['id', 'nombre', 'ruta'],
        model      : archivoAdjunto,
        as         : 'archivosAdjuntos'
      }
    ];

    const result = await documento.findAndCountAll(query);
    return toJSON(result);
  }

  async function getIdOriginal (params = {}) {
    const query = `
      WITH RECURSIVE cte AS (
          SELECT id, id_documento_original
          FROM gestion_documento
          WHERE id = '${params.id}'
          UNION ALL
          SELECT d.id, d.id_documento_original
          FROM gestion_documento d
          INNER JOIN cte ON d.id = cte.id_documento_original
      )
      SELECT id
      FROM cte
      WHERE id_documento_original IS NULL
      LIMIT 1;
    `;
    const [results] = await documento.options.sequelize.query(query);
    return results[0]?.id || null;
  }

  return {
    findByFlujoDocumental,
    superBuscador,
    superBuscadorDocumentos,
    superBuscadorTramites,
    findAll,
    findOne,
    findOneFilterId,
    findById       : (id) => Repository.findById(id, documento),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, documento, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, documento, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, documento, t),
    getTableName   : () => Repository.getTableName(documento),
    cantidadExtra,
    getIdOriginal
  };
};
