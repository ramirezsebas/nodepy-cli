# Node JS CLI

CLI that generates the structure of a Node JS project with Express(Boilerplate code).

Initialize a Git Repository for your Project.

Creates the conexion to your Database

Soports Relational Database with the ORM Sequelize:

- Postgres
- Mysql
- Sql Server
- MariaDB
- Sqlite

Soports Non Relational Database with the ORM Mongoose

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

    - app

      - config

        - middlewares
          - app.middleware.js

        - routes
          - app.route.js

      - controllers
        - app.controller.js

      - models
        - app.model.js

      - services  
        - app.service.js

  - config
    - database.js
    - environment.js
    - server.js
  
  - main.js

- .gitignore
- package.json
- .env
```

## Comandos - Commands

```bash
    //Para Inicializar un Proyecto Nuevo en el Directorio Actual.
    //To Initialize a new Project in the Current Directory

    nodepy new projectName or nodepy n projectName
```
