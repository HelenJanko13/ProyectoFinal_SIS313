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
About to write to /home/AppServer1/apps/api/package.json:

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

---

##  Aplicación CRUD

La aplicación `index.js` es idéntica a la de AppServer1 y contiene:

- Conexión a la base de datos maestro (`192.168.210.103`)
- Interfaz HTML para gestión de productos
- API REST para manejar operaciones CRUD

###  Se inicia con:

```bash
node index.js
```

---

###  La app queda disponible en:

- http://192.168.210.102:3001 (directo)
- http://proxy-sis313.com/ (si AppServer1 falla)

---

##  Hardening y Seguridad

```bash
sudo ufw allow 3001/tcp
```

El firewall fue configurado para permitir únicamente el tráfico necesario.

---

##  Conclusión

Ambos servidores están sincronizados y ejecutan la misma app. Gracias al balanceo, si uno cae, el otro mantiene el servicio activo. La conexión con la base de datos maestro garantiza que todas las acciones CRUD tengan efecto inmediato y replicable.
