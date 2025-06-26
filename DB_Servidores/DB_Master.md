# 🧩 Configuración del Servidor Maestro (BDSERVER1)

## 🎯 Objetivo

Configurar MySQL como servidor maestro para replicación de base de datos, permitiendo que el esclavo reciba automáticamente todos los cambios realizados en la base `tienda`.

---

## 🛠️ Equipamiento

* Ubuntu Server (24.04 LTS)
* IP fija: `192.168.210.103`
* Nombre de host: `BDSERVER1`

---

## 1. Instalación de MySQL

```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
```

---

## 2. Configuración de MySQL para Replicación

### 2.1. Abrir el puerto 3306 en el firewall

```bash
sudo ufw allow 3306/tcp
sudo ufw reload
```

### 2.2. Editar archivo de configuración

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

> `server-id` debe ser único por servidor. El maestro es 1.
> `log_bin` habilita los logs binarios para replicación.
> `binlog_do_db` indica la base que se replicará.

Reiniciar MySQL:

```bash
sudo systemctl restart mysql
```

---

## 3. Crear Usuario de Replicación

Entrar a MySQL como root:

```bash
sudo mysql -u root -p
```

Dentro de la consola `mysql>`:

```sql
CREATE USER 'replica'@'192.168.210.104' IDENTIFIED WITH mysql_native_password BY 'Hsis_313';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'192.168.210.104';
FLUSH PRIVILEGES;
```

---

## 4. Ver Estado del Maestro

```sql
FLUSH TABLES WITH READ LOCK;
SHOW MASTER STATUS;
```

✅ **NO CIERRES ESTA TERMINAL AÚN**
Guarda los valores `File` y `Position`, por ejemplo:

* File: `mysql-bin.000001`
* Position: `1234`

---

## 5. Crear y Exportar Base de Datos

Desde otra terminal:

```bash
mysqldump -u root -p --databases tienda > tienda.sql
scp tienda.sql helen@192.168.210.104:/home/helen/
```

---

## 6. RAID 1 (Simulación de tolerancia a fallos en disco)

### 6.1. Crear RAID 1

```bash
sudo mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
```

### 6.2. Formatear y montar

```bash
sudo mkfs.ext4 -F /dev/md0
sudo mkdir -p /mnt/raid1
sudo mount /dev/md0 /mnt/raid1
```

### 6.3. Configurar fstab para montaje automático

```bash
sudo blkid /dev/md0
# Copiar el UUID
sudo nano /etc/fstab
```

Agregar línea:

```ini
UUID=xxx-xxx /mnt/raid1 ext4 defaults,nofail 0 0
```

---



