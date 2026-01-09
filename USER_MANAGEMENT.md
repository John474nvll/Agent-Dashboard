# Guía de Gestión de Usuarios

Este proyecto utiliza **Replit Auth** para la gestión de usuarios, lo cual simplifica la autenticación y no requiere el manejo manual de contraseñas ni sesiones complejas.

## Cómo añadir Autenticación

Para habilitar la creación de usuarios y el inicio de sesión:

1.  **Integración**: He configurado la base para que el sistema esté listo para recibir usuarios.
2.  **Uso en el Código**: 
    - En el frontend, puedes verificar si un usuario está logueado accediendo a las cabeceras de Replit Auth.
    - Los usuarios se crean automáticamente la primera vez que inician sesión a través de Replit.

## Registro de Usuarios
Si deseas implementar un sistema de registro personalizado o roles de administrador:
- Los usuarios actuales se almacenan en la tabla `users` de la base de datos.
- Puedes extender la tabla `users` en `shared/schema.ts` para añadir campos adicionales como `rol` o `empresa`.

## Seguridad
- No es necesario almacenar contraseñas (Replit Auth lo gestiona).
- Los datos sensibles de los agentes están protegidos por el ID del usuario propietario.
