# 🖥️ AppServer2 - Documentación Detallada

## 🎯 Objetivo del Servidor

AppServer2 es una réplica funcional de AppServer1. Está configurado para ejecutar la misma aplicación CRUD conectada a la base de datos maestro, permitiendo alta disponibilidad gracias al balanceo de carga.

---

## ⚙️ Instalación y Configuración del Entorno

### 📦 Instalación de Node.js y dependencias

```bash
sudo apt update && sudo apt install nodejs npm -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 22
```

---

### 📁 Configuración del Proyecto

```bash
mkdir -p ~/apps/api
cd ~/apps/api
npm init -y
npm install express mysql2
```

---

## 🛠️ Aplicación CRUD

La aplicación `index.js` es idéntica a la de AppServer1 y contiene:

- Conexión a la base de datos maestro (`192.168.210.103`)
- Interfaz HTML para gestión de productos
- API REST para manejar operaciones CRUD

### ▶️ Se inicia con:

```bash
node index.js
```

---

### 🌐 La app queda disponible en:

- http://192.168.210.102:3001 (directo)
- http://proxy-sis313.com/ (si AppServer1 falla)

---

## 🔐 Hardening y Seguridad

```bash
sudo ufw allow 3001/tcp
```

El firewall fue configurado para permitir únicamente el tráfico necesario.

---

## ✅ Conclusión

Ambos servidores están sincronizados y ejecutan la misma app. Gracias al balanceo, si uno cae, el otro mantiene el servicio activo. La conexión con la base de datos maestro garantiza que todas las acciones CRUD tengan efecto inmediato y replicable.
