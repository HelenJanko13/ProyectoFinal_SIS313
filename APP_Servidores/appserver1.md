# AppServer1 

##  Objetivo del Servidor

AppServer1 ejecuta una aplicación web desarrollada con Node.js que implementa un CRUD (Crear, Leer, Actualizar y Eliminar) para la gestión de productos electrónicos.  
Está conectado al servidor de base de datos maestro (`192.168.210.103`) y balanceado a través del proxy `proxy-sis313.com`.

---


##  Instalación y Configuración del Entorno

###  Instalación de Node.js y NPM

```bash
sudo apt update && sudo apt install nodejs npm -y
```

Instala Node.js y el gestor de paquetes npm en el servidor.

---

### 📥 Instalación de Node.js con NVM (opcional)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 22
```

Instala Node.js versión 22 mediante NVM (Node Version Manager), útil para mantener versiones actualizadas y ordenadas.

---

### 📁 Estructura del Proyecto

```bash
mkdir -p ~/apps/api
cd ~/apps/api
npm init -y
```

Crea el directorio para alojar la aplicación y genera el archivo `package.json` que contiene la configuración del proyecto.

---

### 📦 Instalación de dependencias

```bash
npm install express mysql2
```

- `express`: Framework web para Node.js  
- `mysql2`: Cliente para conectarse a bases de datos MySQL

---

## 🛠️ Desarrollo de la Aplicación CRUD

### 📝 Archivo principal `index.js`

```javascript
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a la base de datos
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
```

La configuración se conecta a la base de datos maestro (IP `192.168.210.103`) usando el usuario `appuser1`.

---

### 📄 Ruta principal `/`

Devuelve una interfaz HTML con formulario y tabla:

```javascript
app.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, productos) => {
    if (err) return res.status(500).send('Error consultando la base de datos');
    // ... HTML con formulario, tabla y acciones de edición y borrado
  });
});
```

Esta ruta sirve como interfaz gráfica principal para el usuario.

---

### 📡 API REST

```javascript
// Obtener productos
app.get('/productos', (req, res) => { ... });

// Agregar producto
app.post('/agregar', (req, res) => { ... });

// Editar producto
app.put('/editar/:id', (req, res) => { ... });

// Borrar producto
app.delete('/borrar/:id', (req, res) => { ... });
```

Estas rutas permiten interactuar con la base de datos desde el frontend o un cliente externo.

---

### 🚀 Inicio del servidor

```bash
node index.js
```

La app queda corriendo en el puerto `3001`, accesible en:

- [http://192.168.210.101:3001](http://192.168.210.101:3001) (local)  
- [http://proxy-sis313.com/](http://proxy-sis313.com/) (a través del balanceador)

---

## 🔐 Hardening y Seguridad

```bash
sudo ufw allow 3001/tcp
```

Habilita el puerto 3001 en el firewall para permitir tráfico hacia la app.

