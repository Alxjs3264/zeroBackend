'use strict';

const debug = require('debug')('app:service:auth');
const crypto = require('crypto');
const log = require('log4js').getLogger();
const Issuer = require('openid-client').Issuer;
const { ErrorApp } = require('../../lib/error');
const url = require('url');
const { config } = require('../../../common');
const { iss } = require('../../lib/util');
const { generateToken } = require('../../../application/lib/auth');
const { rolesIds, CARGO_CIUDADANO, ID_ROL_CIUDADANO, ID_ENTIDAD_CIUDADANO, ID_USUARIO_ADMINISTRADOR, CODIGO_PARAMETRO_CONFIGURACION_ENTIDADES } = require('../../../common/config/constants');
const moment = require('moment');
const { bandejaExterna } = require('../../../common/config/app');

module.exports = function authService (repositories, helpers, res) {
  const { FechaHelper } = helpers;

  const {
    AuthRepository,
    UsuarioRepository,
    PersonaRepository,
    SuscripcionRepository,
    ParametroRepository,
    MenuRepository,
    transaction,
    PermisoRepository,
    RolUsuarioRepository,
    UsuarioCargoRepository,
    AreaRepository,
    RolRepository
  } = repositories;

  const { CargoRepository, ConfiguracionCargoRepository } = repositories.planificacion;

  const UsuarioService = require('./UsuarioService')(repositories, helpers, res);
  const issuer = new Issuer(iss);

  const cliente = new issuer.Client(config.openid.client);
  cliente.CLOCK_TOLERANCE = 5;

  async function getCode (data) {
    debug('Obtener código state');
    const state = crypto.randomBytes(16).toString('hex');
    const nonce = crypto.randomBytes(16).toString('hex');

    try {
      const authorizationRequest = Object.assign({ redirect_uri: config.openid.client.redirect_uris[0], state, nonce }, config.openid.client_params);
      log.debug('AuthorizationRequest:::::::::::::\n', authorizationRequest);
      const authorizeUrl = cliente.authorizationUrl(authorizationRequest);

      const data = {
        state,
        parametros  : { nonce },
        userCreated : '7171272e-b31b-4c34-9220-9f535c958c5c'
      };
      data.estado = 'INICIO';
      await AuthRepository.createOrUpdate(data);

      return res.success({
        url    : authorizeUrl,
        codigo : state
      });
    } catch (e) {
      return res.error(e);
    }
  }

  async function verificarVigenciaAccessToken (tokenSistema, force = false) {
    console.log('BUSCANDO TOKEN SISTEMA  =======================> ', tokenSistema);

    const registroAuth = await AuthRepository.findOne({ tokenSistema });

    if (!registroAuth) throw new Error('El token de acceso no se encuentra registrado, parece que iniciaste sesión en otro navegador, cierre sesión y vuelva a iniciar.');
    console.log('\n===============>>>>>>>>>>>>>>>>>>>> USER AUTH: ', registroAuth)

    const estadoIOP = await ParametroRepository.findOne({ grupo: 'CONFIG-IOP', codigo: 'IOP'});
    
    if (registroAuth.authCiudadania && estadoIOP.estado === 'ACTIVO') {
      
      if (!registroAuth.tokens) throw new Error('No inició con ciudadania digital.');
  
      if (!registroAuth.tokens.refresh_token) throw new Error('No se puede refrescar su token.');
  
      
      const currentUnixTimestamp = Math.floor(Date.now() / 1000)
      const tiempoLatencia = 600

      console.log('===============>>>>>>>>>>>>>>>>>>>> VERIFICACION ACCESS TOKEN: ', registroAuth.tokens.expires_at - (currentUnixTimestamp + tiempoLatencia), 'SEGUNDOS');
  
      if ((registroAuth.tokens.expires_at - tiempoLatencia) <= currentUnixTimestamp || force) {
        const nuevosDatos = await cliente.refresh(registroAuth.tokens.refresh_token);
  
        await AuthRepository.deleteItemCond({ id: registroAuth.id });
        await AuthRepository.createOrUpdate({
          ip           : registroAuth.ip,
          state        : registroAuth.state,
          parametros   : registroAuth.parametros,
          navegador    : registroAuth.navegador,
          userAgent    : registroAuth.userAgent,
          tokens       : nuevosDatos,
          idEntidad    : registroAuth.idEntidad,
          idRol        : registroAuth.idRol,
          idUsuario    : registroAuth.idUsuario,
          userCreated  : registroAuth.userCreated,
          tokenSistema : registroAuth.tokenSistema
        });
      }
    }

  }

  function transformarDatosCiudadania (claims) {
    const fechaNacimiento = FechaHelper.formatearFecha(claims.fecha_nacimiento);
    let numeroDocumento = claims.profile?.documento_identidad?.numero_documento;
    let complemento = null;

    if (claims.profile?.documento_identidad?.numero_documento.includes('-')) {
      ([numeroDocumento, complemento] = claims.profile?.documento_identidad?.numero_documento.split('-'));
    }

    return {
      numeroDocumento,
      complemento,
      tipoDocumento   : claims.profile?.documento_identidad?.tipo_documento,
      fechaNacimiento,
      nombres         : claims.profile?.nombre?.nombres,
      primerApellido  : claims.profile?.nombre?.primer_apellido || '-',
      segundoApellido : claims.profile?.nombre?.segundo_apellido || '-',
      email           : claims.email,
      celular         : claims.celular
    };
  }

  async function validarRol (usuario, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const rolesUsuario = await RolUsuarioRepository.findOne({ idUsuario: usuario.id });

      if (rolesUsuario)  return usuario;

      await RolUsuarioRepository.deleteItemCond({ idUsuario: usuario.id }, transaccion);
      const existeRol = await RolRepository.findOne({ ciudadano: true });

      if (!existeRol) throw new Error('No se encuentra la informacion necesaria para habilitar el usuario.');

      await RolUsuarioRepository.createOrUpdate({ idUsuario: usuario.id, idRol: existeRol.id, userCreated: usuario.id }, transaccion);
      if (!t) await transaction.commit(transaccion);
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function validarEntidad (usuario, entidadId, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      let idEntidad = null;

      if (usuario?.idEntidad) return usuario;

      if (usuario.idCargo) {
        const existeCargo = await CargoRepository.findOne({ id: usuario.idCargo, estado: 'ACTIVO' }, transaccion);
        if (existeCargo) {
          const existeUnidad = await AreaRepository.findOne({ id: existeCargo.unidad?.id }, transaccion);

          if (existeUnidad) idEntidad = existeUnidad.idEntidad;
        }
      }

      idEntidad = entidadId || ID_ENTIDAD_CIUDADANO;

      const usuarioActualizado = await UsuarioRepository.createOrUpdate({ id: usuario.id, idEntidad: idEntidad || ID_ENTIDAD_CIUDADANO, userCreated: usuario.id }, transaccion);

      if (!t) await transaction.commit(transaccion);

      return usuarioActualizado;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function validarCargo (usuario, cargo, t) {
    if (usuario?.idCargo) return usuario;

    let transaccion;
    try {
      transaccion = t || await transaction.create();

      const cargoCiudadano = await crearCargoCiudadano(usuario, cargo, transaccion);
      await UsuarioCargoRepository.createOrUpdate({ idUsuario: usuario.id, idCargo: cargoCiudadano.id, userCreated: usuario.userCreated }, transaccion);
      if (!t) await transaction.commit(transaccion);
      return cargoCiudadano;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function crearCargoCiudadano (datosPersona, cargo, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      const datosCargo = {
        nroItem                : cargo.nroItem,
        descripcion            : cargo.descripcion,
        idTipoPuesto           : cargo.idTipoPuesto,
        estado                 : cargo.estado,
        nivel                  : cargo.nivel,
        idUnidadOrganizacional : cargo.idUnidadOrganizacional,
        userCreated            : ID_USUARIO_ADMINISTRADOR
      };
      datosCargo.nroItem += datosPersona.numeroDocumento;
      const cargoCiudadano = await CargoRepository.createOrUpdate(datosCargo, transaccion);

      const datosConfiguracionCargo = {
        idCargo                  : cargoCiudadano.id,
        idDepenenciaLinea        : cargo.configuracionCargos[0].idDepenenciaLinea,
        idDependenciaFuncional   : cargo.configuracionCargos[0].idDependenciaFuncional,
        idDependenciaFormulario  : cargo.configuracionCargos[0].idDependenciaFormulario,
        idDependenciaPoai        : cargo.configuracionCargos[0].idDependenciaPoai,
        idApruebaViaje           : cargo.configuracionCargos[0].idApruebaViaje,
        idElaboraMemorandumViaje : cargo.configuracionCargos[0].idElaboraMemorandumViaje,
        idUnidadOrganizacional   : cargo.configuracionCargos[0].idUnidadOrganizacional,
        userCreated              : ID_USUARIO_ADMINISTRADOR
      };

      datosConfiguracionCargo.idCargo = cargoCiudadano.id;
      await ConfiguracionCargoRepository.createOrUpdate(datosConfiguracionCargo, transaccion);

      if (datosPersona.id) await UsuarioRepository.createOrUpdate({ id: datosPersona.id, idCargo: cargoCiudadano.id, cargo: cargoCiudadano.descripcion }, transaccion);

      if (!t) await transaction.commit(transaccion);
      return cargoCiudadano;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function crearUsuarioCiudadano (datosPersona, cargoCiudadano, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      const usuarioCreado = await UsuarioRepository.createOrUpdate({
        ...datosPersona,
        estado      : 'ACTIVO',
        contrasena  : '$2b$10$RdiL/i2mFvInlOzX.trVh.bgfxNDnmDpW5nXfLzmHYuf8u1H5/Q52',
        idCargo     : cargoCiudadano.id,
        cargo       : cargoCiudadano.descripcion,
        idEntidad   : cargoCiudadano.idEntidad,
        roles       : cargoCiudadano.idRol,
        userCreated : ID_USUARIO_ADMINISTRADOR
      }, transaccion);

      await UsuarioCargoRepository.createOrUpdate({
        idUsuario   : usuarioCreado.id,
        idCargo     : cargoCiudadano.id,
        userCreated : usuarioCreado.userCreated
      }, transaccion);

      if (!t) await transaction.commit(transaccion);
      return usuarioCreado;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function authorizate (req, info) {
    debug('Autorizar código');
    let user;
    let respuesta;
    try {
      const params = cliente.callbackParams(req);

      if (!params.state) throw new Error('Parámetro state es requerido.');

      if (!params.code) throw new Error('Parámetro code es requerido.');

      const parametros = { state: params.state, estado: 'INICIO' };

      const resultadoState = await AuthRepository.findOne(parametros);

      if (!resultadoState) throw new Error('Los códigos de verificacion no coinciden. Intente nuevamente.');

      const respuestaCode = await cliente.callback(cliente.redirect_uris[0], params, { nonce: resultadoState.parametros.nonce, state: resultadoState.state });

      resultadoState.tokens = respuestaCode;
      const claims = await cliente.userinfo(respuestaCode.access_token);

      const datosPersona = transformarDatosCiudadania(claims);

      const dataPersona = { numeroDocumento: datosPersona.numeroDocumento, fechaNacimiento: datosPersona.fechaNacimiento };
      if (datosPersona.complemento) dataPersona.complemento = datosPersona.complemento;

      const existeUsuario = await UsuarioRepository.existe(dataPersona);

      console.log('==========_DESDE_DATOS_CLAIMS_==========');
      console.log(dataPersona, existeUsuario, claims);
      console.log('==========_DESDE_DATOS_CLAIMS_==========');

      if (existeUsuario) {
        const transaccion = await transaction.create();
        try {
          if (existeUsuario  && bandejaExterna) {
            if (existeUsuario?.estado === 'INACTIVO') await UsuarioRepository.createOrUpdate({ id: existeUsuario.id, estado: 'ACTIVO' }, transaccion);

            const cargo = await CargoRepository.findOne({ ciudadano: true });

            await validarRol(existeUsuario, transaccion);
            await validarCargo(existeUsuario, cargo, transaccion);
            await validarEntidad(existeUsuario, cargo?.unidad?.idEntidad, transaccion);
          }

          user = await UsuarioRepository.login({ usuario: existeUsuario.usuario }, transaccion);

          if (user.estado !== 'ACTIVO') throw new Error('El usuario no esta ACTIVO en el sistema. Consulte con el administrador del sistema.');

          respuesta = await getResponse(user);
          resultadoState.idUsuario = user.id;
          resultadoState.estado = 'ACTIVO';
          resultadoState.tokenSistema = respuesta.token;
          await AuthRepository.deleteItemCond({ idUsuario: user.id }, transaccion);
          await AuthRepository.createOrUpdate(resultadoState, transaccion);
          await transaction.commit(transaccion);
        } catch (error) {
          await transaction.rollback(transaccion);
          throw new ErrorApp(error.message, 400);
        }
      } else {
        if (!bandejaExterna) throw new Error('El usuario no existe o no esta habilitado.');

        const transaccion = await transaction.create();
        const datosCargo = JSON.parse(JSON.stringify(CARGO_CIUDADANO.CARGO));
        datosCargo.nroItem += datosPersona.numeroDocumento;
        let usuarioCreado;
        try {
          const cargo = await CargoRepository.findOne({ ciudadano: true });

          if (!cargo) throw new Error('No se encuentra la informacion necesaria para habilitar el usuario.');

          const rol = await RolRepository.findOne({ ciudadano: true });

          if (!rol) throw new Error('No se encuentra la informacion necesaria para habilitar el usuario.');

          const cargoCiudadano = await crearCargoCiudadano(datosPersona, cargo, transaccion);

          cargoCiudadano.idEntidad = cargo.unidad.idEntidad;
          cargoCiudadano.idRol = rol.id;

          usuarioCreado = await crearUsuarioCiudadano(datosPersona, cargoCiudadano, transaccion);

          await RolUsuarioRepository.createOrUpdate({
            idUsuario   : usuarioCreado.id,
            idRol       : ID_ROL_CIUDADANO,
            userCreated : usuarioCreado.userCreated || usuarioCreado.userUpdated
          }, transaccion);

          await transaction.commit(transaccion);
        } catch (error) {
          await transaction.rollback(transaccion);
          throw new ErrorApp(error.message, 400);
        }

        const existeUsuario = await UsuarioRepository.login({ usuario: usuarioCreado.usuario });

        console.log('==========_LOGIN_==========');
        console.log(existeUsuario);

        respuesta = await getResponse(existeUsuario);

        resultadoState.idUsuario = usuarioCreado.id;
        resultadoState.estado = 'ACTIVO';
        resultadoState.tokenSistema = respuesta.token;

        console.log(respuesta);

        await AuthRepository.createOrUpdate(resultadoState);
      }
      return res.success(respuesta);
    } catch (error) {
      console.log('==========_DESDE_ERROR_==========');
      console.log(error);
      console.log('==========_DESDE_ERROR_==========');
      throw new ErrorApp(error.message, 400);
    }
  }

  async function refreshToken (datos) {
    try {
      const existeToken = await AuthRepository.findOne({ tokenSistema: datos.token, idUsuario: datos.idUsuario });
      if (!existeToken) throw new Error('El token no es valido.');

      const existeUsuario = await UsuarioRepository.findById(datos.idUsuario);

      if (!existeUsuario) throw new Error('No existe el usuario.');

      const cargo = await CargoRepository.findOne({ id: datos.idCargo });

      if (!cargo) throw new Error('El cargo no existe.');

      await UsuarioRepository.createOrUpdate({ id: existeUsuario.id, idCargo: datos.idCargo, cargo: cargo.descripcion });

      const  user = await UsuarioRepository.login({ usuario: existeUsuario.usuario });
      const respuesta = await getResponse(user);

      await AuthRepository.deleteItemCond({ idUsuario: datos.idUsuario });

      await AuthRepository.createOrUpdate({
        ip           : existeToken.ip,
        state        : existeToken.state,
        estado       : 'ACTIVO',
        parametros   : existeToken.parametros,
        navegador    : existeToken.navegador,
        userAgent    : existeToken.userAgent,
        tokens       : existeToken.tokens,
        idEntidad    : existeToken.idEntidad,
        idRol        : existeToken.idRol,
        idUsuario    : existeToken.idUsuario,
        tokenSistema : respuesta.token,
        userCreated  : datos.idUsuario
      });

      delete respuesta.contrasena;
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function logout (code, usuario) {
    debug('Salir del sistema');
    let resultUrl;
    const urlExit = '/statics/oauth/logout.html';
    try {
      const user = await UsuarioRepository.findOne({ id: usuario.id });
      if (user) {
        const parametros = {
          state     : code,
          idUsuario : user.id,
          estado    : 'ACTIVO'
        };
        const result = await AuthRepository.findOne(parametros);

        if (!result) throw new Error('Cierre de sesión.');

        if (result) {
          await AuthRepository.createOrUpdate({ id: result.id, estado: 'INACTIVO' });
          resultUrl = getUrl(result);
        } else {
          resultUrl = urlExit;
        }
      } else {
        resultUrl = urlExit;
      }
      log.debug('======== LOGOUT EXITOSO ========');
      log.debug(resultUrl);
      return res.success({ url: resultUrl });
    } catch (e) {
      return res.error(e);
    }
  }

  function getUrl (data) {
    return url.format(Object.assign(url.parse(issuer.end_session_endpoint), {
      search : null,
      query  : {
        id_token_hint            : data.tokens.id_token,
        post_logout_redirect_uri : cliente.post_logout_redirect_uris[0]
      }
    }));
  }

  async function verificarPermisos (params) {
    try {
      const permisos = await PermisoRepository.verificarPermisos(params);
      return permisos;
    } catch (error) {
      error.log(error)
    }
  }

  async function getMenusRoles (roles) {
    const idRoles = roles.map(x => x.id);
    const { rows } = await MenuRepository.findByRoles(idRoles);
    return rows;
  }

  async function getPermisos (roles) {
    const idRoles = roles.map(x => x.id);
    const { rows } = await PermisoRepository.findByRoles(idRoles);
    const permisos = {};
    for (const permiso of rows) {
      permisos[permiso.nombre] = true;
    }
    return permisos;
  }

  async function getResponse (usuario) {
    try {
      usuario.menu = await getMenusRoles(usuario.roles);
      usuario.permisos = await getPermisos(usuario.roles);
      usuario.idRol = usuario.roles[0].id;
      usuario.token = await generateToken(ParametroRepository, {
        idRoles           : usuario.roles.map(x => x.id),
        idUsuario         : usuario.id,
        celular           : usuario.celular,
        correoElectronico : usuario.correoElectronico,
        usuario           : usuario.usuario,
        idEntidad         : usuario.entidad.id,
        idCargo           : usuario.idCargo
      });

      return usuario;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function login (usuario, contrasena, request) {
    try {
      const existeUsuario = await UsuarioRepository.login({ usuario });

      if (!existeUsuario)  throw new Error('No existe el usuario.');

      const respuestaVerificacion = await AuthRepository.verificarContrasena(contrasena, existeUsuario.contrasena);

      if (!respuestaVerificacion) throw new Error('Error en su usuario o su contraseña.');

      delete existeUsuario.contrasena;

      if (!existeUsuario.entidad) throw new Error('El usuario no existe, esta INACTIVO o no tiene una ENTIDAD asignada');

      if (!existeUsuario.roles[0]) throw new Error('El usuario no existe, esta INACTIVO o no tiene un ROL asignadd');

      const respuesta = await getResponse(existeUsuario);
      await AuthRepository.deleteItemCond({ idUsuario: existeUsuario.id });
      await AuthRepository.createOrUpdate({
        ip           : request.ipInfo.ip,
        navegador    : request.ipInfo.navigator,
        userAgent    : request.headers['user-agent'],
        token        : respuesta.token,
        idUsuario    : existeUsuario.id,
        idRol        : existeUsuario.roles.map(x => x.id).join(','),
        idEntidad    : existeUsuario.entidad.id,
        userCreated  : existeUsuario.id,
        tokenSistema : respuesta.token,
        authCiudadania : false
      });
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function getSubscription (idUsuario) {
    const subscriptions = await SuscripcionRepository.findOne({ idUsuario });
    return subscriptions;
  }

  async function registrarNuevoPostulante (datosPersona, transaccion) {
    debug(`Registrar nuevo postulante: ${datosPersona.numeroDocumento}`);

    let personaNueva;
    try {
      personaNueva = await PersonaRepository.createOrUpdate(datosPersona);
    } catch (err) {
      log.debug('Error al registrar datos de la nueva persona');
      log.debug(err);
      throw new ErrorApp(`Error al registrar datos de la nueva persona ${datosPersona.numeroDocumento}`, 400);
    }

    let usuarioNuevo;
    try {
      usuarioNuevo = await UsuarioService.createOrUpdate({
        id_persona  : personaNueva.id,
        usuario     : personaNueva.numeroDocumento,
        roles       : [rolesIds.postulante],
        cargo       : 'postulante',
        idEntidad   : 3, // TODO: cambiar ciudadanos
        userCreated : 1  // TODO: ver que usuario deberia ser el creador
      });
    } catch (err) {
      log.debug('Error al registrar datos del nuevo usuario');
      log.debug(err);
      throw new ErrorApp(`Error al registrar datos del nuevo usuario ${datosPersona.numeroDocumento}`, 400);
    }
    log.debug('usuario nuevo', usuarioNuevo);
    log.debug('persona y usuario registrados.....');
    return [personaNueva, usuarioNuevo];
  }

  async function verificarPermisosAplicacion (params) {
    try {
      const permisos = await PermisoRepository.verificarPermisosAplicacion(params);
      return permisos;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function verificarPermisoEntidades (req, permisos) {
    try {
      const existeConfiguracion = await ParametroRepository.findOne({ codigo: CODIGO_PARAMETRO_CONFIGURACION_ENTIDADES, estado: 'ACTIVO' });

      if (existeConfiguracion) {
        const tienePermiso = await PermisoRepository.verificarPermisos({ roles: req.user.idRoles, permisos });

        if (tienePermiso) req.query.idEntidad = req.user.idEntidad;
      }

      return req;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    verificarPermisoEntidades,
    verificarPermisosAplicacion,
    verificarVigenciaAccessToken,
    getSubscription,
    getMenusRoles,
    verificarPermisos,
    login,
    getCode,
    refreshToken,
    authorizate,
    logout
  };
};
