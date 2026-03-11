
# Backend Zero

El proyecto Backend Zero, esta basado en una arquitectura DDD (Driver Domain Design) en una version personalizada para el proyecto, a continuacion se describe la estructura de los directorios mas importantes.

#### Estructura

La estructura de directiorios que utiliza es:

* public: Contiene todos los archivos que seran enviados desde el backend de forma publica y sin restriccion de acceso.
* files: Contiene todos los documentos generados por el sistema en diferentes formatos, no son de acceso publico.
* ssl: contiene los ceritifados necesarios para levantar el proyecto en un entorno seguro con SSL.
* src: Contiene todo el codigo del proyecto a su vez contiene otros subdirectorios como:
  * application: Contiene toda la logica para manipular las rutas, controladores y middlewares.
    * api/copntrollers: Como su nombre indica, contiene todos los controladores del proyecto, separados por diferentes modulos.
    * api/routes: Contiene todas las rutas protegidas por token desl sistema separado por modulos.
    * api/middlewares: Contiene las funciones que protegen las rutas ya sea por token o permisos.
  * common: Contiene todos los archivos de configuracion como ser, la conexion a la base de datos, conexion a ciudadania digital, constantes, variables de aplicacion, etc.
  * domain: Contiene toda la logica de negocio de la aplicacion, separada por diferentes modulos.
    * helpers: Contiene librerias que ayudan con diferentes tareas recurrentes, como formatear fechas.
    * services: Contiene todos los 'Servicios' la logica de negocio que se conecta con otra capa para obtener datos de la base de datos.
  * infrastructure: Contiene toda la logica de conexion y obtencion de datos de la base de datos.
    * repositories: Contiene la abstraccion de las funciones necesarias para la obtencion de datos de la base de datos a traves de los modelos.
    * models: Contiene la abstraccion de las tablas que se conectan directamente con la base de datos, a traves de Sequelize.
    * seeders: Contiene el llenado de datos de ejmplo al momento de iniciar la base de datos.
    * migrations: Contiene las modificaciones en la base de datos, para llevar un mejor control de versiones.
    * associations.js: Contiene todas las relaciones definidas en la base de datos.
  * views: Contiene todos los archivos que generan vistas o pdf, estan en formato ejs.
#### Nota:
- Los demas archivos son de configuracion general como el manejo de dependencias, los archivos ignorados por git, eslint, peticiones de prueba, etc.
- Para configurar los logs puede modificar el archivo src/common/config/app.js
- Para configurar los logs de base de datos puede modificar el archivo src/common/config/db.js

#### Instalador

Para continuar con la instalación del proyecto, consultar el siguiente archivo [INSTALL.md](./INSTALL.md).

#### Licencia

[Licencia](./LICENSE).#### Documentación

La documentación completa del sistema, incluyendo guías de instalación, arquitectura, variables de entorno, migraciones y errores conocidos está disponible en la Wiki del proyecto:

📖 [Wiki — Gestión Documental](https://devgit.presidencia.gob.bo/gestion-documental/docs-gestion-documental/-/wikis/Inicio)

| Página | Descripción |
|---|---|
| [Arquitectura](https://devgit.presidencia.gob.bo/gestion-documental/docs-gestion-documental/-/wikis/arquitectura) | Stack tecnológico y flujo de tráfico |
| [Guía de Desarrollo](https://devgit.presidencia.gob.bo/gestion-documental/docs-gestion-documental/-/wikis/guia-desarrollo) | Levantar entorno local |
| [Guía de Producción](https://devgit.presidencia.gob.bo/gestion-documental/docs-gestion-documental/-/wikis/guia-produccion) | Despliegue en Rocky Linux |
| [Migraciones](https://devgit.presidencia.gob.bo/gestion-documental/docs-gestion-documental/-/wikis/migraciones) | Tablas faltantes y SQL |
| [Errores Conocidos](https://devgit.presidencia.gob.bo/gestion-documental/docs-gestion-documental/-/wikis/errores-conocidos) | Soluciones a problemas frecuentes |
