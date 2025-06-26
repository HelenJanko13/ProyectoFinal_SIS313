const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: '192.168.210.103',
  user: 'appuser1',
  password: 'Hsis_313',
  database: 'tienda'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

app.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, productos) => {
    if (err) return res.status(500).send('Error consultando la base de datos');
     const rows = productos.map(p => `
      <tr data-id="${p.id}">
        <td>${p.id}</td>
        <td class="nombre">${p.nombre}</td>
        <td class="precio">$${Number(p.precio).toFixed(2)}</td>
        <td>
          <button class="btn-edit" onclick="editar(${p.id})">✏️</button>
          <button class="btn-delete" onclick="borrar(${p.id})">🗑️</button>
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Tienda Electrónica</title>
        <style>
          body { font-family: Arial; background: #eef1f7; padding: 20px; }
          h1 { text-align: center; color: #003366; }
          form { display: flex; gap: 10px; justify-content: center; margin->          form input, button { padding: 10px; font-size: 14px; border-radiu>          form button { background: #007bff; color: white; border: none; }
          form button:hover { background: #0056b3; }
          table { width: 90%; margin: auto; border-collapse: collapse; back>          th, td { padding: 10px; border: 1px solid #ccc; text-align: cente>          th { background: #003366; color: white; }
          .btn-edit { color: #007bff; border: none; background: none; curso>          .btn-delete { color: #dc3545; border: none; background: none; cur>        </style>
      </head>
      <body>
        <h1>📦 Tienda Electrónica2 </h1>

         <form id="formAgregar">                                                       <input name="nombre" placeholder="Nombre del producto" required />          <input name="precio" placeholder="Precio" type="number" step="0.0>          <button type="submit">Agregar</button>
        </form>

        <table id="tablaProductos">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Acciones</th><>          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <script>
          const form = document.getElementById('formAgregar');
          form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
              nombre: formData.get('nombre'),
              precio: parseFloat(formData.get('precio'))
            };
            const res = await fetch('/agregar', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(data)
            });
            if (res.ok) {
              form.reset();
              location.reload();
            } else {
              alert('Error al agregar');
            }
           });

          async function borrar(id) {
            if (!confirm('¿Borrar producto?')) return;
            const res = await fetch('/borrar/' + id, { method: 'DELETE' });
            if (res.ok) location.reload();
            else alert('Error al borrar');
          }

          function editar(id) {
            const tr = document.querySelector(\`tr[data-id="\${id}"]\`);
            const nombreTd = tr.querySelector('.nombre');
            const precioTd = tr.querySelector('.precio');

            const nombreOld = nombreTd.textContent;
            const precioOld = precioTd.textContent.replace('$', '');

            nombreTd.innerHTML = \`<input type=\"text\" id=\"editNombre\" v>            precioTd.innerHTML = \`<input type=\"number\" step=\"0.01\" id=>
            const btn = tr.querySelector('.btn-edit');
            btn.textContent = '💾';
            btn.onclick = async () => {
              const nuevoNombre = document.getElementById('editNombre').val>              const nuevoPrecio = parseFloat(document.getElementById('editP>              const res = await fetch('/editar/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPr>              });
              if (res.ok) location.reload();
              else alert('Error al editar');
            };
          }
        </script>
       </body>
      </html>
    `;
    res.send(html);
  });
});

app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de dato>    res.json(results);
  });
});

app.post('/agregar', (req, res) => {
  const { nombre, precio } = req.body;
  db.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre,>    if (err) return res.status(500).json({ error: 'Error al agregar' });
    res.status(200).json({ mensaje: 'Producto agregado' });
  });
});

app.put('/editar/:id', (req, res) => {
  const { nombre, precio } = req.body;
  db.query('UPDATE productos SET nombre = ?, precio = ? WHERE id = ?', [nom>    if (err) return res.status(500).json({ error: 'Error al editar' });
    res.status(200).json({ mensaje: 'Actualizado' });
  });
});

app.delete('/borrar/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {    if (err) return res.status(500).json({ error: 'Error al borrar' });
    res.status(200).json({ mensaje: 'Borrado' });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
            
        
