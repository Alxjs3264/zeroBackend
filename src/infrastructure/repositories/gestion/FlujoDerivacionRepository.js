'use strict';
// const debug = require('debug')('app:repository:FlujoDerivacion');
const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function flujoDerivacionRepository (models, Sequelize) {
  const { flujoDerivacion, documento, flujoDocumental, usuario, parametro, SolicitudPlantilla, PasoActual } = models;
  const { Cargo } = models.planificacion;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes : ['id', 'nombre'],
        model      : parametro,
        as         : 'accion'
      },
      {
        model   : documento,
        as      : 'documento',
        include : [
          {
            attributes : ['id', 'codigoFlujo', 'tipoFlujo', 'tipo', 'estado', 'concluido', 'referencia', 'copia'],
            model      : flujoDocumental,
            as         : 'flujoDocumental',
            include    : [
              {
                attributes : ['id', 'nombre', 'descripcion', 'codigo'],
                model      : SolicitudPlantilla,
                as         : 'solicitudPlantilla'
              }
            ]
          }
        ]
      },
      {
        model : usuario,
        as    : 'usuarioRemitente'
      },
      {
        model : usuario,
        as    : 'usuarioDestinatario'
      }
    ];

    if (params.codigoFlujo) {
      query.include[1].include[0].where = {
        codigoFlujo: {
          [Op.iLike]: `%${params.codigoFlujo}%`
        }
      };
      query.include[1].required = true;
      query.include[1].include[0].required = true;
    }

    if (params.idUsuarioDestinatario) {
      if (params.bandeja === 'salida') {
        query.where = {
          [Op.and]: [
            {
              [Op.or]: [
                // { etapa: 'INICIO', idUsuarioDestinatario: params.idUsuarioDestinatario },
                { etapa: 'PROCESO', idUsuarioRemitente: params.idUsuarioDestinatario },
                { etapa: 'FIN', idUsuarioDestinatario: params.idUsuarioDestinatario },
                { etapa: 'FIN', idUsuarioRemitente: params.idUsuarioDestinatario }
              ]
            }
          ]
        };

        if (params.idCargoDestinatario) {
          query.where[Op.and][0][Op.or][0].idCargoRemitente = params.idCargoDestinatario;
          query.where[Op.and][0][Op.or][1].idCargoDestinatario = params.idCargoDestinatario;
          query.where[Op.and][0][Op.or][2].idCargoRemitente = params.idCargoDestinatario;
        }
      } else {
        query.where.idUsuarioDestinatario = params.idUsuarioDestinatario;

        if (params.idCargoDestinatario) query.where.idCargoDestinatario = params.idCargoDestinatario;
      }
    }

    if (params.bandeja) {
      query.include.unshift(
        {
          model   : documento,
          as      : 'documento',
          include : [
            {
              model : flujoDocumental,
              as    : 'flujoDocumental'
            }
          ]
        }
      );
    }

    if (params.bandeja === 'documentos') {
      query.where.estadoActual = 'ACTIVO';
      query.include[0].where = {
        estado: 'BORRADOR'
      };
    }

    if (params.bandeja === 'entrada') {
      query.where.estadoActual = 'ACTIVO';
      query.where.estado = 'INICIO';
      query.where.fechaRecepcion = null;
      query.include[0].where = { estado: { [Op.in]: ['DERIVADO', 'CERRADO', 'EN CORRECCION'] } };
    }

    if (params.bandeja === 'pendiente') {
      query.where.estadoActual = 'ACTIVO';
      query.where.estado = 'RECIBIDO';
    }

    if (params.bandeja === 'firma') {
      query.where.estadoActual = 'ACTIVO';
      query.include[0].where = { estado: 'PENDIENTE FIRMA' };
    }

    // if (params.bandeja === 'salida') {
    // }

    if (params.idDocumento) query.where.idDocumento = params.idDocumento;
    if (params.idFlujo) query.where.idFlujo = params.idFlujo;
    if (params.idPaso) query.where.idPaso = params.idPaso;
    if (params.tipo) query.where.tipo = params.tipo;
    if (params.estadoActual) query.where.estadoActual = params.estadoActual;

    if (params.referencia) {
      query.include[0].include[0].where = {
        referencia: {
          [Op.iLike]: `%${params.referencia}%`
        }
      };
      query.include[0].required = true;
      query.include[0].include[0].required = true;
    }

    const result = await flujoDerivacion.findAndCountAll(query);
    return toJSON(result);
  }

  async function cantidades (params = {}) {
    const query = getQuery(params);
    query.where = {};

    let consultaUsuario = '';
    if (params.idUsuarioDestinatario) {
      consultaUsuario = `AND gfd.id_usuario_destinatario = '${params.idUsuarioDestinatario}'`;
    }

    if (params.idCargoDestinatario) {
      consultaUsuario += `AND gfd.id_cargo_destinatario = '${params.idCargoDestinatario}'`;
    }
    const querySELECT = [];
    const queryFROM = [];
    if (params.documentos) {
      querySELECT.push('documentos');
      queryFROM.push(`(
        SELECT count(*) AS documentos
        FROM gestion_flujo_derivacion gfd
        INNER JOIN gestion_documento gd ON gd.id = gfd.id_documento AND gd._deleted_at IS NULL
        WHERE gfd._deleted_at IS NULL  AND gfd.estado_actual = 'ACTIVO' AND gd.estado = 'BORRADOR' ${consultaUsuario}
      ) documentos`);
    }
    if (params.entrada) {
      querySELECT.push('entrada');
      queryFROM.push(`(
        SELECT count(*) AS entrada
        FROM gestion_flujo_derivacion gfd
        INNER JOIN gestion_documento gd ON gd.id = gfd.id_documento AND gd._deleted_at IS NULL
        WHERE gfd._deleted_at IS NULL AND gfd.estado_actual = 'ACTIVO' AND gfd.estado = 'INICIO' AND gd.estado IN ('DERIVADO', 'CERRADO', 'EN CORRECCION')  AND gfd.fecha_recepcion IS NULL ${consultaUsuario}
      ) entrada`);
    }
    if (params.pendiente) {
      querySELECT.push('pendiente');
      queryFROM.push(`(
        SELECT count(*) AS pendiente
        FROM gestion_flujo_derivacion gfd
        join gestion_flujo_documental gfd2 on gfd.id_flujo = gfd2.id and gfd2."_deleted_at" is null
        WHERE gfd._deleted_at IS NULL AND gfd.estado_actual = 'ACTIVO' AND gfd.estado = 'RECIBIDO' ${consultaUsuario}
      ) pendiente`);
    }
    if (params.compartido) {
      querySELECT.push('compartido');
      queryFROM.push(`(
        SELECT count(*) AS compartido
        FROM gestion_documento_compartido as gdc
        INNER JOIN gestion_documento AS gd ON gd.id = gdc.id_documento AND gd._deleted_at IS NULL
        INNER JOIN sys_usuario AS su ON su.id = gdc.id_usuario_origen AND su.estado = 'ACTIVO' AND su._deleted_at IS NULL
        WHERE gdc.id_usuario = '${params.idUsuarioDestinatario}' AND gdc.aprobado = FALSE AND gdc._deleted_at IS NULL
      ) compartido`);
    }
    if (params.firma) {
      querySELECT.push('firma');
      queryFROM.push(`(
        SELECT count(*) AS firma
        FROM sys_aprobacion_documentos sad
        WHERE sad.aceptado = FALSE AND sad.introducido = FALSE AND sad.id_usuario = '${params.idUsuarioDestinatario}' AND sad.id_flujo IS NOT NULL AND sad._deleted_at IS NULL
      ) firma`);
    }

    const result = await flujoDerivacion.sequelize.query(`
        SELECT ${querySELECT.join(', ')}
        FROM ${queryFROM.join(', \n')}
    `, { type: Sequelize.QueryTypes.SELECT });

    if (result[0]) {
      return result[0];
    }
    return {};
  }

  async function cantidadDocumentosPorUsuario (idUsuario) {
    const result = await flujoDerivacion.sequelize.query(`
      select gd.id_plantilla,gd.nombre, count(1)
      from gestion_flujo_derivacion gfd 
      inner join (select gd.plantilla->>'id' id_plantilla, gd.plantilla->>'nombre' nombre, gd.id, gd."_deleted_at" from gestion_documento gd) gd 
      on gd.id=gfd.id_documento
      where gfd.observacion = FALSE AND gfd.nombre_remitente IS NULL AND gfd.id_usuario_destinatario ='${idUsuario}' AND gd."_deleted_at" IS NULL
      group by gd.id_plantilla,gd.nombre
    `, { type: Sequelize.QueryTypes.SELECT });
    return result;
  }

  async function listaDocumentosPorUsuario (params) {
    let query = `
    select
      gfd.id,
      gfd2.id id_flujo_documental,
      gfd2.codigo_flujo,
      gd.id id_documento,
      gd.asunto,
      TO_CHAR(gd.fecha_documento,'dd-mm-yyyy') fecha_documento,
      gd.cite,gfd2.tipo,
      gd.docconfidencial as documento_confidencial,
      case 
        when gfd2.clasificacion = 'CONFIDENCIAL' then true
        else false
      end as flujo_confidencial
    from gestion_flujo_derivacion gfd 
    inner join gestion_documento gd 
    on gd.id=gfd.id_documento
    left join gestion_flujo_documental gfd2 
    on gfd2.id = gfd.id_flujo
    where gfd.observacion = false AND gfd.nombre_remitente is NULL AND gfd.id_usuario_destinatario ='${params.idUsuario}' AND gd."_deleted_at" IS NULL
    
    `;
    if (params.idPlantilla) {
      query = `${query} AND gd.plantilla->>'id' = '${params.idPlantilla}'`;
    }
    query = `${query} order by gd._created_at DESC `;
    const result = await flujoDerivacion.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return result;
  }

  async function listaFlujoDocumentalPendientePorUsuario (params) {
    const select = `
      SELECT 
        gfd.codigo_flujo AS hoja_ruta,
        gfd.estado,
        gfd2.nombre_remitente,
        gfd2.fecha_recepcion,
        gfd2.nombre_destinatario,
        gfd2.estado AS estado_derivacion,
        gfd2.id_flujo,
        gfd2.fecha_recepcion,
        TO_CHAR(gfd2.fecha_derivacion,'dd-mm-yyyy') fecha_derivacion,
        gfd.referencia,
        gfd.tipo,
        su.nombres || ' ' || su.primer_apellido || ' ' || su.segundo_apellido AS funcionario,
        pc.descripcion AS cargo,
        sa.nombre_area AS area`;
    let query = `
      FROM gestion_flujo_documental as gfd
      INNER JOIN gestion_flujo_derivacion as gfd2 
      ON gfd2.id_flujo = gfd.id AND gfd2.estado_actual = 'ACTIVO' AND gfd2.estado IN ('INICIO', 'RECIBIDO', 'PENDIENTE DE FIRMA') AND gfd2._deleted_at IS NULL
      INNER JOIN sys_usuario as su 
      ON su.id = gfd2.id_usuario_destinatario AND su._deleted_at IS NULL`;
    if (params.idUsuario) {
      query += ` AND su.id IN ('${params.idUsuario}')`;
    }
    query += `
      INNER JOIN planificacion_cargo as pc ON pc.id = su.id_cargo AND pc._deleted_at IS NULL
      INNER JOIN sys_area as sa ON sa.id = pc.id_unidad_organizacional AND sa._deleted_at IS NULL
      WHERE gfd.estado = 'PENDIENTE' AND gfd.concluido = FALSE AND gfd._deleted_at IS NULL
    `;

    const queryCount = query;

    if (params.limit) {
      query += `
        LIMIT ${parseInt(params.limit)}
      `;
      if (params.page) {
        query += `
          OFFSET ${parseInt((params.page - 1) * params.limit)}
        `;
      }
    }
    const rows = await flujoDerivacion.sequelize.query(`${select} ${query};`, { type: Sequelize.QueryTypes.SELECT });
    const count = await flujoDerivacion.sequelize.query(`SELECT count(1) ${queryCount};`, { type: Sequelize.QueryTypes.SELECT });
    return { rows, count: parseInt(count[0].count) };
  }

  async function inactivarRegistros (idFlujo, t) {
    const cond = { where: { idFlujo } };
    if (t) cond.transaction = t;

    await flujoDerivacion.update({ estado: 'DERIVADO', estadoActual: 'INACTIVO' }, cond);
  }

  async function ultimaDerivacion (params, order = ['createdAt', 'DESC'], t) {
    const query = { where: {} };

    if (params.notId) {
      query.where.id = { [Op.not]: params.notId };
      delete params.notId;
    }

    query.where = { ...query.where, ...params };

    if (order) query.order = [order];

    if (t) query.transaction = t;

    const result = await flujoDerivacion.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function findOne (params, t) {
    const order = params.order || 'DESC';
    delete params.order;

    const query = { where: params };

    if (params.tipo) {
      query.where.tipo = params.tipo;
      if (Array.isArray(params.tipo)) query.where.tipo = { [Op.in]: params.tipo };
    }

    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    if (params.observacion) {
      query.where.observacion = params.observacion;
    }

    if (params.idUsuario) {      
      query.where[Op.or] = [
        { idUsuarioRemitente: params.idUsuario },
        { idUsuarioDestinatario: params.idUsuario }
      ]
      delete query.where.idUsuario;
    }

    query.order = [['createdAt', order]];

    if (t) query.transaction = t;

    query.include = [
      {
        // attributes: [
        //   'fechaDocumento',
        //   'fechaCerrado',
        //   'palabrasClave',
        //   'id',
        //   'idFlujo',
        //   'idDocumentoPadre',
        //   'configuracionDerivaciones',
        //   'cite',
        //   'asunto',
        //   'plantilla',
        //   'plantillaValor',
        //   'clasificacion',
        //   'firmado',
        //   'referenciaDocumento',
        //   'configuracionFinalizacion',
        //   'estado',
        //   'nombrePdf',
        //   'linkFirma',
        //   'editable',
        //   'compartido',
        //   'idDocumentoOriginal',
        //   'hojaRuta',
        //   'userCreated',
        //   'userUpdated',
        //   'docconfidencial'
        // ],
        model : documento,
        as    : 'documento'
      },
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

      },
      {
        attributes : ['id', 'nombre'],
        model      : parametro,
        as         : 'accion'
      },
      {
        attributes: [
          'id',
          'idEntidad',
          'numeroDocumento',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'cargo',
          'idCargo',
          'estado',
          'noVidente'
        ],
        model   : usuario,
        as      : 'usuarioRemitente',
        include : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargoUsuario'
          }
        ]

      },
      {
        attributes: [
          'id',
          'idEntidad',
          'numeroDocumento',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'cargo',
          'idCargo',
          'estado',
          'noVidente'
        ],
        model   : usuario,
        as      : 'usuarioDestinatario',
        include : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargoUsuario'
          }
        ]
      }

    ];
    const result = await flujoDerivacion.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function findOneSimple (params, t) {
    const order = params.order || 'DESC';
    delete params.order;

    const query = { where: params };

    if (params.tipo) {
      query.where.tipo = params.tipo;
      if (Array.isArray(params.tipo)) query.where.tipo = { [Op.in]: params.tipo };
    }

    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    if (params.observacion) {
      query.where.observacion = params.observacion;
    }

    query.order = [['createdAt', order]];

    if (t) query.transaction = t;

    query.include = [

      {
        attributes : ['id', 'nombre'],
        model      : parametro,
        as         : 'accion'
      },
      {
        attributes: [
          'id',
          'idEntidad',
          'numeroDocumento',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'cargo',
          'idCargo',
          'estado',
          'noVidente'
        ],
        model   : usuario,
        as      : 'usuarioRemitente',
        include : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargoUsuario'
          }
        ]

      },
      {
        attributes: [
          'id',
          'idEntidad',
          'numeroDocumento',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'cargo',
          'idCargo',
          'estado',
          'noVidente'
        ],
        model   : usuario,
        as      : 'usuarioDestinatario',
        include : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargoUsuario'
          }
        ]
      }

    ];
    const result = await flujoDerivacion.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function  findSolicitante (idFlujoDocumental, t = null) {
    const query = {
      where: {
        idFlujo            : idFlujoDocumental,
        idUsuarioRemitente : null
      }
    };

    query.order = [['createdAt', 'ASC']];

    if (t) query.transaction = t;

    const result = await flujoDerivacion.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function eliminarPosteriores ({ idFlujo, idActual, fechaCreacion, idUsuario }, t) {
    const query = {
      idFlujo     : idFlujo,
      id          : { [Op.not]: idActual },
      createdAt   : { [Op.gte]: fechaCreacion },
      userDeleted : idUsuario
    };

    await Repository.deleteItemCond(query, flujoDerivacion, t);
  }

  async function primeraDerivacion (params, order = ['createdAt', 'ASC'], t) {
    const query = { where: params };

    if (order) query.order = [order];

    if (t) query.transaction = t;

    const result = await flujoDerivacion.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    primeraDerivacion,
    eliminarPosteriores,
    findSolicitante,
    ultimaDerivacion,
    inactivarRegistros,
    cantidades,
    findAll,
    findOne,
    findOneSimple,
    findById       : (id) => Repository.findById(id, flujoDerivacion),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, flujoDerivacion, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, flujoDerivacion, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, flujoDerivacion, t),
    cantidadDocumentosPorUsuario,
    listaDocumentosPorUsuario,
    listaFlujoDocumentalPendientePorUsuario
  };
};
