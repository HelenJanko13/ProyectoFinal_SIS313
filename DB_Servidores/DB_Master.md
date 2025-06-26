#  Configuración del Servidor Maestro (BDSERVER1)

##  Objetivo

Configurar MySQL como **servidor maestro** para replicación de base de datos, permitiendo que el esclavo reciba automáticamente todos los cambios realizados en la base `tienda`, y simular un entorno con tolerancia a fallos mediante RAID.

---
---

## 1. Instalación de MySQL

```bash
sudo apt update
```

Instalar el servicio
```bash
sudo apt install mysql-server -y
```
Iniciarlo
```bash
sudo systemctl enable mysql
sudo systemctl start mysql
```
---

## 2. Script de Seguridad Inicial

```bash
sudo mysql_secure_installation
```

**¿Qué hace este comando?**

* Elimina usuarios anónimos.
* Desactiva el acceso remoto del usuario `root`.
* Elimina la base de datos de prueba.
* Establece el nivel de complejidad de contraseñas (en este caso: **MEDIUM**).
* Recarga los privilegios.

 Mejora la seguridad básica de MySQL antes de exponerlo en red.

---

## 3. Configuración de MySQL para Replicación

### 3.1. Abrir el puerto 3306 en el firewall

```bash
sudo ufw allow 3306/tcp
sudo ufw reload
```

Este puerto es necesario para que el esclavo pueda conectarse al maestro.

### 3.2. Editar archivo de configuración

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Agregar o modificar:

```ini
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
bind-address = 0.0.0.0
binlog_do_db = tienda
```

**¿Por qué?**

* `server-id = 1`: identifica este servidor como maestro (único).
* `log_bin`: activa los logs binarios necesarios para replicación.
* `bind-address`: permite conexión desde otras IPs.
* `binlog_do_db`: define qué base de datos se replicará.

Reiniciar MySQL:

```bash
sudo systemctl restart mysql
```

---

## 4. Crear Usuarios para Replicación y Aplicación

###  Usuario `replica` (específico para replicación)

**¿Por qué no usar `root`?**

* Por seguridad: el usuario `root` tiene demasiados privilegios.
* Buenas prácticas: se recomienda la separación de roles.

Entrar a MySQL como root:

```bash
sudo mysql -u root -p
```

Crear el usuario `replica`:

```sql
CREATE USER 'replica'@'192.168.210.104' IDENTIFIED WITH mysql_native_password BY 'Hsis_313';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'192.168.210.104';
FLUSH PRIVILEGES;
```

###  Usuario `appuser1` (para uso por las aplicaciones Node.js)

**Motivo**: Las apps `AppServer1` y `AppServer2` necesitan acceder a la base de datos con permisos de lectura/escritura.

```sql
CREATE USER 'appuser1'@'%' IDENTIFIED WITH mysql_native_password BY 'Hsis_313';
GRANT ALL PRIVILEGES ON tienda.* TO 'appuser1'@'%';
FLUSH PRIVILEGES;
```

> Separar el acceso por funciones mejora la seguridad, trazabilidad y administración.

---

## 5. Bloquear y Consultar Estado del Maestro

```sql
FLUSH TABLES WITH READ LOCK;
SHOW MASTER STATUS;
```

 **NO CIERRES ESTA TERMINAL AÚN**

Guarda los valores `File` y `Position`, por ejemplo:

* File: `mysql-bin.000001`
* Position: `1234`

---

## 6. Crear y Exportar Base de Datos

```bash
mysqldump -u root -p --databases tienda > tienda.sql
scp tienda.sql helen@192.168.210.104:/home/helen/
```

Esto transfiere el estado inicial de la base al esclavo.

---

## 7. Simulación de Tolerancia a Fallos con RAID 1

### 7.1. Crear RAID 1

```bash
sudo mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
```

### 7.2. Formatear y montar

```bash
sudo mkfs.ext4 -F /dev/md0
sudo mkdir -p /mnt/raid1
sudo mount /dev/md0 /mnt/raid1
```

### 7.3. Configurar fstab para montaje automático

```bash
sudo blkid /dev/md0
sudo nano /etc/fstab
```

Agregar línea:

```ini
UUID=xxx-xxx /mnt/raid1 ext4 defaults,nofail 0 0
```

---

##  Buenas Prácticas Aplicadas

###  Separación de usuarios

| Usuario    | Uso                            | Permisos mínimos necesarios |
| ---------- | ------------------------------ | --------------------------- |
| `replica`  | Replicación (esclavo)          | REPLICATION SLAVE           |
| `appuser1` | Acceso desde AppServer1 y App2 | ALL ON tienda.\*            |

**Ventajas:**

* Seguridad por roles.
* Mejor monitoreo y auditoría.
* Evita accesos no deseados o accidentes de código.

---
SE SIGUE NE LA BASE DE DATOS 2



