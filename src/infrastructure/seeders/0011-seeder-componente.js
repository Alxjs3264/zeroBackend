'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const config = require('../../common/config')

let items = [
  {
    id                 : '52d3440d-9db2-4857-bc73-a0adf02beed2',
    nombre             : 'Derivacion',
    descripcion        : 'Componente de derivacion',
    icono              : 'forward_to_inbox',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Derivacion","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"subCampos":["de","via","para","referencia"],"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"query":null,"typeInput":"derivacion","type":"derivacion","edit":true,"url":"${config.app.backendUrl}api/system/usuario-cargo","defaultValue":{},"configuracion":{"configDe":{"externo":false,"dependencia":"","visible":true,"multiple":true,"cargoActual":false,"required": true},"configVia":{"externo":false,"dependencia":"","visible":true,"multiple":true,"cargoActual":false,"required": true},"configPara":{"externo":false,"dependencia":"","visible":true,"multiple":true,"cargoActual":false,"required": true}},"optionsDependencias":[{"label":"Dependendencia lineal","value":"idDepenenciaLinea"},{"label":"Dependendencia funcional","value":"idDependenciaFuncional"},{"label":"Dependendencia formulario","value":"idDependenciaFormulario"},{"label":"Dependendencia POAI","value":"idDependenciaPoai"},{"label":"Aprueba viaje","value":"idApruebaViaje"},{"label":"Elabora Memorandum Viaje","value":"idElaboraMemorandumViaje"}]}`
  },
  {
    id                 : 'db4aa59b-3516-470f-87ae-928144fa66a8',
    nombre             : 'TextField',
    descripcion        : 'Elemento de tipo texto',
    icono              : 'text_fields',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"validations":[],"label":"Textfield","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","edit":true,"defaultValue":""}'
  },
  {
    id                 : '98d04cc7-0872-485d-9bb0-7a8ef8f3906e',
    nombre             : 'Select',
    descripcion        : 'Elemento de tipo select',
    icono              : 'arrow_drop_down_circle',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"validations":[],"label":"Select","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"query":null,"defaultvalue":"","options":[{"val":"1","label":"Opción 1","default":false},{"val":"2","label":"Opción 2","default":false}],"optionValue":"val","optionLabel":"label","typeInput":"normal","type":"select","edit":true}'
  },
  {
    id                 : 'b68cf9c6-d273-4051-a714-e2569fbf51e4',
    nombre             : 'Checkbox',
    descripcion        : 'Elemento de tipo checkbox',
    icono              : 'check_box',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"validations":[],"label":"Checkbox","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"checkbox","edit":true,"defaultValue":""}'
  },
  {
    id                 : 'f33d8b4f-f5fa-40d5-bebf-4afeeb320558',
    nombre             : 'Radio',
    descripcion        : 'Elemento de tipo radio',
    icono              : 'radio_button_checked',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"validations":[],"label":"Radio","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"options":[{"val":"1","label":"Opción 1","default":false},{"val":"2","label":"Opción 2","default":false}],"type":"radio","edit":true,"defaultValue":""}'
  },
  {
    id                 : '52d3440d-9db2-4857-bc73-a0adf02beed1',
    nombre             : 'Fecha selector',
    descripcion        : 'Componente de selección de fecha',
    icono              : 'calendar_today',
    estado             : 'ACTIVO',
    tipo               : 'AVANZADO',
    configuracion_json : '[{"visible":true,"required":false,"disabled":false,"edit":true,"validations":[],"label":"Día","ariaLabel":null,"ariaLabelledBy":null,"customClass":"col-3","customStyles":null,"placeholder":"01","autocomplete":null,"readonly":false,"type":"text","name":"dia","typeInput":"number","active":false,"maxlength":"2","max":"31","min":"1","designColumn":"col-4"},{"visible":true,"validations":[],"label":"Mes","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":"Seleccione","autocomplete":null,"readonly":false,"options":[{"value":"1","label":"Enero","default":false,"hola":"ddddd","val":"1","active":false},{"value":"dd","label":"Febrero","default":false,"val":"2","active":false},{"value":"3","label":"Marzo","default":false,"val":"3","active":false},{"value":"4","label":"Abril","default":false,"val":"4","active":false},{"value":"5","label":"Mayo","default":false,"val":"5","active":false},{"value":"6","label":"Junio","default":false,"val":"6","active":false},{"value":"7","label":"Julio","default":false,"val":"7","active":false},{"value":"8","label":"Agosto","default":false,"val":"8","active":false},{"value":"9","label":"Septiembre","default":false,"val":"9","active":false},{"value":"10","label":"Octubre","default":false,"val":"10","active":false},{"value":"11","label":"Noviembre","default":false,"val":"11","active":false},{"value":"12","label":"Diciembre","default":false,"val":"12","active":false}],"optionValue":"value","optionLabel":"label","type":"select","name":"mes","required":false,"active":false,"designColumn":"col-4"},{"visible":true,"validations":[],"label":"Año","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":"1990","autocomplete":null,"readonly":false,"type":"text","name":"anio","required":false,"typeInput":"number","active":false,"maxlength":"4","min":"1900","max":"2021","designColumn":"col-4","info":"","help":""}]'
  },
  {
    id                 : 'e724f26b-77e6-4485-aa45-77c61595be25',
    nombre             : 'Persona',
    descripcion        : 'Componente Persona SEGIP',
    icono              : 'person',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"label":"Person","visible":true,"required":false,"disabled":false,"edit":true,"customClass":null,"customStyles":null,"type":"person","typeInput":"contrastacion","options":[{"validations":[],"label":"Tipo de documento","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"options":[{"val":"CI","label":"Cédula de indentidad","default":false,"active":false},{"val":"EXTRANJERO","label":"Cédula de extranjería","default":false,"active":false},{"value":"","label":"Pasaporte","default":false,"val":"PASAPORTE","active":false}],"optionValue":"val","optionLabel":"label","type":"select","uid":"137763a7-73c8-4c33-8435-468c32fec357","name":"tipo_documento","required":false,"active":false,"designColumn":"col-4"},{"validations":[],"label":"Número de documento","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"9384f872-cb5d-4719-b978-1de3805051ff","name":"nro_documento","required":true,"active":false,"designColumn":"col-4","typeInput":"text","info":"########-AA","help":"Si su Cédula de identidad tiene Complemento escriba primero su número de Cédula de indentidad seguido de un guión y el complemento. Ejemplo: 123456-AB"},{"uid":"a4f1ecc0-e6dc-413d-a9b5-d72d5d7d0dfa","label":"Fecha de nacimiento","name":"fecha_nacimiento","type":"AVANZADO","designColumn":"col-4","visible":true,"required":true,"disabled":false,"items":[{"visible":true,"validations":[],"label":"Día","ariaLabel":null,"ariaLabelledBy":null,"customClass":"col-3","customStyles":null,"disabled":false,"placeholder":"01","autocomplete":null,"readonly":false,"validationTrigger":{"type":"blur","threshold":0},"type":"text","name":"dia","required":true,"typeInput":"number","active":false,"maxlength":"2","max":"31","min":"1","designColumn":"col-4"},{"visible":true,"validations":[],"label":"Mes","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":"Seleccione","autocomplete":null,"readonly":false,"validationTrigger":{"type":"blur","threshold":0},"options":[{"value":"1","label":"Enero","default":false,"hola":"ddddd","val":"1","active":false},{"value":"2","label":"Febrero","default":false,"val":"2","active":false},{"value":"3","label":"Marzo","default":false,"val":"3","active":false},{"value":"4","label":"Abril","default":false,"val":"4","active":false},{"value":"5","label":"Mayo","default":false,"val":"5","active":false},{"value":"6","label":"Junio","default":false,"val":"6","active":false},{"value":"7","label":"Julio","default":false,"val":"7","active":false},{"value":"8","label":"Agosto","default":false,"val":"8","active":false},{"value":"9","label":"Septiembre","default":false,"val":"9","active":false},{"value":"10","label":"Octubre","default":false,"val":"10","active":false},{"value":"11","label":"Noviembre","default":false,"val":"11","active":false},{"value":"12","label":"Diciembre","default":false,"val":"12","active":false}],"optionValue":"val","optionLabel":"label","type":"select","name":"mes","required":true,"active":false,"designColumn":"col-4"},{"visible":true,"validations":[],"label":"Año","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":"1990","autocomplete":null,"readonly":false,"validationTrigger":{"type":"blur","threshold":0},"type":"text","name":"anio","required":true,"typeInput":"number","active":false,"maxlength":"4","min":"1900","max":"2021","designColumn":"col-4","info":"","help":""}],"active":false},{"validations":[],"label":"Nombre(s)","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"8ddb7165-b499-40bb-900e-a3f91ac21c6d","name":"nombres","required":true,"active":false,"designColumn":"col-4","typeInput":"text"},{"validations":[],"label":"Primer apellido","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"14b301a8-2370-459d-8a8b-1b4f6044a766","name":"primer_apellido","required":true,"active":false,"designColumn":"col-4","typeInput":"text"},{"validations":[],"label":"Segundo apellido","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"88430a86-652f-4c8c-acde-6391ecbdabd3","name":"segundo_apellido","required":false,"active":false,"designColumn":"col-4","typeInput":"text"},{"uid":"9031c3fb-1129-48e6-8e14-ca2c5ac0e810","label":"","name":"","type":"AVANZADO","designColumn":"col-6","visible":true,"disabled":false,"required":false,"active":false,"items":[{"visible":true,"required":false,"disabled":false,"validations":[],"label":"Nacionalidad","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"placeholder":null,"autocomplete":null,"readonly":false,"options":[{"val":"1","label":"Opción 1","default":false,"active":false},{"val":"2","label":"Opción 2","default":false,"active":false}],"optionValue":"nacionalidad","optionLabel":"nacionalidad","type":"select","uid":"b984edc0-5fed-463d-b71e-4ab6819e1958","name":"nacionalidad","active":false,"designColumn":"col-12","url":"${config.app.backendUrl}public/paises","typeInput":"autocomplete","response":[{"key":"mensaje","type":"string","path":["mensaje"],"checked":false,"value":"OK","show":false},{"key":"finalizado","type":"boolean","path":["finalizado"],"checked":false,"value":true,"show":false},{"key":"datos","type":"object","path":["datos"],"collapse":false,"children":[{"key":"0","type":"object","path":["datos","0"],"collapse":false,"children":[{"key":"nacionalidad","type":"string","path":["datos","0","nacionalidad"],"checked":false,"value":"AFGANA","show":false},{"key":"pais","type":"string","path":["datos","0","pais"],"checked":false,"value":"AFGANISTÁN","show":false}],"checked":false,"show":true}],"checked":true,"show":true}],"selected":"datos.0"}]},{"validations":[],"label":"Ocupación","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"5a24eff5-41fe-4c06-97d3-1807b01fe058","name":"ocupacion","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"validations":[],"label":"Dirección","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"9787d763-dc0b-4c4e-87cd-6b40783bd3dd","name":"direccion","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"validations":[],"label":"Teléfono/móvil","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"251aa075-d500-45e6-b683-95698bfda758","name":"telefono","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"uid":"85f51f28-3b2c-409b-ae05-e31b7acc3a2a","label":"","name":"-urut2d","type":"AVANZADO","designColumn":"col-6","visible":true,"required":false,"disabled":false,"items":[{"visible":true,"validations":[],"label":"Estado civil","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"validationTrigger":{"type":"blur","threshold":0},"options":[{"val":"CASADO","label":"CASADO(A)","default":false},{"val":"SOLTERO","label":"SOLTERO(A)","default":false},{"value":"","label":"VIUDO(A)","default":false,"val":"VIUDO"},{"value":"","label":"DIVORCIADO(A)","default":false,"val":"DIVORCIADO"}],"optionValue":"val","optionLabel":"label","type":"select","name":"estado_civil","required":false,"designColumn":"col-12","active":true}],"active":false},{"validations":[],"label":"Género","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"options":[{"val":"Mujer","label":"Mujer","default":false,"active":false},{"val":"Hombre","label":"Hombre","default":false,"active":false}],"type":"radio","uid":"159d46dd-6de8-41b6-98d6-e4db8168d189","name":"genero","required":false,"active":false,"designColumn":"col-6"},{"validations":[],"label":"¿Tiene ciudadanía?","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"3a67e136-bd30-44da-9972-4488527eff9a","name":"ciudadania","required":false,"active":false,"designColumn":"col-12","typeInput":"hidden","value":""}]}`
  },
  {
    id                 : '79ac33c8-a066-4fdb-b44b-2f5311f60e15',
    nombre             : 'Editor',
    descripcion        : 'Editor (WYSIWYG)',
    icono              : 'format_color_text',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"validations":[],"visible":true,"label":"Editor","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"type":"editor","name":"editor","required":false,"designColumn":"col-12","typeInput":"text","active":true,"edit":true,"defaultValue":""}'
  },
  {
    id                 : '023888c2-46dc-4c82-a201-15879f92c853',
    nombre             : 'Upload',
    descripcion        : 'Componente de subida de archivos',
    icono              : 'file_upload',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"visible":true,"validations":[],"label":"Upload","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"type":"upload","name":"upload","required":false,"designColumn":"col-12","typeInput":"text","active":true,"edit":true,"defaultValue":[]}'
  },
  {
    id                 : '5830e191-1563-4a7d-8b4f-372f5f5118b4',
    nombre             : 'DataGrid',
    descripcion        : 'CRUD básico de registros',
    icono              : 'grid_on',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"visible":true,"validations":[],"label":"DataGrid","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"type":"datagrid","name":"datagrid","required":false,"designColumn":"col-12","typeInput":"text","active":true,"edit":true,"defaultValue":[]}'
  },
  {
    id                 : 'e3f5eb0e-aed7-4060-82cc-5a34b7785e1d',
    nombre             : 'Nacionalidad',
    descripcion        : 'nacionalidad',
    icono              : 'people',
    estado             : 'ACTIVO',
    tipo               : 'AVANZADO',
    configuracion_json : '[{"visible":true,"edit":true,"required":false,"disabled":false,"validations":[],"label":"Nacionalidad","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"placeholder":null,"autocomplete":null,"readonly":false,"options":[{"val":"1","label":"Opción 1","default":false,"active":false},{"val":"2","label":"Opción 2","default":false,"active":false}],"optionValue":"nacionalidad","optionLabel":"nacionalidad","type":"select","uid":"b984edc0-5fed-463d-b71e-4ab6819e1958","name":"nacionalidad","active":false,"designColumn":"col-12","url":"http://localhost:3000/public/paises","typeInput":"autocomplete","response":[{"key":"mensaje","type":"string","path":["mensaje"],"checked":false,"value":"OK","show":false},{"key":"finalizado","type":"boolean","path":["finalizado"],"checked":false,"value":true,"show":false},{"key":"datos","type":"object","path":["datos"],"collapse":false,"children":[{"key":"0","type":"object","path":["datos","0"],"collapse":false,"children":[{"key":"nacionalidad","type":"string","path":["datos","0","nacionalidad"],"checked":false,"value":"AFGANA","show":false},{"key":"pais","type":"string","path":["datos","0","pais"],"checked":false,"value":"AFGANISTÁN","show":false}],"checked":false,"show":true}],"checked":true,"show":true}],"selected":"datos.0"}]'
  },
  {
    id                 : '08e1f613-7901-4bf7-993d-d62a39d8b174',
    nombre             : 'Estado civil',
    descripcion        : 'Estado civil de la persona',
    icono              : 'sentiment_satisfied',
    estado             : 'ACTIVO',
    tipo               : 'AVANZADO',
    configuracion_json : `[{"visible":true,"required":false,"edit":true,"disabled":false,"validations":[],"label":"Estado civil","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"placeholder":null,"autocomplete":null,"readonly":false,"options":[{"val":"CASADO","label":"CASADO(A)","default":false},{"val":"SOLTERO","label":"SOLTERO(A)","default":false},{"value":"","label":"VIUDO(A)","default":false,"val":"VIUDO"},{"value":"","label":"DIVORCIADO(A)","default":false,"val":"DIVORCIADO"}],"optionValue":"val","optionLabel":"label","type":"select","name":"estado_civil","designColumn":"col-12","active":true}]`
  },
  {
    id                 : 'db8ecc64-c2bf-432d-af69-82a4b1b85348',
    nombre             : 'Título',
    descripcion        : 'Componente título o texto',
    icono              : 'title',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Title","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"title","typeInput":"title","edit":true,"defaultValue":""}`
  },
  {
    id                 : '19b0edfe-fb16-425a-bf5d-94482f018faa',
    nombre             : 'Ubicación',
    descripcion        : 'Componente de ubicación y dirección',
    icono              : 'location_on',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"label":"Map","visible":true,"edit":true,"required":false,"disabled":false,"customClass":null,"customStyles":null,"type":"map","typeInput":"map","defaultValue":{},"options":[{"validations":[],"label":"Departamento","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"query":null,"options":[{"val":"Beni","label":"Beni","default":false,"active":false},{"val":"Chuquisaca","label":"Chuquisaca","default":false,"active":false},{"value":"","label":"Cochabamba","default":false,"val":"Cochabamba","active":false},{"value":"","label":"La Paz","default":false,"val":"La Paz","active":false},{"value":"","label":"Oruro","default":false,"val":"Oruro","active":false},{"value":"","label":"Pando","default":false,"val":"Pando","active":false},{"value":"","label":"Potosí","default":false,"val":"Potosí","active":false},{"value":"","label":"Santa Cruz","default":false,"val":"Santa Cruz","active":false},{"value":"","label":"Tarija","default":false,"val":"Tarija","active":false}],"optionValue":"val","optionLabel":"label","typeInput":"normal","type":"select","uid":"307c661b-9403-4ebf-9032-c12d35b7b0cf","name":"departamento","required":true,"active":false,"designColumn":"col-4"},{"validations":[],"label":"Provincia","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"query":null,"options":[],"optionValue":"val","optionLabel":"label","typeInput":"normal","type":"select","uid":"16167cf1-2af1-4da5-88f7-59fd65ce8de8","name":"provincia","required":false,"active":false,"designColumn":"col-4"},{"validations":[],"label":"Municipio","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"query":null,"options":[],"optionValue":"val","optionLabel":"label","typeInput":"normal","type":"select","uid":"6d9eda1d-989e-43bc-b4d5-8b7f8dc44a55","name":"municipio","required":false,"active":false,"designColumn":"col-4"},{"validations":[],"label":"Zona/barrio/unidad vecinal u otro","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"options":[{"val":"Zona","label":"Zona","default":false,"active":false},{"val":"Barrio","label":"Barrio","default":false,"active":false},{"value":"","label":"Unidad vecinal","default":false,"val":"Unidad vecinal","active":false},{"value":"","label":"Otro","default":false,"val":"Otro","active":false}],"type":"radio","uid":"8471f994-65d5-4cb5-b7c0-55204e6998bf","name":"zona","required":false,"active":false,"designColumn":"col-6"},{"validations":[],"label":"Calle/avenida/pasaje/callejón u otro","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":false,"options":[{"val":"Calle","label":"Calle","default":false,"active":false},{"val":"Avenida","label":"Avenida","default":false,"active":false},{"value":"","label":"Pasaje","default":false,"val":"Pasaje","active":false},{"value":"","label":"Callejón","default":false,"val":"Callejón","active":false},{"value":"","label":"Otro","default":false,"val":"Otro","active":false}],"type":"radio","uid":"3bf0f0de-781d-43ce-9955-da031ed15088","name":"calle","required":false,"active":false,"designColumn":"col-6"},{"validations":[],"label":"Dirección referencial","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"text","uid":"6ccf6984-913b-45a0-a581-bffff4db360a","name":"direccion_referencial","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"validations":[],"label":"Número de domicilio","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":false,"type":"text","uid":"29883bf7-9b4d-4abd-a78e-610a5d42fc85","name":"numero_de_domicilio","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"validations":[],"label":"Número de edificio","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":false,"type":"text","uid":"20e10f58-b02f-43b6-be1b-c64afa4789ef","name":"numero_de_edificio","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"validations":[],"label":"Piso de edificio","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":false,"type":"text","uid":"7e9a5159-1f9d-4ee3-8c40-1893049d7ea7","name":"piso_de_edificio","required":false,"active":false,"designColumn":"col-6","typeInput":"text"},{"validations":[],"label":"Departamento/local u oficina","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":false,"options":[{"val":"Departamento","label":"Departamento","default":false,"active":false},{"val":"Local","label":"Local","default":false,"active":false},{"value":"","label":"Oficina","default":false,"val":"Oficina","active":false}],"type":"radio","uid":"ea440c89-7208-4688-b965-84520a7ccd2c","name":"tipo_casa","required":false,"active":false,"designColumn":"col-6"}]}`
  },
  {
    id                 : 'f33d8b4f-f5fa-40d5-bebf-4afeeb320560',
    nombre             : 'Separator',
    descripcion        : 'Linea de separaioin de sectores',
    icono              : 'safety_divider',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Title","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"separator","typeInput":"q-separator","edit":true,"defaultValue":""}`
  },
  {
    id                 : 'f33d8b4f-f5fa-40d5-bebf-4afeeb320570',
    nombre             : 'List Person',
    descripcion        : 'Lista de personal de la institución',
    icono              : 'groups',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Select","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"query":null,"options":[{"val":"1","label":"Opción 1","default":false},{"val":"2","label":"Opción 2","default":false}],"optionValue":"val","optionLabel":"label","typeInput":"personsList","type":"persons","edit":true,"url":"system/usuariosSearch?nombre=A","multiple":true,"defaultvalue":[]}`
  },
  {
    id                 : 'f33d8b4f-f5fa-40d5-bebf-4afeeb320571',
    nombre             : 'Presupuesto',
    descripcion        : 'Detalle de Items',
    icono              : 'attach_money',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Presupuesto","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"required":true,"visible":true,"query":null,"typeInput":"presupuesto","type":"presupuesto","edit":true,"defaultValue":{"id":null,"detalles":[]},"options":[],"configuracion":{"aniadir":true,"certificado":false,"pagado":false,"partidaUnica":false}, "subCampos":["operacion","value","idSolicitud"]}`
  },
  {
    id                 : 'f33d8b4f-f5fa-40d5-bebf-4afeeb320572',
    nombre             : 'Personal Eventual',
    descripcion        : 'Detalle de Items de Personal Eventual',
    icono              : 'groups',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Detalle de Items","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"required":true,"visible":true,"query":null,"typeInput":"eventual","type":"eventual","edit":true,"defaultValue":{"id":null,"detalles":[]},"options":[],"configuracion":{"aniadir":true,"certificado":false,"pagado":false,"partidaUnica":false}, "subCampos":["operacion","value","idSolicitud"]}`
  },
  {
    id                 : 'ac5ea79f-2b5e-4c0a-a432-c947f097b869',
    nombre             : 'Funcionario',
    descripcion        : 'Informacion del funcionario',
    icono              : 'badge',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"type":"funcionario","options":[{"label":"Funcionarios","name":"persons","disabled":false,"readonly":false,"autoselected":false,"required":true,"visible":true,"optionValue":"val","optionLabel":"label","typeInput":"personsList","type":"persons","edit":false,"url":"${config.app.backendUrl}api/system/usuario-cargo","multiple":false,"designColumn":"col-12"},{"label":"Tipo de documento","disabled":false,"readonly":true,"visible":true,"options":[{"val":"CI","label":"Cédula de indentidad","default":false,"active":false},{"val":"EXTRANJERO","label":"Cédula de extranjería","default":false,"active":false},{"val":"PASAPORTE","label":"Pasaporte","default":false,"active":false}],"optionValue":"val","optionLabel":"label","type":"select","name":"tipo_documento","required":false,"active":false,"designColumn":"col-3"},{"label":"Número de documento","name":"nro_documento","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-3"},{"label":"Complemento","name":"complemento","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-3"},{"label":"Fecha de Nacimiento","name":"fecha_nacimiento","disabled":false,"required":false,"readonly":true,"visible":true,"type":"date","edit":false,"designColumn":"col-3"},{"label":"Nombres","name":"nombres","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"},{"label":"Primer Apellido","name":"primer_apellido","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"},{"label":"Segundo Apellido","name":"segundo_apellido","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"},{"label":"Nro Item","name":"nro_item","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-3"},{"label":"Cargo del Funcionario","name":"cargo","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-6"},{"label":"Usuario","name":"usuario","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-3"},{"label":"Area","name":"area","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-12"},{"label":"Telefono","name":"telefono","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"},{"label":"Celular","name":"celular","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"},{"label":"Correo Electronico","name":"correo_electronico","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"},{"label":"Nivel","name":"nivel","disabled":false,"required":false,"readonly":true,"visible":true,"type":"text","edit":false,"designColumn":"col-4"}],"name":"funcionario","typeInput":"funcionario","label":"","visible":true,"edit":true,"defaultValue":{}, "subCampos": ["value", "tipoDocumento", "documento", "complemento", "fechaNacimiento", "nombres", "primerApellido", "segundoApellido", "item", "cargo", "usuario", "area", "nivel", "celular", "telefono", "correoElectronico"]}`
  },
  {
    id                 : 'ac5ea79f-2b5e-4c0a-a432-c947f097b870',
    nombre             : 'POA',
    descripcion        : 'Plan Operativo Anual',
    icono              : 'task',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : '{"type":"poa","options":[],"label":"Plan Operativo Anual","ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"required":true,"visible":true,"query":null,"typeInput":"poa","edit":true,"defaultValue":[],"configuracion":{"aniadir":true,"estructura":[{"nombre":"Acción de Mediano Plazo","visible":false},{"nombre":"Acción de Corto Plazo","visible":true},{"nombre":"Resultado Esperado","visible":true},{"nombre":"Operacion","visible":true},{"nombre":"Resultado Intermedio","visible":true}]},"url":"http://192.168.3.107/apisipfa/api/poa"}'
  },
  {
    id                 : 'ac5ea79f-2b5e-4c0a-a432-c947f097b871',
    nombre             : 'Cálculo de días viáticos',
    descripcion        : 'Cálculo de días viáticos',
    icono              : 'edit_calendar',
    estado             : 'ACTIVO',
    tipo               : 'BASICO',
    configuracion_json : `{"validations":[],"label":"Días Cálculados","url":"${config.app.sipfaUrl}CalculoViatico","subCampos":["fechaSalida","horaSalida","fechaRetorno","horaRetorno","ci","complemento","tipoViaje","tipoPorcentaje","dias"],"ariaLabel":null,"ariaLabelledBy":null,"customClass":null,"customStyles":null,"disabled":false,"placeholder":null,"autocomplete":null,"readonly":false,"visible":true,"type":"diaViaticos","typeInput":"diaViaticos","edit":true,"defaultValue":""}`
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('gestion_componente', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },

  down (queryInterface, Sequelize) { }
};
