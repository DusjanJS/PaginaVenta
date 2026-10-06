# PaginaVenta
Tarea 1 - Soluciones Informáticas para la Empresa

## Ejecutar la tienda en local

Entra en `frontend`, ejecuta `npm install` y luego `npm run dev`. Este comando inicia frontend y backend juntos en los puertos fijos `5173` y `3000`.

El frontend está en `http://localhost:5173`, reenvía las peticiones `/api` al backend local en el puerto `3000`. Para desplegar la tienda, configura `VITE_API_URL` con la URL pública de la API, incluyendo `/api` (por ejemplo, `https://api.ejemplo.com/api`), y despliega también el backend.

**Solo para desarrollo local (provisional):** si no se recibe ninguna petición HTTP durante 19 minutos, la terminal avisa que los servidores se apagarán en un minuto. Al cumplir 20 minutos sin peticiones, detiene ambos procesos y libera los puertos. Cualquier petición al frontend o backend reinicia el temporizador. `Ctrl+C` detiene los dos inmediatamente. Esta regla no se usa en producción y deberá retirarse al desplegar la web en el dominio y configurar los servidores de producción.

La autenticación de demostración ofrece `cliente@ucam.test` / `demo1234` y `admin@ucam.test` / `admin1234`. Las cuentas y tokens se guardan en memoria del backend; al reiniciar el servidor, los registros se pierden y hay que iniciar sesión de nuevo. Las fechas de alta, incluidas las cuentas demo, las asigna el backend.

Los pedidos se crean en `POST /api/pedidos` enviando únicamente identificadores de producto/variante y cantidades, además de los datos de envío. El servidor valida, comprueba y descuenta stock, y vuelve a calcular los totales. `GET /api/pedidos` devuelve los pedidos propios o todos para admin; `GET /api/pedidos/:id` aplica el acceso de propietario/invitado/admin; `PATCH /api/pedidos/:id/estado` es solo para admin. El pago académico se registra en `POST /api/pedidos/:id/pago`.

Los pedidos y el stock también residen en memoria: se reinician al apagar el backend; para producción deberán persistirse en la base de datos. Los estados de pago aprobados usan `pagado`.
