'use strict';

const { setTimestampsSeeder } = require('../lib/util');
// Datos de producción
let items = [
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043001',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101020',
    monto_aprobado            : 35094013.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043002',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101006',
    monto_aprobado            : 583925.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043003',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101019',
    monto_aprobado            : 480887.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043004',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101015',
    monto_aprobado            : 2973741.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043005',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101033',
    monto_aprobado            : 3567795.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043006',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101034',
    monto_aprobado            : 610092.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043007',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101036',
    monto_aprobado            : 1070338.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043008',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101038',
    monto_aprobado            : 713558.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043009',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101115',
    monto_aprobado            : 1422000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043010',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb271',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101088',
    monto_aprobado            : 40000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043011',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb266',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043012',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb267',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 4320.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043013',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb267',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 2280.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043014',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb266',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043015',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb263',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1893.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043016',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb264',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 631.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043017',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb280',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101078',
    monto_aprobado            : 18660.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043018',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb280',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101150',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043019',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb280',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 13500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043020',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101411',
    monto_aprobado            : 840.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043021',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb294',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2930.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043022',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb294',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2226.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043023',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb294',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 4500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043024',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb294',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 4323.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043025',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb295',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2930.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043026',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101020',
    monto_aprobado            : 869291.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043027',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb295',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2226.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043028',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101006',
    monto_aprobado            : 53677.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043029',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101015',
    monto_aprobado            : 76238.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043030',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 60000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043031',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb295',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 580.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043032',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101019',
    monto_aprobado            : 33075.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043033',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101033',
    monto_aprobado            : 92297.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043034',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb296',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 9008.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043035',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101036',
    monto_aprobado            : 27690.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043036',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101038',
    monto_aprobado            : 18460.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043037',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb296',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc08',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 7684.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043038',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101034',
    monto_aprobado            : 15783.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043039',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101053',
    monto_aprobado            : 31104.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043040',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 27000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043041',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101049',
    monto_aprobado            : 30000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043042',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101050',
    monto_aprobado            : 4200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043043',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101175',
    monto_aprobado            : 20000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043044',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb326',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101127',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043045',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101186',
    monto_aprobado            : 15898.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043046',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb291',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 545.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043047',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb326',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101107',
    monto_aprobado            : 270.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043048',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb261',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043049',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb261',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 7440.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043050',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb292',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 5480.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043051',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb292',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101104',
    monto_aprobado            : 0.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043052',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb292',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 3336.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043053',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb327',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101081',
    monto_aprobado            : 20000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043054',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 55650.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043055',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb288',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 15910.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043056',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb289',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 28430.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043057',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 34503.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043058',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb288',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 13356.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043059',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb289',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 27083.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043060',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101060',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043061',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb288',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 30000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043062',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101071',
    monto_aprobado            : 24000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043063',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb289',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 20000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043064',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 10000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043065',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 90000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043066',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101072',
    monto_aprobado            : 27800.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043067',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb288',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101107',
    monto_aprobado            : 25038.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043068',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101115',
    monto_aprobado            : 76032.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043069',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb327',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 13340.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043070',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101095',
    monto_aprobado            : 3466.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043071',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb327',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 7049.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043072',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb327',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043073',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb288',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 52500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043074',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101123',
    monto_aprobado            : 23500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043075',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101124',
    monto_aprobado            : 10000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043076',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb306',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc04',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 600.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043077',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb331',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc04',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101055',
    monto_aprobado            : 5207.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043078',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb331',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc04',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043079',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101141',
    monto_aprobado            : 45600.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043080',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 18320.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043081',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101142',
    monto_aprobado            : 7933.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043082',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101426',
    monto_aprobado            : 14400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043083',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101150',
    monto_aprobado            : 40080.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043084',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb275',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 7070.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043085',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb284',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101150',
    monto_aprobado            : 108603.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043086',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb274',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 7070.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043087',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb274',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 3154.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043088',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb274',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043089',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb274',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 1200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043090',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb275',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 3153.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043091',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb275',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043092',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb275',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 1565.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043093',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb276',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 15218.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043094',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb276',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 8904.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043095',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb276',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043096',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb333',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 16982.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043097',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb334',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 9414.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043098',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb333',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 10388.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043099',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb334',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4452.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043100',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb262',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 6864.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043101',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb333',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 1450.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043102',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb262',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4452.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043103',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb334',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 3500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043104',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb333',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 7000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043105',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb334',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 3795.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043106',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb332',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 3728.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043107',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb299',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 6864.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043108',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb299',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4452.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043109',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb333',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 4000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043110',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb334',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc11',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2320.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043111',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb310',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 4620.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043112',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb311',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 3887.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043113',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb311',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 12504.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043114',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb312',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 4000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043115',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb319',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043116',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb319',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2226.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043117',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb319',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc15',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1862.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043118',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb273',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101063',
    monto_aprobado            : 136.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043119',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb273',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043120',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb273',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101084',
    monto_aprobado            : 1790.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043121',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043122',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043123',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 9300.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043124',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 7493.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043125',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 15400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043126',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 5500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043127',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb342',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 10500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043128',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb342',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 14000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043129',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb342',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101102',
    monto_aprobado            : 2625.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043130',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb348',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043131',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb350',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043132',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb350',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 19800.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043133',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb350',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 3500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043134',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb350',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 6603.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043135',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb350',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043136',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb350',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 3600.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043137',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb351',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 3500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043138',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb351',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043139',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb353',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 22000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043140',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb353',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 14840.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043141',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb353',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043142',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb353',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 10000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043143',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101049',
    monto_aprobado            : 468720.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043144',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb353',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101082',
    monto_aprobado            : 337728.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043145',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101115',
    monto_aprobado            : 14256.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043146',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb354',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 25000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043147',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb354',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 14000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043148',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb354',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 20000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043149',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb354',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101081',
    monto_aprobado            : 88000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043150',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb354',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 20518.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043151',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101050',
    monto_aprobado            : 65520.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043152',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb357',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 11000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043153',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb358',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc20',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 3400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043154',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb276',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 2203.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043155',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb363',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043156',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb363',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4557.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043157',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb363',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1379.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043158',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb363',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1600.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043159',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 28531.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043160',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb364',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4700.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043161',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 20034.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043162',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb364',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4452.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043163',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb364',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043164',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 30000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043165',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb364',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 5400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043166',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101152',
    monto_aprobado            : 15000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043167',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101184',
    monto_aprobado            : 15000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043168',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb365',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 3507.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043169',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb365',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 5194.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043170',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101131',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043171',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb365',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1600.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043172',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb367',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043173',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb367',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc23',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043174',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101186',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043175',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101144',
    monto_aprobado            : 12000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043176',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101053',
    monto_aprobado            : 508000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043177',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101051',
    monto_aprobado            : 414000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043178',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 110435.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043179',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb343',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 11000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043180',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101048',
    monto_aprobado            : 240000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043181',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb343',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043182',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb343',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 8941.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043183',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb343',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1076.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043184',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb343',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 4976.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043185',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb344',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 6000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043186',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb344',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 3342.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043187',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb345',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043188',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb347',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 750.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043189',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb347',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 742.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043190',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb346',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc19',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043191',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 34854.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043192',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 13500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043193',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101123',
    monto_aprobado            : 79314.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043194',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 50070.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043195',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101131',
    monto_aprobado            : 15000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043196',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101146',
    monto_aprobado            : 10000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043197',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101138',
    monto_aprobado            : 4000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043198',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101124',
    monto_aprobado            : 28100.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043199',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 91975.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043200',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101060',
    monto_aprobado            : 60000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043201',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101062',
    monto_aprobado            : 153000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043202',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb380',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043203',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb380',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043204',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb380',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043205',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb441',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101146',
    monto_aprobado            : 105983.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043206',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb381',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 1134.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043207',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb381',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 3266.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043208',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb381',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043209',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb381',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 11000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043210',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101072',
    monto_aprobado            : 306900.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043211',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb382',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043212',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb385',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043213',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb385',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043214',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb385',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc24',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1104.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043215',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb283',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101084',
    monto_aprobado            : 1200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043216',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 28460.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043217',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101073',
    monto_aprobado            : 24000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043218',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101081',
    monto_aprobado            : 360000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043219',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101129',
    monto_aprobado            : 8000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043220',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101094',
    monto_aprobado            : 6000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043221',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101131',
    monto_aprobado            : 560.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043222',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101138',
    monto_aprobado            : 3540.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043223',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101141',
    monto_aprobado            : 2740.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043224',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101142',
    monto_aprobado            : 16850.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043225',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101144',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043226',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101146',
    monto_aprobado            : 20075.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043227',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101148',
    monto_aprobado            : 9372.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043228',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101150',
    monto_aprobado            : 520266.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043229',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb352',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101152',
    monto_aprobado            : 30400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043230',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101131',
    monto_aprobado            : 5000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043231',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101065',
    monto_aprobado            : 950400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043232',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb441',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101141',
    monto_aprobado            : 29639.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043233',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101139',
    monto_aprobado            : 24000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043234',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb290',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2102.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043235',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 10000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043236',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb290',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1037.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043237',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101071',
    monto_aprobado            : 140057.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043238',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101071',
    monto_aprobado            : 521519.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043239',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb384',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 1100.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043240',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb384',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 742.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043241',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101175',
    monto_aprobado            : 104850.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043242',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb390',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 11000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043243',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb390',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 7772.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043244',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb390',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1350.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043245',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb441',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101149',
    monto_aprobado            : 16150.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043246',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb391',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043247',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb391',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043248',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb406',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 6000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043249',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 244488.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043250',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb391',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1350.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043251',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101075',
    monto_aprobado            : 25000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043252',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb382',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 4800.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043253',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb407',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc10',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4084.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043254',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb392',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 5472.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043255',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb392',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2228.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043256',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101030',
    monto_aprobado            : 3039034.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043257',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb392',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 6294.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043258',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb393',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 3300.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043259',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb393',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2226.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043260',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb394',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 9900.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043261',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb407',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc10',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 8814.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043262',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb394',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 6678.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043263',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb407',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc10',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 9300.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043264',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb406',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101150',
    monto_aprobado            : 1120.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043265',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb406',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101150',
    monto_aprobado            : 600.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043266',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb407',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc10',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 1920.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043267',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101184',
    monto_aprobado            : 40000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043268',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101186',
    monto_aprobado            : 10000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043269',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb406',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101175',
    monto_aprobado            : 2700.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043270',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101406',
    monto_aprobado            : 3800.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043271',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb441',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101141',
    monto_aprobado            : 43161.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043272',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101135',
    monto_aprobado            : 130000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043273',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb441',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101130',
    monto_aprobado            : 6000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043274',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 20309.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043275',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb441',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc03',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101138',
    monto_aprobado            : 60800.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043276',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101085',
    monto_aprobado            : 840000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043277',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 132000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043278',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101092',
    monto_aprobado            : 50000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043279',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101115',
    monto_aprobado            : 162846.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043280',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 14616.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043281',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 12555.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043282',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101102',
    monto_aprobado            : 2610.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043283',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043284',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb354',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101082',
    monto_aprobado            : 116730.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043285',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc22',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101115',
    monto_aprobado            : 4752.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043286',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb387',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc05',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043287',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb427',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1785.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043288',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb427',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 3180.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043289',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb427',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 5936.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043290',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb427',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101063',
    monto_aprobado            : 250.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043291',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb408',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 48230.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043292',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb408',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 31379.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043293',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb427',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 928.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043294',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb355',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101185',
    monto_aprobado            : 3480.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043295',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb429',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 1590.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043296',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb429',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2226.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043297',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb429',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101063',
    monto_aprobado            : 100.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043298',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb416',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 19040.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043299',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101033',
    monto_aprobado            : 303904.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043300',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb298',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 12866.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043301',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101034',
    monto_aprobado            : 51968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043302',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101036',
    monto_aprobado            : 91171.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043303',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101038',
    monto_aprobado            : 60781.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043304',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb298',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 11130.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043305',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb368',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 17363.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043306',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb368',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 14840.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043307',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb370',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 11596.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043308',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb370',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 6307.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043309',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb372',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2380.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043310',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb431',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043311',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb430',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc16',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101094',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043312',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb406',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 20080.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043313',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb356',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101098',
    monto_aprobado            : 915232.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043314',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb406',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 22514.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043315',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb338',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 9316.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043316',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb338',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 1484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043317',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb339',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1700.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043318',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101095',
    monto_aprobado            : 9000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043319',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb284',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 50000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043320',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101088',
    monto_aprobado            : 20000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043321',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb306',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc04',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1170.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043322',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101115',
    monto_aprobado            : 30240.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043323',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb266',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc25',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 6508.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043324',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb437',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 33000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043325',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb434',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc12',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 16704.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043326',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb434',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc12',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 8046.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043327',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb434',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc12',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101102',
    monto_aprobado            : 5250.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043328',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb437',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 22500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043329',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb434',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc12',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 15820.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043330',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb434',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc12',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 24180.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043331',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 66061.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043332',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb399',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2300.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043333',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 48914.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043334',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 25911.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043335',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 28960.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043336',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101102',
    monto_aprobado            : 7460.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043337',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb439',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043338',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb439',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043339',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb439',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 1734.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043340',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb341',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc17',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 7265.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043341',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 138250.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043342',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 69974.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043343',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101102',
    monto_aprobado            : 10295.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043344',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 61140.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043345',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 295684.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043346',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 314720.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043347',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb440',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc01',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101102',
    monto_aprobado            : 30307.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043348',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101127',
    monto_aprobado            : 12000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043349',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb436',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc14',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101094',
    monto_aprobado            : 3000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043350',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb408',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 8084.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043351',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb404',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 35987.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043352',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb404',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 23713.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043353',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb416',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 15000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043354',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb416',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 4006.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043355',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb419',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101086',
    monto_aprobado            : 15000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043356',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb216',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc02',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101141',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043357',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb384',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 2220.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043358',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb384',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1392.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043359',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb392',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 742.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043360',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb261',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 5100.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043361',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb261',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4452.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043362',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101030',
    monto_aprobado            : 302631.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043363',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101033',
    monto_aprobado            : 30263.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043364',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101034',
    monto_aprobado            : 5175.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043365',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101036',
    monto_aprobado            : 9079.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043366',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101038',
    monto_aprobado            : 6053.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043367',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb277',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 150000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043368',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb282',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101152',
    monto_aprobado            : 9000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043369',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb278',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 130000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043370',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb277',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 3200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043371',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb443',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 6000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043372',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101030',
    monto_aprobado            : 1142656.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043373',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101033',
    monto_aprobado            : 114266.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043374',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101034',
    monto_aprobado            : 19539.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043375',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101036',
    monto_aprobado            : 34280.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043376',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb268',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc09',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101038',
    monto_aprobado            : 22853.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043377',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb444',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101051',
    monto_aprobado            : 45000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043378',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb444',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101184',
    monto_aprobado            : 70000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043379',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb445',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101152',
    monto_aprobado            : 18000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043380',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb445',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101184',
    monto_aprobado            : 6500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043381',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb446',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 40000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043382',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb446',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 50000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043383',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb447',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 9000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043384',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb448',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101153',
    monto_aprobado            : 10500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043385',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb452',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101081',
    monto_aprobado            : 100000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043386',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb259',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101175',
    monto_aprobado            : 1000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043387',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb457',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 8640.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043388',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb457',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 10388.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043389',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb457',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 972.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043390',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb399',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc13',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101068',
    monto_aprobado            : 2396.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043391',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb459',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 10645.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043392',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb459',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 1855.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043393',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb383',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 2304.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043394',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb383',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043395',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb383',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 4400.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043396',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb382',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 3200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043397',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb439',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 1100.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043398',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb439',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 742.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043399',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb391',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 1100.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043400',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb391',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 742.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043401',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb391',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc18',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 484.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043402',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb460',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101081',
    monto_aprobado            : 35000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043403',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb290',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 3500.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043404',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb292',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101176',
    monto_aprobado            : 14000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043405',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb461',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101057',
    monto_aprobado            : 7200.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043406',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb461',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101059',
    monto_aprobado            : 4320.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043407',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb461',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 8800.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043408',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb290',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101104',
    monto_aprobado            : 0.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043409',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb461',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 4452.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043410',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb461',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc06',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 236.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043411',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb464',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101056',
    monto_aprobado            : 5012.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043412',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb464',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101058',
    monto_aprobado            : 2968.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043413',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb464',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101087',
    monto_aprobado            : 2000.00
  },
  {
    id                        : '651c6cf5-f15b-47da-a077-caa1f9043414',
    id_operacion              : 'fa4555d2-1cb0-417a-9e33-dcaef90eb464',
    id_categoria_programatica : 'b96c5719-24ec-4e39-857e-2948f845dc07',
    id_organismo_financiador  : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    id_partida_presupuestaria : 'bf28223b-4b7c-432c-afd4-dc36f9101116',
    monto_aprobado            : 5000.00
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('presupuesto_presupuesto', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
