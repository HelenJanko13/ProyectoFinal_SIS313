
# 🧩 Configuración del Servidor Esclavo (BDSERVER2)

## 🎯 Objetivo

Configurar el servidor `BDSERVER2` como esclavo que se conectará al maestro (`BDSERVER1`) y replicará los cambios en la base `tienda`.

---

## 🛠️ Equipamiento

* Ubuntu Server (24.04 LTS)
* IP fija: `192.168.210.104`
* Nombre de host: `BDSERVER2`

---

## 1. Instalación de MySQL

```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
```

---

## 2. Editar archivo de configuración

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Agregar o modificar:

```ini
server-id = 2
relay-log = /var/log/mysql/mysql-relay-bin.log
bind-address = 0.0.0.0
```

Reiniciar MySQL:

```bash
sudo systemctl restart mysql
```

---

## 3. Importar Base de Datos Enviada por el Maestro

```bash
mysql -u root -p < /home/helen/tienda.sql
```

---

## 4. Configurar Replicación

Entrar a MySQL como root:

```bash
sudo mysql -u root -p
```

Dentro de `mysql>`:

```sql
STOP SLAVE;
CHANGE MASTER TO 
  MASTER_HOST='192.168.210.103',
  MASTER_USER='replica',
  MASTER_PASSWORD='Hsis_313',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=1234;
START SLAVE;
```

---

## 5. Verificar que la replicación funciona

```sql
SHOW SLAVE STATUS\G;
```

> Debe decir:

* `Slave_IO_Running: Yes`
* `Slave_SQL_Running: Yes`

---

## 6. Prueba de replicación

Desde el maestro:

```sql
USE tienda;
INSERT INTO productos (nombre, precio) VALUES ('Disco SSD', 450);
```

Desde el esclavo:

```sql
SELECT * FROM productos;
```

> El registro debe aparecer automáticamente.

---

## ✅ Conclusión

Ambos servidores están correctamente configurados. Si el maestro falla, se puede hacer un failover reconfigurando el esclavo para lectura/escritura. La replicación asegura consistencia y alta disponibilidad para el sistema web distribuido.

