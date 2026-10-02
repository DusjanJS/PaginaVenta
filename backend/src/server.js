const express = require("express");
const cors = require("cors");
const productosRoutes = require("./routes/productos.routes");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", productosRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend de PaginaVenta funcionando correctamente"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});