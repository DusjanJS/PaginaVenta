const express = require("express");
const productos = require("../data/productos");

const router = express.Router();

// Obtener todos los productos
router.get("/", (req, res) => {
    res.json(productos);
});

module.exports = router;