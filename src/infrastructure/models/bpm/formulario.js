'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    nombre : {
      type      : DataTypes.STRING(400),
      allowNull : false,
      xlabel    : lang.t('fields.nombre')
    },
    descripcion: {
      type      : DataTypes.STRING(800),
      allowNull : false,
      xlabel    : lang.t('fields.descripcion')
    },
    idCategoria: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idCategoria'),
      allowNull : false,
      field     : 'id_categoria'
    },
    idArea: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idArea'),
      allowNull : true,
      field     : 'id_area'
    },
    citeCategoria: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.citeCategoria'),
      allowNull    : false,
      defaultValue : true,
      field        : 'cite_categoria'
    },
    abreviacion: { // nuevop
      type   : DataTypes.STRING(255),
      xlabel : lang.t('fields.abreviacion'),
      field  : 'abreviacion'
    },
    tipo: { // nuevo
      type         : DataTypes.ENUM,
      values       : ['ADMINISTRACION', 'GESTION DOCUMENTAL', 'PROYECTO'],
      defaultValue : 'GESTION DOCUMENTAL',
      xlabel       : lang.t('fields.tipo'),
      field        : 'tipo'
    },
    configuracion_json: {
      type         : DataTypes.JSONB,
      allowNull    : false,
      defaultValue : '[]',
      xlabel       : lang.t('fields.configuracion_json'),
      field        : 'configuracion_json'
    },
    sigla: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      unique    : true,
      xlabel    : lang.t('fields.sigla'),
      field     : 'sigla'
    },
    anual: {
      type         : DataTypes.BOOLEAN,
      defaultValue : true,
      xlabel       : lang.t('fields.anual')
    },
    estado: { // nuevo
      type         : DataTypes.TEXT,
      defaultValue : 'ACTIVO',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    configuracionPagina: {
      type         : DataTypes.JSONB,
      allowNull    : false,
      defaultValue : `{
          "tamanioPagina": { "nombre": "CARTA", "ancho": "21.59", "alto": "27.94" },
          "margenIzquierdo": 4,
          "margenSuperior": 3,
          "margenDerecho": 3,
          "margenInferior": 3 }`,
      xlabel : lang.t('fields.configuracionPagina'),
      field  : 'configuracion_pagina'
    },
    dobleVerificacion: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.dobleVerificacion'),
      field        : 'doble_verificacion'
    },
    habilitarPalabrasClave: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      xlabel       : lang.t('fields.habilitarPalabrasClave'),
      field        : 'habilitar_palabras_clave'
    },
    generarCite: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      xlabel       : lang.t('fields.generarCite'),
      field        : 'generar_cite'
    },
    noObservable: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      xlabel       : lang.t('fields.noObservable'),
      field        : 'no_observable'
    },
    citeInstitucional: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      xlabel       : lang.t('fields.citeInstitucional'),
      field        : 'cite_institucional'
    },
    configuracionExportacion: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : [],
      xlabel       : lang.t('fields.configuracionExportacion'),
      field        : 'configuracion_exportacion'
    },
    migracionDori: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.migracionDori'),
      field        : 'migracion_dori'
    },
    permite_confidencial: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.permite_confidencial'),
      field        : 'permite_confidencial'
    },
    pertenece_flujo: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.pertenece_flujo'),
      field        : 'pertenece_flujo'
    },
    permiteCiteDiferente: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      xlabel       : lang.t('fields.permiteCiteDiferente'),
      field        : 'permite_cite_diferente'
    },
    idAreaCite: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idAreaCite'),
      allowNull : true,
      field     : 'id_area_cite'
    },
    permiteAdjunto: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : true,
      xlabel       : lang.t('fields.permiteAdjunto'),
      field        : 'permite_adjunto'
    },
    postergarCite: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.postergarCite'),
      field        : 'postergar_cite'
    },
    ocultarAdjunto: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.ocultarAdjunto'),
      field        : 'ocultar_adjunto'
    },
    mostrarFondoPdf: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.mostrarFondoPdf'),
      field        : 'mostrar_fondo_pdf'
    },
    fechaLiteralPdf: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.fechaLiteralPdf'),
      field        : 'fecha_literal_pdf'
    },
    formatoCitePdf: {
      type         : DataTypes.STRING(200),
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.formatoCitePdf'),
      field        : 'formato_cite_pdf'
    },
    generarPlantilla: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.generarPlantilla'),
      field        : 'generar_plantilla'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const formulario = sequelize.define('formulario', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_formulario'
  });

  return formulario;
};
