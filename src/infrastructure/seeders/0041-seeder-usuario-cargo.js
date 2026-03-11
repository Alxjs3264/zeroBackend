'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
		"id" : "8537540d-f2b2-4d11-821b-b9a8ab28bb24",
		"id_usuario" : "55eebb09-e036-44d0-8c5c-ebc145df595c",
		"id_cargo" : "f844fc25-12dc-4c63-a86d-e0622ab5f739",
		"estado" : "ACTIVO"
	},
	{
		"id" : "11c99815-b780-4a70-9083-efa3f7490df3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3001",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67069",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1e445b9e-d427-4f6e-895e-ba7d5c62619e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3002",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67187",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f6657c3e-9f03-4ef3-9867-16ea3f0125ab",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3003",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67158",
		"estado" : "ACTIVO"
	},
	{
		"id" : "323d983a-930b-40f3-9154-d765b28f9246",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3004",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67245",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d13bfdad-3943-47a0-9e69-1af1b889d618",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3005",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67037",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b5de913b-c7cf-4989-b115-5d7af36cfb33",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3006",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67139",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8e5aaa4e-df9f-4830-8241-1149f93363d2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3007",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67092",
		"estado" : "ACTIVO"
	},
	{
		"id" : "12868e94-615a-4879-b0c4-f3493bfec15f",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3008",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67114",
		"estado" : "ACTIVO"
	},
	{
		"id" : "580214bd-4f42-405b-964e-09b44fa13f86",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3009",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67163",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9cbbc397-6e65-4168-b53c-46b81d7b4165",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3010",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67247",
		"estado" : "ACTIVO"
	},
	{
		"id" : "18f0b52e-0f0b-4d51-9b3b-c3bb5934e1ee",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3011",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67101",
		"estado" : "ACTIVO"
	},
	{
		"id" : "99f9a11f-c0c0-4bb9-9dbe-48837128cdc3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3012",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67121",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2690caa8-97f9-439c-af9d-902122bf61ae",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3013",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67002",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1c5d7815-5877-414c-a4d5-d0678f66e2d5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3014",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67212",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c70b8148-d3ee-4117-9969-c805e7cbf416",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3015",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67007",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b23e992b-f24d-4761-a14f-e060b3d16683",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3016",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67175",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d125bd4d-0d46-46f0-8776-d1762d542410",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3017",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67166",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0b2dbaaa-ecad-4de0-82f5-09a461969126",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3018",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67036",
		"estado" : "ACTIVO"
	},
	{
		"id" : "7c23685f-541e-45ad-a803-7b5855df373a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3019",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67043",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2eaa9e38-824e-4751-bd7c-be2ad7bee494",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3020",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67225",
		"estado" : "ACTIVO"
	},
	{
		"id" : "309d48fe-d1b7-468c-83f8-f93423388f23",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3021",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67100",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c87ed683-a019-4b5c-a6bf-cacb930e0963",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3022",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67195",
		"estado" : "ACTIVO"
	},
	{
		"id" : "33ed86ac-ab9e-4f0d-a199-39b40864f60e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3023",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67146",
		"estado" : "ACTIVO"
	},
	{
		"id" : "39ba85b8-d6df-48f2-99e5-538268f30221",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3024",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67253",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3dc61319-2aef-40cb-ac6c-6b9c8197f278",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3025",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67144",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1f32268d-8843-4901-8291-bdb163157f68",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3026",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67096",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f41b8b8e-810a-4678-b2b2-167bcb2fe71c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3027",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67143",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8088f927-df82-43e2-8e7b-404a712811f5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3028",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67238",
		"estado" : "ACTIVO"
	},
	{
		"id" : "24a633ba-ff93-49f2-adb6-11fee0caa34e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3029",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67031",
		"estado" : "ACTIVO"
	},
	{
		"id" : "fd2542cf-a98c-4f1d-92a1-de271ea0d828",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3030",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67211",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c133613b-e0e6-4ce2-a973-d1f33a367b79",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3031",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67058",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ee372cf1-3679-49b0-85b5-d5853dfdcdda",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3032",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67073",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d0ff394c-f9e2-48d5-99bd-398c86fdac90",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3033",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67235",
		"estado" : "ACTIVO"
	},
	{
		"id" : "07c1b2ef-e895-43f4-81f5-6becb77af9d4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3034",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67207",
		"estado" : "ACTIVO"
	},
	{
		"id" : "cd3ef892-0277-4fa8-981b-bb85aee865e4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3035",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67074",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e348686b-6a7f-4b59-b42f-a06f8b52f1a6",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3036",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67045",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2d38655c-3bba-4975-81f9-5a4c68c158a0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3037",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67110",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a6e83631-ce32-4061-8d02-51d55c3bca79",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3038",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67057",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8482828b-228f-431d-be78-e16e3d4e7ff8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3039",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67150",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9f21fc4c-0df2-4001-b77e-d16bfeffcdc0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3040",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67227",
		"estado" : "ACTIVO"
	},
	{
		"id" : "85db709b-1254-4ce5-b60e-95165a8767b8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3041",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67154",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d5163f95-4120-4cb9-be46-af21c38ed649",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3042",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67078",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6ad04ba0-6a3a-4f0e-bff6-f18cee3e86ab",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3043",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67080",
		"estado" : "ACTIVO"
	},
	{
		"id" : "24bdd1ad-7209-45b8-92f9-303943587c5a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3044",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67191",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b4c759fa-8c3b-4781-b680-f609b3109e84",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3046",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67050",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9458b788-06e4-43df-a27f-8b67b4cd0819",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3047",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67147",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a478ee65-d0f7-4a73-af4f-ee46741c1875",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3048",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67034",
		"estado" : "ACTIVO"
	},
	{
		"id" : "597f1b61-24ed-4896-933d-137e0fc53bc6",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3049",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67394",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3f2a02e5-9c0b-4adf-869e-4329851bf7ea",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3050",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67049",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3aa4eefc-d23f-45db-9118-5e5c8ad09d20",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3051",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67168",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5a158fd9-45bc-4c64-b92d-4aba38666c03",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3053",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67161",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bc4ca56b-9445-4495-81f4-906794bb4a44",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3054",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67160",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d2433565-e41d-4986-9c7d-7ee0f8f46be2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3055",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67090",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a4e16a31-e231-4db3-8791-41641c66d98e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3056",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67098",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c1cf7c99-8c28-4aab-92a9-96000fc762af",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3057",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67005",
		"estado" : "ACTIVO"
	},
	{
		"id" : "65322414-ef35-481f-8ee7-9639b7bf83d5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3058",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67085",
		"estado" : "ACTIVO"
	},
	{
		"id" : "05ca3020-21fe-4580-bf74-c2973b281ee0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3059",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67111",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f3f30461-058f-48ac-85f8-087c45dc5ba8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3060",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67126",
		"estado" : "ACTIVO"
	},
	{
		"id" : "178b5fb9-7c78-4827-8dd1-690933ac23e7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3061",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67003",
		"estado" : "ACTIVO"
	},
	{
		"id" : "134dfd5d-f5f2-44eb-8e11-a29beefc5760",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3062",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67081",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5e4f56f4-4342-4eda-885b-50154f0063bb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3063",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67001",
		"estado" : "ACTIVO"
	},
	{
		"id" : "442530c4-6db7-4433-b16b-c21edc2ad742",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3064",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67042",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a78583c8-1b36-4519-b75a-7dd417136307",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3065",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67064",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8fae6efe-463f-4090-b67e-6836b040e87b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3066",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67053",
		"estado" : "ACTIVO"
	},
	{
		"id" : "17eb2b11-3a83-45d6-8296-10262ddff448",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3067",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67395",
		"estado" : "ACTIVO"
	},
	{
		"id" : "dcdf5c53-ca1a-48b3-b804-9e5e1900e5d0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3068",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67065",
		"estado" : "ACTIVO"
	},
	{
		"id" : "16702f0e-b50a-4f89-9943-d3fa26df12f7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3069",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67026",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1c4e4645-7e6d-4a2d-bb3d-49c44099a1e3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3070",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67152",
		"estado" : "ACTIVO"
	},
	{
		"id" : "21efb0d5-5d7a-495c-85ef-94f45685db44",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3071",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67233",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2ed56562-43a2-499b-a427-553c8c9b6744",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3072",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67044",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f028f41d-4a3e-44de-af46-e272302d0d32",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3073",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67038",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0a8f8377-23e2-4bf4-ab16-b3b858fe2c05",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3075",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67047",
		"estado" : "ACTIVO"
	},
	{
		"id" : "07377b90-2eca-4968-b8d7-c56602157eb3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3076",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67244",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a765eaf5-8c96-4aec-8492-5bf13e38341b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3077",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67014",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1789e8f5-e16e-45c0-81a7-8fda0ad4ebeb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3078",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67224",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bb47daf2-8b17-45fa-bca1-e7d7554147eb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3079",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67095",
		"estado" : "ACTIVO"
	},
	{
		"id" : "586526f9-61bb-45e6-bbe9-edfa36f7bbc3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3080",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67214",
		"estado" : "ACTIVO"
	},
	{
		"id" : "533fe1fc-de78-49be-824e-26d987bf6e80",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3081",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67157",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8c2795f3-f627-4fdc-9588-ad77c0be614d",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3082",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67106",
		"estado" : "ACTIVO"
	},
	{
		"id" : "7380e560-e504-46f0-a4c1-c39321bc318c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3083",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67255",
		"estado" : "ACTIVO"
	},
	{
		"id" : "876b2a2e-e383-4cd4-9a13-afcb92000ac9",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3171",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67203",
		"estado" : "ACTIVO"
	},
	{
		"id" : "979906c7-6ad1-4279-b0da-764d77c9c41c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3084",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67205",
		"estado" : "ACTIVO"
	},
	{
		"id" : "dc2fd48d-b448-4ddb-bb79-2e6ebdb1ed37",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3085",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67020",
		"estado" : "ACTIVO"
	},
	{
		"id" : "eb648585-a336-4afa-8f70-b640cabbe2bc",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3086",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67167",
		"estado" : "ACTIVO"
	},
	{
		"id" : "70cfa210-3df2-4145-9153-225cf887b513",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3087",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67076",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e16cb87a-e3cd-4845-8d8c-007c23af4224",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3088",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67070",
		"estado" : "ACTIVO"
	},
	{
		"id" : "47ce5069-a24d-418c-bbbc-dfb1586161c2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3090",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67178",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e2217289-8bc4-4299-af95-493aa748db11",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3091",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67213",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9db60c1f-f44e-460b-8bc8-c62dc19da333",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3092",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67164",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f106f802-c84f-4bf1-af65-a4fa51babf52",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3093",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67262",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6a6ce723-db42-4fe6-a4a7-0a937c3676dc",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3094",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67054",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8e0ebd52-f9a2-4abd-8df8-802883270b9b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3095",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67222",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c0a60b17-44fb-4f09-9f93-04bdc8c49b43",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3097",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67228",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d03dce0a-7635-42c9-bb38-4ea76cfd6924",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3098",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67024",
		"estado" : "ACTIVO"
	},
	{
		"id" : "532bdedd-f38c-4439-bab4-c2ca19c6be3c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3099",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67220",
		"estado" : "ACTIVO"
	},
	{
		"id" : "22315dfa-9659-4796-8846-4fba3c9b3827",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3100",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67217",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e279ca8f-a3da-458c-a226-000910713a06",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3101",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67082",
		"estado" : "ACTIVO"
	},
	{
		"id" : "73420b4e-dab8-4071-8479-c79a1bf4eb38",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3102",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67120",
		"estado" : "ACTIVO"
	},
	{
		"id" : "949af608-e8bb-46a2-80ae-c877425febb0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3103",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67218",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9d7a87c1-3956-46af-b57e-48bdacaed35c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3105",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67131",
		"estado" : "ACTIVO"
	},
	{
		"id" : "389c5d86-fff9-479e-89b7-f617af84a137",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3106",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67196",
		"estado" : "ACTIVO"
	},
	{
		"id" : "fdf16f59-862f-4c59-b390-f666c12b8063",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3107",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67259",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1242023c-df8f-4dc0-9402-72c31c967258",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3108",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67230",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3b81e5de-1b49-40a1-ab2d-e8ca488acff0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3109",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67266",
		"estado" : "ACTIVO"
	},
	{
		"id" : "93c84891-e051-470a-bb7b-18581d6aa7b3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3110",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67138",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2078ecb0-4d23-4c6d-b77e-cba9364e2cdf",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3111",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67025",
		"estado" : "ACTIVO"
	},
	{
		"id" : "74302e73-fa16-4b1d-84ea-28181b7c77d9",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3112",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67257",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9ea68867-2ce1-4d4a-9296-edfa8523b837",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3113",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67112",
		"estado" : "ACTIVO"
	},
	{
		"id" : "31ce1d38-2093-40b9-8b0d-1d2fa06e0aa8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3114",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67156",
		"estado" : "ACTIVO"
	},
	{
		"id" : "834c1209-9f31-4642-a618-002289654a0c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3115",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67239",
		"estado" : "ACTIVO"
	},
	{
		"id" : "66e816d6-757b-4402-80a0-d9d55e4bf95c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3116",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67242",
		"estado" : "ACTIVO"
	},
	{
		"id" : "738ee74d-f32c-4bfe-ba26-83f9cedde0e2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3117",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67275",
		"estado" : "ACTIVO"
	},
	{
		"id" : "312e16ba-b483-4fc9-b2db-b5a036fe39f7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3118",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67141",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0de8d85b-430b-4825-9563-b8aecadd9163",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3119",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67125",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9c5f4e2e-f1f0-4148-8540-8789611a9c4a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3120",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67252",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8d7c5f1e-70c2-4ea7-9391-0529c5e7641e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3121",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67145",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9db6a8b5-220c-4d18-a278-2bd6ec56457f",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3122",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67129",
		"estado" : "ACTIVO"
	},
	{
		"id" : "969e6912-2aec-414c-8db3-3ae054461058",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3123",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67174",
		"estado" : "ACTIVO"
	},
	{
		"id" : "caebb66d-3fb7-4fa1-92f7-a54616c2b49b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3124",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67099",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9f09daaa-9859-4c1f-80d7-884bd9538a9c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3125",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67061",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0f19c4b9-12e7-4fb3-a7f5-0dda85d13da7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3126",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67215",
		"estado" : "ACTIVO"
	},
	{
		"id" : "7c1af9e1-5ee5-45ca-902c-06fc61dde49e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3127",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67190",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5d2f9860-0c82-448b-a284-814c67166485",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3128",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67004",
		"estado" : "ACTIVO"
	},
	{
		"id" : "92debb63-d436-455f-ad42-8d5f12eb1ef2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3129",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67181",
		"estado" : "ACTIVO"
	},
	{
		"id" : "eba38653-c4be-45e3-9119-002c3bf430b2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3130",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67261",
		"estado" : "ACTIVO"
	},
	{
		"id" : "edddd274-ce30-46ce-86d5-e5e600f650a9",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3131",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67170",
		"estado" : "ACTIVO"
	},
	{
		"id" : "993cee26-46d3-4c23-b146-de80e4cb9129",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3132",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67216",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d7da0214-36d4-42d1-af31-0e322c040011",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3133",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67083",
		"estado" : "ACTIVO"
	},
	{
		"id" : "77afd8c8-18ee-4b8b-ab62-6dfcfb258247",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3134",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67059",
		"estado" : "ACTIVO"
	},
	{
		"id" : "28bed07a-e740-42b3-9684-318ba4d7d582",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3135",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67219",
		"estado" : "ACTIVO"
	},
	{
		"id" : "38129d06-8e2c-41e2-8fab-e60a917eed90",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3136",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67116",
		"estado" : "ACTIVO"
	},
	{
		"id" : "238dec43-0332-47b5-a707-20a501740b04",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3137",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67135",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0cdf12c8-a038-4153-8b07-10da7441c2b8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3138",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67011",
		"estado" : "ACTIVO"
	},
	{
		"id" : "908c1b26-b7cb-4f17-a18c-1ba3bb20e44c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3139",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67113",
		"estado" : "ACTIVO"
	},
	{
		"id" : "14fc1bac-0c69-44fa-8a45-91d033a4e90b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3140",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67067",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e53b0cec-f67a-4030-98e5-c1012e8dbd69",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3141",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67279",
		"estado" : "ACTIVO"
	},
	{
		"id" : "83635d61-267e-45ae-a06d-aa0e3a246e6c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3142",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67046",
		"estado" : "ACTIVO"
	},
	{
		"id" : "628f896b-fcfc-483c-ae6b-4ade48a6dde4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3143",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67012",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e12b7a6b-699f-4013-92f4-61a9073a9f2d",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3145",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67176",
		"estado" : "ACTIVO"
	},
	{
		"id" : "fbe0a6a4-43fd-482d-b3a0-ab0f7d5ce556",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3146",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67086",
		"estado" : "ACTIVO"
	},
	{
		"id" : "41924d37-dcb6-4fbf-a5f6-b96abf8b1a7f",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3147",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67202",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8b520286-bef7-40b8-a9dd-82903482dc1e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3148",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67186",
		"estado" : "ACTIVO"
	},
	{
		"id" : "041b7556-1ed8-4fb5-aaa0-ea65f696884d",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3149",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67185",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a25c823c-266e-4bb0-ba47-50bb00af1644",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3150",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67013",
		"estado" : "ACTIVO"
	},
	{
		"id" : "29893223-9378-4fdf-9ec4-d052b475ef8f",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3151",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67006",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a4da87b2-abd1-45ab-b704-38807d20f758",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3152",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67079",
		"estado" : "ACTIVO"
	},
	{
		"id" : "eb2c2597-3f05-4ac8-9006-bdb3de7e6920",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3153",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67022",
		"estado" : "ACTIVO"
	},
	{
		"id" : "fa58f60d-ea74-455b-8cb6-7da5bd66e62e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3154",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67093",
		"estado" : "ACTIVO"
	},
	{
		"id" : "eecbb313-2e1c-4e2f-a935-23045560b3ee",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3155",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67084",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2a6e5607-477c-4179-9c66-affa7e10c366",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3156",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67091",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a07cf73d-fc18-4c97-96d4-2aa5309e5f26",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3157",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67107",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a5ed6311-ae54-4bed-a113-906610621715",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3159",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67240",
		"estado" : "ACTIVO"
	},
	{
		"id" : "acc88f67-e496-4fef-bba8-7175b7d96b21",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3160",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67028",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b351934e-e686-4b56-be70-5699192851e4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3161",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67089",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4107520a-0d0e-4998-8624-d71d9ba0ea4d",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3162",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67149",
		"estado" : "ACTIVO"
	},
	{
		"id" : "78b6d795-df52-4299-9d9c-9d720d5d6994",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3163",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67184",
		"estado" : "ACTIVO"
	},
	{
		"id" : "38fcb92a-b21e-4fdc-8b59-1ba0e12d198a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3164",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67183",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0cbc74a9-24f5-4ac8-8c71-3d69f975fa59",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3165",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67192",
		"estado" : "ACTIVO"
	},
	{
		"id" : "15e1e956-c8bb-4a00-a83c-b5c670c27905",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3166",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67066",
		"estado" : "ACTIVO"
	},
	{
		"id" : "da63cbec-193f-4d1a-b4e5-4018d1a00e27",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3167",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67254",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b79f9cd8-b0f6-41fb-8d63-0d0b9e899406",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3168",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67250",
		"estado" : "ACTIVO"
	},
	{
		"id" : "262fbb0d-ba8c-4848-a62b-bcb5dc7dd70f",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3169",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67027",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c0ad6448-c4f8-4d4b-900a-00a752c25baa",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3170",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67118",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c0709ef7-b750-4659-96a4-b0a474594fd9",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3172",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67132",
		"estado" : "ACTIVO"
	},
	{
		"id" : "742c4537-6c25-4892-950a-5bef7ef04602",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3173",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67198",
		"estado" : "ACTIVO"
	},
	{
		"id" : "410b42e2-f263-4870-827a-3d8604f5816e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3174",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67008",
		"estado" : "ACTIVO"
	},
	{
		"id" : "91f43f29-3f7e-463c-a67a-b300b9bf8130",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3175",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67210",
		"estado" : "ACTIVO"
	},
	{
		"id" : "60a365d6-edfa-4c3f-bdd8-d3e8f08f384e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3176",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67188",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3c39ae37-2cef-4f2a-aad2-cc09c99204ab",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3177",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67029",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f3d2a20a-945e-4ec9-9307-3e53f8fb96e7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3178",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67052",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8e149c79-bb69-4c57-80ae-ad9ba54b415c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3179",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67016",
		"estado" : "ACTIVO"
	},
	{
		"id" : "7bbbd7b4-f3bb-46c4-b7d7-e3767cd156ac",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3180",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67179",
		"estado" : "ACTIVO"
	},
	{
		"id" : "28600940-ebf4-4542-8282-126763a3d7ea",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3181",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67194",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3e6ecba8-21ab-4309-8d15-e575f46d0cbb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3182",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67197",
		"estado" : "ACTIVO"
	},
	{
		"id" : "13d602a0-2459-4b25-b3f3-24ebe017aa21",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3183",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67268",
		"estado" : "ACTIVO"
	},
	{
		"id" : "78ebc06d-0da2-45b1-acca-6f86df5f716e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3185",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67040",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ae292b95-0efd-4d47-9791-57d02ce34cf0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3186",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67193",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2ae42699-8d77-4d76-b9ac-efd4d397f7a7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3187",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67243",
		"estado" : "ACTIVO"
	},
	{
		"id" : "61fc5768-928a-438c-8b35-f2052010a6d8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3190",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67221",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9f96cc82-efcf-4898-9763-b50d674b3a86",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3191",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67177",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3f20d3f3-b7e5-4736-b6a5-06f02dcc1ec8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3192",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67169",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c03c5d60-8019-4abe-8b20-f56069343e7b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3193",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67151",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ce64a24e-d629-46dd-b37e-962fcf8e05d5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3194",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67263",
		"estado" : "ACTIVO"
	},
	{
		"id" : "cab6c4d6-e061-4aa4-af22-ff09e0183f08",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3195",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67265",
		"estado" : "ACTIVO"
	},
	{
		"id" : "edd02fb3-3a2a-4903-888d-eebfa59deb5a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3197",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67071",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4dedcb45-98b4-490e-9ee0-f8eb9b78b50a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3198",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67397",
		"estado" : "ACTIVO"
	},
	{
		"id" : "847325af-8d67-4ee5-a83c-74c2a9fcc635",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3199",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67035",
		"estado" : "ACTIVO"
	},
	{
		"id" : "77728385-24f6-490d-80f7-06ab5b208ed2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3200",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67199",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5246051d-4407-4da3-8721-5c49889a08d5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3201",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67075",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d36b82f6-8504-4b2a-892f-d8cdecb5bf7e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3202",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67229",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ef0fdf89-48cd-48f6-a384-719f21df8187",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3204",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67009",
		"estado" : "ACTIVO"
	},
	{
		"id" : "23f21002-a457-4097-9f18-804cd56177ce",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3205",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67260",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5f2b5ccc-f45f-4c21-beae-835d8c3e97d4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3206",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67246",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ad768e0b-d0c2-454a-8ba3-c2f1119ba695",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3208",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67393",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b898f595-5622-4ef7-8ff4-74d2e90540ba",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3209",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67155",
		"estado" : "ACTIVO"
	},
	{
		"id" : "57e23e5d-fb7a-4e48-994f-61bde762e9c1",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3210",
		"id_cargo" : "fd64ebd2-eaa3-4ac5-b390-b631e681c350",
		"estado" : "ACTIVO"
	},
	{
		"id" : "cc3b8d3d-f15d-4820-a059-7656fb66899c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3211",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67264",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b5c09bba-0a76-4132-acf7-25833c0452e5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3212",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67189",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a7d004e6-f7d0-474e-b2d4-dd82bc0064a5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3213",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67056",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2a04ef56-f798-4d24-b3a6-13707b3e6b24",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3214",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67271",
		"estado" : "ACTIVO"
	},
	{
		"id" : "894570b0-e674-4e29-8a5a-b11362fce6cf",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3215",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67162",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0353f6e8-63d9-40e7-8fd3-f7d588694e60",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3216",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67249",
		"estado" : "ACTIVO"
	},
	{
		"id" : "40627309-576f-480f-a166-ce25f5cfaeea",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3217",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67109",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2f2c1095-03da-4326-b0ec-752c6f96616a",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3218",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67015",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d6b1290e-f5dd-4a4b-b19f-1741d81d6fd4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3219",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67048",
		"estado" : "ACTIVO"
	},
	{
		"id" : "7b84fbf5-797a-44b9-b810-9e31b9347861",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3222",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67280",
		"estado" : "ACTIVO"
	},
	{
		"id" : "350d603c-3b38-4c7f-9825-7ba8f7267686",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3223",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67115",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1800a115-f50c-4b58-b5f3-0820e437e0f1",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3224",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67060",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1a7ac4cb-8bca-4d20-a5ff-2ea32bc00573",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3225",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67204",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6a3f68a9-96c3-4be3-8e88-5a74e17a30e6",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3226",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67021",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6e6d4968-6a05-47d7-85f9-8ec8c6ade35e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3227",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67223",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d2906a2c-b498-48a2-b9fd-8fa962facbc8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3228",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67248",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6ffd8845-e86f-4fcc-878b-a6677b0d0673",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3229",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67128",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bf01270d-e24e-48b4-bec2-351874d31fbb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3230",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67274",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ddf3d67c-dc9b-48a7-9de0-c3fe20c00b12",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3232",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67272",
		"estado" : "ACTIVO"
	},
	{
		"id" : "42dc1380-e0ab-48f8-8326-897b55764946",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3233",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67010",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b9eedb5a-b025-4c76-9aad-5a00abde6317",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3234",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67055",
		"estado" : "ACTIVO"
	},
	{
		"id" : "36f6340c-9e77-4896-8ac3-90f04522e6a6",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3235",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67232",
		"estado" : "ACTIVO"
	},
	{
		"id" : "06667cf8-6780-4547-bf9b-1d158a6bd2ec",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3236",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67172",
		"estado" : "ACTIVO"
	},
	{
		"id" : "cf919add-cc34-44be-8f1d-87e3a10b1941",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3237",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67165",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a9303933-dbf1-45f4-9b2f-48c0e05e09fb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3238",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67133",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ded927e0-695f-4c5d-afb7-008f3a2c23ab",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3239",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67256",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5cab4bf5-baab-44b1-860a-75b888467363",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3240",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67276",
		"estado" : "ACTIVO"
	},
	{
		"id" : "15109477-07ae-42f4-9594-3312da2cd2e3",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3241",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67102",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5dfb78ee-becf-40a1-b819-d7666a24b796",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3242",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67201",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2cfa1811-1d2a-4726-ac63-7046fd6366e8",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3243",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67062",
		"estado" : "ACTIVO"
	},
	{
		"id" : "801d6489-1003-4a8d-bede-d73c4d185536",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3244",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67077",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b9cebe1e-72ba-4ee8-8743-898e3192ee98",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3246",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67269",
		"estado" : "ACTIVO"
	},
	{
		"id" : "66f3ba6e-7fa6-4791-9e16-d63a7c34bc94",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3248",
		"id_cargo" : "5cadfddf-6a57-4a22-bce8-74e398758793",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f942c7e7-82cd-485e-8dac-0a82290bc29c",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3249",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67039",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e7741c9e-ad25-4974-9098-2a946ea9c7d6",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3250",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67142",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c8ab4741-3533-4757-a80f-6c523218e0b5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3251",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67063",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f51c7b59-3ee5-4b61-ae4c-d7e3ccf43472",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3252",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67137",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5884d460-1360-4dab-a118-c3543d0b80b2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3253",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67136",
		"estado" : "ACTIVO"
	},
	{
		"id" : "541d7767-3f18-4474-aa4b-a04af9a1f842",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3254",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67105",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2eabfd2f-0961-4d37-bb62-c4e41898a8b5",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3255",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67019",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9b604a29-952c-41d3-ad54-fba4296765b9",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3256",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67241",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a8ec6fdb-d22d-422d-8fa6-9273c04933f4",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3257",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67396",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0fb8d6d7-69c1-44c8-8c53-c176f9b9c7a7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3258",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67237",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e2ce27d8-e923-474c-8dec-ddce8d39db7e",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3259",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67018",
		"estado" : "ACTIVO"
	},
	{
		"id" : "cefbfc6d-82ba-494b-89a7-9774c2af49d0",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3262",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67209",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d64ac465-eaa6-4160-ae1d-dd345e2f74e2",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3263",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67094",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bca3d893-5ae7-4ad9-a4b8-97caa8f8a4c7",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3264",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67171",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ab20f331-d65a-42cb-8bb2-c4d185a10ebb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3265",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67051",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e3117926-dda8-46b9-8e64-84c68c742a2b",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3266",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67097",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8df32e11-1dc6-49ff-aa73-8ecc0d786955",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3267",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67119",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c4c27fbe-f712-4ac2-9b98-9c4b616c0eeb",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3268",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67182",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d5ebb069-74b3-46b9-9349-06269e372d73",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3269",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67148",
		"estado" : "ACTIVO"
	},
	{
		"id" : "daec892f-e7e7-40dc-ab9f-e420597ac868",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3270",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67251",
		"estado" : "ACTIVO"
	},
	{
		"id" : "ebf2de5c-ecd3-4b8b-863a-292a61ae2f01",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3271",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67023",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b482d3e5-0809-49dc-af7c-9db06b329881",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3272",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67103",
		"estado" : "ACTIVO"
	},
	{
		"id" : "db3f2824-8279-45a8-9f0e-5c014c05c0af",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3273",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67208",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bfb5bcf8-988a-448f-8850-f94f6e2981ef",
		"id_usuario" : "a01be97b-4116-4357-839f-807e37ee3274",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67273",
		"estado" : "ACTIVO"
	},
	{
		"id" : "60e373bd-950a-4c3f-acfe-70b7f3116b9f",
		"id_usuario" : "99535530-04f6-43a2-9572-e1794b207eb6",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67017",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3233144c-005d-438f-a767-a830b05792ef",
		"id_usuario" : "e486275c-5040-4c74-a440-0fe5263e7c62",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67030",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9616bee9-e84b-4b76-8734-c1b5e6f0a37f",
		"id_usuario" : "861528b1-7f5e-4a41-8dd0-6dd9d3d014d7",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67032",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0f703241-4146-4e18-b25a-80f94a258184",
		"id_usuario" : "74e36ec2-f823-408b-8993-efba6493bc0a",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67068",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f7ceac9b-d08a-4e5d-9d31-ee726b59a01a",
		"id_usuario" : "bc73047b-b54f-4f55-95e3-357069a248fd",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67072",
		"estado" : "ACTIVO"
	},
	{
		"id" : "31dd8ed4-64ce-43d0-8d93-9424ae534d55",
		"id_usuario" : "a043d9b6-fb77-4bdf-86c8-0d12e69495f8",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67087",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6402feb2-b840-44dd-8458-1fb8d7682168",
		"id_usuario" : "93695613-1077-4639-85f0-066d0accc6d3",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67104",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b56986ed-dac7-4a0d-b3c7-fbd57081c99c",
		"id_usuario" : "a83a50c8-e348-42e7-adfa-dc5ecaba41e6",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67123",
		"estado" : "ACTIVO"
	},
	{
		"id" : "66e7386e-deed-4887-9470-d8ac386913a7",
		"id_usuario" : "3e32581b-de3c-4ee8-ba02-7c501d0b4278",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67124",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a76a702c-7d50-4a0c-b216-546a17b844ad",
		"id_usuario" : "a77d582c-0c4a-423a-8e49-44752791f045",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67127",
		"estado" : "ACTIVO"
	},
	{
		"id" : "259ade0c-15b3-44ca-a23e-4121256ee0ac",
		"id_usuario" : "fd5ff180-314b-4b27-82ba-3d89276c66a8",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67130",
		"estado" : "ACTIVO"
	},
	{
		"id" : "efebb3c0-584c-4429-94c0-5f6ec1229ef3",
		"id_usuario" : "896799ce-56b0-443b-ae28-d03d66ead8f6",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67134",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1db00941-fe11-441d-9e8a-c844b307f815",
		"id_usuario" : "9b1fadff-7624-4567-a030-300b15001f15",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67153",
		"estado" : "ACTIVO"
	},
	{
		"id" : "92c7e42a-e8bf-484b-a694-31e49804c516",
		"id_usuario" : "9b59cd93-06d8-4d80-9cb7-79a37132a110",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67159",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6b6145d8-a30d-45f4-aefb-951379786d9d",
		"id_usuario" : "3e512d28-f534-4d07-baed-9c474591627b",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67173",
		"estado" : "ACTIVO"
	},
	{
		"id" : "55a349dc-faac-4f32-ae49-de5b5fde098a",
		"id_usuario" : "7382c4c0-56b4-4618-ad0d-f6ca6c7ddb3f",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67200",
		"estado" : "ACTIVO"
	},
	{
		"id" : "73734422-2f29-490c-bfbd-3f3d37e4a3fd",
		"id_usuario" : "822f0fd2-0a14-4cec-b835-9a1d39d5b6d7",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67231",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d6ade4fc-b4c2-40ff-bf56-80db1f100a66",
		"id_usuario" : "30281724-c9bc-4d61-82fa-c6d6de56aa8c",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67234",
		"estado" : "ACTIVO"
	},
	{
		"id" : "c8938b2c-8f05-4412-9175-91a9aa604c19",
		"id_usuario" : "e07b83f7-30ff-4024-a13a-9d61b831175e",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67236",
		"estado" : "ACTIVO"
	},
	{
		"id" : "916cab5e-ef0c-4407-88bd-dffe88e57bf0",
		"id_usuario" : "9f05627c-7a4a-48c7-8591-bc31f9caa781",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67258",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5ac51838-cab0-4b90-81c8-752dc80a1215",
		"id_usuario" : "1fae3e08-fa02-4300-ba10-58e789bbe378",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67270",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8378fb79-b511-485c-80c7-c89af8ef0b3d",
		"id_usuario" : "af311846-a59c-473c-a8b2-8b02b56737ec",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67277",
		"estado" : "ACTIVO"
	},
	{
		"id" : "424da73d-c299-4f15-95f5-0f42d45d479e",
		"id_usuario" : "48228e96-bb1f-4743-9954-8ae55bcfe79f",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67284",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9b9c0e61-84c2-4aa5-acd6-336bd57c89f5",
		"id_usuario" : "373d49b6-ccff-4c49-bab2-b91732aed17e",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67289",
		"estado" : "ACTIVO"
	},
	{
		"id" : "da6871e3-324d-4adb-83ef-54079de32b75",
		"id_usuario" : "8d6a7a7c-f265-4961-8d88-b900535b0c39",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67303",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f0644e18-2bbf-46de-8fbe-63d818786d96",
		"id_usuario" : "84348936-56b2-4d0f-8e25-5d7b9b394ee3",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67310",
		"estado" : "ACTIVO"
	},
	{
		"id" : "8ee5c669-6327-4c46-8116-c993fce6823b",
		"id_usuario" : "407e24d5-5d8d-4bf4-9729-fd8a23b2e1db",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67317",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d80f126c-afd0-4d9b-bd6c-f40a737cb07c",
		"id_usuario" : "7f0777f7-6a8b-47a7-ab2a-ea30421b5488",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67319",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d86f7d50-6339-45f8-bd7a-db0c0087bc2c",
		"id_usuario" : "1cd388dc-c841-4c83-b42b-6f8dd2be6e75",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67326",
		"estado" : "ACTIVO"
	},
	{
		"id" : "6254f66b-c7f7-4ca7-afdd-75a809cb74bc",
		"id_usuario" : "c90dff0c-c88d-4891-8bc8-5283b1ce8528",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67328",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d34df590-7b32-434e-b835-0782cce9ed13",
		"id_usuario" : "c07cf116-15cd-4aef-a665-dbfe9dd65add",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67339",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a01fc8b4-9811-455b-8260-6e74f88096f5",
		"id_usuario" : "660d1c3a-d0a3-41b4-808b-48313cdd5ad6",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67348",
		"estado" : "ACTIVO"
	},
	{
		"id" : "3fef07e9-4a27-4538-9f54-b7cd05eb6da7",
		"id_usuario" : "383850a9-5d8f-4b08-a3dc-a150581e4b0f",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67357",
		"estado" : "ACTIVO"
	},
	{
		"id" : "246be72a-a9ce-4ce8-829a-bd76a4bb658a",
		"id_usuario" : "d53cd39f-6e75-4a83-a9b7-83787ac0313a",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67358",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bacbd652-a92b-4a2f-abd4-aa94d8e3defb",
		"id_usuario" : "9057a6b4-77d3-4283-98b9-eeda8336e1e3",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67361",
		"estado" : "ACTIVO"
	},
	{
		"id" : "aa5757ba-7426-42df-95dd-a883698c12c4",
		"id_usuario" : "4d0f0aed-6763-4051-86c0-e0aff28cec96",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67369",
		"estado" : "ACTIVO"
	},
	{
		"id" : "b885fec4-b097-4e21-a721-9fa734716d08",
		"id_usuario" : "1bbe094e-0966-43ca-a0c8-113956738b61",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67372",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f6fe8ed3-eb71-4829-884a-73bebf4009f2",
		"id_usuario" : "a496894f-2f54-4088-a846-ec41dddbb102",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67377",
		"estado" : "ACTIVO"
	},
	{
		"id" : "cb3a60f8-4893-4141-b97b-dd4fb1378861",
		"id_usuario" : "1b2e9977-e0fa-4575-b2ac-7bd09c24773b",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67380",
		"estado" : "ACTIVO"
	},
	{
		"id" : "0a5b213b-e9db-48f9-931e-8518e2a9d11e",
		"id_usuario" : "63e2bd90-25a7-4c02-8d54-b2165b2561bd",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67411",
		"estado" : "ACTIVO"
	},
	{
		"id" : "55b8c33e-0806-4cfd-b4a7-56d3a2f82cc7",
		"id_usuario" : "b0deed2e-cdca-4fbb-80ba-07b959303e96",
		"id_cargo" : "c404327e-cd83-4824-8837-0ac49bc67412",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4e2f5711-c831-4b62-ac9a-6a8284380ca2",
		"id_usuario" : "544169ad-b863-4318-9f49-9c492f0ad1af",
		"id_cargo" : "10ceae52-8b05-4fc6-a7e4-0029573cf1fe",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4b5d8f58-9a72-4ecb-b5b2-1095eea396f1",
		"id_usuario" : "8ff3c091-0ee1-4de7-b3f9-25cf635f0f6b",
		"id_cargo" : "0b16d6fa-ac32-4d45-bc87-ccfcd58c62c2",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9e812ff9-8769-4669-9e30-1b8a1d8d000a",
		"id_usuario" : "659be595-9b4a-4c23-ba36-e6ad9fd460a9",
		"id_cargo" : "bae7e48f-5705-4a3c-b5fe-fae38e9f35a8",
		"estado" : "ACTIVO"
	},
	{
		"id" : "68e94e88-77de-4881-b96a-c887c3371826",
		"id_usuario" : "b9d13316-f14e-48a8-bb11-b8da6d211f2b",
		"id_cargo" : "1f3afeb3-d253-4e3e-a189-f48f2885efbe",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5647f181-b140-45cd-9352-a6b72a5a72d0",
		"id_usuario" : "eb54ff1e-78bf-4453-ba52-329455c3748c",
		"id_cargo" : "36b34815-4e82-4437-b913-1f82cdb9203c",
		"estado" : "ACTIVO"
	},
	{
		"id" : "163cb24e-1714-4d74-9a48-55601e85ca7b",
		"id_usuario" : "e3808ce4-3443-43ba-93d0-6e3f05fac170",
		"id_cargo" : "38457ca7-8a22-468f-badf-0b715ac0e96e",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4f411113-b548-44ff-9409-bf5d2af3ef50",
		"id_usuario" : "07cdce53-eec3-42f7-af53-0de4894f95bb",
		"id_cargo" : "3f00b39e-391f-4cb7-b39d-7c59b8d1f26b",
		"estado" : "ACTIVO"
	},
	{
		"id" : "2d0ebf0f-d55b-4a78-872f-911a46afc45e",
		"id_usuario" : "4d13e9b8-e709-47b9-bcd1-f28ffc5d8b52",
		"id_cargo" : "e09812b9-ef7b-476d-a798-58abe5f90527",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d2a3108c-e0b0-4914-86cf-f08d68e85fea",
		"id_usuario" : "9a9ef109-c611-4206-a5ab-812e6acd1e27",
		"id_cargo" : "0eb18f37-cba9-49d0-ad3d-dcb4ca9c68ce",
		"estado" : "ACTIVO"
	},
	{
		"id" : "879fdb05-10fc-41da-9f27-3d81b303171a",
		"id_usuario" : "2efe38d7-9ea5-47fe-9fb1-97618a2f7e68",
		"id_cargo" : "b787e410-81a7-4766-ba06-28bbe27c8908",
		"estado" : "ACTIVO"
	},
	{
		"id" : "d1f126f3-c6ac-47c6-9979-cde4366a6b57",
		"id_usuario" : "da97bb17-7ebe-46b9-b18a-eb76645a2877",
		"id_cargo" : "3b66944b-8273-4a7b-9c33-718147800f42",
		"estado" : "ACTIVO"
	},
	{
		"id" : "70e9f2d7-81f5-435c-86c1-242e5969e919",
		"id_usuario" : "d0e8d2c1-7438-4271-add9-06d9ddeb120a",
		"id_cargo" : "d8bbf72c-f11e-4f71-9a67-e6edbd7c7412",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4338808a-9df1-464a-8e97-3cd57be9c54a",
		"id_usuario" : "a6df3be1-8b55-4c34-ab7a-182903946435",
		"id_cargo" : "bba4fa92-5241-430e-ae28-cad95b1f96e6",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4f42fc65-5ab4-4793-bf83-65710688570e",
		"id_usuario" : "c57bed6d-9da7-4172-ac61-8a669fd18b1d",
		"id_cargo" : "18c7946f-cd61-4658-af1b-709c8c87cc77",
		"estado" : "ACTIVO"
	},
	{
		"id" : "5501c96d-c735-4b0e-8ec5-427098c2dc48",
		"id_usuario" : "7fcb4a94-fcd0-4d22-84a5-063617f9bd57",
		"id_cargo" : "2d78a0e7-7ca0-4150-afba-a4c8c0ef8b81",
		"estado" : "ACTIVO"
	},
	{
		"id" : "919b98c9-eb84-4f2b-b67d-63cd8b74ec7a",
		"id_usuario" : "6ec98198-eab1-437f-a953-46969a3f2133",
		"id_cargo" : "fef25c0c-60e2-4ac8-bc12-61eafbdda446",
		"estado" : "ACTIVO"
	},
	{
		"id" : "28071314-aa75-4db1-b1f4-65ef16fe9fde",
		"id_usuario" : "5abd88ae-8549-4d6d-ba2c-1406fe24269e",
		"id_cargo" : "c1a9d89c-78dc-491b-ac66-09cf04e8a871",
		"estado" : "ACTIVO"
	},
	{
		"id" : "a6c8b9c8-e15a-4e1c-9b02-642518c123a9",
		"id_usuario" : "d72dbfff-946d-417b-8875-322fb7f2800f",
		"id_cargo" : "10740370-334a-499e-90f7-64929f312caa",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1cc7b333-65bd-48da-88e6-06cf793f6544",
		"id_usuario" : "897725e1-d090-4641-a508-545f5cbb37a1",
		"id_cargo" : "fba0c408-5bec-439d-9132-f73603cfa395",
		"estado" : "ACTIVO"
	},
	{
		"id" : "f947faf5-5a75-466f-b685-f6b8551c558d",
		"id_usuario" : "13ea36df-6006-4ae3-a5f6-875e9b7262f0",
		"id_cargo" : "eab6ef6c-52a9-4cd4-8088-e5c78b066bc9",
		"estado" : "ACTIVO"
	},
	{
		"id" : "dfe45642-d1ab-4519-a786-fb007a4db1f5",
		"id_usuario" : "3f71589a-bbc4-4124-8738-c08d53549255",
		"id_cargo" : "103031db-5dd3-4f7c-a0a5-d09c4dfc3164",
		"estado" : "ACTIVO"
	},
	{
		"id" : "9b54afcc-802e-43f9-b7e2-25ad84caf5ff",
		"id_usuario" : "5943f333-7ed6-4d05-baa8-49ad5bc4d9e7",
		"id_cargo" : "46be3d47-53a7-410f-8edb-2087c353a577",
		"estado" : "ACTIVO"
	},
	{
		"id" : "1fe248a0-dad8-4a3a-938d-1abb29a21be0",
		"id_usuario" : "f1e50466-8f4f-44ea-a901-4edaaf4aac52",
		"id_cargo" : "ac60ec1b-bf3d-4e53-895f-3faa3ceb7ada",
		"estado" : "ACTIVO"
	},
	{
		"id" : "4c67b338-7adc-4180-a24e-5816168b24ac",
		"id_usuario" : "7bf862f4-8a18-4818-a7ca-7bd03746579a",
		"id_cargo" : "175bb6c4-11d2-456c-84bf-af525552f1fb",
		"estado" : "ACTIVO"
	},
	{
		"id" : "36c30c82-e6eb-4d90-ad01-f521e704ae23",
		"id_usuario" : "57239f9b-57f3-4d67-b839-221acbea99ea",
		"id_cargo" : "9ea29273-45d8-41c7-9372-9497f50bc1c8",
		"estado" : "ACTIVO"
	},
	{
		"id" : "bf71f1b2-01b9-4dd5-91b1-9796d5e4364e",
		"id_usuario" : "8e8348ca-dd63-44e3-89e7-883e88cbba43",
		"id_cargo" : "e9713e3b-56fb-4812-aace-180d57d4cba6",
		"estado" : "ACTIVO"
	},
	{
		"id" : "204b30f7-733f-488f-8baa-b4a6dec23604",
		"id_usuario" : "8177c5f9-71b1-41c7-8d04-6c192adcabe4",
		"id_cargo" : "2926cf36-f770-4851-9573-68173b92f402",
		"estado" : "ACTIVO"
	},
	{
		"id" : "e4a53f46-c047-456a-9e5c-13b0892f9626",
		"id_usuario" : "4b7a4722-d7e1-4fe9-8819-f3b2138c41f5",
		"id_cargo" : "cf06fd3e-9ac8-4ed5-bab1-49bd7b508579",
		"estado" : "ACTIVO"
	}
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_usuario_cargo', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
