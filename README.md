### Financial Resource Management

# Frontend

React con TypeScript
Framework de Estilos: Tailwind CSS para un diseño rápido y responsivo.
Gestión de Estado: Redux Toolkit para manejar el estado de la aplicación.
Autenticación: Auth0 para un inicio de sesión seguro y verificación de usuarios.
Gráficas y Visualización: Chart.js para mostrar datos financieros de manera visual.

# Backend

Node.js con NestJS y TypeScript

# Arquitectura de Microservicios:

Organizacion de backend en servicios independientes para manejar autenticación, transacciones, cuentas y procesamiento de datos.
APIs REST.
Validación y Seguridad: Helmet para protección contra vulnerabilidades y class-validator para validar la entrada de datos.

### Microservicios

# Autenticación:

Microservicio para manejo de autenticación y autorización.

# Transacciones:

Microservicio independiente para procesar y registrar transacciones (implementable en una segunda fase), utilizando colas de mensajes como RabbitMQ para garantizar procesamiento seguro.

# Cuentas Bancarias y Gastos:

Microservicio que conecta con APIs de terceros como Plaid para obtener y actualizar datos bancarios del usuario.

# Manejo de Notificaciones:

Un microservicio para enviar notificaciones (por email o push) cuando se detecten actividades importantes.
Base de Datos

# PostgreSQL

como base de datos relacional para almacenar los datos principales (transacciones, cuentas, historial de usuarios).

# Redis

para caché y almacenamiento temporal de datos frecuentemente solicitados, mejorando la velocidad de respuesta.
Colas y Mensajería

# RabbitMQ

Manejar procesamiento en cola y asegurar la integridad de las transacciones. Manejar los procesos que requieren sincronización, como el registro de transacciones en tiempo real.
