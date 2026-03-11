# Notas para la integración del servicio de aprobación con ciudadanía digital

El servicio de [aprobación de documentos de ciudadanía digital](https://www.gob.bo/especificaciones_tecnicas/pdf/Especificaciones_t%C3%A9cnicas_para_el_servicio_de_Aprobaci%C3%B3n.pdf) puede utilizarse para dar validez legal a documentos pdf o json digitales, para usuarios que tengan sesión de ciudadanía digital iniciada.

## Sobre el flujo

Como se indica en el documento de [especificaciones técnicas](https://www.gob.bo/especificaciones_tecnicas/pdf/Especificaciones_t%C3%A9cnicas_para_el_servicio_de_Aprobaci%C3%B3n.pdf) el servicio requiere un backend y frontend por parte de este sistema.

El flujo en sí empieza cuando el backend envía una solicitud de aprobación vía petición POST a https://<url-base-servicio-interoperabilidad-aprobacion-firma>. En esta solicitud se envía:

  - El contenido de un documento por ejemplo un PDF en base 64.
  - El hash sha256 de ese contenido enviado.
  - La descripción del trámite que se está realizando.
  - Un idTramite único para poder identificar a esta petición.
  - Un token obtenido del inicio de sesión con ciudadanía
  - Un token de interoperabilidad que se adjunta en la cabecera de la petición. Este Token debe obtenerse de la plataforma de interoperabilidad de AGETIC para poder usar el servicio.
  
Luego de la solicitud inicial el servicio retorna un `linkRedireccion` al backend, y para continuar el flujo el backend debe pasarle este link al frontend. El frontend debería redireccionar al usuario a ese `linkRedireccion`.

En link proveído del servicio de aprobación volverá a comprobar la sesión de ciudadanía digital y una vez el usuario haya aprobado o rechazado el documento, notificará al backend la acción del usuario.

El backend debe tener un endpoint (aún no está implementado) para recibir esta respuesta, en la respuesta el servicio de aprobación enviará:

  - **aceptado**: True si el ciudadano ha aceptado la aprobación
  - **introducido**: True si se introdujo el registro en la cadena de bloques sin problemas.
  - **requestUuid**: Correspondiente al campo `idTramite` enviado en la petición inicial. Esto ayuda a verificar qué documento es del que se recibe la notificación.
  - **codigoOperacion**: Código usado para la blockchain.
  - **mensaje**: Una cadena de texto
  - **transaction**_id: Este código de transacción se puede usar posteriormente para verificar directamente este documento en la cadena de bloques estatal.
  - **fechaHoraSolicitud**
  - **hashDatos**: El mismo hash que se envió en la solicitud inicial.
  - **ci**: El documento de identidad del ciudadano.
  
## Funciones Implementadas en el sistema

Se tiene la tabla `sys_aprobacion_documentos` implementada donde se guardan registros de intentos de aprobación de documentos. Esta esta asociada con `sys_auth` y `sys_usuario` para identificar al usuario, y `gestion_documento` para asociar una solicitud de aprobación con ciudadanía digital con un documento directamente.

El archivo `AprobacionDocumentosService.js` tiene las funciones necesarias que cubren:

- Solicitud inicial de aprobación de documentos.
- Recepción de notificación del servicio de aprobación de documentos con ciudadanía digital.

### POST /ciudadania/aprobacion

Se tiene el endpoint `/ciudadania/aprobacion` que recibe una solicitud de tipo `POST` para registrar la notificación de aprobación de ciudadanía enviada por el servicio de ciudadanía digital. Este endpoint utiliza las el token `postSecret` especificado en `src/common/config/openid.js` que debe registrarse previamente en ciudadanía digital.
