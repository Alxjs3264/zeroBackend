const db = require('../../infrastructure');
const { config, errors } = require('../../common');
const parametros = process.argv.slice(2);

// params: -- --usuarios=user1,user2,.., --password=field1,field2,...
// Ej.: npm run users:reset-password -- --usuario=12563544,132556,25222564 --password=fechaNacimiento,usuario --separator=. --reset=true

(async function () {
    const params = parametros.reduce((acc, arg) => {
        const [key, value] = arg.split('=');
        acc[key.replace('--', '')] = value.includes(',') ? value.split(',') : value
        return acc
    }, {})
    
    const repositories = await db(config.db).catch(errors.handleFatalError);
    const {
        UsuarioRepository,
        AuthRepository,
        transaction
    } = repositories;
    let transaccion;

    try {
        transaccion = await transaction.create();
        const userParams = {
            estado: 'ACTIVO'
        }
        if (params.usuario) userParams.usuario = params.usuario;
        const usuarios = await UsuarioRepository.findAll(userParams, false);
        for (let i = 0; i < usuarios.rows.length; i++) {
            const usuario = usuarios.rows[i];
            if (!usuario.numeroDocumento || !usuario.fechaNacimiento || usuario.usuario === 'admin') {
                continue;
            }
            let newPassword = ''
            if (params.password) {
                const separador = params.separator ?? '.'
                params.password = Array.isArray(params.password) ? params.password : [params.password]
                const paswordParams = []
                for (const field of params.password) {
                    const param = field === 'fechaNacimiento' 
                    ? usuario[field].split('-').reverse().join('') 
                    : (
                        field === 'apellidosNombre'
                        ? (usuario.primerApellido || '').split('')[0] + (usuario.segundoApellido || '').split('')[0] + (usuario.nombres || '').split('')[0]
                        : usuario[field]
                    )
                    paswordParams.push(param)
                }
                newPassword = paswordParams.join(separador)
            } else {
                newPassword = 'Developer'
            }
            const contrasena = await AuthRepository.codificarContrasena(newPassword);
            const cambios = { id: usuario.id, usuario: usuario.usuario, contrasena };
            if (params.reset) {
                cambios.resetearContrasena = true
            } else {
                cambios.resetearContrasena = false
            }
            await UsuarioRepository.cambiarContrasena(cambios, transaccion);
        }
        await transaction.commit(transaccion);
        console.log('usuarios y contraseñas actualizados');
    } catch (error) {
        console.error(error.message)
        await transaction.rollback(transaccion);
    }
})();