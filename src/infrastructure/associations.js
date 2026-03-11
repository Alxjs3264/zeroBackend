'use strict';

// Definiendo asociaciones de las tablas
module.exports = function associations (models) {
  const {
    apitokenEndpoint,
    aprobacionDocumentos,
    archivoAdjunto,
    rol,
    aplicacion,
    aplicacionPermiso,
    area,
    areaUsuario,
    auth,
    correlativo,
    documento,
    referenciaDocumento,
    flujoDocumental,
    derivacion,
    usuario,
    permiso,
    entidad,
    rolPermiso,
    rolUsuario,
    rolMenu,
    menu,
    parametro,
    formulario,
    usuarioCargo,
    flujoDerivacion,
    SolicitudPlantilla,
    Paso,
    PasoSiguiente,
    PasoAnterior,
    PasoObservacion,
    PasoActual,
    Publicacion,
    DocumentoCompartido,
    DocumentoObservacion,
    Carpeta,
    PermisoSolicitud,
    EntidadUsuario,
    EntidadFlujoDocumental,
    PermisoFormulario
  } = models;

  const {
    ConfiguracionCargo,
    Cargo
  } = models.planificacion;

  menu.belongsTo(menu, { foreignKey: { name: 'idMenu' }, as: 'menuPadre' });
  menu.hasMany(menu,  { foreignKey: { name: 'idMenu' }, as: 'menus' });

  auth.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuario' });
  usuario.hasMany(auth,  { foreignKey: { name: 'idUsuario' }, as: 'sesiones' });

  rol.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
  entidad.hasMany(rol,  { foreignKey: { name: 'idEntidad' }, as: 'roles' });

  aplicacion.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
  entidad.hasMany(aplicacion,  { foreignKey: { name: 'idEntidad' }, as: 'aplicaciones' });

  entidad.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'eEntidadntidadPadre' });
  entidad.hasMany(entidad,  { foreignKey: { name: 'idEntidad' }, as: 'Solicitud' });

  usuario.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
  entidad.hasMany(usuario,  { foreignKey: { name: 'idEntidad' }, as: 'usuarios' });

  usuario.belongsTo(Cargo, { foreignKey: { name: 'idCargo' }, as: 'cargoUsuario' });
  Cargo.hasMany(usuario,  { foreignKey: { name: 'idCargo' } });

  rol.belongsToMany(menu, { through: { model: rolMenu, unique: false }, as: 'menus', foreignKey: 'idRol' });
  menu.belongsToMany(rol, { through: { model: rolMenu, unique: false }, as: 'roles', foreignKey: 'idMenu' });

  // USUARIO CARGO
  usuarioCargo.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuario' });
  usuario.hasMany(usuarioCargo,  { foreignKey: { name: 'idUsuario' }, as: 'usuarioCargo' });

  usuarioCargo.belongsTo(Cargo, { foreignKey: { name: 'idCargo' }, as: 'cargo' });
  Cargo.hasMany(usuarioCargo,  { foreignKey: { name: 'idCargo' }, as: 'usuarioCargo' });
  // USUARIO CARGO

  rol.belongsToMany(permiso, { through: { model: rolPermiso, unique: false }, as: 'permisos', foreignKey: 'idRol' });
  permiso.belongsToMany(rol, { through: { model: rolPermiso, unique: false }, as: 'roles', foreignKey: 'idPermiso' });

  // aprobacion documentos
  aprobacionDocumentos.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuario' });
  usuario.hasMany(aprobacionDocumentos, { foreignKey: { name: 'idUsuario' }, as: 'documentosAprobadosCiudadania' });

  aprobacionDocumentos.belongsTo(flujoDocumental, { foreignKey: { name: 'idFlujo' }, as: 'flujoDocumental' });
  flujoDocumental.hasMany(aprobacionDocumentos, { foreignKey: { name: 'idFlujo' }, as: 'aprobacionFlujo' });

  aprobacionDocumentos.belongsTo(documento, { foreignKey: { name: 'idDocumento' }, as: 'documentoAprobado' });
  documento.hasMany(aprobacionDocumentos, { foreignKey: { name: 'idDocumento' }, as: 'aprobacionesCiudadania' });

  referenciaDocumento.belongsTo(documento, { foreignKey: { name: 'idDocumentoReferenciado' }, as: 'documentoReferenciado' });
  documento.hasMany(referenciaDocumento, { foreignKey: { name: 'idDocumentoReferenciado' }  });

  // Roles de usuario
  usuario.belongsToMany(rol,  { through: { model: rolUsuario, unique: false }, as: 'roles', foreignKey: 'idUsuario' });
  rol.belongsToMany(usuario, { through: { model: rolUsuario, unique: false }, as: 'usuarios', foreignKey: 'idRol' });

  auth.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuarioSesion' });
  usuario.hasMany(auth,  { foreignKey: { name: 'idUsuario' }, as: 'sesionesUsuario' });

  auth.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidadSesion' });
  entidad.hasMany(auth,  { foreignKey: { name: 'idEntidad' }, as: 'sesionesEntidad' });

  Cargo.belongsTo(area, { foreignKey: { name: 'idUnidadOrganizacional' }, as: 'unidad' });
  area.hasMany(Cargo, { foreignKey: { name: 'idUnidadOrganizacional' } }, 'cargo');

  // PLANIFICACION
  ConfiguracionCargo.belongsTo(Cargo, { foreignKey: { name: 'idCargo' }, as: 'cargo' });
  Cargo.hasMany(ConfiguracionCargo,  { foreignKey: { name: 'idCargo' }, as: 'configuracionCargos' });

  Cargo.belongsTo(parametro, { foreignKey: { name: 'idTipoPuesto' }, as: 'tipoPuesto' });
  parametro.hasMany(Cargo, { foreignKey: { name: 'idTipoPuesto' } });

  // -- gestion documental

  usuario.belongsToMany(area, { through: { model: areaUsuario, unique: false }, as: 'areas', foreignKey: 'idUsuario' });
  area.belongsToMany(usuario, { through: { model: areaUsuario, unique: false }, as: 'usuarios', foreignKey: 'idArea' });

  derivacion.belongsTo(flujoDocumental, { foreignKey: { name: 'idFlujo' }, as: 'flujoDocumental' });
  flujoDocumental.hasMany(derivacion,  { foreignKey: { name: 'idFlujo' }, as: 'derivaciones' });

  // archivos adjuntos
  archivoAdjunto.belongsTo(documento, { foreignKey: { name: 'idDocumento' }, as: 'documento' });
  documento.hasMany(archivoAdjunto,  { foreignKey: { name: 'idDocumento' }, as: 'archivosAdjuntos' });

  // documento
  documento.belongsTo(flujoDocumental, { foreignKey: { name: 'idFlujo' }, as: 'flujoDocumental' });
  flujoDocumental.hasMany(documento,  { foreignKey: { name: 'idFlujo' }, as: 'documentos' });

  documento.belongsTo(documento, { foreignKey: { name: 'idDocumentoPadre' }, as: 'documentoAntecesor' });
  documento.hasOne(documento,  { foreignKey: { name: 'idDocumentoPadre' }, as: 'documentoHijo' });

  // derivaciones

  derivacion.belongsTo(documento, { foreignKey: { name: 'idDocumento' }, as: 'documento' });
  documento.hasMany(derivacion,  { foreignKey: { name: 'idDocumento' }, as: 'derivaciones' });

  derivacion.belongsTo(usuario, { foreignKey: { name: 'usuarioInicial' }, as: 'de' });
  usuario.hasMany(derivacion,  { foreignKey: { name: 'usuarioInicial' }, as: 'derivacionUsuarioInicial' });

  derivacion.belongsTo(usuario, { foreignKey: { name: 'usuarioFinal' }, as: 'para' });
  usuario.hasMany(derivacion,  { foreignKey: { name: 'usuarioFinal' }, as: 'derivacionUsuarioFinal' });

  // apitoken endpoint
  apitokenEndpoint.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuario' });
  usuario.hasMany(apitokenEndpoint,  { foreignKey: { name: 'idUsuario' }, as: 'apitokens' });

  // GESTION DOCUMENTAL
  formulario.belongsTo(usuario, { foreignKey: { name: '_user_created' }, as: 'usuarioCreacion' });

  formulario.belongsTo(parametro, { foreignKey: { name: 'idCategoria' }, as: 'categoria' });

  flujoDerivacion.belongsTo(Paso, { foreignKey: 'idPaso', as: 'paso' });
  Paso.hasMany(flujoDerivacion, { foreignKey: 'idPaso', as: 'flujoDerivaciones' });

  flujoDerivacion.belongsTo(documento, { foreignKey: 'idDocumento', as: 'documento' });
  documento.hasMany(flujoDerivacion, { foreignKey: 'idDocumento', as: 'flujoDerivaciones' });

  flujoDerivacion.belongsTo(flujoDocumental, { foreignKey: { name: 'idFlujo' }, as: 'flujoDocumental' });
  flujoDocumental.hasMany(flujoDerivacion, { foreignKey: { name: 'idFlujo' }, as: 'flujoDerivaciones' });

  flujoDerivacion.belongsTo(usuario, { foreignKey: 'idUsuarioRemitente', as: 'usuarioRemitente' });
  usuario.hasMany(flujoDerivacion, { foreignKey: 'idUsuarioRemitente', as: 'flujoDerivacionesRemitente' });

  flujoDerivacion.belongsTo(usuario, { foreignKey: 'idUsuarioDestinatario', as: 'usuarioDestinatario' });
  usuario.hasMany(flujoDerivacion, { foreignKey: 'idUsuarioDestinatario', as: 'flujoDerivacionesDestinatario' });
  // FIN GESTION DOCUMENTAL

  correlativo.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
  entidad.hasMany(correlativo,  { foreignKey: { name: 'idEntidad' }, as: 'correlativos' });

  correlativo.belongsTo(area, { foreignKey: { name: 'idUnidadOrganizacional' }, as: 'unidadOrganizacional' });
  area.hasMany(correlativo,  { foreignKey: { name: 'idUnidadOrganizacional' }, as: 'correlativos' });

  correlativo.belongsTo(formulario, { foreignKey: { name: 'idFormulario' }, as: 'formulario' });
  formulario.hasMany(correlativo,  { foreignKey: { name: 'idFormulario' }, as: 'correlativos' });

  flujoDerivacion.belongsTo(parametro, { foreignKey: { name: 'idAccion' }, as: 'accion' });
  parametro.hasOne(flujoDerivacion,  { foreignKey: { name: 'idAccion' }, as: 'flujoDerivacion' });

  Paso.belongsTo(SolicitudPlantilla, { foreignKey: { name: 'idSolicitudPlantilla' }, as: 'solicitudPlantilla' });
  SolicitudPlantilla.hasMany(Paso,  { foreignKey: { name: 'idSolicitudPlantilla' }, as: 'pasos' });

  flujoDocumental.belongsTo(SolicitudPlantilla, { foreignKey: { name: 'idSolicitudPlantilla' }, as: 'solicitudPlantilla' });
  SolicitudPlantilla.hasMany(flujoDocumental,  { foreignKey: { name: 'idSolicitudPlantilla' }, as: 'flujosDocumentales' });

  Paso.belongsTo(formulario,  { foreignKey: { name: 'idFormulario' }, as: 'formulario' });

  Paso.hasMany(PasoSiguiente,  { foreignKey: { name: 'idPaso' }, as: 'pasosSiguientes' });
  PasoSiguiente.belongsTo(Paso, { foreignKey: { name: 'idPasoSiguiente' }, as: 'pasoSiguiente' });

  Paso.hasMany(PasoAnterior,  { foreignKey: { name: 'idPaso' }, as: 'pasosAnteriores' });
  PasoAnterior.belongsTo(Paso, { foreignKey: { name: 'idPasoAnterior' }, as: 'pasoAnterior' });

  Paso.hasMany(PasoObservacion,  { foreignKey: { name: 'idPaso' }, as: 'pasosObservacion' });
  PasoObservacion.belongsTo(Paso, { foreignKey: { name: 'idPasoObservacion' }, as: 'pasoObservacion' });

  flujoDocumental.hasMany(PasoActual,  { foreignKey: { name: 'idFlujoDocumental' }, as: 'pasosActuales' });
  PasoActual.belongsTo(Paso, { foreignKey: { name: 'idPaso' }, as: 'pasoActual' });

  Publicacion.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuarioPublicacion' });
  usuario.hasMany(Publicacion,  { foreignKey: { name: 'idUsuario' }, as: 'publicaciones' });

  flujoDocumental.belongsTo(usuario, { foreignKey: { name: '_user_created' }, as: 'usuarioCreacion' });
  usuario.hasMany(flujoDocumental,  { foreignKey: { name: '_user_created' }, as: 'flujosDocumentales' });

  DocumentoCompartido.belongsTo(documento, { foreignKey: { name: 'idDocumento' }, as: 'documento' });
  documento.hasMany(DocumentoCompartido,  { foreignKey: { name: 'idDocumento' }, as: 'documentosCompartidos' });

  DocumentoCompartido.belongsTo(usuario, { foreignKey: { name: 'idUsuarioOrigen' }, as: 'usuarioOrigen' });
  usuario.hasMany(DocumentoCompartido,  { foreignKey: { name: 'idUsuarioOrigen' }, as: 'documentosCompartidos' });

  area.belongsTo(usuario, { foreignKey: { name: 'usuarioResponsable' }, constraints: false, as: 'usuarioResponsableArea' });
  usuario.hasOne(area,  { foreignKey: { name: 'usuarioResponsable' }, constraints: false, as: 'area' });

  flujoDocumental.belongsTo(Carpeta, { foreignKey: { name: 'idCarpeta' }, as: 'carpeta' });
  Carpeta.hasMany(flujoDocumental,  { foreignKey: { name: 'idCarpeta' }, as: 'flujosDocumentales' });

  archivoAdjunto.belongsTo(usuario, { foreignKey: { name: '_user_created' }, as: 'usuarioCreacion' });
  usuario.hasMany(archivoAdjunto,  { foreignKey: { name: '_user_created' }, as: 'archivosAdjuntosCreacion' });

  archivoAdjunto.belongsTo(usuario, { foreignKey: { name: '_user_updated' }, as: 'usuarioActualizacion' });
  usuario.hasMany(archivoAdjunto,  { foreignKey: { name: '_user_updated' }, as: 'archivosAdjuntosActualizacion' });

  SolicitudPlantilla.belongsToMany(entidad, { through: { model: PermisoSolicitud, unique: false }, as: 'entidadesSolicitud', foreignKey: 'idSolicitudPlantilla' });
  entidad.belongsToMany(SolicitudPlantilla, { through: { model: PermisoSolicitud, unique: false }, as: 'solicitudesEntidad', foreignKey: 'idEntidad' });

  SolicitudPlantilla.belongsToMany(area, { through: { model: PermisoSolicitud, unique: false }, as: 'areasSolicitud', foreignKey: 'idSolicitudPlantilla' });
  area.belongsToMany(SolicitudPlantilla, { through: { model: PermisoSolicitud, unique: false }, as: 'solicitudesArea', foreignKey: 'idArea' });

  area.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
  entidad.hasMany(area,  { foreignKey: { name: 'idEntidad' }, as: 'area' });

  aplicacion.belongsToMany(permiso, { through: { model: aplicacionPermiso, unique: false }, as: 'permisos', foreignKey: 'idAplicacion' });
  permiso.belongsToMany(aplicacion, { through: { model: aplicacionPermiso, unique: false }, as: 'aplicaciones', foreignKey: 'idPermiso' });

  usuario.belongsToMany(entidad, { through: { model: EntidadUsuario, unique: false }, as: 'entidades', foreignKey: 'idUsuario' });
  entidad.belongsToMany(usuario, { through: { model: EntidadUsuario, unique: false }, as: 'funcionarios', foreignKey: 'idEntidad' });

  flujoDocumental.belongsToMany(entidad, { through: { model: EntidadFlujoDocumental, unique: false }, as: 'entidades', foreignKey: 'idFlujoDocumental' });
  entidad.belongsToMany(flujoDocumental, { through: { model: EntidadFlujoDocumental, unique: false }, as: 'flujos', foreignKey: 'idEntidad' });

  permiso.belongsTo(menu, { foreignKey: { name: 'idMenu' }, as: 'menu' });
  menu.hasMany(permiso,  { foreignKey: { name: 'idMenu' }, as: 'permisos' });

  formulario.belongsToMany(entidad, { through: { model: PermisoFormulario, unique: false }, as: 'entidadesFormulario', foreignKey: 'idFormulario' });
  entidad.belongsToMany(formulario, { through: { model: PermisoFormulario, unique: false }, as: 'formulariosEntidad', foreignKey: 'idEntidad' });

  formulario.belongsToMany(area, { through: { model: PermisoFormulario, unique: false }, as: 'areasFormulario', foreignKey: 'idFormulario' });
  area.belongsToMany(formulario, { through: { model: PermisoFormulario, unique: false }, as: 'formulariosArea', foreignKey: 'idArea' });

  DocumentoObservacion.belongsTo(documento, { foreignKey: { name: 'idDocumento' }, as: 'documento' });
  DocumentoObservacion.belongsTo(usuario, { foreignKey: { name: 'idUsuarioRevisor' }, as: 'revisor' });
  documento.hasMany(DocumentoObservacion,  { foreignKey: { name: 'idDocumento' }, as: 'observaciones' });

  Publicacion.belongsTo(parametro, { foreignKey: { name: 'idCategoria' }, as: 'categoria' });
  
  return models;
};
