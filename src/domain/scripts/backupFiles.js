const db = require('../../infrastructure');
const Sequelize = require('sequelize');
const fs = require('fs');
const { config, errors } = require('../../common');


(async function () {
    const repositories = await db(config.db).catch(errors.handleFatalError);
    const {
        flujoDocumental
    } = repositories._models;

    try {
        const query = `
select
case when sa.id is null then 'OTROS' else REPLACE(sa.nombre_area, ' ', '_') end ||
'/' || gfd.codigo_flujo as folder_path,
gd.cite as file_name,
gd.id as id_documento
from sys_area sa
join (
	select 
	distinct gd1.id, sa1.id as id_area
	from gestion_documento gd1
	cross join lateral jsonb_array_elements(gd1.configuracion_derivaciones) AS objeto
	join planificacion_cargo pc on pc.id = (objeto->>'idCargo')::uuid
	join sys_area sa1 ON pc.id_unidad_organizacional = sa1.id 
	join sys_entidad se1 on se1.id = sa1.id_entidad 
	where gd1."_deleted_at" is null
	and gd1.estado not in ('CANCELADO', 'INVALIDO', 'OBSERVADO', 'BORRADOR')
	and se1.id = '7965b520-c30b-4e8c-a349-ba2d8bb5d466'
) tmp on sa.id = tmp.id_area
join gestion_documento gd on gd.id = tmp.id
join gestion_flujo_documental gfd on gd.id_flujo = gfd.id and gfd."_deleted_at" is null
where gfd.estado <> 'CANCELADO'
and gd.estado not in ('CANCELADO', 'INVALIDO', 'OBSERVADO', 'BORRADOR')
        `;
        const result = await flujoDocumental.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

        if (result) {
            const basePath = '/opt/sepdavi_backups_files/';
            // const registros = result;
            for (const item of result) {
                const folderPath = basePath + item.folder_path;
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }
                const filePath = folderPath + '/' + item.file_name + '.pdf';

                const { fileStoragePath } = config.app;
                const folder = `${fileStoragePath}/documentos/generados/pdf`;
                let originFilePath = null;
                if (fs.existsSync(`${folder}/firmado/${item.id_documento}.pdf`)) {
                    originFilePath = `${folder}/firmado/${item.id_documento}.pdf`;
                }
                if (!originFilePath && fs.existsSync(`${folder}/${item.id_documento}.pdf`)) {
                    originFilePath = `${folder}/${item.id_documento}.pdf`;
                }
                if (!originFilePath && fs.existsSync(`${folder}/BORRADOR-${item.id_documento}.pdf`)) {
                    originFilePath = `${folder}/BORRADOR-${item.id_documento}.pdf`;
                }
                if (!originFilePath) {
                    console.log(`:Archivo no encontrado para el documento ID: ${item.id_documento}`);
                    continue;
                }

                fs.copyFileSync(originFilePath, filePath);
                console.log(`=> Archivo respaldado: ${filePath}`);
            }
        }
    } catch (error) {
        console.error(error.message);
    }
})();
