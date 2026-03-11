# Instalacion de Backend Zero

#### Algunos requisitos necesarios son:
* Nodejs 14 en adelante
* Postgresql 12 en adelante
* PM2

- Nodejs 14 en adelante
- Postgresql 12 en adelante

## Instalando las dependencias necesarias

Se realizaron distintas instalaciones en el servidor de TEST Debian 10, a continuación las configuraciones realizadas.

### Herramientas genéricas

* Actualizar repositorios

```sh
sudo apt-get update
```

* Certificados

En la plantilla de la máquina virtual de producción se tuvieron problemas con los certificados, para resolverlo se instaló lo siguiente:

```sh
sudo  apt-get install ca-certificates
```

- Build Essentials

```sh
sudo apt-get install build-essential libssl-dev
```

- Generación de reportes PDF

```sh
sudo apt-get install libfontconfig1
```

- Curl y Wget

Si no se tiene instalado el curl y el wget, se recomienda instalar al menos uno de ellos.

```sh
sudo  apt-get install curl
sudo  apt-get install wget
```

### Postgres

Para instalar Postgres se realizaron los pasos, basados en el siguiente enlace:

Como se indica se ejecutaron los siguientes comandos:

```sh
sudo apt-get install postgresql postgresql-contrib
```
```sh
sudo -U postgres -H localhost psql
```

El último comando sólo es par comprobar la instalación.

### wkhtmltopdf

Para renderizar archivos PDF es necesario instalar `wkhtmltopdf` en el sistema. Si fuese un derivado de Debian GNU/Linux se puede hacer con:

```sh
sudo apt install wkhtmltopdf
```

## Obtener el código fuente

Sino se tiene el código fuente en un archivo comprimido se puede obtener con:

```
git clone https://gitlab.justicia.gob.bo/proyecto-acceso-a-la-justicia-ajan/backend-conciliacion
```

## Instalación de dependencias

Ingresar al directorio donde se descargó el proyecto y ejecutar en una terminal:

```bash 
npm install
```
O en su defecto usar: 
```bash 
yarn install
```

## Configuraciones

- Renombrar el archivo `src/common/config/app.js.sample` a `src/common/config/app.js` y ajustar según se requiera.
- Renombrar el archivo `src/common/config/db.js.sample` a `src/common/config/db.js` y asjustar seg[un se requiera para apuntar a una BD.
- Para ciudadanía digital, ajustar `src/common/config/openid.js` para integrar la autenticación y aprobación de documentos.

En el archivo `src/common/config/constants.js` están configuraciones como extensiones de archivos permitidos y endpoints habilitados para interoperabilidad con otros sistemas. Todos los parámetros se pueden cambiar.

### Ajuste de Seeders

En el directorio `src/infrastructure/seeders/` se encuentran archivos que introducen registros de muestra en la base de datos. Estos datos se pueden cambiar pero se debe hacer con cautela porque existen dependencias entre registros.

## Iniciando el sistema

#### Primero se debe crear el esquema de tablas y poblar la base de datos con:

```sh
npm run db
```
Nota: Puede crear mas comandos personalizados en el archivo [package.json](./package.json)

Luego se puede iniciar diferentes modos:

- `npm run start` para iniciar en modo producción
- `npm run dev:debug` para iniciar en modo desarrollo con alta verbosidad y logs incluídos.
- Los logs se guardan en el directorio `logs/` y se opcionalmente configuran en `src/common/config/app.js`.
- Los archivos se guardan en `files/` pero este directorio también se puede cambiar en `src/common/config/app.js`.


### Limpiando la base de datos

Puede realizar la eliminacion manual de los registros que no necesita de la base de datos, o puede ejecutar el script llamado LimpiarDB, sobre el cual puede modificar para que no se elimine lo que se requiera.