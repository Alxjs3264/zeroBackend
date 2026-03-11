'use strict';

const { ErrorApp } = require('../../lib/error');
const moment = require('moment');
const axios = require('axios');
const log = require('log4js').getLogger();
const { generateToken } = require('../../../application/lib/auth');
const { usuarioReducido } = require('../../lib/util');
const { config } = require('../../../common');
const { CONTRASENA_DEFECTO, ID_PERSONAL_PLANTA, ROL_DEFECTO } = require('../../../common/config/constants');

module.exports = function userService (repositories, helpers, res) {
  const {
    UsuarioRepository,
    RolUsuarioRepository,
    AuthRepository,
    RolRepository,
    transaction,
    ParametroRepository,
    HistorialHorarios,
    UsuarioCargoRepository,
    EntidadRepository,
    AreaRepository
  } = repositories;

  const { CargoRepository, ConfiguracionCargoRepository } = repositories.planificacion;
  const { FechaHelper } = helpers;

  async function listarUsuarios (params) {
    try {
      return UsuarioRepository.findAll(params);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarRemitentes (params) {
    try {
      return UsuarioRepository.listarRemitentes(params);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function mostrar (id) {
    try {
      return UsuarioRepository.findOne({ id });
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function findOneEdicion (id) {
    try {
      return UsuarioRepository.findOneEdicion({ id });
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function findOne (id) {
    try {
      return UsuarioRepository.findOne({ id });
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function getResponse (user, seleccionarRol, info = {}) {
    let respuesta;
    try {
      const usuario = user.usuario;
      // Actualizando el último login
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      let text = '';
      if (info.location) {
        text += `Location: ${info.location.country} -- ${info.location.city} <br />`;
      }
      if (info.navigator) {
        text += `Navigator: ${info.navigator}`;
      }

      const where = {};
      if (seleccionarRol) {
        where.id = seleccionarRol;
      } else {
        // where.ciudadano = true; No existe la columna ciudadano en el tabla rol
        where.id = 1;
      }
      let idRolSeleccionado = await RolRepository.findOne(where);
      if (!idRolSeleccionado) {
        throw new Error('El rol seleccionado no existe.');
      }
      idRolSeleccionado = idRolSeleccionado.id;
      const rolSeleccionado = user.roles.find(x => x.id === idRolSeleccionado);
      if (!rolSeleccionado) {
        throw new Error('No tiene asignado el rol que selecciono.');
      }
      const menu = rolSeleccionado.menus;
      const listaRoles = user.roles.map(x => {
        return {
          id          : x.id,
          nombre      : x.nombre,
          descripcion : x.descripcion
          // ciudadano   : x.ciudadano,
          // admin       : x.admin
        }
        ;
      });
      // menu = menu.data.menu;
      // Generando token
      const token = await generateToken(ParametroRepository, {
        id        : user.id,
        user      : user.usuario,
        rol       : rolSeleccionado.id,
        state     : info.state,
        idPersona : user.idPersona,
        idEmpresa : user.idEmpresa ? user.idEmpresa : null
      });
      respuesta = {
        roles   : listaRoles,
        menu,
        token,
        usuario : {
          usuario          : user.usuario,
          nombres          : user.nombres,
          primer_apellido  : user.primerApellido,
          segundo_apellido : user.segundoApellido,
          email            : user.email,
          rol              : rolSeleccionado.nombre,
          idEmpresa        : user.idEmpresa ? user.idEmpresa : null,
          lang             : 'es'
        },
        redirect: rolSeleccionado.path
      };
      return respuesta;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async function userExist (usuario, contrasena, nit) {
    let result;
    let t;
    try {
      result = await UsuarioRepository.login({ usuario });
      if (!nit && !result) {
        throw new ErrorApp(`No existe el usuario ${usuario}`, 400);
      }

      const respuestaVerificacion = await AuthRepository.verificarContrasena(contrasena, result.contrasena);
      if (!nit && !respuestaVerificacion) {
        throw new ErrorApp(`La contraseña del usuario ${usuario} es incorrecta`, 400);
      }

      if (result.estado === 'INACTIVO') {
        throw new ErrorApp(`El usuario ${usuario} se encuentra deshabilitado. Consulte con el administrador del sistema.`, 400);
      }

      return result;
    } catch (e) {
      if (t) {
        await transaction.rollback(t);
      }

      throw new ErrorApp(e.message, 400);
    }
  }

  async function createOrUpdate (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      if (data.id) delete data.contrasena;

      if (data.contrasena) data.contrasena = await AuthRepository.codificarContrasena(data.contrasena);

      const existeUsuario = await UsuarioRepository.verificarCorreoElectronico({ id: data.id, correoElectronico: data.correoElectronico, usuario: data.usuario }, transaccion);

      if (existeUsuario) {
        if (existeUsuario.correoElectronico === data.correoElectronico) throw new Error(`Ya se encuentra registrado un usuario con el correo electronico "${data.correoElectronico}".`);

        if (existeUsuario.usuario === data.usuario) throw new Error(`Ya se encuentra registrado un usuario con el nombre de usuario "${data.usuario}".`);
      }

      if (data.cargos) {
        if (data.cargos[0]) {
          const rolPrincipal = await CargoRepository.findOne({ id: data.cargos[0] }, transaccion);
          data.cargo = rolPrincipal.descripcion;
          data.idCargo = rolPrincipal.id;
        }
      }

      const usuarioCreado = await UsuarioRepository.createOrUpdate(data, transaccion);

      if (data.cargos) {
        await UsuarioCargoRepository.deleteItemCond({ idUsuario: usuarioCreado.id }, transaccion);

        for (const cargo of data.cargos) {
          await UsuarioCargoRepository.deleteItemCond({ idCargo: cargo, estado: 'ACTIVO' }, transaccion);
          await UsuarioCargoRepository.createOrUpdate({ idUsuario: usuarioCreado.id, idCargo: cargo, userCreated: data.userCreated || data.userUpdated }, transaccion);
        }

        if (data.cargos.length === 0) await UsuarioRepository.createOrUpdate({ id: usuarioCreado.id, idCargo: null, cargo: null, estado: 'INACTIVO' }, transaccion);
      }

      if (data.roles) {
        if (data.roles.length === 0) throw new Error('Debe asignar al menos un rol al usuario');
        await RolUsuarioRepository.deleteItemCond({ idUsuario: usuarioCreado.id });
        for (const rol of data.roles) {
          await RolUsuarioRepository.createOrUpdate({ idUsuario: usuarioCreado.id, idRol: rol, userCreated: data.userCreated || data.userUpdated }, transaccion);
        }
      }

      await transaction.commit(transaccion);
      return usuarioCreado;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cambiarContrasena (data) {
    try {
      const existeUsuario = await UsuarioRepository.findById(data.id);
      if (!existeUsuario) {
        throw new Error('No existe el usuario.');
      }

      const respuestaVerificacion = await AuthRepository.verificarContrasena(data.antiguaContrasena, existeUsuario.contrasena);
      if (!respuestaVerificacion) {
        throw new Error('Su contraseña anterior no coincide.');
      }

      await UsuarioRepository.createOrUpdate({
        id         : existeUsuario.id,
        contrasena : await AuthRepository.codificarContrasena(data.nuevaContrasena),
        resetearContrasena: false
      });
      return true;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      return UsuarioRepository.deleteItem(id);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function asignarRoles (data) {
    try {
      const { idUsuario, roles } = data;
      await RolUsuarioRepository.eliminarRolesAsociados(idUsuario);
      await RolUsuarioRepository.crearRolesAsociados(idUsuario, roles);
      return true;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listadoReducido (params) {
    try {
      const _usuarios = await UsuarioRepository.listadoReducido(params);
      return _usuarios.rows.map(_usuario => { return usuarioReducido(_usuario); });
    } catch (err) {
      log.debug('Error listando usuarios');
      log.debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function actualizarHorarios (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const existeUsuario = await UsuarioRepository.findById(data.id);

      if (!existeUsuario) throw new Error('No existe el usuario.');

      const datoshistorial = {
        idUsuario   : data.id,
        motivo      : data.motivo,
        userCreated : data.userUpdated
      };

      for (const periodo of data.horarios) {
        if (periodo.dia === 'Lunes') datoshistorial.lunes = periodo.periodos;
        if (periodo.dia === 'Martes') datoshistorial.martes = periodo.periodos;
        if (periodo.dia === 'Miercoles') datoshistorial.miercoles = periodo.periodos;
        if (periodo.dia === 'Jueves') datoshistorial.jueves = periodo.periodos;
        if (periodo.dia === 'Viernes') datoshistorial.viernes = periodo.periodos;
        if (periodo.dia === 'Sabado') datoshistorial.sabado = periodo.periodos;
        if (periodo.dia === 'Domingo') datoshistorial.domingo = periodo.periodos;
      }

      await UsuarioRepository.createOrUpdate({ id: data.id, horariosAtencion: data.horarios }, transaccion);
      await HistorialHorarios.createOrUpdate(datoshistorial, transaccion);

      await transaction.commit(transaccion);
      return true;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cambiarEstado (params) {
    try {
      const resultado = await UsuarioRepository.createOrUpdate(params);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function findByCi (numerosDocumento) {
    try {
      if (!numerosDocumento) throw new Error('Debe enviar numeros de documento para su verificacion.');

      const respuesta = [];

      let numerosDocumentoIterator = numerosDocumento;

      if (!Array.isArray(numerosDocumento)) numerosDocumentoIterator = [numerosDocumento];

      for (const numeroDocumento of numerosDocumentoIterator) {
        const existeUsuario = await UsuarioRepository.findOne({ numeroDocumento, estado: 'ACTIVO' });

        if (!existeUsuario) throw new Error(`El usuario con el CI: ${numeroDocumento} no existe o no se ecuentra habilitado.`);

        respuesta.push({
          numeroDocumento : existeUsuario.numeroDocumento,
          nombres         : existeUsuario.nombres,
          primerApellido  : existeUsuario.primerApellido,
          segundoApellido : existeUsuario.segundoApellido
        });
      }

      return respuesta;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function verificarCi (numeroDocumento) {
    try {
      if (!numeroDocumento) throw new Error('Debe enviar numeros de documento para su verificacion.');

      const { rows: existeUsuario } = await UsuarioCargoRepository.findAll({ numeroDocumento, estado: 'ACTIVO' });

      if (!existeUsuario[0]) throw new Error(`El usuario con el CI: ${numeroDocumento} no existe o no se ecuentra habilitado.`);

      return existeUsuario[0];
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearUsuario (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      data.contrasena = await AuthRepository.codificarContrasena(CONTRASENA_DEFECTO);

      const existeUsuario = await UsuarioRepository.verificarCorreoElectronico({
        id                : data.id,
        correoElectronico : data.correoElectronico,
        usuario           : data.usuario
      }, transaccion);

      if (existeUsuario) {
        if (existeUsuario.correoElectronico === data.correoElectronico) throw new Error(`Ya se encuentra registrado un usuario con el correo electronico "${data.correoElectronico}".`);

        if (existeUsuario.usuario === data.usuario) throw new Error(`Ya se encuentra registrado un usuario con el numero de documento "${data.usuario}".`);
      }

      if (!data?.cargos[0]) throw new Error('Debe asignar al menos 1 cargo al usuario.');

      const cargoPrincipal = await CargoRepository.findOne({ id: data.cargos[0].id }, transaccion);

      if (!cargoPrincipal) throw new Error('El cargo que se asigno al usuario, no se encuentra habilitado o no existe.');

      data.cargo = cargoPrincipal.descripcion;
      data.idCargo = cargoPrincipal.id;

      const usuarioCreado = await UsuarioRepository.createOrUpdate(data, transaccion);

      if (data.cargos.length > 0) {
        await UsuarioCargoRepository.deleteItemCond({ idUsuario: usuarioCreado.id }, transaccion);

        for (const cargo of data.cargos) {
          await UsuarioCargoRepository.deleteItemCond({ idCargo: cargo.id, estado: 'ACTIVO' }, transaccion);

          await UsuarioCargoRepository.createOrUpdate({
            idUsuario   : usuarioCreado.id,
            idCargo     : cargo.id,
            userCreated : data.userCreated || data.userUpdated
          }, transaccion);
        }
      }

      if (data.cargos.length === 0) await UsuarioRepository.createOrUpdate({ id: usuarioCreado.id, idCargo: null, cargo: null }, transaccion);

      await RolUsuarioRepository.deleteItemCond({ idUsuario: usuarioCreado.id });

      await RolUsuarioRepository.createOrUpdate({
        idUsuario   : usuarioCreado.id,
        idRol       : data.rol.id,
        userCreated : data.userCreated || data.userUpdated
      }, transaccion);

      await transaction.commit(transaccion);
      return usuarioCreado;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function importar (usuarios) {
    let transaccion;
    try {
      for (let index = 0; index < usuarios.length; index++) {
        transaccion = await transaction.create();
        try {
          const usuario = usuarios[index];
          usuario.usuario = usuario.numeroDocumento;
          usuario.contrasena = await AuthRepository.codificarContrasena('Developer');
          usuario.errores = [];
          usuario.fechaNacimiento = FechaHelper.formatearFecha(usuario.fechaNacimiento);

          const existeEntidad = await EntidadRepository.findOne({ codigo: usuario.codigoEntidad }, transaccion);

          if (!existeEntidad) usuario.errores.push(`La entidad con el codigo ${usuario.codigoEntidad} no existe en la linea ${index + 1}.`);

          if (existeEntidad) {
            if (existeEntidad.estado === 'INACTIVO') usuario.errores.push(`La entidad con el codigo ${usuario.codigoEntidad} esta INACTIVA en la linea ${index + 1}.`);

            const existeArea = await AreaRepository.findOne({ idEntidad: existeEntidad.id, sigla: usuario.siglaArea }, transaccion);

            if (!existeArea) usuario.errores.push(`El area/unidad con la sigla ${usuario.siglaArea} no existe o no pertenece a ${existeEntidad.nombre} en la linea ${index + 1}.`);

            if (existeArea) {
              let existeCargo = await CargoRepository.existe({ id: usuario.idCargo, nroItem: usuario.nroItem, idUnidadOrganizacional: existeArea.id }, transaccion);

              if (!existeCargo) {
                const datosCargo = {
                  nroItem                : usuario.nroItem,
                  descripcion            : usuario.descripcion,
                  nivel                  : usuario.nivel,
                  idTipoPuesto           : ID_PERSONAL_PLANTA,
                  idUnidadOrganizacional : existeArea.id,
                  userCreated            : usuario.userCreated
                };

                const configuracionCargo = {
                  idCargo                  : null,
                  idDepenenciaLinea        : null,
                  idDependenciaFuncional   : null,
                  idDependenciaFormulario  : null,
                  idDependenciaPoai        : null,
                  idApruebaViaje           : null,
                  idElaboraMemorandumViaje : null,
                  idUnidadOrganizacional   : existeArea.id,
                  userCreated              : usuario.userCreated
                };

                const { itemDependenciaFuncional, itemDependenciaLineal } = usuario;

                if (itemDependenciaFuncional) {
                  const existeDependenciaFuncional = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemDependenciaFuncional, estado: 'ACTIVO' });
                  if (existeDependenciaFuncional) configuracionCargo.idDependenciaFuncional = existeDependenciaFuncional.id;
                }

                if (itemDependenciaLineal) {
                  const existeDependenciaLineal = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemDependenciaLineal, estado: 'ACTIVO' });
                  if (existeDependenciaLineal) configuracionCargo.idDepenenciaLinea = existeDependenciaLineal.id;
                }

                existeCargo = await CargoRepository.createOrUpdate(datosCargo, transaccion);

                configuracionCargo.idUnidadOrganizacional = existeArea.id;
                configuracionCargo.idCargo = existeCargo.id;
                configuracionCargo.userCreated = usuario.userCreated;

                await ConfiguracionCargoRepository.createOrUpdate(configuracionCargo, transaccion);
              }

              usuario.idCargo = existeCargo.id;
              usuario.cargo = existeCargo.descripcion;
              usuario.idEntidad = existeEntidad.id;
              let existeUsuario = await UsuarioRepository.verificarCorreoElectronico({ id: usuario.id, correoElectronico: usuario.correoElectronico, usuario: usuario.usuario }, transaccion);

              if (!existeUsuario) existeUsuario = await UsuarioRepository.createOrUpdate(usuario, transaccion);

              const existeRolUsuario = await RolUsuarioRepository.findOne({ idUsuario: existeUsuario.id }, transaccion);
              if (!existeRolUsuario) await RolUsuarioRepository.createOrUpdate({ idUsuario: existeUsuario.id, idRol: ROL_DEFECTO, userCreated: usuario.userCreated }, transaccion);

              await UsuarioCargoRepository.deleteItemCond({ idCargo: existeCargo.id }, transaccion);
              await UsuarioCargoRepository.createOrUpdate({ idCargo: existeCargo.id, idUsuario: existeUsuario.id, userCreated: usuario.userCreated }, transaccion);
            }
          }

          if (usuario.errores.length > 0)  await transaction.rollback(transaccion);
          if (usuario.errores.length === 0)  await transaction.commit(transaccion);
        } catch (error) {
          await transaction.rollback(transaccion);
        }
      }

      return usuarios;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }
  async function cambiarTodasContrasenas () {
    let transaccion;

    try {
      transaccion = await transaction.create();
      const usuarios = await UsuarioRepository.findAll({ estado: 'ACTIVO' }, false);
      for (let i = 0; i < usuarios.rows.length; i++) {
        const usuario = usuarios.rows[i];
        if (!usuario.numeroDocumento || !usuario.fechaNacimiento || usuario.usuario === 'admin') {
          continue;
        }
        // const nombreUsuario = `${(usuario.primerApellido || '').split('')[0] || ''}${(usuario.segundoApellido || '').split('')[0] || ''}${(usuario.nombres || '').split('')[0] || ''}`
        // const newPassword = `${nombreUsuario}.${usuario.numeroDocumento}` //`${usuario.numeroDocumento}.${usuario.fechaNacimiento.split('-').reverse().join('')}`;
        
        const newPassword = `${usuario.fechaNacimiento.split('-').reverse().join('')}.${usuario.numeroDocumento}`;
        
        const contrasena = await AuthRepository.codificarContrasena(newPassword);
        const cambios = { id: usuario.id, usuario: usuario.usuario, contrasena };
        await UsuarioRepository.cambiarContrasena(cambios, transaccion);
      }
      await transaction.commit(transaccion);
      const message = 'usuario y contrasena actualizado ';
      return message;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function sincronizar (datos) {
    let transaccion;
    try {
      const initStatus = {
        method  : 'GET',
        url     : `${config.app.servicios.srh.url}/api/srh/datos-persona/${datos.nroDocumento}/informacion`,
        headers : { Authorization: `Bearer ${config.app.servicios.srh.iopToken || ''}`},
      };
      const { data } = await axios.request(initStatus)
      return data.datos
    } catch (error) {
      console.error('------------------------ ERROR SRH REQUEST ------------------------\n', error);
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
      return null
    }
  }

  return {
    importar,
    crearUsuario,
    verificarCi,
    findByCi,
    findOneEdicion,
    findOne,
    cambiarEstado,
    actualizarHorarios,
    listarRemitentes,
    getResponse,
    cambiarContrasena,
    asignarRoles,
    listarUsuarios,
    listadoReducido,
    mostrar,
    createOrUpdate,
    eliminar,
    userExist,
    cambiarTodasContrasenas,
    sincronizar
  };
};
