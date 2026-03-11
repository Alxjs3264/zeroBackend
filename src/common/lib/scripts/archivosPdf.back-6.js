const sha256 = require('sha256');
const fs = require('fs');
const path = require('path');
const defaults = require('defaults');
const Sequelize = require('sequelize');
const { app } = require('../../config');
const { config } = require('../../../common');
const { obtenerPdfGeneradoB64 } = require('../archivos.js');
const json2csv = require('json2csv').parse;


(async function (){
    const dbConfig = defaults(config.db, {
        dialect : 'postgres',
        pool    : {
            max  : 10,
            min  : 0,
            idle : 10000
        },
        timezone: 'America/La_Paz'
    });
    
    const sequelize = new Sequelize(dbConfig);
    async function getQueryResult(query) {
        const data = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
        return data;
    }
    const lista = ['46c96c16-0ef9-478e-876e-d861d7b11e7d','04f464a0-2eaa-4506-8834-7aa8431c2677','0b030340-95c5-4af5-9d32-e4b7d94f31f9','3ec8f614-9c5c-4ec5-b789-b5af582dc951','03d58c90-387c-4c6a-8a28-c17b9a983e32','1caf373b-df8d-4c1a-bbbb-e508c51c7790','958b2a20-ec9b-4b7b-9da1-52e1a2d80c15','0a8e61d6-5cba-4c11-b480-6ddf01107650','d4221b29-2244-47db-b827-8017c3bffe09'];
    const query = `
    select
        gd.id,
        gd.cite,
        COALESCE(gd.hoja_ruta, gfdd.codigo_flujo) as hoja_ruta,
        -- gd.hoja_ruta,
        gd.fecha_documento,
        gf.nombre as plantilla,
        COALESCE(jsonb_array_length(gd.configuracion_derivaciones), 0) AS cantidad_usuarios_involucrados,
        gd.configuracion_derivaciones,
        gd.plantilla_valor
    from gestion_documento gd
    --left join sys_aprobacion_documentos sad on gd.id = sad.id_documento
    left join (
        select sad.id_documento, COUNT(DISTINCT sad.hash_datos) as cantidad
        from sys_aprobacion_documentos sad
        where sad.aceptado = true
        AND sad.introducido = true
        AND sad._deleted_at IS NULL
        group by sad.id_documento
    ) temp on gd.id = temp.id_documento
    join gestion_flujo_derivacion gfd on gfd.id_documento = gd.id and gfd."_deleted_at" is null
    join gestion_formulario gf on gf.id = (gd.plantilla->>'id')::uuid
    join gestion_flujo_documental gfdd on gfdd.id = gd.id_flujo and gfdd."_deleted_at" is null
    and gd."_deleted_at" is null
    and gd.estado in ('CERRADO','DERIVADO')
    and gd.configuracion_derivaciones is not null
    and gd.id_documento_original is null
    and (temp.cantidad > 1 or temp.cantidad is null)
    -- and gd.id_flujo not in (
    --     select gfd_join.id
    --     from gestion_flujo_documental gfd_join
    --     join bpm_solicitud_plantilla bsp on bsp.id = gfd_join.id_solicitud_plantilla and bsp."_deleted_at" is null
    --     where gfd_join."_deleted_at" is null and bsp.docfisico = true
    --     and gfd_join.estado <> 'CANCELADO'
    -- )
    AND NOT EXISTS (
        SELECT 1
        FROM
            gestion_flujo_documental gfd_join
            JOIN bpm_solicitud_plantilla bsp ON bsp.id = gfd_join.id_solicitud_plantilla
        WHERE
            gfd_join.id = gd.id_flujo
            AND bsp."_deleted_at" IS NULL
            AND gfd_join."_deleted_at" IS NULL
            AND bsp.docfisico = true
            AND gfd_join.estado <> 'CANCELADO'
    )
    and gfd.observacion = false
    -- AND (
    --     gd.id_flujo IS NULL
    --     OR EXISTS (
    --         SELECT 1
    --         FROM
    --             gestion_flujo_documental gfd_join
    --             JOIN bpm_solicitud_plantilla bsp ON bsp.id = gfd_join.id_solicitud_plantilla
    --         WHERE
    --             gfd_join.id = gd.id_flujo
    --             AND bsp."_deleted_at" IS NULL
    --             AND gfd_join."_deleted_at" IS NULL
    --             AND bsp.docfisico = false
    --             AND gfd_join.estado <> 'CANCELADO'
    --     )
    -- )
    -- and gd.id in ('${lista.join('\',\'')}')
    group by
        gd.id,
        gd.cite,
        gd.hoja_ruta,
        gfdd.codigo_flujo,
        gd.fecha_documento,
        gf.nombre,
        gd.configuracion_derivaciones,
        gd.plantilla_valor
    `;
    const result = await getQueryResult(query);
    let cabecera = []
    let reultados = []
    let reultadosRaros = []
    for (let index = 0; index < result.length; index++) {
        let esNormal = true
        const doc = result[index];
        let filePath = path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', `${doc.id}.pdf`);
        filePath = path.resolve(filePath);
        if (fs.existsSync(filePath)) {
            const fileB64 = obtenerPdfGeneradoB64(filePath);
            doc.pdf_hash = sha256(fileB64);
            doc.existe_archivo = true;
        } else {
            continue
            doc.pdf_hash = null;
            doc.existe_archivo = false;
        }
        // Cantidad de usuarios involucrados
        const usuarios = await doc.configuracion_derivaciones.map(reg => reg.idUsuario)
        const usuarioFinal = doc.configuracion_derivaciones.find(reg => reg.final && reg.siguiente === null)
        let usuarioActual = null
        if (usuarios.length === 0) continue
        // doc.cantidad_usuarios_involucrados = usuarios.length
        // Cantidad de usuarios procesos
        let subquery = `
        SELECT DISTINCT id_usuario_destinatario, fecha_recepcion, fecha_derivacion, tipo, _created_at, observacion
        FROM gestion_flujo_derivacion
        WHERE id_documento = '${doc.id}'
        AND _deleted_at IS NULL
        -- AND observacion = false
        AND tipo IN ('REMITENTE', 'VIA', 'DESTINATARIO', 'RECUPERADO', 'PROVEIDO')
        AND id_usuario_destinatario IN ('${usuarios.join('\',\'')}')
        ORDER BY _created_at DESC
        `
        let res = await getQueryResult(subquery);
        const derivaciones = res.filter(d => d.tipo !== 'PROVEIDO')
        const existianProveidos = derivaciones.length !== res.length
        doc.cantidad_firmas = 0
        doc.cantidad_usuarios_flujo = derivaciones.length > usuarios.length ? usuarios.length : derivaciones.length
        doc.firmas_faltantes_flujo = 0
        doc.firmas_completas = false
        doc.flujo_completo = false
        doc.estado_flujo = 'OBSERVACiON FLUJO'
        // doc.estado_accion_ultimo_participante = ''
        doc.ultimo_participante = ''
        // doc.ultimo_participante_activo = true
        doc.ultimo_participante_nivel = ''
        let usuarioInicialFlujo;
        if (derivaciones.length) {
            let usuariosFlujo = []
            derivaciones.forEach(reg => {
                if (!usuariosFlujo.includes(reg.id_usuario_destinatario)) {
                    usuariosFlujo.push(reg.id_usuario_destinatario)
                }
            })
            doc.cantidad_usuarios_flujo = usuariosFlujo.length
            const usuarioFinalFlujo = {...derivaciones[0]}
            usuarioInicialFlujo = {...derivaciones[derivaciones.length - 1]}
            subquery = `
            SELECT DISTINCT sad.id_usuario
            FROM sys_aprobacion_documentos sad
            WHERE sad.id_documento = '${doc.id}'
                AND sad.hash_datos = '${doc.pdf_hash}'
                AND sad.aceptado = true
                AND sad.introducido = true
                AND sad._deleted_at IS NULL
                AND sad.id_usuario IN ('${usuariosFlujo.join('\',\'')}')
            `;
            res = await getQueryResult(subquery);
            doc.cantidad_firmas = parseInt(res.length)
            doc.firmas_faltantes_flujo = parseInt(doc.cantidad_usuarios_flujo) - parseInt(doc.cantidad_firmas)
            doc.firmas_completas = parseInt(res.length) === parseInt(usuariosFlujo.length)
            const estadoUltimaUsuarioFirma = typeof res.find(i => i.id_usuario === usuarioFinalFlujo.id_usuario_destinatario) !== 'undefined'
            doc.flujo_completo = parseInt(usuarios.length) === parseInt(usuariosFlujo.length)
            if (!doc.flujo_completo && usuarios.filter(u => !usuariosFlujo.includes(u)).length === 0) {
                esNormal = false
            }
                    // && usuarioFinalFlujo.fecha_derivacion !== null
                    // && estadoUltimaUsuarioFirma
            doc.estado_flujo = doc.flujo_completo ? 'COMPLETO' : 'INCOMPLETO'
            // doc.estado_accion_ultimo_participante = estadoUltimaUsuarioFirma  ? 'FIRMADO' : (
            //     usuarioFinalFlujo?.fecha_derivacion === null ? (
            //         usuarioFinalFlujo?.fecha_recepcion === null ? 'BANDEJA RECIBIDOS' : 'BANDEJA PENDIENTES'
            //     ) : 'FIRMA ROTA'
            // )
            if (doc.firmas_completas && doc.flujo_completo) continue;
            usuarioActual = doc.configuracion_derivaciones.find(reg => reg.idUsuario === usuarioFinalFlujo.id_usuario_destinatario)
            doc.ultimo_participante = usuarioActual.nombreUsuario
            const componente = doc.plantilla_valor.find(it => it.type === 'derivacion')
            let ultimo_participante_nivel = ''
            if (componente) {
                for (let prop in componente.valores) {
                    const lista = Array.isArray(componente.valores[prop]) ? componente.valores[prop] : [componente.valores[prop]]
                    const find = lista.find(it => it.idUsuario === usuarioActual.idUsuario)
                    if (find) {
                        ultimo_participante_nivel = prop.toLocaleUpperCase()
                        break
                    }
                }
            }
            doc.ultimo_participante_nivel = ultimo_participante_nivel
        } else {
            continue
        }
        doc.cantidad_usuarios_inactivos = 0
        doc.usuarios_inactivos = null
        delete doc.configuracion_derivaciones
        delete doc.plantilla_valor
        subquery = `
        SELECT su.id, su.numero_documento || ' - ' || su.nombres || ' ' || su.primer_apellido || ' ' || su.segundo_apellido AS nombre
        FROM sys_usuario su
        WHERE su.id IN ('${usuarios.join('\',\'')}')
        AND su.estado = 'INACTIVO'
        AND su._deleted_at IS NULL
        `;
        res = await getQueryResult(subquery);
        // if (doc.ultimo_participante !== '' && usuarioActual) {
        //     const find = res.find(i => i.id === usuarioActual.idUsuario)
        //     doc.ultimo_participante_activo = typeof find === 'undefined'
        // }
        doc.cantidad_usuarios_inactivos = res.length;
        doc.usuarios_inactivos = res.map(reg => reg.nombre).join(', ');
        // cabecera = Object.keys(doc);
        result[index] = doc
        delete doc.pdf_hash
        delete doc.existe_archivo
        if (!doc.flujo_completo && usuarioInicialFlujo && usuarioInicialFlujo?.observacion && existianProveidos) {
            esNormal = false
        }
        if (esNormal) {
            reultados.push(doc)
        } else {
            reultadosRaros.push(doc)
        }
        cabecera = Object.keys(doc);
    }
    const csv = json2csv(reultados, { fields: cabecera })
    fs.writeFileSync('reporte-documento-firma.csv', csv, 'utf8')
    if (reultadosRaros.length) {
        const csvRaro = json2csv(reultadosRaros, { fields: cabecera })
        fs.writeFileSync('reporte-documento-firma-casos-raros.csv', csvRaro, 'utf8')
    }
    console.log(`Reporte generado exitosamente, ${reultados.length} registros encontrados.`)

})();
