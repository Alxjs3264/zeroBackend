const debug = require('debug')('app:service:FlujoDerivacion');
const { ErrorApp } = require('../../lib/error');

module.exports = function CorrelativoService (repositories, helpers, res) {
  const {
    FlujoDerivacionRepository,
    CorrelativoRepository,
    UsuarioRepository,
    AreaRepository,
    EntidadRepository,
    FormularioRepository,
    ParametroRepository, transaction
  } = repositories;
  const { CargoRepository } = repositories.planificacion;

  async function listar (params) {
    try {
      const documentos = await FlujoDerivacionRepository.findAll(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function cantidades (params) {
    try {
      if (params) {
        params.documentos = true
        params.entrada = true
        params.pendiente = true
        params.firma = true
        params.compartido = true
      }
      const documentos = await FlujoDerivacionRepository.cantidades(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarCodigoFlujo (idEntidad, idUnidadOrganizacional, userCreated, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      const fechaAcual = new Date();
      const gestion = fechaAcual.getFullYear();
      const _existeCorrelativo = await CorrelativoRepository.findOne({ idEntidad, idFormulario: null, gestion, estado: 'ACTIVO' }, transaccion);
      const unidadOrganizacional = await AreaRepository.findOne({ id: idUnidadOrganizacional }, transaccion);
      let usarPrefijo = true;

      if (!unidadOrganizacional) throw new Error('Error al generar codigo de hora de ruta, no existe la unidad organizacional.');

      if (_existeCorrelativo) {
        usarPrefijo = _existeCorrelativo.entidad.usarPrefijo ?? true;
        const nuevoCorrelativo = _existeCorrelativo.correlativo + 1;
        await CorrelativoRepository.createOrUpdate({ id: _existeCorrelativo.id, correlativo: nuevoCorrelativo, userUpdated: userCreated  }, transaccion);

        if (!t) await transaction.commit(transaccion);

        return {
          codigo      : `${usarPrefijo ? _existeCorrelativo.entidad.sigla + '-' : ''}${unidadOrganizacional.sigla}-${nuevoCorrelativo}-${gestion}`,
          codigoUnico : `${_existeCorrelativo.entidad.sigla}-${nuevoCorrelativo}-${gestion}`
        };
      }
      const correlativoCreado = await CorrelativoRepository.createOrUpdate({ idEntidad, idFormulario: null, gestion, correlativo: 1, userCreated }, transaccion);
      const correlativoEncontrado = await CorrelativoRepository.findOne({ id: correlativoCreado.id }, transaccion);
      
      usarPrefijo = correlativoEncontrado.entidad.usarPrefijo ?? true;
      if (!t) await transaction.commit(transaccion);

      return {
        codigo      : `${usarPrefijo ? correlativoEncontrado.entidad.sigla + '-' : ''}${unidadOrganizacional.sigla}-1-${gestion}`,
        codigoUnico : `${correlativoEncontrado.entidad.sigla}-1-${gestion}`
      };
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function generarCodigoDocumento (idEntidad, idUnidadOrganizacional, idFormulario, idCategoria, userCreated, citeInstitucional = false, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const fechaAcual = new Date();
      const gestion = fechaAcual.getFullYear();

      const datosBusquedaCorrelativo = {
        idEntidad,
        idUnidadOrganizacional : citeInstitucional ? null : idUnidadOrganizacional,
        gestion,
        estado                 : 'ACTIVO'
      };

      let _existeCategoria = null;

      if (idCategoria) {
        datosBusquedaCorrelativo.idCategoria = idCategoria;
        _existeCategoria =  await ParametroRepository.findOne({ id: idCategoria }, transaccion);
      } else {
        datosBusquedaCorrelativo.idFormulario = idFormulario;
      }

      const _existeCorrelativo = await CorrelativoRepository.findOne(datosBusquedaCorrelativo, transaccion);
      let usarPrefijo = true;

      if (_existeCorrelativo) {
        usarPrefijo = _existeCorrelativo.entidad.usarPrefijo ?? true;
        const nuevoCorrelativo = _existeCorrelativo.correlativo + 1;
        await CorrelativoRepository.createOrUpdate({ id: _existeCorrelativo.id, correlativo: nuevoCorrelativo, userUpdated: userCreated }, transaccion);

        if (!t) await transaction.commit(transaccion);

        let sigla = _existeCorrelativo.formulario.sigla;

        if (_existeCategoria) sigla = _existeCategoria.codigo;

        return `${usarPrefijo ? _existeCorrelativo.entidad.sigla + '-' : ''}${citeInstitucional ? '' : _existeCorrelativo.unidadOrganizacional.sigla + '-'}${sigla}-Z-${nuevoCorrelativo}-${gestion}`;
      }

      const correlativoCreado = await CorrelativoRepository.createOrUpdate({
        idEntidad,
        idUnidadOrganizacional : citeInstitucional ? null : idUnidadOrganizacional,
        idCategoria,
        idFormulario,
        gestion,
        correlativo            : 1,
        userCreated
      }, transaccion);
      const correlativoEncontrado = await CorrelativoRepository.findOne({ id: correlativoCreado.id }, transaccion);
      usarPrefijo = correlativoEncontrado.entidad.usarPrefijo ?? true;

      if (!t) await transaction.commit(transaccion);

      let sigla = correlativoEncontrado.formulario.sigla;

      if (_existeCategoria) sigla = _existeCategoria.codigo;
      return `${usarPrefijo ? correlativoEncontrado.entidad.sigla + '-' : ''}${citeInstitucional ? '' : correlativoEncontrado.unidadOrganizacional.sigla + '-'}${sigla}-Z-1-${gestion}`;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function generarCodigos ({ idUsuario, idFormulario, flujo = true, documento = true, idCategoria = null, userCreated, citeInstitucional = false }, t) {
    let transaccion;
    try {
      const respuesta = { codigoFlujo: null, codigoDocumento: null };

      if (!idUsuario) return respuesta;

      transaccion = t || await transaction.create();

      const _existeUsuario = await UsuarioRepository.login({ id: idUsuario });

      if (!_existeUsuario)  throw new Error('No existe el usuario.');

      const { cargoUsuario } = _existeUsuario;

      if (!cargoUsuario.configuracionCargos[0]) throw new Error('Error al obtener informacion del cargo del usuario.');      
      
      let idUnidadOrganizacional = null;
      if (idFormulario && documento) {
        const formulario = await FormularioRepository.findOne({ id: idFormulario });
        if (formulario?.permiteCiteDiferente && formulario?.idAreaCite) {
          idUnidadOrganizacional = formulario.idAreaCite
        }
      }

      const unidad = await AreaRepository.findOne({ id: idUnidadOrganizacional || cargoUsuario.configuracionCargos[0].idUnidadOrganizacional });

      if (!unidad) throw new Error('Error al obtener informacion del cargo y el area/unidad del usuario.');

      const entidad = await EntidadRepository.findOne({ id: unidad.idEntidad });

      if (flujo) {
        const codigosFlujo = await generarCodigoFlujo(
          unidad.idEntidad,
          unidad.id,
          userCreated,
          transaccion
        );
        respuesta.codigoFlujo = codigosFlujo.codigo;
        respuesta.codigoUnicoFlujo = codigosFlujo.codigoUnico;
      }

      if (documento) {
        respuesta.codigoDocumento = await generarCodigoDocumento(
          entidad.id,
          unidad.id,
          idFormulario,
          idCategoria,
          userCreated,
          citeInstitucional,
          transaccion
        );
      }

      if (!t) await transaction.commit(transaccion);

      return respuesta;
    } catch (error) {
      console.error(error);
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  return {
    generarCodigoDocumento,
    generarCodigoFlujo,
    generarCodigos,
    listar,
    cantidades
  };
};
