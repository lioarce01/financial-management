# Financial Resource Management

### Frontend

React con TypeScript
Framework de Estilos: Tailwind CSS para un diseño rápido y responsivo.
Gestión de Estado: Redux Toolkit para manejar el estado de la aplicación.
Autenticación: Auth0 para un inicio de sesión seguro y verificación de usuarios.
Gráficas y Visualización: Chart.js para mostrar datos financieros de manera visual.
Socket.IO: Escucha eventos del backend y actualiza la vista del usuario o muestra notificaciones en tiempo real.

### Backend

Node.js con ExpressJS, Prisma, Typescript, PostgreSQL, Helmet.
Socket.IO: Emite eventos de actualización de saldo o nuevas transacciones al frontend cada vez que el backend recibe nuevos datos desde la API bancaria o el sistema de cuentas.

### Arquitectura de Microservicios:

Organizacion de backend en servicios independientes para manejar autenticación, transacciones, cuentas y procesamiento de datos.
APIs REST.
Validación y Seguridad: Helmet para protección contra vulnerabilidades y class-validator para validar la entrada de datos.

### Autenticación:

manejo de autenticación y autorización.

### Transacciones:

procesar y registrar transacciones (implementable en una segunda fase), utilizando colas de mensajes como RabbitMQ para garantizar procesamiento seguro.

### Cuentas Bancarias y Gastos:

conecxion con APIs de terceros como Plaid para obtener y actualizar datos bancarios del usuario.

### Manejo de Notificaciones:

enviar notificaciones (por email o push) cuando se detecten actividades importantes.
Base de Datos

### PostgreSQL

Base de datos NoSQL para almacenar los datos principales (transacciones, cuentas, historial de usuarios).
