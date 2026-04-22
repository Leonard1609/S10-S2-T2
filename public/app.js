const form = document.getElementById('productoForm');
const tabla = document.querySelector('#tablaProductos tbody');
const btnSubmit = document.getElementById('btnSubmit');
const inputId = document.getElementById('productoId');
const themeToggle = document.getElementById('theme-toggle');

// --- MODO OSCURO ---
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerText = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
});

// --- LÓGICA CRUD ---

async function cargarProductos() {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    tabla.innerHTML = productos.map(p => `
        <tr>
            <td><small>#${p.id}</small></td> <td><strong>${p.nombre}</strong></td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>${p.categoria}</td>
            <td>
                <button class="btn-edit" onclick="prepararEdicion(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock}, '${p.categoria}')">✏️</button>
                <button class="btn-delete" onclick="eliminar(${p.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const id = inputId.value;
        const data = {
            nombre: document.getElementById('nombre').value,
            precio: parseFloat(document.getElementById('precio').value),
            stock: parseInt(document.getElementById('stock').value),
            categoria: document.getElementById('categoria').value
        };

        const url = id ? `/api/productos/${id}` : '/api/productos';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        alert("¡Éxito!"); 
        form.reset();
        inputId.value = '';
        cargarProductos();
    } catch (error) {
        console.error("Hubo un fallo:", error);
        alert("No se pudo guardar: " + error.message);
    }
});

async function eliminar(id) {
    if(confirm('¿Eliminar producto?')) {
        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        cargarProductos();
    }
}

function prepararEdicion(id, nombre, precio, stock, categoria) {
    inputId.value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
    document.getElementById('stock').value = stock;
    document.getElementById('categoria').value = categoria;
    btnSubmit.innerText = "Actualizar Producto";
    btnSubmit.style.background = "#f59e0b";
}

cargarProductos();