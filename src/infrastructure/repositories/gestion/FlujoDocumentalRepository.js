'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');
const log = require('log4js').getLogger();
const moment = require('moment');

module.exports = function flujoDocumentalRepository (models, Sequelize) {
  const {
    flujoDocumental,
    flujoDerivacion,
    parametro,
    usuario,
    PasoActual,
    entidad,
    documento,
    aprobacionDocumentos,
    SolicitudPlantilla,
    Paso
  } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    query.distinct = true;

    query.include = [
      {
        attributes : ['id', 'nombre', 'estado', 'docfisico'],
        model      : SolicitudPlantilla,
        as         : 'solicitudPlantilla'
      },
      {
        attributes : ['id', 'palabrasClave', 'asunto'],
        required   : false,
        model      : documento,
        as         : 'documentos',
        where      : { estado: 'CERRADO' }
      }
    ];

    if (params.codigoFlujo) {
      query.where.codigoFlujo = {
        [Op.iLike]: `%${params.codigoFlujo}%`
      };
    }

    if (params.idSolicitudPlantilla) query.where.idSolicitudPlantilla = params.idSolicitudPlantilla;

    if (params.idCarpeta) query.where.idCarpeta = params.idCarpeta;

    if (params.tipo) query.where.tipo = params.tipo;

    if (params.referencia) query.where.referencia = { [Op.iLike]: `%${params.referencia}%` };

    if (params.search) {
      query.where[Op.or] = [
        { codigoFlujo: { [Op.iLike]: `%${params.search}%` } },
        { referencia: { [Op.iLike]: `%${params.search}%` } },
        { remitente: { [Op.iLike]: `%${params.search}%` } }
      ];
    }

    if (params.idFlujoPadre) {
      query.where.idFlujoPadre = params.idFlujoPadre;
      query.include.push({
        required   : false,
        attributes : [
          'id',
          'aceptado',
          'introducido',
          'hashDatos',
          'codigoOperacion',
          'transactionId'
        ],
        model : aprobacionDocumentos,
        as    : 'aprobacionFlujo',
        where : {
          [Op.or]: [
            { aceptado: false },
            { introducido: false }
          ]
        },
        include: [
          {
            model      : usuario,
            as         : 'usuario',
            attributes : [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido',
              'usuario',
              'cargo',
              'estado'
            ]
          }
        ]
      });
    };

    if (params.userCreated) query.where.userCreated = params.userCreated;

    if (params.estado) query.where.estado = params.estado;

    if (params.idEntidad) {
      query.include.push({
        required : true,
        model    : entidad,
        as       : 'entidades',
        where    : { id: params.idEntidad }
      });
    };

    if (params.palabrasClave) {
      query.include[0].required = true;
      query.include[0].where = { palabrasClave: { [Op.iLike]: `%${params.palabrasClave}%` } };
    }

    if (params.fechaDesde) {
      query.where.createdAt = {
        [Op.gte]: params.fechaDesde
      };
    }

    const result = await flujoDocumental.findAndCountAll(query);
    return toJSON(result);
  }

  function findAllBook (params = {}) {
    const query = getQuery(params);
    query.where = {};
    if (params.userCreated) {
      query.where.userCreated = params.userCreated;
    }
    if (params.fechaDesde) {
      query.where.createdAt = {
        [Op.gte]: params.fechaDesde
      };
    }
    if (params.fechaHasta) {
      query.where.createdAt = {
        [Op.lte]: params.fechaHasta
      };
    }
    if (params.fechaDesde && params.fechaHasta) {
      query.where.createdAt = {
        [Op.between]: [params.fechaDesde, params.fechaHasta]
      };
    }
    if (params.areaRemitente) {
      query.where.areaDestinoId = params.areaRemitente;
    }
    if (params.codigoFlujo) {
      query.where.codigoFlujo = {
        [Op.iLike]: `%${params.codigoFlujo}%`
      };
    }
    query.where.deletedAt = null;
    return flujoDocumental.findAndCountAll(query);
  }

  async function findOne (params = {}, subParams = {}, t) {
    const query = { where: params };
    query.order = [
      [
        {
          model : flujoDerivacion,
          as    : 'flujoDerivaciones'
        }, 'createdAt', 'DESC']
    ];

    if (t) query.transaction = t;

    query.include = [
      {
        model : PasoActual,
        as    : 'pasosActuales'
      },
      {
        model   : flujoDerivacion,
        as      : 'flujoDerivaciones',
        include : [
          {
            model : documento,
            as    : 'documento'
          },
          {
            attributes : ['id', 'nombre'],
            model      : parametro,
            as         : 'accion'
          },
          {
            attributes: [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido'
            ],
            model : usuario,
            as    : 'usuarioRemitente'
          },
          {
            attributes: [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido'
            ],
            model : usuario,
            as    : 'usuarioDestinatario'
          }
        ]
      }
    ];

    query.include[1].where = {};

    if (subParams.tipo) {
      query.include[1].where.tipo = subParams.tipo;
    }

    if (subParams.estadoActual) {
      query.include[1].where.estadoActual = subParams.estadoActual;
    }

    if (subParams.idDocumento) {
      query.include[1].include[0].where = { id: subParams.idDocumento };
    }

    const result =  await flujoDocumental.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function categoriasFlujos () {
    try {
      const response = await flujoDocumental.findAndCountAll({
        where      : {},
        attributes : ['id', 'categoria']
      });
      return response.rows.map(flujo => {
        return flujo.dataValues.categoria;
      });
    } catch (err) {
      log.error('Error obteniendo categorías de flujos');
      log.error(err);
      return [];
    }
  }

  async function update (item, t) {
    let updated;
    try {
      updated = await flujoDocumental.update(
        item,
        { attributes: ['id'], where: { id: item.id } },
        t ? { transaction: t } : {}
      );
    } catch (err) {
      if (t) {
        await t.rollback();
      }
      log.error('Actualizando flujo documental');
      log.error(err);
      throw new Error(err);
    }

    const result = updated ? await flujoDocumental.findOne({ where: { id: item.id } }) : item;
    if (result) { return result.toJSON(); }
    return null;
  }

  async function listarDocumentos (params = {}) {
    const query = {
      distinct   : true,
      attributes : [
        [Sequelize.literal('ROW_NUMBER() OVER (ORDER BY _created_at)'), 'index'],
        'id',
        'cite',
        'fechaDocumento',
        'estado',
        'plantilla',
        'configuracionDerivaciones',
        'docconfidencial',
        [Sequelize.literal(`(SELECT ${params.nivel})`), 'nivel']
      ],
      where: {
        idFlujo: params.idFlujo
      },
      order: [['createdAt', 'ASC']]
    };

    if (params.nivel === 1) {
      query.where.estado = {
        [Op.in]: ['CERRADO', 'ARCHIVADO']
      };
    }

    if (params.id) {
      query.where.id = { [Op.not]: params.id };
    }

    if (params.cite) {
      query.where.cite = params.cite;
    }

    const result = await documento.findAndCountAll(query);
    return toJSON(result);
  }

  async function getCantidadCopias (params, t) {
    const query = {};
    if (t) query.transaction = t;
    query.where = params;

    const cantidades = await flujoDocumental.count(query);
    return cantidades;
  }

  async function findForClone (params = {}, subParams = {}, t) {
    const query = { where: params };

    if (t) query.transaction = t;

    const result =  await flujoDocumental.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function findOne (params = {}, subParams = {}, t) {
    const query = { where: params };
    query.order = [
      [
        {
          model : flujoDerivacion,
          as    : 'flujoDerivaciones'
        }, 'createdAt', 'DESC']
    ];

    if (t) query.transaction = t;

    query.include = [
      {
        model : PasoActual,
        as    : 'pasosActuales'
      },
      {
        model   : flujoDerivacion,
        as      : 'flujoDerivaciones',
        include : [
          {
            model : documento,
            as    : 'documento'
          },
          {
            attributes : ['id', 'nombre'],
            model      : parametro,
            as         : 'accion'
          },
          {
            attributes: [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido'
            ],
            model : usuario,
            as    : 'usuarioRemitente'
          },
          {
            attributes: [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido'
            ],
            model : usuario,
            as    : 'usuarioDestinatario'
          }
        ]
      },
      {
        attributes : ['id', 'nombre', 'estado', 'docfisico'],
        model      : SolicitudPlantilla,
        as         : 'solicitudPlantilla'
      }
    ];

    query.include[1].where = {};

    if (subParams.tipo) {
      query.include[1].where.tipo = subParams.tipo;
    }

    if (subParams.estadoActual) {
      query.include[1].where.estadoActual = subParams.estadoActual;
    }

    if (subParams.idDocumento) {
      query.include[1].include[0].where = { id: subParams.idDocumento };
    }

    const result =  await flujoDocumental.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function historial (params = {}, subParams = {}, t) {
    const query = { where: { id: params.id } };

    query.distinct = true;

    query.attributes = [
      'id',
      'codigoFlujo',
      'tipo',
      'estado',
      'areaRemitente',
      'remitente',
      'cargoRemitente',
      'referencia',
      'clasificacion',
      'idFlujoPadre',
      'idSolicitudPlantilla',
      'createdAt'
    ];

    query.order = [
      [
        {
          model : flujoDerivacion,
          as    : 'flujoDerivaciones'
        }, 'createdAt', 'DESC']
    ];

    if (t) query.transaction = t;

    query.include = [
      {
        attributes : ['id', 'nombre', 'estado', 'docfisico'],
        model      : SolicitudPlantilla,
        as         : 'solicitudPlantilla'
      },
      {
        attributes: [
          'id',
          'idFlujo',
          'idUsuarioDestinatario',
          'nombreRemitente',
          'fechaDerivacion',
          'fechaRecepcion',
          'tipo',
          'idDocumento',
          'descripcion',
          'nombreDestinatario',
          'cargoDestinatario',
          'idCargoDestinatario',
          'idUsuarioRemitente',
          'cargoRemitente',
          'idCargoRemitente',
          'idPaso',
          'etapa',
          'estado',
          'observacion',
          'estadoActual',
          'idAccion'
        ],
        model   : flujoDerivacion,
        as      : 'flujoDerivaciones',
        include : [
          {
            attributes: [
              'id',
              'asunto',
              'cite',
              'estado',
              'editable',
              'fechaDocumento',
              'configuracionDerivaciones',
              'idDocumentoPadre',
              'idDocumentoOriginal',
              [Sequelize.json('plantilla.nombre'), 'nombrePlantilla']
            ],
            model : documento,
            as    : 'documento'
          },
          {
            attributes : ['id', 'nombrePaso'],
            model      : Paso,
            as         : 'paso'
          },
          {
            attributes : ['id', 'nombre'],
            model      : parametro,
            as         : 'accion'
          },
          {
            attributes: [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido'
            ],
            model : usuario,
            as    : 'usuarioRemitente'
          },
          {
            attributes: [
              'id',
              'nombres',
              'primerApellido',
              'segundoApellido'
            ],
            model : usuario,
            as    : 'usuarioDestinatario'
          }
        ]
      }
    ];

    if (params.documento) {
      query.include[1].include[0].where = {
        [Op.or]: [
          { cite: { [Op.iLike]: `%${params.documento}%` } },
          { asunto: { [Op.iLike]: `%${params.documento}%` } },
          { 'plantilla.nombre': { [Op.iLike]: `%${params.documento}%` } }
        ]
      };
    }

    if (params.derivacion || params.remitente || params.destinatario || params.fechaDerivacion || params.fechaRecepcion ||
        params.fechaDerivacionI || params.fechaDerivacionF || params.fechaRecepcionI || params.fechaRecepcionF) query.include[1].where = {};

    if (params.derivacion) {
      Object.assign(query.include[1].where, { descripcion: { [Op.iLike]: `%${params.derivacion}%` } });
    }

    if (params.fechaDerivacion) {
      Object.assign(query.include[1].where, { fechaDerivacion: params.fechaDerivacion });
    }

    if (params.fechaRecepcion) {
      Object.assign(query.include[1].where, { fechaRecepcion: params.fechaRecepcion });
    }

    if (params.remitente) {
      Object.assign(query.include[1].where, {
        [Op.and]: [
          {
            [Op.or]: [
              { nombreRemitente: { [Op.iLike]: `%${params.remitente}%` } },
              { cargoRemitente: { [Op.iLike]: `%${params.remitente}%` } }
            ]
          }
        ]
      });
    }

    if (params.destinatario) {
      if (query.include[1].where[Op.and]) {
        query.include[1].where[Op.and].push({
          [Op.or]: [
            { nombreDestinatario: { [Op.iLike]: `%${params.destinatario}%` } },
            { cargoDestinatario: { [Op.iLike]: `%${params.destinatario}%` } }
          ]
        });
      } else {
        Object.assign(query.include[1].where, {
          [Op.or]: [
            { nombreDestinatario: { [Op.iLike]: `%${params.destinatario}%` } },
            { cargoDestinatario: { [Op.iLike]: `%${params.destinatario}%` } }
          ]
        });
      }
    }

    const result =  await flujoDocumental.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }
  return {
    historial,
    findForClone,
    getCantidadCopias,
    listarDocumentos,
    findAll,
    categoriasFlujos,
    findAllBook,
    findOne,
    update,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, flujoDocumental, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, flujoDocumental, t)
  };
};
