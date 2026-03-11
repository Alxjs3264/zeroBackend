'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
	{
		id             : 'c38c70b3-56f8-4bd4-a488-a50c931a755c',
		nro_item       : '001',
		descripcion    : 'MINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'PRIMERA'
	},
	{
		id             : '00be130f-c8d5-4393-ad1a-aae3c9c77f14',
		nro_item       : '002',
		descripcion    : 'VICEMINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'SEGUNDA'
	},
	{
		id             : '618f6daa-a37e-4e18-9885-f833cdc0a697',
		nro_item       : '003',
		descripcion    : 'DIRECTOR GENERAL',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '1d2e25e9-d03b-471d-9771-cbbabe61e8e0',
		nro_item       : '004',
		descripcion    : 'JEFE DE UNIDAD II JEFE DE GABINETE',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '3e67dc17-d4bc-4427-81b1-7abedabaf6c0',
		nro_item       : '005',
		descripcion    : 'JEFE DE UNIDAD III - ESPECIALISTA I',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'cfc606bd-f72e-4048-9ec1-ed3db29f7fa9',
		nro_item       : '006',
		descripcion    : 'JEFE DE UNIDAD IV - ESPECIALISTA II',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '7b3bf00a-159d-4d05-82da-81469d066afe',
		nro_item       : '007',
		descripcion    : 'RESPONSABLE I - ESPECIALISTA III',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '567f0b42-f225-4809-a15c-776549f9d3dd',
		nro_item       : '008',
		descripcion    : 'RESPONSABLE III - PROFESIONAL II',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '89e06058-1ea0-4c2d-82bb-6dadfd2e95b6',
		nro_item       : '009',
		descripcion    : 'RESPONSABLE IV - PROFESIONAL III',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '3d9a9e92-84cd-45b6-ba10-0ad0287bb05c',
		nro_item       : '010',
		descripcion    : 'PROFESIONAL IV',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '527ee60e-26d0-49a8-a854-7e184fd733f0',
		nro_item       : '011',
		descripcion    : 'PROFESIONAL V',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'f5c15201-9cbe-4882-94b8-c4b05cc64b00',
		nro_item       : '012',
		descripcion    : 'PROFESIONAL VI',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'e682b6a8-ad0e-4dba-b0a4-3a2ad82444ab',
		nro_item       : '013',
		descripcion    : 'PROFESIONAL VII - TECNICO I',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'b65bfa1c-74c7-46b2-ad34-70f5fc84dec4',
		nro_item       : '014',
		descripcion    : 'PROFESIONAL VIII - TECNICO II',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '34ff497c-3bfc-42f8-9b0f-843fc3089aec',
		nro_item       : '015',
		descripcion    : 'PROFESIONAL IX - TECNICO III - SECRETARIA MINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '8ac2e82c-ca20-4b62-add8-cb9d6198daa7',
		nro_item       : '016',
		descripcion    : 'PROFESIONAL IX - TECNICO III - SECRETARIA MINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'a34056d6-a5de-45a5-9b48-f83e833fc909',
		nro_item       : '017',
		descripcion    : 'TECNICO IV',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '8979e6fe-93a7-4984-8d4d-fcc7f072597d',
		nro_item       : '018',
		descripcion    : 'TECNICO V - SECRETARIA VICEMINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '5ecc3aa5-58d7-487f-b460-9ea3fda791b4',
		nro_item       : '019',
		descripcion    : 'TECNICO VI - SECRETARIA DIRECCION GENERAL - CHOFER MINISTRO - UJIER MINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'c33a9bdb-0410-437a-9dab-2068aa0cf454',
		nro_item       : '020',
		descripcion    : 'ADMINISTRATIVO I - SECRETARIA UNIDAD - CHOFER VICEMINISTRO - UJIER VICEMINISTRO',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '20d3eb91-dbc1-4fef-b149-869600c5c0d8',
		nro_item       : '021',
		descripcion    : 'ADMINISTRATIVO III - UJIER DE UNIDAD',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : 'b22a2486-21b8-49c4-8982-f1895dda6aa3',
		nro_item       : '022',
		descripcion    : 'ADMINISTRATIVO IV',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		id             : '6647da2d-da4b-4760-81b1-3cc80918b518',
		nro_item       : '023',
		descripcion    : 'AUXILIAR II',
		id_tipo_puesto : '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
		nivel : 'TERCERA'
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67001",
		"nro_item" : "1",
		"descripcion" : "MINISTRO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "PRIMERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67002",
		"nro_item" : "2",
		"descripcion" : "SECRETARIA MINISTRO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67003",
		"nro_item" : "3",
		"descripcion" : "UJIER MINISTRO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67004",
		"nro_item" : "4",
		"descripcion" : "CHOFER - MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67005",
		"nro_item" : "5",
		"descripcion" : "ASESOR (A) DESPACHO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67006",
		"nro_item" : "6",
		"descripcion" : "ASESOR (A) DESPACHO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67007",
		"nro_item" : "7",
		"descripcion" : "JEFE DE GABINETE",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67008",
		"nro_item" : "8",
		"descripcion" : "TECNICO DESPACHO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67009",
		"nro_item" : "9",
		"descripcion" : "TECNICO DESPACHO ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67010",
		"nro_item" : "10",
		"descripcion" : "ASISTENTE DE DESPACHO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67011",
		"nro_item" : "11",
		"descripcion" : "OPERADOR DE VENTANILLA UNICA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67012",
		"nro_item" : "12",
		"descripcion" : "OPERADOR DE VENTANILLA UNICA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1c87b2f-6b56-40b5-bb51-1fb93bdd0112"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67013",
		"nro_item" : "13",
		"descripcion" : "JEFE DE UNIDAD COMUNICACION SOCIAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1bf2558-99ab-4e96-a380-d59e612a3fbf"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67014",
		"nro_item" : "14",
		"descripcion" : "ENCARGADO (A) DE PRENSA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1bf2558-99ab-4e96-a380-d59e612a3fbf"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67015",
		"nro_item" : "15",
		"descripcion" : "ENCARGADO (A) DE MONITOREO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1bf2558-99ab-4e96-a380-d59e612a3fbf"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67016",
		"nro_item" : "16",
		"descripcion" : "TECNICO DE DISEÑO GRAFICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67017",
		"nro_item" : "17",
		"descripcion" : "TECNICO EN COMUNICACIÓN SOCIAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1bf2558-99ab-4e96-a380-d59e612a3fbf"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67018",
		"nro_item" : "18",
		"descripcion" : "JEFE DE LA UNIDAD DE TRANSPARENCIA Y LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "dbad5d02-4d2c-4ccd-8400-03e1e87b15b1"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67019",
		"nro_item" : "19",
		"descripcion" : "TECNICO UNIDAD DE TRANSPARENCIA Y LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "dbad5d02-4d2c-4ccd-8400-03e1e87b15b1"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67020",
		"nro_item" : "20",
		"descripcion" : "JEFE DE LA UNIDAD DE AUDITORIA INTERNA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67021",
		"nro_item" : "21",
		"descripcion" : "ADMINISTRATIVO UAI",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67022",
		"nro_item" : "22",
		"descripcion" : "SUPERVISOR DE AUDITORIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67023",
		"nro_item" : "23",
		"descripcion" : "AUDITOR (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67024",
		"nro_item" : "24",
		"descripcion" : "AUDITOR (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67025",
		"nro_item" : "25",
		"descripcion" : "DIRECTOR (A) GENERAL DE PLANIFICACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2b741d29-32d0-45cc-a127-783d249cbbe8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67026",
		"nro_item" : "26",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2b741d29-32d0-45cc-a127-783d249cbbe8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67027",
		"nro_item" : "27",
		"descripcion" : "RESPONSABLE DE PLANIFICACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2b741d29-32d0-45cc-a127-783d249cbbe8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67028",
		"nro_item" : "28",
		"descripcion" : "ANALISTA EN PLANIFICACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2b741d29-32d0-45cc-a127-783d249cbbe8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67029",
		"nro_item" : "29",
		"descripcion" : "RESPONSABLE DE GESTION INSTITUCIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2b741d29-32d0-45cc-a127-783d249cbbe8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67030",
		"nro_item" : "30",
		"descripcion" : "ANALISTA EN PLANIFICACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2b741d29-32d0-45cc-a127-783d249cbbe8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67031",
		"nro_item" : "31",
		"descripcion" : "DIRECTOR (A) GENERAL DE ASUNTOS JURIDICOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67032",
		"nro_item" : "32",
		"descripcion" : "SECRETARIA (O)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67034",
		"nro_item" : "34",
		"descripcion" : "ABOGADO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67035",
		"nro_item" : "35",
		"descripcion" : "ABOGADO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67036",
		"nro_item" : "36",
		"descripcion" : "ABOGADO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67037",
		"nro_item" : "37",
		"descripcion" : "JEFE UNIDAD DE ANALISIS JURIDICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67038",
		"nro_item" : "38",
		"descripcion" : "ABOGADO (A) ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67039",
		"nro_item" : "39",
		"descripcion" : "ABOGADO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67040",
		"nro_item" : "40",
		"descripcion" : "ABOGADO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "14cd84de-c4e3-4734-8fb6-107ecfbca71d"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67042",
		"nro_item" : "42",
		"descripcion" : "DIRECTOR (A) GENERAL DE ASUNTOS ADMINISTRATIVOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "0c808214-3e58-4d69-be67-b62a7babb473"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67043",
		"nro_item" : "43",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "0c808214-3e58-4d69-be67-b62a7babb473"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67044",
		"nro_item" : "44",
		"descripcion" : "TECNICO ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "0c808214-3e58-4d69-be67-b62a7babb473"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67045",
		"nro_item" : "45",
		"descripcion" : "PROFESIONAL DGAA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "0c808214-3e58-4d69-be67-b62a7babb473"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67046",
		"nro_item" : "46",
		"descripcion" : "JEFE UNIDAD FINANCIERA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67047",
		"nro_item" : "47",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67048",
		"nro_item" : "48",
		"descripcion" : "ENCARGADA DEL SISTEMA PENAL PARA ADOLESCENTES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67049",
		"nro_item" : "49",
		"descripcion" : "ANALISTA ADMINISTRATIVO FINANCIERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67050",
		"nro_item" : "50",
		"descripcion" : "ANALISTA ADMINISTRATIVO FINANCIERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67051",
		"nro_item" : "51",
		"descripcion" : "ANALISTA ADMINISTRATIVO FINANCIERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67052",
		"nro_item" : "52",
		"descripcion" : "ENCARGADO DE PRESUPUESTOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67053",
		"nro_item" : "53",
		"descripcion" : "TECNICO PRESUPUESTARIO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67054",
		"nro_item" : "54",
		"descripcion" : "ENCARGADO DE CONTABILIDAD",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67055",
		"nro_item" : "55",
		"descripcion" : "PROFESIONAL EN REDES Y COMUNICACIONES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67056",
		"nro_item" : "56",
		"descripcion" : "CONTADOR (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67057",
		"nro_item" : "57",
		"descripcion" : "ENCARGADO DE TESORERIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67058",
		"nro_item" : "58",
		"descripcion" : "TECNICO DE TESORERIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67059",
		"nro_item" : "59",
		"descripcion" : "TECNICO DE TESORERIA - PASAJES Y VIATICOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "62aa499f-e22b-47e6-9ead-defacb7d2739"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67060",
		"nro_item" : "60",
		"descripcion" : "JEFE UNIDAD DE RECURSOS HUMANOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67061",
		"nro_item" : "61",
		"descripcion" : "TECNICO EN ADMINISTRACION DE PERSONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67062",
		"nro_item" : "62",
		"descripcion" : "HABILITADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67063",
		"nro_item" : "63",
		"descripcion" : "TECNICO DE REGISTRO Y ARCHIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67064",
		"nro_item" : "64",
		"descripcion" : "CONTROL DE PERSONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67065",
		"nro_item" : "65",
		"descripcion" : "TECNICO EN GESTION DE PERSONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67066",
		"nro_item" : "66",
		"descripcion" : "TECNICO EN SEGURIDAD SOCIAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67067",
		"nro_item" : "67",
		"descripcion" : "JEFE UNIDAD ADMINISTRATIVA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67068",
		"nro_item" : "68",
		"descripcion" : "ADMINISTRATIVO UA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67069",
		"nro_item" : "69",
		"descripcion" : "ENCARGADO DE CONTRATACIONES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67070",
		"nro_item" : "70",
		"descripcion" : "TECNICO EN CONTRATACIONES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67071",
		"nro_item" : "71",
		"descripcion" : "TECNICO EN CONTRATACIONES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67072",
		"nro_item" : "72",
		"descripcion" : "TECNICO EN CONTRATACIONES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67073",
		"nro_item" : "73",
		"descripcion" : "ENCARGADO (A) DE ALMACENES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67074",
		"nro_item" : "74",
		"descripcion" : "ENCARGADO (A) DE BIBLIOTECA Y ARCHIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67075",
		"nro_item" : "75",
		"descripcion" : "ENCARGADO DE ACTIVOS FIJOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67076",
		"nro_item" : "76",
		"descripcion" : "TECNICO ACTIVOS FIJOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67077",
		"nro_item" : "77",
		"descripcion" : "TECNICO ACTIVOS FIJOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67078",
		"nro_item" : "78",
		"descripcion" : "ENCARGADO SERVICIOS GENERALES E INFRAESTRUCTURA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67079",
		"nro_item" : "79",
		"descripcion" : "SERVICIOS GENERALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67080",
		"nro_item" : "80",
		"descripcion" : "AUXILIAR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67081",
		"nro_item" : "81",
		"descripcion" : "OPERARIO DE SERVICIO DE TE ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67082",
		"nro_item" : "82",
		"descripcion" : "PORTERO (A)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67083",
		"nro_item" : "83",
		"descripcion" : "OPERADOR DE CENTRAL TELEFONICA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67084",
		"nro_item" : "84",
		"descripcion" : "OPERARIO  EN MANTENIMIENTO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67085",
		"nro_item" : "85",
		"descripcion" : "ENCARGADO TECNOLOGIAS DE  INFORMACIÓN Y COMUNICACIÓN",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67086",
		"nro_item" : "86",
		"descripcion" : "PROFESIONAL DE INFRAESTRUCTURA Y RECURSOS TECNOLOGICOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67087",
		"nro_item" : "87",
		"descripcion" : "PROFESIONAL EN SISTEMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67089",
		"nro_item" : "89",
		"descripcion" : "PROFESIONAL EN DESARROLLO DE SISTEMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67090",
		"nro_item" : "90",
		"descripcion" : "SOPORTE DE SISTEMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67091",
		"nro_item" : "91",
		"descripcion" : "TECNICO EN SISTEMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67092",
		"nro_item" : "92",
		"descripcion" : "VICEMINISTRA (O) DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "SEGUNDA",
		"id_unidad_organizacional" : "a35a5d08-61e9-443c-b8b6-935c3be85fcc"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67093",
		"nro_item" : "93",
		"descripcion" : "SECRETARIA ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a35a5d08-61e9-443c-b8b6-935c3be85fcc"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67094",
		"nro_item" : "94",
		"descripcion" : "CHOFER MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a35a5d08-61e9-443c-b8b6-935c3be85fcc"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67095",
		"nro_item" : "95",
		"descripcion" : "AUXILIAR MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a35a5d08-61e9-443c-b8b6-935c3be85fcc"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67096",
		"nro_item" : "96",
		"descripcion" : "DIRECTOR (A) GENERAL DE JUSTICIA INDIGENA ORIGINARIO CAMPESINA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2d78da8c-5527-47d2-b68a-6cbb25a5f582"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67097",
		"nro_item" : "97",
		"descripcion" : "TECNICO VJIOC ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "2d78da8c-5527-47d2-b68a-6cbb25a5f582"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67098",
		"nro_item" : "98",
		"descripcion" : "VICEMINISTRA (O) DE IGUALDAD DE OPORTUNIDADES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "SEGUNDA",
		"id_unidad_organizacional" : "7fd59690-5b78-4de9-89e1-c99eb50d9b8b"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67099",
		"nro_item" : "99",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7fd59690-5b78-4de9-89e1-c99eb50d9b8b"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67100",
		"nro_item" : "100",
		"descripcion" : "CHOFER MESAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7fd59690-5b78-4de9-89e1-c99eb50d9b8b"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67101",
		"nro_item" : "101",
		"descripcion" : "AUXILIAR MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7fd59690-5b78-4de9-89e1-c99eb50d9b8b"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67102",
		"nro_item" : "102",
		"descripcion" : "ANALISIS Y SEGUIMIENTO DEL VIO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7fd59690-5b78-4de9-89e1-c99eb50d9b8b"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67103",
		"nro_item" : "103",
		"descripcion" : "DIRECTOR (A) GENERAL DE PERSONAS CON DISCAPACIDAD",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "42bf9ec3-206b-4004-83ec-1978c8d2dac8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67104",
		"nro_item" : "104",
		"descripcion" : "TRANSVERSALIZACION DE LA TEMATICA DE DISCAPACIDAD",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "42bf9ec3-206b-4004-83ec-1978c8d2dac8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67105",
		"nro_item" : "105",
		"descripcion" : "ANALISTA EN TEMATICA DE  DISCAPACIDAD",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "42bf9ec3-206b-4004-83ec-1978c8d2dac8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67106",
		"nro_item" : "106",
		"descripcion" : "ANALISTA EN TEMATICA DE  DISCAPACIDAD",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "42bf9ec3-206b-4004-83ec-1978c8d2dac8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67107",
		"nro_item" : "107",
		"descripcion" : "DIRECTOR (A) GENERAL DE PREVENCION Y ELIMINACION DE TODA FORMA DE VIOLENCIA EN RAZON DE GENERO Y GENERACIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "5c7a46e1-85b4-478f-b1eb-b2575076d5c2"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67109",
		"nro_item" : "109",
		"descripcion" : "ANALISTA EN TEMATICA DE GENERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "5c7a46e1-85b4-478f-b1eb-b2575076d5c2"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67110",
		"nro_item" : "110",
		"descripcion" : "ANALISTA EN TEMATICA DE GENERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "5c7a46e1-85b4-478f-b1eb-b2575076d5c2"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67111",
		"nro_item" : "111",
		"descripcion" : "ANALISTA EN TEMATICA DE GENERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "5c7a46e1-85b4-478f-b1eb-b2575076d5c2"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67112",
		"nro_item" : "112",
		"descripcion" : "DIRECTOR (A) GENERAL DE NIÑEZ Y PERSONAS ADULTAS MAYORES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67113",
		"nro_item" : "113",
		"descripcion" : "ENCARGADO DE TRANSVERZALIZACION DE DERECHOS DE LA NIÑEZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67114",
		"nro_item" : "114",
		"descripcion" : "ANALISTA EN TEMATICA DE NIÑEZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67115",
		"nro_item" : "115",
		"descripcion" : "ANALISTA DEL SISTEMA PENAL PARA ADOLECENTES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67116",
		"nro_item" : "116",
		"descripcion" : "ANALISTA EN TEMATICA DE NIÑEZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67118",
		"nro_item" : "118",
		"descripcion" : "ENCARGADO DE TRANSVERSALIZACION DEL ENFOQUE DE DERECHOS DE LAS PERSONAS ADULTAS MAYORES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67119",
		"nro_item" : "119",
		"descripcion" : "ANALISTA EN ADULTOS MAYORES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67120",
		"nro_item" : "120",
		"descripcion" : "ANALISTA EN ADULTOS MAYORES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "be125912-386e-4125-b85e-2051988809c9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67121",
		"nro_item" : "121",
		"descripcion" : "DIRECTOR (A) PLURINACIONAL DE LA JUVENTUD",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7e90d048-4c5e-4c69-b839-97b47c08740a"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67123",
		"nro_item" : "123",
		"descripcion" : "ANALISTA EN TEMATICA DE JUVENTUDES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7e90d048-4c5e-4c69-b839-97b47c08740a"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67124",
		"nro_item" : "124",
		"descripcion" : "ANALISTA EN TEMATICA DE JUVENTUDES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7e90d048-4c5e-4c69-b839-97b47c08740a"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67125",
		"nro_item" : "125",
		"descripcion" : "VICEMINISTRO (A) DE DEFENSA DE LOS DERECHOS DEL USUARIO Y DEL CONSUMIDOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "SEGUNDA",
		"id_unidad_organizacional" : "7a738b57-1c9e-487f-8eef-72f52ee4dfb9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67126",
		"nro_item" : "126",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7a738b57-1c9e-487f-8eef-72f52ee4dfb9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67127",
		"nro_item" : "127",
		"descripcion" : "CHOFER MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7a738b57-1c9e-487f-8eef-72f52ee4dfb9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67128",
		"nro_item" : "128",
		"descripcion" : "AUXILIAR MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7a738b57-1c9e-487f-8eef-72f52ee4dfb9"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67129",
		"nro_item" : "129",
		"descripcion" : "DIRECTOR (A) GENERAL DE DEFENSA DE LOS DERECHOS DEL USUARIO Y CONSUMIDOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67130",
		"nro_item" : "130",
		"descripcion" : "ENCARGADO (A) DE CAUC",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67131",
		"nro_item" : "131",
		"descripcion" : "TECNICO CAUC",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67132",
		"nro_item" : "132",
		"descripcion" : "TECNICO CAUC",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "c1bf2558-99ab-4e96-a380-d59e612a3fbf"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67133",
		"nro_item" : "133",
		"descripcion" : "TECNICO CAUC",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67134",
		"nro_item" : "134",
		"descripcion" : "TECNICO CAUC",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67135",
		"nro_item" : "135",
		"descripcion" : "JEFE UNIDAD DE POLITICAS, NORMAS Y PROYECTOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67136",
		"nro_item" : "136",
		"descripcion" : "ENCARGADO (A) DE ASESORAMIENTO EN APLICACIÓN DE NORMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67137",
		"nro_item" : "137",
		"descripcion" : "ENCARGADO (A) DE NORMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67138",
		"nro_item" : "138",
		"descripcion" : "JEFE UNDIAD DE EDUCACION Y DIFUSION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67139",
		"nro_item" : "139",
		"descripcion" : "ENCARGADO (A) DE DIFUSION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67141",
		"nro_item" : "141",
		"descripcion" : "VICEMINISTRO (A) DE JUSTICIA Y DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "SEGUNDA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67142",
		"nro_item" : "142",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67143",
		"nro_item" : "143",
		"descripcion" : "ADMINISTRATIVO VJDF",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67144",
		"nro_item" : "144",
		"descripcion" : "CHOFER MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67145",
		"nro_item" : "145",
		"descripcion" : "AUXILIAR MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67146",
		"nro_item" : "146",
		"descripcion" : "TECNICO ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67147",
		"nro_item" : "147",
		"descripcion" : "DIRECTOR GENERAL DE REGISTRO PUBLICO DE LA ABOGACIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67148",
		"nro_item" : "148",
		"descripcion" : "AUXILIAR ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67149",
		"nro_item" : "149",
		"descripcion" : "ENCARGADO DE DENUNCIAS Y CONCILIACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67150",
		"nro_item" : "150",
		"descripcion" : "ABOGADO (A) RPA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67151",
		"nro_item" : "151",
		"descripcion" : "TECNICO RPA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67152",
		"nro_item" : "152",
		"descripcion" : "ENCARGADO RPA COCHABAMBA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67153",
		"nro_item" : "153",
		"descripcion" : "ENCARGADO RPA SANTA CRUZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67154",
		"nro_item" : "154",
		"descripcion" : "ENCARGADA RPA CHUQUISACA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67155",
		"nro_item" : "155",
		"descripcion" : "DIRECTOR (A) GENERAL DE JUSTICIA Y DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67156",
		"nro_item" : "156",
		"descripcion" : "AUXILIAR ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67157",
		"nro_item" : "157",
		"descripcion" : "RESPONSABLE DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67158",
		"nro_item" : "158",
		"descripcion" : "PROFESIONAL EN DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67159",
		"nro_item" : "159",
		"descripcion" : "PROFESIONAL EN DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67160",
		"nro_item" : "160",
		"descripcion" : "PROFESIONAL EN DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67161",
		"nro_item" : "161",
		"descripcion" : "RESPONSABLE JUSTICIA Y ANALISIS NORMATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67162",
		"nro_item" : "162",
		"descripcion" : "PROFESIONAL EN JUSTICIA Y ANALISIS NORMATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67163",
		"nro_item" : "163",
		"descripcion" : "PROFESIONAL EN JUSTICIA Y ANALISIS NORMATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67164",
		"nro_item" : "164",
		"descripcion" : "PROFESIONAL EN JUSTICIA Y ANALISIS NORMATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67165",
		"nro_item" : "165",
		"descripcion" : "PROFESIONAL EN JUSTICIA Y ANALISIS NORMATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67166",
		"nro_item" : "166",
		"descripcion" : "RESPONSABLE DE TRATA Y TRAFICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67167",
		"nro_item" : "167",
		"descripcion" : "PROFESIONAL EN TRATA Y TRAFICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67168",
		"nro_item" : "168",
		"descripcion" : "TECNICO TRATA Y TRAFICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67169",
		"nro_item" : "169",
		"descripcion" : "TECNICO TRATA Y TRAFICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67170",
		"nro_item" : "170",
		"descripcion" : "JEFE DE UNIDAD SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67171",
		"nro_item" : "171",
		"descripcion" : "AUXILIAR ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67172",
		"nro_item" : "172",
		"descripcion" : "TECNICO ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67173",
		"nro_item" : "173",
		"descripcion" : "TECNICO JURIDICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67174",
		"nro_item" : "174",
		"descripcion" : "ENCARGADO DEPARTAMENTAL SIJPLU LA PAZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67175",
		"nro_item" : "175",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67176",
		"nro_item" : "176",
		"descripcion" : "PSICOLOGO(A) SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67177",
		"nro_item" : "177",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67178",
		"nro_item" : "178",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67179",
		"nro_item" : "179",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67181",
		"nro_item" : "181",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67182",
		"nro_item" : "182",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67183",
		"nro_item" : "183",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67184",
		"nro_item" : "184",
		"descripcion" : "PSICOLOGO(A) SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67185",
		"nro_item" : "185",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67186",
		"nro_item" : "186",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67187",
		"nro_item" : "187",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67188",
		"nro_item" : "188",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67189",
		"nro_item" : "189",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67190",
		"nro_item" : "190",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67191",
		"nro_item" : "191",
		"descripcion" : "ENCARGADO DEPARTAMENTAL SIJPLU COCHABAMBA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67192",
		"nro_item" : "192",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67193",
		"nro_item" : "193",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67194",
		"nro_item" : "194",
		"descripcion" : "PSICOLOGO(A) SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67195",
		"nro_item" : "195",
		"descripcion" : "ENCARGADO DEPARTAMENTAL SIJPLU SANTA CRUZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67196",
		"nro_item" : "196",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67197",
		"nro_item" : "197",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67198",
		"nro_item" : "198",
		"descripcion" : "PSICOLOGO(A) SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67199",
		"nro_item" : "199",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67200",
		"nro_item" : "200",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67201",
		"nro_item" : "201",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67202",
		"nro_item" : "202",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67203",
		"nro_item" : "203",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67204",
		"nro_item" : "204",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67205",
		"nro_item" : "205",
		"descripcion" : "ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67207",
		"nro_item" : "207",
		"descripcion" : "DIRECTOR (A) GENERAL DE DESARROLLO CONSTITUCIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67208",
		"nro_item" : "208",
		"descripcion" : "AUXILIAR ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67209",
		"nro_item" : "209",
		"descripcion" : "ESPECIALISTA EN DESARROLLO CONSTITUCIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67210",
		"nro_item" : "210",
		"descripcion" : "ESPECIALISTA EN DESARROLLO CONSTITUCIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67211",
		"nro_item" : "211",
		"descripcion" : "PROFESIONAL EN DESARROLLO CONSTITUCIONAL ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67212",
		"nro_item" : "212",
		"descripcion" : "PROFESIONAL EN DESARROLLO CONSTITUCIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67213",
		"nro_item" : "213",
		"descripcion" : "PROFESIONAL EN DESARROLLO CONSTITUCIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fbfbcb62-d10b-436d-a70f-03f01d9b17da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67214",
		"nro_item" : "214",
		"descripcion" : "DIRECTOR GENERAL DE DERECHO INTERNACIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "04d5e16a-fb10-4968-bcff-48350651f4f8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67215",
		"nro_item" : "215",
		"descripcion" : "AUXILIAR ADMINISTRATIVO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "04d5e16a-fb10-4968-bcff-48350651f4f8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67216",
		"nro_item" : "216",
		"descripcion" : "PROFESIONAL DE DERECHO INTERNACIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "04d5e16a-fb10-4968-bcff-48350651f4f8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67217",
		"nro_item" : "217",
		"descripcion" : "PROFESIONAL DE DERECHO INTERNACIONAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "04d5e16a-fb10-4968-bcff-48350651f4f8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67218",
		"nro_item" : "218",
		"descripcion" : "VICEMINISTRO (A) DE TRANSPARENCIA INSTITUCIONAL Y LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "SEGUNDA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67219",
		"nro_item" : "219",
		"descripcion" : "SECRETARIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67220",
		"nro_item" : "220",
		"descripcion" : "CHOFER MENSAJERO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67221",
		"nro_item" : "221",
		"descripcion" : "ESPECIALISTA EN  TRANSPARENCIA INSTITUCIONAL Y LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67222",
		"nro_item" : "222",
		"descripcion" : "PROFESIONAL LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67223",
		"nro_item" : "223",
		"descripcion" : "TECNICO PROCURADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67224",
		"nro_item" : "224",
		"descripcion" : "JEFE DE UNIDAD DE PROCESAMIENTO PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67225",
		"nro_item" : "225",
		"descripcion" : "PROFESIONAL ABOGADO EN MATERIA PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172125"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67227",
		"nro_item" : "227",
		"descripcion" : "PROFESIONAL ABOGADO EN MATERIA PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172125"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67228",
		"nro_item" : "228",
		"descripcion" : "PROFESIONAL ABOGADO EN MATERIA PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172125"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67229",
		"nro_item" : "229",
		"descripcion" : "PROFESIONAL ABOGADO EN MATERIA PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172125"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67230",
		"nro_item" : "230",
		"descripcion" : "JEFE DE UNIDAD DE ADMISION DE DENUNCIAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67231",
		"nro_item" : "231",
		"descripcion" : "ANALISTA DE ADMISION DE DENUNCIAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172124"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67232",
		"nro_item" : "232",
		"descripcion" : "ANALISTA DE ADMISION DE DENUNCIAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172124"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67233",
		"nro_item" : "233",
		"descripcion" : "DIRECTOR GENERAL DE PREVENCION, PROMOCION DE LA ETICA Y TRANSPARENCIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67234",
		"nro_item" : "234",
		"descripcion" : "ANALISTA EN PROMOCION DE LIDERAZGOS E INNOVACION EN TRANSPARENCIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67235",
		"nro_item" : "235",
		"descripcion" : "JEFE DE UNIDAD DE PARTICIPACION ,CONTROL SOCIAL Y ACCESO A LA INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67236",
		"nro_item" : "236",
		"descripcion" : "ANALISTA DE PARTICIPACION, CONTROL SOCIAL Y ACCESO A LA INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67237",
		"nro_item" : "237",
		"descripcion" : "ANALISTA DE PARTICIPACION, CONTROL SOCIAL Y ACCESO A LA INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67238",
		"nro_item" : "238",
		"descripcion" : "ANALISTA EN TRANSPARENCIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67239",
		"nro_item" : "239",
		"descripcion" : "JEFE DE UNIDAD DE ETICA PUBLICA, GESTION DE RIESGOS Y PROCESAMIENTO DE LA INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67240",
		"nro_item" : "240",
		"descripcion" : "ANALISTA DE ETICA PUBLICA, GESTION DE RIESGOS Y PROCESAMIENTO DE LA INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67241",
		"nro_item" : "241",
		"descripcion" : "ANALISTA DE ETICA PUBLICA, GESTION DE RIESGOS Y PROCESAMIENTO DE LA INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "7834ed96-7438-4931-9f5b-03f8091eb1da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67242",
		"nro_item" : "242",
		"descripcion" : "DIRECTOR GENERAL DE LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67243",
		"nro_item" : "243",
		"descripcion" : "PROFESIONAL EN LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67244",
		"nro_item" : "244",
		"descripcion" : "JEFE DE UNIDAD DE INVESTIGACION DE ACTOS DE CORRUPCION EN ENTIDADES PUBLICAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67245",
		"nro_item" : "245",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67246",
		"nro_item" : "246",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67247",
		"nro_item" : "247",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67248",
		"nro_item" : "248",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67249",
		"nro_item" : "249",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67250",
		"nro_item" : "250",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67251",
		"nro_item" : "251",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67252",
		"nro_item" : "252",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67253",
		"nro_item" : "253",
		"descripcion" : "PROFESIONAL AUDITOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67254",
		"nro_item" : "254",
		"descripcion" : "TECNICO ABOGADO ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67255",
		"nro_item" : "255",
		"descripcion" : "JEFE DE UNIDAD DE RECUPERACION DE BIENES E INTELIGENCIA FINANCIERA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67256",
		"nro_item" : "256",
		"descripcion" : "PROFESIONAL ABOGADO EN MATERIA PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67257",
		"nro_item" : "257",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67258",
		"nro_item" : "258",
		"descripcion" : "PROFESIONAL ABOGADO EN MATERIA PENAL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67259",
		"nro_item" : "259",
		"descripcion" : "PROFESIONAL INGENIERO CIVIL",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67260",
		"nro_item" : "260",
		"descripcion" : "JEFE DE UNIDAD DEL SIIARBE",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67261",
		"nro_item" : "261",
		"descripcion" : "ABOGADO VERIFICADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67262",
		"nro_item" : "262",
		"descripcion" : "ABOGADO VERIFICADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67263",
		"nro_item" : "263",
		"descripcion" : "ANALISTA FINANCIERO VERIFICADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67264",
		"nro_item" : "264",
		"descripcion" : "ANALISTA FINANCIERO VERIFICADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67265",
		"nro_item" : "265",
		"descripcion" : "ANALISTA FINANCIERO VERIFICADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67266",
		"nro_item" : "266",
		"descripcion" : "ABOGADO VERIFICADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67268",
		"nro_item" : "268",
		"descripcion" : "ABOGADO PROCESADOR DE INFORMACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67269",
		"nro_item" : "269",
		"descripcion" : "TECNICO ESTADISTICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67270",
		"nro_item" : "270",
		"descripcion" : "RESPONSABLE DEPARTAMENTAL SANTA CRUZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67271",
		"nro_item" : "271",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172122"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67272",
		"nro_item" : "272",
		"descripcion" : "RESPONSABLE DEPARTAMENTAL COCHABAMBA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67273",
		"nro_item" : "273",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172121"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67274",
		"nro_item" : "274",
		"descripcion" : "RESPONSABLE DEPARTAMENTAL CHUQUISACA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67275",
		"nro_item" : "275",
		"descripcion" : "PROFESIONAL ABOGADO ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172120"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67276",
		"nro_item" : "276",
		"descripcion" : "ABOGADO ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172120"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67277",
		"nro_item" : "277",
		"descripcion" : "RESPONSABLE DEPARTAMENTAL TARIJA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67279",
		"nro_item" : "279",
		"descripcion" : "RESPONSABLE DEPARTAMENTAL BENI",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67280",
		"nro_item" : "280",
		"descripcion" : "PROFESIONAL ABOGADO ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172119"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67284",
		"nro_item" : "10003",
		"descripcion" : "PROFESIONAL IX -  AUDITOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67289",
		"nro_item" : "10008",
		"descripcion" : "TECNICO VI - AUDITOR JUNIOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67303",
		"nro_item" : "10022",
		"descripcion" : "ADMINISTRATIVO III - APOYO, PARA EL VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES (VJDF)",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67310",
		"nro_item" : "10029",
		"descripcion" : "ADMINISTRATIVO III - APOYO PARA EL VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67317",
		"nro_item" : "10036",
		"descripcion" : "TECNICO VI - ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67319",
		"nro_item" : "10038",
		"descripcion" : "PROFESIONAL VIII - MEDICO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "0c808214-3e58-4d69-be67-b62a7babb473"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67326",
		"nro_item" : "10045",
		"descripcion" : "TECNICO EN ATENCION DE USUARIO Y AL CONSUMIDOR - LA PAZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67328",
		"nro_item" : "10047",
		"descripcion" : "ADMINISTRATIVO I - UJIER DE DESPACHO VICEMINISTERIO DE TRANSPARENCIA INSTITUCIONAL Y LUCHA CONTRA LA CORRUPCION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67339",
		"nro_item" : "10053",
		"descripcion" : "ADMINISTRATIVO IV -  TECNICO PARA LA ATENCION DEL USUARIO Y CONSUMIDOR - ORURO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67348",
		"nro_item" : "10062",
		"descripcion" : "TECNICO VI - ABOGADO SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67357",
		"nro_item" : "10066",
		"descripcion" : "TECNICO VI - DESARROLLADOR DE SISTEMAS RPA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67358",
		"nro_item" : "10067",
		"descripcion" : "TECNICO V - PROFESIONAL EN COORDINACION DE ACTIVIDADES DE DIFUSION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67361",
		"nro_item" : "10070",
		"descripcion" : "TECNICO VI - ADMINISTRATIVO SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67369",
		"nro_item" : "10078",
		"descripcion" : "TECNICO VI - ABOGADO PARA EL DEPARTAMENTO DE ORURO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67372",
		"nro_item" : "10081",
		"descripcion" : "TECNICO V - APOYO PARA EL VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67377",
		"nro_item" : "10084",
		"descripcion" : "TECNICO VI - TECNICO ATENCION AL USUARIO Y AL CONSUMIDOR  CAUC ORURO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67380",
		"nro_item" : "20008",
		"descripcion" : "COORDINADORA PARA EL PROYECTO APOYO A LA IMPLEMENTACION DE LA POLITICA PUBLICA INTEGRAL PARA UNA VIDA DIGNA DE LAS MUJERES 2DO. AÑO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b3",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "5c7a46e1-85b4-478f-b1eb-b2575076d5c2"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67393",
		"nro_item" : "281",
		"descripcion" : "JEFE DE UNIDAD DE DEFENSA DEL LITIGANTE",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "bca3ddde-63df-4354-8fd6-6a44f3950430"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67394",
		"nro_item" : "282",
		"descripcion" : "PROFESIONAL ABOGADO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172127"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67395",
		"nro_item" : "283",
		"descripcion" : "PROFESIONAL ANALISTA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172127"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67396",
		"nro_item" : "284",
		"descripcion" : "PROFESIONAL ANALISTA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172127"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67397",
		"nro_item" : "285",
		"descripcion" : "PROCURADOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b1",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "28d0e4ec-7eeb-4a35-bd27-489aaa172127"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67411",
		"nro_item" : "10112",
		"descripcion" : "TECNICO VI - ABOGADO SIJPLU",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "c404327e-cd83-4824-8837-0ac49bc67412",
		"nro_item" : "10113",
		"descripcion" : "TECNICO IV- APOYO SERVICIOS GENERALES E INFRAESTRUCTURA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "10ceae52-8b05-4fc6-a7e4-0029573cf1fe",
		"nro_item" : "10116",
		"descripcion" : "ADMINISTRATIVO I - OPERADOR DE REGISTRO Y ARCHIVO URH",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "458b076f-9b08-4798-830b-770d7f750090"
	},
	{
		"id" : "0b16d6fa-ac32-4d45-bc87-ccfcd58c62c2",
		"nro_item" : "10117",
		"descripcion" : "TECNICO V - ABOGADO DE REGISTRO Y CONTROL 1",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "bae7e48f-5705-4a3c-b5fe-fae38e9f35a8",
		"nro_item" : "10118",
		"descripcion" : "ADMINISTRATIVO I - APOYO OPERATIVO - LA PAZ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "1f3afeb3-d253-4e3e-a189-f48f2885efbe",
		"nro_item" : "10119",
		"descripcion" : "TECNICO V - ABOGADO DE LA SECRETARIA TECNICA DEL TRIBUNAL DE ETICA DE LA ABOGACIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "36b34815-4e82-4437-b913-1f82cdb9203c",
		"nro_item" : "10120",
		"descripcion" : "TECNICO V - PROFESIONAL ENCARGADO DEL SISTEMA INFORMATICO DEL DGRPA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "38457ca7-8a22-468f-badf-0b715ac0e96e",
		"nro_item" : "10121",
		"descripcion" : "TECNICO V -  PROFESIONAL ENCARGADO DE ORGANIZACIÓN   DE EVENTOS ACADEMICOS DE ABOGADAS Y ABOGADOS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "5cadfddf-6a57-4a22-bce8-74e398758793",
		"nro_item" : "10122",
		"descripcion" : "PROFESIONAL PARA LA ATENCION DEL USUARIO Y EL CONSUMIDOR EL ALTO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "3f00b39e-391f-4cb7-b39d-7c59b8d1f26b",
		"nro_item" : "10123",
		"descripcion" : "OPERADOR DEL REGISTRO UAF",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "e09812b9-ef7b-476d-a798-58abe5f90527",
		"nro_item" : "10125",
		"descripcion" : "ADMINISTRATIVO I - OPERADOR DE REGISTRO UA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "0c808214-3e58-4d69-be67-b62a7babb473"
	},
	{
		"id" : "0eb18f37-cba9-49d0-ad3d-dcb4ca9c68ce",
		"nro_item" : "10126",
		"descripcion" : "PROFESIONAL PARA LA ATENCION DEL USUARIO Y CONSUMIDOR COCHABAMBA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "b787e410-81a7-4766-ba06-28bbe27c8908",
		"nro_item" : "10127",
		"descripcion" : "ADMINISTRATIVO I - DESARROLLADOR DE SISTEMAS",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a4f0bae3-3570-4b1a-923d-086e31fbb9ad"
	},
	{
		"id" : "3b66944b-8273-4a7b-9c33-718147800f42",
		"nro_item" : "10129",
		"descripcion" : "TECNICO VI - ABOGADO SIJPLU ",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "81e5e18c-d5f6-40f1-b033-b30840343976"
	},
	{
		"id" : "d8bbf72c-f11e-4f71-9a67-e6edbd7c7412",
		"nro_item" : "10130",
		"descripcion" : "ADMINISTRATIVO I - AUDITOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "bba4fa92-5241-430e-ae28-cad95b1f96e6",
		"nro_item" : "10131",
		"descripcion" : "ADMINISTRATIVO I - AUDITOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "18c7946f-cd61-4658-af1b-709c8c87cc77",
		"nro_item" : "10132",
		"descripcion" : "PROFESIONAL IX - AUDITOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "f844fc25-12dc-4c63-a86d-e0622ab5f739",
		"nro_item" : "10133",
		"descripcion" : "TECNICO VI - DESARROLLADOR DE SISTEMAS RPA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "2d78a0e7-7ca0-4150-afba-a4c8c0ef8b81",
		"nro_item" : "10134",
		"descripcion" : "ADMINISTRATIVO I - AUDITOR",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8595bcb2-3e1a-441e-9628-a624381197da"
	},
	{
		"id" : "fef25c0c-60e2-4ac8-bc12-61eafbdda446",
		"nro_item" : "10135",
		"descripcion" : "TECNICO V - ABOGADO PARA LA GESTION DEL TRIBUNAL DE ETICA DE LA ABOGACIA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "fd64ebd2-eaa3-4ac5-b390-b631e681c350",
		"nro_item" : "10136",
		"descripcion" : "ADMINISTRATIVO IV - TECNICO PARA LA ATENCION DEL USUARIO Y CONSUMIDOR TARIJA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "c1a9d89c-78dc-491b-ac66-09cf04e8a871",
		"nro_item" : "10137",
		"descripcion" : "ADMINISTRATIVO III - TECNICO PARA LA ATENCION DEL USUARIO Y CONSUMIDOR EL ALTO",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "10740370-334a-499e-90f7-64929f312caa",
		"nro_item" : "10138",
		"descripcion" : "ADMINISTRATIVO I - ASISTENTE DE APOYO EN LA ADMINISTRACION DE GESTION DE DENUNCIAS DE LA DGLCC",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "424316db-13b6-4ffe-886f-4b02d38acaa8"
	},
	{
		"id" : "fba0c408-5bec-439d-9132-f73603cfa395",
		"nro_item" : "10139",
		"descripcion" : "ADMINISTRATIVO IV - TECNICO PARA LA ATENCION DEL USUARIO  Y CONSUMIDOR COBIJA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "6c983471-a2af-4faf-846c-02f1559c9414"
	},
	{
		"id" : "eab6ef6c-52a9-4cd4-8088-e5c78b066bc9",
		"nro_item" : "10140",
		"descripcion" : "TECNICO V - ABOGADO DEL CENTRO DE CONCILIACION",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "103031db-5dd3-4f7c-a0a5-d09c4dfc3164",
		"nro_item" : "10141",
		"descripcion" : "TECNICO V - ABOGADO DE REGISTRO Y CONTROL 2",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "46be3d47-53a7-410f-8edb-2087c353a577",
		"nro_item" : "10142",
		"descripcion" : "ADMINISTRATIVO III - APOYO, PARA EL VICEMINISTERIO DE JUSTICIA Y DERECHOS FUNDAMENTALES",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "a2ab7879-89f7-4cf7-ab28-3a0de3c1e041"
	},
	{
		"id" : "ac60ec1b-bf3d-4e53-895f-3faa3ceb7ada",
		"nro_item" : "10143",
		"descripcion" : "ADMINISTRATIVO I - APOYO SECRETARIAL DE LA DGRPA",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "8f6f4e9f-971c-48c6-8a82-8dafde78b171"
	},
	{
		"id" : "175bb6c4-11d2-456c-84bf-af525552f1fb",
		"nro_item" : "10144",
		"descripcion" : "PENDIENTE",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b2",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "9ea29273-45d8-41c7-9372-9497f50bc1c8",
		"nro_item" : "20012",
		"descripcion" : "TECNICO VI DEL PROYECTO SIPPASE",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b3",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "5c7a46e1-85b4-478f-b1eb-b2575076d5c2"
	},
	{
		"id" : "e9713e3b-56fb-4812-aace-180d57d4cba6",
		"nro_item" : "50001",
		"descripcion" : "MARCAJE SEPMUD 1",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b4",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "2926cf36-f770-4851-9573-68173b92f402",
		"nro_item" : "50002",
		"descripcion" : "MARCAJE SEPMUD 2",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b4",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	},
	{
		"id" : "cf06fd3e-9ac8-4ed5-bab1-49bd7b508579",
		"nro_item" : "50003",
		"descripcion" : "MARCAJE SEPMUD 3",
		"id_tipo_puesto" : "760f0dd0-59ef-4c6c-bdf5-1277992054b4",
		"nivel" : "TERCERA",
		"id_unidad_organizacional" : "fe2026c8-523e-4ef9-ac91-38a5fd8c522c"
	}
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('planificacion_cargo', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
