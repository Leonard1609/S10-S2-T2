const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos (Se creará como productos.db)
const db = new sqlite3.Database('./productos.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Conectado a la base de datos de Productos');
});

// Crear tabla de Productos
db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    precio REAL,
    stock INTEGER,
    categoria TEXT
)`);

// ===== CRUD DE PRODUCTOS =====

// CREATE: Registrar un producto
app.post('/productos', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;
    db.run(
        'INSERT INTO productos (nombre, precio, stock, categoria) VALUES (?, ?, ?, ?)',
        [nombre, precio, stock, categoria],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.send('Producto registrado exitosamente');
        }
    );
});

// READ: Listar todos los productos
app.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// READ: Obtener un producto por ID
app.get('/productos/:id', (req, res) => {
    db.get('SELECT * FROM productos WHERE id=?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        res.json(row);
    });
});

// UPDATE: Actualizar datos de un producto
app.put('/productos/:id', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;
    db.run(
        'UPDATE productos SET nombre=?, precio=?, stock=?, categoria=? WHERE id=?',
        [nombre, precio, stock, categoria, req.params.id],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.send('Producto actualizado correctamente');
        }
    );
});

// DELETE: Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    db.run('DELETE FROM productos WHERE id=?', [req.params.id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.send('Producto eliminado del sistema');
    });
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Productos corriendo en http://localhost:${PORT}`);
});