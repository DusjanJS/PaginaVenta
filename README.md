# UCAM Stereo

## Canal digital de venta instrumentado

---

## 1. Introducción:

UCAM Stereo es un proyecto académico desarrollado para la asignatura **Soluciones Informáticas para la Empresa (SIE)** del Grado en Ingeniería Informática de la UCAM.

El proyecto consiste en el diseño e implementación de un **canal digital de venta** especializado en productos de audio, como tocadiscos, altavoces, auriculares y vinilos.

La aplicación representa el funcionamiento de una tienda online, incluyendo catálogo de productos, fichas de producto, carrito de compra, checkout, pago simulado, generación y gestión de pedidos, persistencia de datos, registro de eventos y automatización de procesos.

> **Importante:** UCAM Stereo es un prototipo exclusivamente académico. No se realizan pagos reales ni se utilizan datos personales, bancarios o credenciales personales reales.

---

## 2. Tecnologías utilizadas

### Frontend

El frontend se ha desarrollado utilizando:

- React
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- Lucide React

React se utiliza para construir la interfaz de usuario y gestionar las diferentes páginas y componentes de la aplicación.

El frontend incluye, entre otras, las siguientes vistas:

- Página de inicio.
- Catálogo.
- Ficha de producto.
- Carrito.
- Checkout.
- Confirmación del pedido.
- Login.
- Soporte.
- Administración.

### Backend

El backend se ha desarrollado utilizando:

- Node.js
- Express
- JavaScript
- API REST
- CORS
- dotenv

El backend actúa como intermediario entre el frontend y la base de datos y proporciona la API necesaria para consultar y gestionar la información de la aplicación.

### Base de datos

La persistencia de datos se realiza mediante:

- PostgreSQL

La base de datos almacena la información necesaria para representar el funcionamiento del canal digital de venta, incluyendo productos, usuarios de prueba, pedidos, líneas de pedido, pagos simulados y eventos.

### Diseño y prototipado

Para el diseño inicial, mockups y definición visual de la aplicación se ha utilizado:

- Figma

Figma se utilizó para definir la estructura de las páginas, colores, distribución de elementos, tamaños de componentes, navegación, acciones, ventanas emergentes y otros aspectos de la interfaz.

Las decisiones de diseño realizadas por el grupo se encuentran documentadas en la carpeta `docs/`.

### Pago simulado

Para representar el proceso de pago se utiliza:

- PayPal

El pago se realiza exclusivamente como una simulación académica y no implica ninguna transacción económica real.

### Automatización

Para las automatizaciones del sistema se utilizará:

- n8n

Una de las principales automatizaciones previstas consiste en el envío de un correo electrónico de confirmación después de completar una compra.

### Inteligencia Artificial

Durante el desarrollo se han utilizado las siguientes herramientas de IA generativa:

- ChatGPT
- Claude
- Gemini

Estas herramientas se han utilizado como apoyo para consultas técnicas, programación, depuración, documentación, resolución de errores y otras tareas de desarrollo.

La información detallada sobre el uso de IA se encuentra documentada en `docs/`.

---

## 3. Arquitectura

La aplicación está organizada separando la interfaz, el backend y la persistencia de datos.

```text
                         USUARIO
                            |
                            v
                 +----------------------+
                 |       FRONTEND       |
                 |        React         |
                 |                      |
                 | Inicio               |
                 | Catálogo             |
                 | Producto             |
                 | Carrito              |
                 | Checkout             |
                 | Confirmación         |
                 | Administración       |
                 +----------+-----------+
                            |
                         HTTP/JSON
                            |
                            v
                 +----------------------+
                 |       BACKEND        |
                 |    Node.js/Express   |
                 |                      |
                 | API REST             |
                 | Rutas                |
                 | Servicios            |
                 | Lógica de negocio    |
                 +----------+-----------+
                            |
                           SQL
                            |
                            v
                 +----------------------+
                 |      PostgreSQL      |
                 |                      |
                 | Productos            |
                 | Usuarios             |
                 | Pedidos              |
                 | Líneas de pedido     |
                 | Pagos simulados      |
                 | Eventos              |
                 +----------------------+
```

---

## 4. Eventos e instrumentación

El proyecto incorpora instrumentación de eventos para registrar acciones relevantes durante la navegación y el proceso de compra.

Entre los eventos contemplados se encuentran:

- `product.viewed`
- `cart.item_added`
- `checkout.started`
- `order.created`
- `payment.simulated`
- `support.requested`
- `incident.created`

### Automatización con n8n

n8n se utilizará para automatizar procesos relacionados con la compra.

Una de las automatizaciones previstas consiste en enviar un correo electrónico de confirmación una vez completado el pedido.

---

## 5. Requisitos previos

Para ejecutar el proyecto se necesitan:

- Node.js
- npm
- PostgreSQL
- Git
- n8n

### Node.js

Node.js es necesario para ejecutar el frontend y el backend.

Descarga oficial:

https://nodejs.org/

Se recomienda utilizar una versión LTS.

Para comprobar la instalación:

```bash
node --version
npm --version
```

### PostgreSQL

PostgreSQL es necesario para ejecutar la base de datos.

Descarga oficial:

https://www.postgresql.org/download/

Para comprobar la instalación:

```bash
psql --version
```

### Git

Git es necesario para clonar y gestionar el repositorio.

Descarga oficial:

https://git-scm.com/downloads

Para comprobar la instalación:

```bash
git --version
```

---

## 6. Instalación del proyecto

### Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/DusjanJS/PaginaVenta.git
```

Entrar en la carpeta:

```bash
cd PaginaVenta
```

### Instalación y ejecución del frontend

Entrar en la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local de acceso, normalmente:

http://localhost:5173

### Instalación y ejecución del backend

Abrir otra terminal.

Desde la carpeta raíz del proyecto:

```bash
cd PaginaVenta/backend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar el servidor:

```bash
node src/server.js
```

El backend se ejecutará normalmente en:

http://localhost:3000

Para comprobar que está funcionando se puede acceder a:

http://localhost:3000

Para comprobar la API de productos:

http://localhost:3000/api/productos

---

## 7. Variables de entorno

Las variables de entorno se utilizan para evitar almacenar información sensible directamente en el código.

Debe existir un archivo `.env` en la ubicación correspondiente al backend.

Ejemplo de configuración:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña
```

Los valores mostrados son únicamente un ejemplo y deben sustituirse por los correspondientes al entorno de ejecución.

No se deben subir al repositorio:

- Contraseñas.
- Tokens.
- Claves API.
- Credenciales de PostgreSQL.
- Credenciales de PayPal.
- Credenciales de correo.
- Otros datos sensibles.

El archivo `.env` debe permanecer incluido en `.gitignore`.

---

## 8. Ejecución completa

Para ejecutar el proyecto completo localmente se recomienda utilizar varias terminales.

### Terminal 1 - PostgreSQL

Iniciar PostgreSQL y comprobar que la base de datos está disponible.

### Terminal 2 - Backend

```bash
cd PaginaVenta/backend

npm install
node src/server.js
```

Backend:

http://localhost:3000

### Terminal 3 - Frontend

```bash
cd PaginaVenta/frontend

npm install
npm run dev
```

Frontend:

http://localhost:5173

---

## 9. Seguridad y privacidad

El proyecto tiene carácter exclusivamente académico.

Por este motivo:

- No se utilizan datos personales reales.
- No se utilizan datos bancarios reales.
- No se realizan pagos reales.
- Los usuarios son usuarios de prueba.
- Las credenciales utilizadas son exclusivamente de prueba.
- No se almacenan credenciales privadas dentro del repositorio.
- Las claves y datos sensibles se gestionan mediante variables de entorno.
- Las integraciones externas tienen finalidad demostrativa.

El proyecto no está diseñado para utilizarse como una plataforma comercial real.

---

## 10. Datos de prueba

Los productos y usuarios utilizados durante las pruebas son ficticios.

El catálogo se ha diseñado para representar una tienda de audio realista y permite realizar pruebas de:

- Productos.
- Categorías.
- Búsqueda.
- Filtrado.
- Stock.
- Variantes.
- Carrito.
- Checkout.
- Pedidos.
- Pago simulado.
- Eventos.

---

## 11. Limitaciones

El proyecto es un prototipo académico y presenta las siguientes limitaciones:

- Los pagos son simulados.
- No se realizan transacciones económicas reales.
- Los usuarios son usuarios de prueba.
- Los datos utilizados son ficticios.
- Las automatizaciones mediante n8n tienen finalidad demostrativa.
- Algunas funcionalidades pueden estar simplificadas respecto a una aplicación comercial real.
- La seguridad y escalabilidad pueden estar simplificadas respecto a un entorno de producción.
- Las integraciones externas se utilizan con finalidad académica.
- El sistema no está destinado a gestionar una actividad comercial real.

---

## 12. Documentación adicional

La documentación adicional se encuentra en:

`docs/`

Dentro de esta carpeta se incluyen documentos relacionados con:

- Memoria del proyecto.
- Uso de Inteligencia Artificial.
- Decisiones de diseño de Figma.
- Documentación complementaria.

La memoria desarrolla con mayor profundidad la arquitectura, el modelo de datos, los eventos, las decisiones tecnológicas, las limitaciones y el uso de IA.

---

## 13. Despliegue

### URL pública

PENDIENTE

En caso de disponer de URLs diferentes para frontend y backend:

Frontend:

PENDIENTE

Backend/API:

PENDIENTE

---

## 14. Repositorio

El código fuente y el historial de desarrollo se encuentran disponibles en GitHub:

https://github.com/DusjanJS/PaginaVenta

El repositorio contiene:

- Código fuente del frontend.
- Código fuente del backend.
- Archivos de la base de datos.
- Documentación.
- Configuración del proyecto.
- Historial de commits.

---

## 15. Trabajo colaborativo

El proyecto se desarrolla mediante Git y GitHub.

El repositorio permite:

- Control de versiones.
- Registro de cambios.
- Trabajo colaborativo.
- Seguimiento del desarrollo.
- Integración de las diferentes partes del proyecto.
- Conservación del historial de commits.

El historial de commits refleja la evolución del proyecto y las aportaciones de los miembros del grupo.

### Equipo

Proyecto desarrollado por estudiantes del:

Grado en Ingeniería Informática - UCAM

### Integrantes

- PENDIENTE
- PENDIENTE
- PENDIENTE
- PENDIENTE

---

## 16. Finalidad del proyecto

Este proyecto ha sido desarrollado exclusivamente con fines académicos para la asignatura Soluciones Informáticas para la Empresa (SIE).

No está destinado a explotación comercial ni al tratamiento de datos reales.

Su objetivo es demostrar el diseño e implementación de un canal digital de venta, su arquitectura, persistencia, flujo transaccional, instrumentación de eventos y posibilidades de integración con otros sistemas.
