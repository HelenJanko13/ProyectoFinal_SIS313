#  AppServer2 

##  Objetivo del Servidor

AppServer2 es una réplica funcional de AppServer1. Está configurado para ejecutar la misma aplicación CRUD conectada a la base de datos maestro, permitiendo alta disponibilidad gracias al balanceo de carga.

---

##  Instalación y Configuración del Entorno

###  Instalación de Node.js con NVM (opcional)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```
```bash
. "$HOME/.nvm/nvm.sh"
```
Download and install Node.js:
```bash
nvm install 22
```

Verify the Node.js version:
```bash
node -v
```
Should print "v22.17.0".

```bash
nvm current
```
Should print "v22.17.0".

Verify npm version:
```bash
npm -v
```
Should print "10.9.2".

Instala Node.js versión 22 mediante NVM (Node Version Manager), útil para mantener versiones actualizadas y ordenadas.

---

###  Estructura del Proyecto
#### Crea el directorio para alojar la aplicación y entrar con `cd`

```bash
mkdir -p ~/apps/api
cd ~/apps/api
```
#### Genera el archivo `package.json` que contiene la configuración del proyecto.
```bash
npm init -y
```
#### Configuraciones 
```bash
package name: (api)
version: (1.0.0)
description: API Backend Project SIS313
entry point: (index.js)
test command:
git repository:
keywords: API, ProjectSIS313
author: SH SIS313
license: (ISC)
About to write to /home/AppServer2/apps/api/package.json:

{
  "name": "api",
  "version": "1.0.0",
  "description": "API Backend Project SIS313",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "API",
    "ProjectSIS313"
  ],
  "author": " SH SIS313",
  "license": "ISC"
}


Is this OK? (yes) y
```
#### Si es el caso, se podria actualizar el gestor de paquetes de Node.js, el que te permite instalar librerías como express, mysql2, etc.
```bash
npm install -g npm@11.4.2
```
---
---
###  Instalación de dependencias

```bash
npm install express mysql2 body-parser
```

- `express`: Framework web para Node.js  
- `mysql2`: Cliente para conectarse a bases de datos MySQL
- `body-parser`: Middleware que permite que la app entienda el contenido de las peticiones POST y PUT.

---

##  Desarrollo de la Aplicación CRUD

###  Archivo principal `index.js`

```javascript
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3002;

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
---


###  Se inicia con:

```bash
node index.js
```

---

###  La app queda disponible en:

- http://192.168.210.102:3002 (directo)
- http://proxy-sis313.com/ (si AppServer1 falla)

---

##  Hardening y Seguridad

```bash
sudo ufw allow 3002/tcp
```

El firewall fue configurado para permitir únicamente el tráfico necesario.

---

##  Conclusión

Ambos servidores están sincronizados y ejecutan la misma app. Gracias al balanceo, si uno cae, el otro mantiene el servicio activo. La conexión con la base de datos maestro garantiza que todas las acciones CRUD tengan efecto inmediato y replicable.
