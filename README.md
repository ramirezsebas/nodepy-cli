# Node JS CLI
https://www.npmjs.com/package/@sebas369/nodepy

Hope you find this CLI useful, leave your issues.

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
- public //Static Files of the API
  - index.html

- src
  - index.js //Entry file
  - api 
    - app //App Module that contains its routers, models, controllers and services. 
      - routes
      - controllers
      - middleware
      - models
      - services
        
  -base //Base folder that has base classes
    - factory.service.js
  
  - shared //Folder that shares files
    - middleware

  - config //Project Configuration
    - server.config.js
    - database.config.js
    - environments.config.js

- .gitignore

- package.json
- .env
```

## Comandos - Commands

```bash
    //To Initialize a new Project in the Current Directory

    nodepy new projectName or nodepy n projectName
```
