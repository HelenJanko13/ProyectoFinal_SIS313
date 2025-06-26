# Proyecto Final – Infraestructura de TI Tolerante a Fallos (SIS313)

Este repositorio contiene la documentación completa y el código fuente del proyecto final de la materia **SIS313**, cuyo objetivo es implementar una infraestructura de TI robusta, escalable y tolerante a fallos.

---

## Contenido del Proyecto

| Módulo                        | Descripción                                                                                     |
|------------------------------|-------------------------------------------------------------------------------------------------|
|  [Balanceador (Proxy)](./Proxy_Balanceador.md)        | Configuración de NGINX como balanceador de carga entre AppServer1 y AppServer2.             |
|  [Base de Datos Maestro](./DB_Master.md)             | Configuración de replicación MySQL, usuarios, hardening y RAID 1 en `BDSERVER1`.            |
|  [Base de Datos Esclavo](./DB_Slave.md)             | Configuración de MySQL como esclavo replicado desde `BDSERVER1`.                            |
|  [AppServer 1](./AppServer1.md)                      | Despliegue de una aplicación Node.js CRUD en `APPSERVER1` conectada a la base de datos.     |
|  [AppServer 2](./AppServer2.md)                      | Despliegue idéntico al AppServer1 en `APPSERVER2` para alta disponibilidad.                 |

---

## Tecnologías Utilizadas

- **Ubuntu Server 24.04**
- **Node.js v22.16.0**
- **MySQL Server**
- **NGINX**
- **UFW, RAID, SSH**
- **NVM, Express.js, MySQL2**

---

---

## Seguridad Aplicada

- Uso de `mysql_secure_installation`
- Separación de usuarios para acceso (`appuser1`) y replicación (`replica`)
- Cambios de puertos en SSH
- Restricción de servicios con `UFW`
- Tolerancia a fallos con RAID 1

---

---

##  Autores

- Janko Sanga Helen
- Condori Romero Said


---


