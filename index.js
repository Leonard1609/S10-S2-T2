const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos con manejo de errores mejorado
const db = new sqlite3.Database('./productos.db', (err) => {
    if (err) return console.error("Error al conectar DB:", err.message);
    console.log('✅ Conectado a SQLite: productos.db');
});

// Inicialización de tabla
db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    categoria TEXT
)`);

// ===== API ROUTES =====

// CREATE
app.post('/api/productos', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;
    if(!nombre || !precio) return res.status(400).json({ error: "Nombre y precio son obligatorios" });

    const sql = 'INSERT INTO productos (nombre, precio, stock, categoria) VALUES (?, ?, ?, ?)';
    db.run(sql, [nombre, precio, stock, categoria], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Producto registrado' });
    });
});

// READ (All)
app.get('/api/productos', (req, res) => {
    db.all('SELECT * FROM productos ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// DELETE
app.delete('/api/productos/:id', (req, res) => {
    db.run('DELETE FROM productos WHERE id=?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado', changes: this.changes });
    });
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en: http://localhost:3000`);
});