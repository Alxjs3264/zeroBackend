'use strict';

const { query } = require('express');
const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function usuariosRepository (models, Sequelize) {
  const Op = Sequelize.Op;
  const { usuario, rol, entidad, menu, area, usuarioCargo } = models;
  const { Cargo, ConfiguracionCargo } = models.planificacion;

  async function listarRemitentes () {
    const query = `
      SELECT DISTINCT(remitente) AS nombre
      FROM gestion_flujo_documental as gfd
      WHERE remitente IS NOT NULL
    `;
    const [results] = await usuario.options.sequelize.query(query);
    return results || null;
  }

  async function findAll (params = {}, include = true) {
    const query = getQuery(params);
    query.attributes = [
      'celular',
      'correoElectronico',
      'estado',
      'foto',
      'id',
      'tipoDocumento',
      'fechaNacimiento',
      'nombres',
      'cargo',
      'idCargo',
      'numeroDocumento',
      'primerApellido',
      'segundoApellido',
      'telefono',
      'usuario',
      'idEntidad',
      'createdAt'
    ];
    query.where = {};

    if (params.exclude) {
      query.where.id = {
        [Op.notIn]: Array.isArray(params.exclude) ? params.exclude : [params.exclude]
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.search) {
      query.where = {
        ...query.where,
        [Op.or]: [
          {
            nombres: {
              [Op.iLike]: `%${params.search}%`
            }
          },
          {
            primerApellido: {
              [Op.iLike]: `%${params.search}%`
            }
          },
          {
            segundoApellido: {
              [Op.iLike]: `%${params.search}%`
            }
          }
        ]
      };
    }

    if (params.usuario) {
      if (Array.isArray(params.usuario)) {
        query.where.usuario = {
          [Op.in]: params.usuario
        }
      } else {
        query.where.usuario = {
          [Op.iLike]: `%${params.usuario}%`
        }
      }
    }

    if (params.nombres) {
      query.where.nombres = {
        [Op.iLike]: `%${params.nombres}%`
      };
    }

    if (params.primerApellido) {
      query.where.primerApellido = {
        [Op.iLike]: `%${params.primerApellido}%`
      };
    }

    if (params.segundoApellido) {
      query.where.segundoApellido = {
        [Op.iLike]: `%${params.segundoApellido}%`
      };
    }

    if (params.numeroDocumento) {
      query.where.numeroDocumento = {
        [Op.iLike]: `%${params.numeroDocumento}%`
      };
    }

    if (params.correoElectronico) {
      query.where.correoElectronico = {
        [Op.iLike]: `%${params.correoElectronico}%`
      };
    }

    if (params.celular) query.where.celular = { [Op.iLike]: `%${params.celular}%` };

    if (params.cargo) query.where.cargo = { [Op.iLike]: `%${params.cargo}%` };

    if (params.idCargo) {
      query.where.idCargo = params.idCargo;
      if (Array.isArray(params.idCargo)) {
        query.where.idCargo = {
          [Op.in]: params.idCargo
        };
      }
    }
    if (params.idEntidad)  query.where.idEntidad = params.idEntidad;

    if (include) {
      query.include = [
        {
          model : entidad,
          as    : 'entidad'
        },
        {
          through : { attributes: [] },
          model   : rol,
          as      : 'roles'
        }
      ];
    }

    const result = await usuario.findAndCountAll(query);
    return toJSON(result);
  }

  // TODO: corregir error: no existe usuario.idEntidad
  async function findOne (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'usuario',
      'nombres',
      'idEntidad',
      'primerApellido',
      'segundoApellido',
      'tipoDocumento',
      'complemento',
      'fechaNacimiento',
      'numeroDocumento',
      'idCargo',
      'cargo',
      'telefono',
      'celular',
      'correoElectronico',
      'foto',
      'estado',
      'horariosAtencion',
      'noVidente'
    ];

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'codigo', 'nombre', 'sigla', 'nivel'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [
          'id',
          'idEntidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      },
      {
        model      : area,
        as         : 'areas',
        attributes : [
          'id',
          'nombreArea',
          'sigla',
          'estado'
        ]
      },
      {
        model   : Cargo,
        as      : 'cargoUsuario',
        include : [
          {
            model : ConfiguracionCargo,
            as    : 'configuracionCargos'
          }
        ]
      },
      {
        model   : usuarioCargo,
        as      : 'usuarioCargo',
        include : [
          {
            attributes : ['id', 'descripcion', 'nroItem'],
            model      : Cargo,
            as         : 'cargo'
          }
        ]
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findByCi (params = {}) {
    const query = {};

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'codigo', 'nombre', 'sigla', 'nivel'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [
          'id',
          'id_entidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function listadoReducido (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'numeroDocumento',
      'tipoDocumento',
      'nombres',
      'primerApellido',
      'segundoApellido',
      'cargo',
      'estado'
    ];

    query.include = [
      {
        model      : entidad,
        as         : 'entidad',
        attributes : [
          'id',
          'codigo',
          'nombre',
          'sigla'
        ]
      },
      {
        model      : area,
        as         : 'areas',
        attributes : [
          'id',
          'nombreArea',
          'sigla'
        ]
      }
    ];

    query.where = {};

    if (Object.keys(params).length === 0) {
      return { count: 0, rows: [] };
    }

    if (params.area) {
      query.include[2].where = {
        nombreArea: {
          [Op.iLike]: `%${params.area.toUpperCase()}`
        }
      };
    }

    if (params.cargo) {
      query.where.cargo = params.cargo;
    }

    if (params.nombre) {
      query.where = {
        ...query.where,
        [Op.or]: [
          {
            nombres: {
              [Op.iLike]: `%${params.nombre}%`
            }
          },
          {
            primerApellido: {
              [Op.iLike]: `%${params.nombre}%`
            }
          },
          {
            segundoApellido: {
              [Op.iLike]: `%${params.nombre}%`
            }
          }
        ]
      };
    }

    const result = await usuario.findAndCountAll(query);
    return toJSON(result);
  }

  async function login (params = {}, t) {
    const query = {};
    if (t) query.transaction = t;

    query.attributes = [
      'id',
      'contrasena',
      'usuario',
      'nombres',
      'primerApellido',
      'segundoApellido',
      'numeroDocumento',
      'fechaNacimiento',
      'telefono',
      'celular',
      'correoElectronico',
      'foto',
      'estado',
      'idCargo',
      'horariosAtencion',
      'noVidente',
      'resetearContrasena'
    ];

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'codigo', 'nombre', 'sigla', 'nivel', 'idEntidad'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        attributes : ['id', 'descripcion', 'interno'],
        model      : Cargo,
        as         : 'cargoUsuario',
        include    : [
          {
            model : ConfiguracionCargo,
            as    : 'configuracionCargos'
          },
          {
            model      : area,
            as         : 'unidad',
            attributes : ['id', 'nombreArea']
          }
        ]
      },
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [
          'id',
          'idEntidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      },
      {
        model   : usuarioCargo,
        as      : 'usuarioCargo',
        include : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargo'
          }
        ]
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findById (id) {
    const query = {};

    query.where = {
      id,
      estado: 'ACTIVO'
    };

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function createOrUpdate (usuarioParam, t) {
    const cond = { where: { id: usuarioParam.id || null } };

    const item = await usuario.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await usuario.update(usuarioParam, cond);
      } catch (e) {
        errorHandler(e);
      }

      try {
        const result = updated ? await usuario.findOne(cond) : item;

        if (result) {
          return result.toJSON();
        }
        return null;
      } catch (error) {
      }
    }

    let result;
    try {
      result = await usuario.create(usuarioParam, t ? { transaction: t } : {});
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function verificarCorreoElectronico (params) {
    const query = {};
    query.where = {};

    if (params.correoElectronico) {
      Object.assign(query.where, { correoElectronico: params.correoElectronico });
    }

    if (params.usuario) {
      Object.assign(query.where, { usuario: params.usuario });
    }

    if (params.usuario && params.correoElectronico) {
      query.where = {
        [Op.or]: [
          {
            usuario: params.usuario
          },
          {
            correoElectronico: params.correoElectronico
          }
        ]
      };
    }

    if (params.id) {
      query.where.id = {
        [Op.not]: params.id
      };
    }

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findOneEdicion (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'usuario',
      'nombres',
      'idEntidad',
      'primerApellido',
      'segundoApellido',
      'tipoDocumento',
      'complemento',
      'fechaNacimiento',
      'numeroDocumento',
      'idCargo',
      'cargo',
      'telefono',
      'celular',
      'correoElectronico',
      'foto',
      'estado',
      'horariosAtencion',
      'noVidente'
    ];

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'codigo', 'nombre', 'sigla', 'nivel'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        through    : { attributes: [] },
        attributes : [
          'id',
          'idEntidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      },
      {
        model      : area,
        as         : 'areas',
        attributes : [
          'id',
          'nombreArea',
          'sigla',
          'estado'
        ]
      },
      {
        model   : Cargo,
        as      : 'cargoUsuario',
        include : [
          {
            model : ConfiguracionCargo,
            as    : 'configuracionCargos'
          }
        ]
      },
      {
        model   : usuarioCargo,
        as      : 'usuarioCargo',
        include : [
          {
            attributes : ['id', 'descripcion', 'nroItem'],
            model      : Cargo,
            as         : 'cargo'
          }
        ]
      }
    ];
    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function existe (params) {
    const query = { where: params };

    const result = await usuario.findOne(query);
    if (result) return result.toJSON();
    return null;
  }
  return {
    existe,
    findOneEdicion,
    listarRemitentes,
    findByCi,
    login,
    findById,
    verificarCorreoElectronico,
    findAll,
    listadoReducido,
    findOne,
    createOrUpdate,
    deleteItem        : (id, t) => Repository.deleteItem(id, usuario, t),
    cambiarContrasena : (id, t) => Repository.createOrUpdate(id, usuario, t)
  };
};
