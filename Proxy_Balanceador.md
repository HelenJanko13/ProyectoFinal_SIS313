# Implementación del Balanceador de Carga con Nginx

## Objetivo del Balanceador

El balanceador de carga tiene como objetivo distribuir las solicitudes de los usuarios entre dos servidores de aplicaciones (AppServer1 y AppServer2), permitiendo:

* Alta disponibilidad del sistema.
* Escalabilidad horizontal.
* Redundancia frente a fallos de un servidor.
* Punto de acceso único para el cliente (proxy-sis313.com).

Este balanceador fue implementado con **NGINX** y configurado para redirigir el tráfico entre los dos servidores de aplicaciones, ambos corriendo un CRUD desarrollado en Node.js conectado a una base de datos MySQL replicada (maestro-esclavo).

---

## Entorno de Infraestructura

*  **Proxy/Balanceador:** 192.168.210.100 (COMPU1)
*  **AppServer1:** 192.168.210.101 (COMPU1)
*  **AppServer2:** 192.168.210.102 (COMPU2)
*  DNS: proxy-sis313.com (resuelto en el archivo `/etc/hosts`)

---

## Pasos Realizados para Implementar el Balanceador

### 1. Configuración de Red Estática en el Proxy

Archivo editado:

```bash
sudo nano /etc/netplan/50-cloud-init.yaml
```

Contenido:

```yaml
 network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: false
      addresses: [192.168.210.100/24]
      routes:
      - to: default
        via: 192.168.210.60
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

Aplicación:

```bash
sudo netplan apply
```

---

### 2.  Instalación y configuración de NGINX

####   Actualizacion e Instalacion
```bash
   sudo apt update && sudo apt install nginx
```
####   Verificacion del EStado del servicio
```bash
   sudo systemctl status nginx
```
  El estado deberia de estar en active (running). Si no lo esta, se lo inicia con: 
```bash
   sudo systemctl start nginx
```
  Para habilitar el inicio automatico con: 
```bash
   sudo systemctl enable nginx
```
---

### 3. Configuración del Sitio de Balanceo

Archivo creado:

```bash
sudo nano /etc/nginx/sites-available/proxy-sis313.com
```

Contenido del archivo:

```nginx
upstream appservers {
    server 192.168.210.101:3001;
    server 192.168.210.102:3002;
}

server {
    listen 80;
    server_name proxy-sis313.com;

    location / {
        proxy_pass http://appservers;
        proxy_http_version 1.1;
        # Cabeceras necesarias para WebSocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        # Cabeceras de identidad del cliente
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Evita caché en conexiones WebSocket
        proxy_cache_bypass $http_upgrade;

        # Mantiene la redirecciones  originales del backend
        proxy_redirect off;
    }
}
```

---

### 4. 🔗 Enlace simbólico y activación

```bash
sudo ln -s /etc/nginx/sites-available/proxy-sis313.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```
Se elimina el enlace default

---

### 5. Verificación y reinicio del servicio

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

### 6.  Prueba de funcionamiento

#### Hosts en cliente:
En el Sistema operativo de Windows, se debe de ejecutar el block de notas como administrador y abrir la siguiente direccion:

```bash
C:\Windows\System32\drivers\etc
```
En el archivo `hosts`
Agregar:

```
192.168.210.100 proxy-sis313.com
```

#### Pruebas con navegador o `curl`:

```bash
curl http://proxy-sis313.com/
curl http://proxy-sis313.com/productos
```

---

## Seguridad aplicada (Hardening)

* Se eliminó el archivo por defecto de NGINX para evitar conflictos (`default`).
* Se restringió el acceso solo al puerto 80 para NGINX y al puerto 3001 internamente entre servidores.
* Se configuró firewall UFW para permitir solo los servicios necesarios.

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## Prueba de Tolerancia a Fallos

1. Apagar AppServer1:

```bash
sudo shutdown now  # desde AppServer1
```

2. Acceder desde el navegador:

```
http://proxy-sis313.com/
```

3. NGINX redirige a AppServer2 automáticamente (sin intervención del usuario).

---

##  Conclusión

Con esta configuración, se logra implementar un balanceador de carga funcional, tolerante a fallos y con capacidad de escalar horizontalmente. El balanceador distribuye el tráfico entre las aplicaciones y mejora la continuidad del servicio en caso de fallos de un servidor de aplicación.

