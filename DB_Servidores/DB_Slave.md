
#  Configuración del Servidor Esclavo (BDSERVER2)

##  Objetivo

Configurar el servidor `BDSERVER2` como **esclavo**, el cual se conectará al maestro (`BDSERVER1`) y replicará los cambios en la base `tienda` de forma automática.

---
---

## 1. Instalación de MySQL

```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
```

Ejecutar también:

```bash
sudo mysql_secure_installation
```

**Este paso mejora la seguridad del servicio antes de exponerlo.**

---

## 2. Configurar MySQL para actuar como Esclavo

Editar archivo:

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

 Configuración de /etc/hosts

Registrar la IP del maestro para facilitar conexión por nombre (opcional pero recomendado):

```bash
sudo nano /etc/hosts
```
Agregar:
`
192.168.210.103 BDSERVER1
127.0.0.1       localhost
127.0.1.1       BDSERVER2
`

## 3. Importar Base de Datos desde el Maestro

```bash
mysql -u root -p < /home/helen/tienda.sql
```

Esto asegura que el esclavo parte del mismo estado inicial que el maestro.

---

## 4. Configurar Replicación en el Esclavo

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
  MASTER_LOG_FILE='mysql-bin.000007',
  MASTER_LOG_POS=157;
START SLAVE;
```

---

## 5. Verificar que la replicación funcione

```sql
SHOW SLAVE STATUS\G;
```

> Verifica que:
>
> * `Slave_IO_Running: Yes`
> * `Slave_SQL_Running: Yes`

Si aparecen errores de conexión, revisa la contraseña del usuario `replica`, el log file y log position.

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

##  Conclusión

Ambos servidores están correctamente configurados:

* El maestro realiza la escritura.
* El esclavo replica los datos.
* Se han aplicado prácticas de seguridad (usuarios separados, secure installation).
* Tolerancia a fallos fue demostrada con RAID.

Esto garantiza **alta disponibilidad**, **integridad de los datos** y **resiliencia** ante fallos físicos o de red.
