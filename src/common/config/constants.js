'use strict';

const constants = Object.freeze({
  CODIGO_PARAMETRO_BANDEJA_CIUDADANO       : 'S-BC',
  CODIGO_PARAMETRO_CLASIFICACION_DEFECTO   : 'S-CD',
  ROL_DEFECTO                              : '2b44d494-df91-4d1e-9472-3d06a3971b73',
  ID_PERSONAL_PLANTA                       : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
  CODIGO_PARAMETRO_CONFIGURACION_ENTIDADES : 'S-SPR',
  CODIGO_PARAMETRO_HEADER_FOOTER_ENTIDADES : 'S-HFPA',
  CONTRASENA_DEFECTO                       : 'Developer',
  ID_USUARIO_ADMINISTRADOR                 : '4ba3dc0d-35d7-4a89-9eb3-7ac95072d46f',
  ID_ENTIDAD_CIUDADANO                     : '29b37e83-3e68-4fb6-b0b0-b51cbcb1f1e0',
  ID_ROL_CIUDADANO                         : '2b44d494-df91-4d1e-9472-3d06a3971b73',
  CLASIFICACION_FLUJO                      : {
    CONFIDENCIAL : 'CONFIDENCIAL',
    ABIERTO      : 'ABIERTO'
  },
  CARGO_CIUDADANO: {
    CARGO: {
      nroItem                : 'CIUDADANO-',
      descripcion            : 'CIUDADANO',
      idTipoPuesto           : '4ba3dc0d-35d7-4a89-9eb3-7ac95072d46f',
      estado                 : 'ACTIVO',
      nivel                  : 'TERCERA',
      idUnidadOrganizacional : '0805ffa1-9c87-425b-b681-e762076a4821',
      userCreated            : '4ba3dc0d-35d7-4a89-9eb3-7ac95072d46f'
    },
    CONFIGURACION_CARGO: {
      idCargo                  : '',
      idDepenenciaLinea        : 'c404327e-cd83-4824-8837-0ac49bc67011',
      idDependenciaFuncional   : 'c404327e-cd83-4824-8837-0ac49bc67011',
      idDependenciaFormulario  : 'c404327e-cd83-4824-8837-0ac49bc67011',
      idDependenciaPoai        : 'c404327e-cd83-4824-8837-0ac49bc67011',
      idApruebaViaje           : 'c404327e-cd83-4824-8837-0ac49bc67011',
      idElaboraMemorandumViaje : 'c404327e-cd83-4824-8837-0ac49bc67011',
      idUnidadOrganizacional   : '0805ffa1-9c87-425b-b681-e762076a4821',
      userCreated              : '4ba3dc0d-35d7-4a89-9eb3-7ac95072d46f'
    }
  },
  TIPOS_DERIVACIONES: {
    PROVEIDO             : '5a79bf7f-e1ec-4681-bf94-a29aeaedba11',
    CREAR_DOCUMENTO      : '5a79bf7f-e1ec-4681-bf94-a29aeaedba13',
    ARCHIVAR             : '5a79bf7f-e1ec-4681-bf94-a29aeaedba12',
    PROVEIDO_OBSERVACION : '5a79bf7f-e1ec-4681-bf94-a29aeaedba14',
    DERIVAR_DOCUMENTO    : '5a79bf7f-e1ec-4681-bf94-a29aeaedba15',
    CERRAR               : '5a79bf7f-e1ec-4681-bf94-a29aeaedba16',
    CERRADO              : '5a79bf7f-e1ec-4681-bf94-a29aeaedba16',
    OBSERVAR             : '5a79bf7f-e1ec-4681-bf94-a29aeaedba17'
  },
  CAMPOS_NATIVOS: {
    ID_DOCUMENTO     : 'Id del documento',
    ID_FLUJO         : 'id del flujo',
    CITE             : 'Cite',
    HOJA_RUTA        : 'Hoja de ruta',
    FECHA_DOCUMENTO  : 'fecha del documento',
    CLASIFICACION    : 'Clasificacion',
    FECHA_CREACION   : 'Fecha de creacion',
    ESTADO_DOCUMENTO : 'Eestado del documento',
    ESTADO_FLUJO     : 'Estado del flujo',
    USUARIO_ACTUAL   : 'Usuario actual'
  },
  TRANSFORMACIONES: {
    STRING  : 'STRING',
    BOOLEAN : 'BOOLEAN',
    FLOAT   : 'FLOAT',
    INTEGER : 'INTEGER',
    OBJECT  : 'OBJECT',
    ARRAY   : 'ARRAY'
  },
  TIPO_FINALIZACION: {
    PROVEIDO: 'PROVEIDO'
  },
  TIPO_HEADER_FOOTER: {
    AREA    : 'AREA',
    ENTIDAD : 'ENTIDAD',
    TODOS   : 'TODOS'
  },
  ESTADO_DOCUMENTO: {
    CANCELADO : 'CANCELADO',
    DERIVADO  : 'DERIVADO',
    CERRADO   : 'CERRADO',
    OBSERVADO : 'OBSERVADO'
  },
  ESTADO_FLUJO_DOCUMENTAL: {
    FINALIZADO : 'FINALIZADO',
    PENDIENTE  : 'PENDIENTE',
    ARCHIVADO  : 'ARCHIVADO',
    CANCELADO  : 'CANCELADO',
    CERRADO    : 'CERRADO'
  },
  TIPO_PASO: {
    INTEROPERABILIDAD : 'interoperabilidad',
    DECISION          : 'decision',
    FORMULARIO        : 'formulario',
    FIN               : 'fin',
    INICIO            : 'inicio',
    FALLO             : 'fallo'
  },
  TIPO_FLUJO_DOCUMENTAL_SIPFA   : 'SIPFA',
  TIPO_FLUJO_DOCUMENTAL_GESTION : 'GESTION',
  TIPO_CARGO                    : {
    TODOS                 : 'fe278e1e-a60c-4bc9-be76-29b8ac5158f7',
    DEPENDENCIA_FUNCIONAL : '03d8b373-ed99-4ba6-b36d-b9f50089776c',
    SOLICITANTE           : '410bcbec-b065-46cb-9f58-1b303e6dcc9e',
    ESPECIFICO            : 'ae0262f2-7450-408a-9045-22479b478131',
    FORMULARIO            : 'd7081140-5863-40e5-8966-5853a0bc2602',
    DEPENDIENTES          : '86b48ba7-88d3-4c74-b51c-7e3d557c8d34',
    CAMPO_FORMULARIO      : '5effbf75-fa9d-4e67-a3f8-c35a4f47d594'
  },
  DEPENDENCIA: {
    LINEAL                   : 'idDepenenciaLinea',
    FUNCIONAL                : 'idDependenciaFuncional',
    FORMULARIO               : 'idDependenciaFormulario',
    POAI                     : 'idDependenciaPoai',
    APRUEBA_VIAJE            : 'idApruebaViaje',
    ELABORA_MEMORANDUM_VIAJE : 'idElaboraMemorandumViaje'
  },
  fileExtensionsAndFolders: {
    jpg  : 'fotos/',
    jpeg : 'fotos/',
    png  : 'fotos/',
    pdf  : 'documentos/',
    odt  : 'documentos/',
    doc  : 'documentos/',
    docx : 'documentos/'
  },
  Ids: {
    menus: {
      Dashboard   : '6190597f-7fa6-4c39-bcc9-7a1441ba566a',
      Entidades   : '039a897a-76dd-44c1-b3d7-9682df8f5342',
      Roles       : '61d6d53b-ac65-41ac-bc54-3228f548f40a',
      Menus       : 'ef6b99d0-0834-4d1e-86b0-207111744f98',
      Usuarios    : '6dc27435-bb49-48c8-b98d-ed9024d10ec5',
      Parametros  : 'a0882ff9-0d95-4d60-835d-85624f7a3469',
      Formularios : 'cc522099-0d95-8149-3fed-a2626f7e3461'
    },
    entidad: {
      'MINISTERIO DE JUSTICIA' : '745034da-06cb-4d98-8fee-4c982adfbb22',
      'MINISTERIO DE TRABAJO'  : '3f5faa14-cd56-465e-afd4-f81415859982'
    },
    permisos: {
      'usuarios:crear'               : '7f5b3565-b270-4c16-b957-1b1ac3aaa04d',
      'usuarios:listar'              : 'e73a95a7-7eb6-4b73-bea1-8bd551e71093',
      'usuarios:listadoReducido'     : '923ad5a2-2056-4f80-c086-8bd551e71a60',
      'usuarios:actualizar'          : '0fba0566-6db3-4e65-984d-e42a945a12d2',
      'usuarios:eliminar'            : '0c1289e5-1870-4135-8217-0e2ec2b75e81',
      'menus:listar'                 : '6e3f26a6-e681-4304-8fcb-2e0b6b269ce7',
      'menus:crear'                  : 'f1d548ae-7a9d-4159-aace-48a00b997299',
      'menus:actualizar'             : '8b83d19d-563c-43a8-b073-131d0256ee9f',
      'menus:eliminar'               : '6dbe5edc-7075-4554-8f8f-ec33081c8fe8',
      'roles:listar'                 : '86f561eb-4c3c-445d-a460-bd7646323b3d',
      'roles:crear'                  : '0a0d00d4-5deb-4fd9-b8bd-02f526f1a3eb',
      'roles:actualizar'             : '76d904bd-ee07-4732-b5df-0d9bd9efb744',
      'roles:eliminar'               : '0afc4b37-1594-44e1-98d7-c9f47dd2672c',
      'permisos:listar'              : 'bcfed14e-2405-4e25-ac63-61e348e1c2c0',
      'permisos:crear'               : '15ff0e86-45f5-4b84-88ff-77461bccf7bc',
      'permisos:actualizar'          : '9b764e5c-7f65-4cfc-9741-b84d47ebfeb3',
      'permisos:eliminar'            : 'fb2aca8a-6257-4ef1-a435-5ed131d702f9',
      'entidades:listar'             : '22067709-ce42-4926-89e6-8ce2dc52e193',
      'entidades:listarpor'          : '5a064635-3084-42c5-ab38-d74588932b3c',
      'entidades:crear'              : 'a6aec23e-bdbf-4cf7-a97e-fceb3a0c782d',
      'entidades:actualizar'         : '56c2756b-63c4-4c1f-bf1d-d3b5c604eca6',
      'entidades:eliminar'           : '3ee48c68-fb87-4a22-a4cc-47ce4b2bc6c6',
      'formulario:listar'            : '743d712b-4904-489f-92ee-6ae6e9f6b1d7',
      'formulario:listarpor'         : 'b0b7e8be-0a7a-4ef9-bf16-bc9f1a687867',
      'formulario:crear'             : '959800a3-b744-4ffe-99e6-afaf33eb3ad3',
      'formulario:actualizar'        : '4cef1f8f-0672-46eb-aaf9-1bf6bb19af4b',
      'formulario:eliminar'          : 'cd2e8e5a-11b1-4f38-ae5c-b0858e6461ec',
      'componente:listar'            : '4c6baaa4-2bb4-42ca-a487-ddf2da1b052a',
      'componente:listarpor'         : 'c7e71c1d-aae4-4384-9b12-c5312a1bf32d',
      'componente:crear'             : 'cb921d03-a8ed-46d1-8cfa-7f881bba0c17',
      'componente:actualizar'        : '69467c92-06e4-4cb5-8e81-a8d7fb9faab8',
      'componente:eliminar'          : '62fff69d-a5a7-46a9-928f-8db80fb2ff53',
      'cite:listar'                  : '3e34c6f6-aa48-4a6c-96bb-1aafe36b8cd5',
      'cite:listarpor'               : 'f472add0-d591-4179-b679-44ca29113d34',
      'cite:crear'                   : 'c43768b3-54a2-45f7-a6ef-9d5c0f90d5d4',
      'cite:actualizar'              : '62717df2-3571-46c6-9e36-9badbea75188',
      'cite:eliminar'                : '0337dc06-7b23-4768-b7f6-804ed67044d2',
      'cite:generacite'              : 'a66c6b73-99aa-424d-902c-9d5d73cbd017',
      'entidadcomponente:listar'     : '844cc0bc-60c7-494e-b61f-4a41baffe4bb',
      'entidadcomponente:listarpor'  : '2bea0d0c-d12b-4c31-aed0-ec25598e07eb',
      'entidadcomponente:crear'      : '1a55dd8e-0091-4753-b626-e82822166b1a',
      'entidadcomponente:actualizar' : 'c664b237-84bd-43fb-8648-f4942d09b109',
      'entidadcomponente:eliminar'   : '2ee56b9e-2bba-4d37-892c-10aaf654a073',
      'persona:personasegip'         : 'db99f98d-9c86-4795-880c-7971955a11d2',
      'formulariodatos:listar'       : '48523625-91c4-40a3-9c3d-fa2575977c9b',
      'formulariodatos:listarpor'    : 'bdd2ef70-1d02-452e-b67e-1c40814f48c5',
      'formulariodatos:crear'        : '8a313739-f2fc-442d-b982-a5219d333892',
      'formulariodatos:actualizar'   : '43f0796f-342a-4ce1-a8ff-50b6788b6055',
      'formulariodatos:eliminar'     : '3690bed7-799c-41bc-a688-03022ad7f7ce',
      'flujoplantilla:listar'        : 'af15eb25-e052-486b-a967-660d61ecf0d1',
      'flujoplantilla:listarpor'     : '4cc343eb-0782-4739-8509-db79be8e416e',
      'flujoplantilla:crear'         : 'c5720a83-15c4-4641-8164-a0a4da7c3d8e',
      'flujoplantilla:actualizar'    : 'dcf487a4-7639-4073-b4f4-dff8530ff284',
      'flujoplantilla:eliminar'      : '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe62da',

      'bandeja:listar'       : 'e064b237-bec3-4ad0-a1b3-db79be8e416e',
      'documento:crear'      : 'd0fba6ba-7279-4907-a9a2-59a1de6b0a9a',
      'documento:actualizar' : '52d5f531-5721-4ddf-bb5a-a0e46fa77cd3',
      'documento:finalizar'  : '1a966d80-e4e2-4575-96d1-d5ba2a036504',
      'documento:listar'     : '4e0bb3f3-d5a2-4d27-b75d-305d5e1bb250',

      'apitoken:modificar': 'dd814702-8912-1583-4481-5891ab65812c'
    },
    usuarios: {
      admin         : '7171272e-b31b-4c34-9220-9f535c958c5c',
      ministro      : 'cc448ea1-db4a-4b4c-a458-8e42ba4fd2d8',
      viceministro  : '8275d638-d970-4505-a414-a5833b16452b',
      director      : 'd5197e55-5a99-47a0-920c-1ba075d0879e',
      jefeUnidad    : '3f4d4883-4b82-4b5b-8962-aaa1148fc032',
      secretaria    : '00f94146-44b7-4b82-b3c4-1ee426b353db',
      autoridad     : '5bc93f28-e85c-49d3-8839-72ae175de6f9',
      personalMjti  : '75e6b039-ea8b-42c1-b712-3a37533ff4d6',
      personalMjti1 : '463650b0-40e6-4490-abda-54ec44bd72c3',
      personalMjti2 : 'daeccf5c-e4ba-4a27-a1bf-3463d09df201',
      personalMjti3 : 'da1d40be-99c6-400c-b606-67e55515b4b0',
      personalMjti4 : '55282b18-68db-4db1-8df2-47ab234c3154',
      personalMjti5 : '80d6b8d7-cb2f-4c7b-a2cd-a5111a59ecd8',
      personalMjti6 : 'cb837d19-bf6c-43d3-bf69-b9f4d800ae1f',
      personalMjti7 : 'e3805f2e-7fba-4052-8578-d734f36f66d8',
      personalMjti8 : '3e65e7bc-0ed4-40b0-99e1-6a9ba17cf02b',
      entidad1      : 'aa820d24-61aa-42a7-8da0-b21e2f4dfef8',
      ciudadania1   : 'ce2d0fe8-c50a-43df-8c46-5f25127d9bf5',
      ciudadania2   : '06157455-5d48-46b5-bde0-990ebe89b609',
      ciudadania3   : '55eebb09-e036-44d0-8c5c-ebc145df595c'
    },
    roles: {
      'ROL SUPER ADMIN' : '88b0104c-1bd1-42b2-bb01-9bf0502bab5a',
      ministro          : '4591e6fa-fe52-4d88-9902-9bbd6cb8fc2d',
      viceministro      : 'e47a9209-cf42-4b1f-a866-206db389766e',
      directores        : '8a038673-9657-4a9e-a2ee-4263ff78b7f4',
      'jefes de unidad' : 'bdf4ca15-7ef6-4ba7-9856-c201e4dc1b1c',
      secretaria        : 'b8892306-6156-4e37-afe3-0cefdb2efcb5',
      autoridades       : 'c7f83fb4-472f-4d5d-ac73-95d0f11afc3f',
      'personal mjti'   : '2b44d494-df91-4d1e-9472-3d06a3971b73',
      iop               : 'a0ce1803-6aa8-49e8-848b-7883b88355b1'
    },
    areas: {
      'DESPACHO MINISTERIAL'                                                                                       : 'c1c87b2f-6b56-40b5-bb51-1fb93bdd0112',
      'DIRECCIÓN GENERAL DE ASUNTOS ADMINISTRATIVOS'                                                               : '0c808214-3e58-4d69-be67-b62a7babb473',
      'DIRECCIÓN GENERAL DE ASUNTOS JURIDICOS'                                                                     : '14cd84de-c4e3-4734-8fb6-107ecfbca71d',
      'DIRECCIÓN GENERAL DE PLANIFICACION'                                                                         : '2b741d29-32d0-45cc-a127-783d249cbbe8',
      'VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES'                                                        : 'a2ab7879-89f7-4cf7-ab28-3a0de3c1e041',
      'VICEMINISTERIO DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA'                                                   : 'a35a5d08-61e9-443c-b8b6-935c3be85fcc',
      'VICEMINISTERIO DE IGUALDAD DE OPORTUNIDADES'                                                                : '7fd59690-5b78-4de9-89e1-c99eb50d9b8b',
      'VICEMINISTERIO DE DEFENSA DE LOS DERECHOS DEL USUARIO Y DEL CONSUMIDOR'                                     : '7a738b57-1c9e-487f-8eef-72f52ee4dfb9',
      'VICEMINISTERIO DE TRANSPARENCIA INSTITUCIONAL Y LUCHA CONTRA LA CORRUPCIÓN'                                 : 'bca3ddde-63df-4354-8fd6-6a44f3950430',
      'UNIDAD DE COMUNICACION SOCIAL'                                                                              : 'c1bf2558-99ab-4e96-a380-d59e612a3fbf',
      'UNIDAD DE AUDITORIA INTERNA'                                                                                : '8595bcb2-3e1a-441e-9628-a624381197da',
      'JEFATURA DE GABINETE'                                                                                       : '4c8c0d74-db57-4ede-9880-83f7411241c0',
      'UNIDAD DE TRANSPARENCIA Y LUCHA CONTRA LA CORRUPCION'                                                       : 'dbad5d02-4d2c-4ccd-8400-03e1e87b15b1',
      // nivel 3
      'DIRECCION GENERAL DE DERECHO INTERNACIONAL'                                                                 : '04d5e16a-fb10-4968-bcff-48350651f4f8',
      'DIRECCION GENERAL DE DESARROLLO CONSTITUCIONAL'                                                             : 'fbfbcb62-d10b-436d-a70f-03f01d9b17da',
      'DIRECCION GENERAL DE JUSTICIA Y DERECHOS FUNDAMENTALES'                                                     : '81e5e18c-d5f6-40f1-b033-b30840343976',
      'DIRECCION GENERAL DE REGISTRO PUBLICO DE LA ABOGACIA'                                                       : '8f6f4e9f-971c-48c6-8a82-8dafde78b171',
      'DIRECCIÓN GENERAL DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA'                                                : '2d78da8c-5527-47d2-b68a-6cbb25a5f582',
      'DIRECCIÓN GENERAL DE NIÑEZ Y PERSONAS ADULTAS MAYORES'                                                      : 'be125912-386e-4125-b85e-2051988809c9',
      'DIRECCIÓN GENERAL DE PERSONAS CON DISCAPACIDAD'                                                             : '42bf9ec3-206b-4004-83ec-1978c8d2dac8',
      'DIRECCIÓN GENERAL DE PREVENCION Y ELIMINACION DE TODA FORMA DE VIOLENCIA EN RAZON DE GENERO Y GENERACIONAL' : '5c7a46e1-85b4-478f-b1eb-b2575076d5c2',
      'DIRECCION PLURINACIONAL DE LA JUVENTUD'                                                                     : '7e90d048-4c5e-4c69-b839-97b47c08740a',
      'DIRECCIÓN GENERAL DE DEFENSA DE LOS DERECHOS DEL USUARIO Y CONSUMIDOR'                                      : '6c983471-a2af-4faf-846c-02f1559c9414',
      'DIRECCION GENERAL DE LUCHA CONTRA LA CORRUPCION'                                                            : '424316db-13b6-4ffe-886f-4b02d38acaa8',
      'DIRECCION GENERAL DE PREVENCION, PROMOCION DE LA ETICA Y TRANSPARENCIA'                                     : '7834ed96-7438-4931-9f5b-03f8091eb1da',
      'UNIDAD ADMINISTRATIVA'                                                                                      : 'fe2026c8-523e-4ef9-ac91-38a5fd8c522c',
      'UNIDAD FINANCIERA'                                                                                          : '62aa499f-e22b-47e6-9ead-defacb7d2739',
      'UNIDAD DE RECURSOS HUMANOS'                                                                                 : '458b076f-9b08-4798-830b-770d7f750090',
      'UNIDAD DE GESTION JURIDICA'                                                                                 : '6f67d504-70ab-4819-8ab3-668613b54026',
      'UNIDAD DE ANALISIS JURIDICO'                                                                                : '48cfd78f-3484-45cf-b28a-5ab0347a7158',
      // nivel 4
      'TECNOLOGIAS DE LA INFORMACION Y COMUNICACION'                                                               : 'a4f0bae3-3570-4b1a-923d-086e31fbb9ad',
      'AREA DE SERVICIOS GENERALES E INFRAESTRUCTURA'                                                              : 'ccbd44d3-d74b-4365-a748-f6f0d2313758',
      'AREA DE CONTRATACIONES'                                                                                     : '0a92f124-d418-42b1-a927-18a511715a58',
      'AREA DE ALMACENES'                                                                                          : 'd3d3e5bb-4398-4b9f-9d9b-c65c337ac91a',
      'AREA DE ACTIVOS FIJOS'                                                                                      : '10e200b9-e12d-4638-b7c6-138f53b91552',
      'AREA DE BIBLIOTECA Y ARCHIVO'                                                                               : '160b3d9f-fcb6-402b-ad91-d2ad7ddc60e0',
      'AREA DE TESORERIA'                                                                                          : 'ba7c5194-d7d0-493d-8515-2e6c7578243a',
      'AREA DE CONTABILIDAD'                                                                                       : 'cf313494-48b5-45d8-bd96-382b86ecc12e',
      'AREA DE PRESUPUESTO'                                                                                        : '60759d61-108a-43a6-ae9d-0fa60c51138a',
      'UNIDAD DE SERVICIOS INTEGRALES DE JUSTICIA PLURINACIONAL'                                                   : '614bae7c-8c70-4cbd-8096-c1ae10af3e08',
      'AREA DE JUSTICIA Y ANALISIS NORMATIVO'                                                                      : '51b5716f-4387-4700-93de-ea0d64b2f152',
      'AREA TRATA Y TRAFICO'                                                                                       : 'd63351ce-61a4-4158-8bf2-ab7d99d9a99a',
      'AREA DE TRANVERSALIZACION DE DERECHOS DE LA NIÑEZ'                                                          : 'db5db5be-443c-456b-8a33-0f057b4364d3',
      'AREA DE TRANVERSALIZACION DEL ENFOQUE DE DERECHOS DE PERSONAS ADULTAS Y MAYORES'                            : '52eea4ed-9da3-4f57-a159-b1c3fb8424dd',
      'UNIDAD DE EDUCACION Y DIFUSION'                                                                             : '578768d0-c4ef-496e-991d-15ca8e2fce4c',
      'UNIDAD DE POLITICAS PUBLICAS NORMAS Y PROYECTOS'                                                            : 'f9b7a57f-2b26-4afc-a9a0-625c8d8ab8cb',
      'AREA ASESORAMIENTO Y ATENCION AL USUARIO CONSUMIDOR'                                                        : 'f047487e-55d2-48fc-98c2-e1a7d9b8ce4c',
      'UNIDAD DE PARTICIPACION Y CONTROL SOCIAL Y ACCESO A LA INFORMACION'                                         : '2916eca0-25ab-4743-9ded-cd4302cc4850',
      'UNIDAD DE ETICA PUBLICA GESTION DE RIESGOS Y PROCESAMIENTOS DE LA INFORMACION'                              : '5999cb9e-310f-4476-b740-7d7b5702bcfd',
      'UNIDAD DE INVESTIGACION DE ACTOS DE CORRUPCION EN ENTIDADES PUBLICAS'                                       : 'f9e6c914-70c5-4344-8f2d-28fa4fd3b7b5',
      'UNIDAD RECUPERACION DE BIENES E INTELIGENCIA FINANCIERA'                                                    : 'ebf64b96-c32e-493e-b959-3e447512750b',
      'UNIDAD DEL SIIARBE (SISTEMA INTEGRADO DE INFORMACION ANTICORRUPCION Y RECUPERACION DE BIENES AL ESTADO)'    : '7cee41d1-fae4-4f27-af03-0de3faadd8c7',
      // nivel externos
      'INFRAESTRUCTURA Y MANTENIMIENTO'                                                                            : '28d0e4ec-7eeb-4a35-bd27-489aaa172118', // UNIDAD ADMINISTRATIVA
      'REPRESENTACION DEPARTAMENTAL BENI'                                                                          : '28d0e4ec-7eeb-4a35-bd27-489aaa172119',
      'REPRESENTACION DEPARTAMENTAL CHUQUISACA'                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172120',
      'REPRESENTACION DEPARTAMENTAL COCHABAMBA'                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172121',
      'REPRESENTACION DEPARTAMENTAL SANTA CRUZ'                                                                    : '28d0e4ec-7eeb-4a35-bd27-489aaa172122',
      'REPRESENTACION DEPARTAMENTAL TARIJA'                                                                        : '28d0e4ec-7eeb-4a35-bd27-489aaa172123',
      'UNIDAD DE ADMISIÓN DE DENUNCIAS'                                                                            : '28d0e4ec-7eeb-4a35-bd27-489aaa172124',
      'UNIDAD DE PROCESAMIENTO PENAL'                                                                              : '28d0e4ec-7eeb-4a35-bd27-489aaa172125',
      'DERECHOS FUNDAMENTALES'                                                                                     : '28d0e4ec-7eeb-4a35-bd27-489aaa172126',
      'UNIDAD DE DEFENSA DEL LITIGANTE'                                                                            : '28d0e4ec-7eeb-4a35-bd27-489aaa172127'
    }
  },
  endpointsIop: [
    'usuarios',
    'documentoInterno',
    'documentoInternoSearch',
    'archivoAdjunto',
    'historialFlujo',
    'categoriasFlujo'
  ],
  tipoAccion: {
    CREACION: '7a49fe4e-3b87-44e6-9418-ffc8eebcd382'
  },
  tipoCargoBandeja: {
    DEPENDENCIA_FUNCIONAL : '03d8b373-ed99-4ba6-b36d-b9f50089776c',
    ESPECIFICO            : 'ae0262f2-7450-408a-9045-22479b478131',
    SOLICITANTE           : '410bcbec-b065-46cb-9f58-1b303e6dcc9e'
  },
  tipoSolicitud: {
    bienServicio: {
      id: 'cda028e8-0561-494f-ae9e-ba350490b559'
    },
    pasajeViatico: {
      id                 : '5043d960-fc02-4020-987a-c3d6afea62db',
      partidasPermitidas : ['bf28223b-4b7c-432c-afd4-dc36f9101058', 'bf28223b-4b7c-432c-afd4-dc36f9101059']
    },
    fondoAvance: {
      id: 'f50003b2-b12d-40f9-a479-ae50d148f900'
    },
    cajaChica: {
      id: 'eccf34ca-efbf-4ea9-9ec8-033a4fea1d69'
    },
    pagoProveedorDirecto: {
      id: '31148391-0cc8-46aa-ad54-b46cbd1cbf07'
    },
    reembolso: {
      id: '1df0aef6-04ea-4993-bc91-b3f937296ecb'
    },
    personalEventual: {
      id: '19a7b0ea-6d8c-408b-bcfa-1d43183637d8'
    },
    pagoPlanilla: {
      id: '03244ade-8170-40c8-83fb-b3ceeedfd7b8'
    }
  },
  BITACORA: {
    ACCION_PARAMETRO_INACTIVO: 'INACTIVAR_PARAMETRO',
    ACCION_DESCARGAR_DOCUMENTO: 'DESCARGAR_DOCUMENTO',
    ACCION_VISUALIZAR_DOCUMENTO: 'VER_DOCUMENTO',
  }
});

module.exports = constants;
