# Node JS CLI

CLI that generates the structure of a Node JS project with Express.

Initializes a Git Repository for your Project.

Soports Relational Database with the ORM Sequelize:

- Postgres
- Mysql
- Sql Server
- MariaDB
- Sqlite

Soports Non Relational Database with the ORM Mongoose

- MongoDB

---

Un CLI que permite al desarollador generar una estructura base de un proyecto en Node JS con express.

Soporta Base de Datos Relacionales con el ORM Sequelize:

- Postgres
- Mysql
- Sql Server
- MariaDB
- Sqlite

Soporta Base de Datos No Relacionales con el ORM Mongose:

- MongoDB

## Instalacion - Instalation

```bash
//Instalar de Manera Global
//Install Package Globally
npm i -g @sebas369/nodepy

```

## Estructura de un Proyecto - Project Structure

```bash
- public
  - index.html
- src

  - api

    - routes

      - index.routes.js

    -controllers

  - models
  - services
    - factory.service.js

- .gitignore
- index.js
- package.json
- .env
```

## Comandos - Commands

```bash
    //Para Inicializar un Proyecto Nuevo en el Directorio Actual.
    //To Initialize a new Project in the Current Directory

    nodepy new nombre_del_proyecto
```
