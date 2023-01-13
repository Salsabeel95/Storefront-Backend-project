# Storefront REST API project
## introduction
Storefront is a Node & Postgres db backend for handmade ecommerce project that's enable users to see handmade products and make orders.

### Project Support Features
* Users can signup and login to their accounts.
* Public (non-authenticated) users can access all products in the store.
* Authenticated users can access all thier orders as well as create a new order, add products to and also cancel what they've ordered.
* Authenticated admin users can access all orders and users as well as create a new product, see some statics, see best-seller items and also delete user, order or products.

## Requirements

For development, you will only need Node.js , a node global package  and installed in your environement. Also download postgres database from *[here](https://www.postgresql.org/download/)*.

## Getting started: 
### 1.Clone this Repository
```
   git clone https://github.com/Salsabeel95/Storefront-Backend-project.git
   cd 'Storefront Backend project'
```
### 2.Install project dependencies

```
  npm install
```
### 3.Project configration
>  Note: Simply No configrations needed to provide. Configration will be used automatically from `src/utilities/config.ts` file, *So make sure to check it first*.

#### Or you can create your own `.env` file in the root directory with variables:
* SERVER_PORT
* POSTGRES_PORT
* POSTGRES_HOST
* POSTGRES_DB
* POSTGRES_DB_TEST
* POSTGRES_USER
* POSTGRES_PASSWORD
* ENV
* CRYPT_PASSWORD
* SALT_ROUNDS
* TOKEN_SECRET 

#### 3.1 Create databases and db user which are mentioned above using:
In the Windows Command Prompt, run the command:
```
psql –U postgres
```
*Enter default user password when prompted.
*Make a database user 
```
create user [user name] with encrypted password '[your password]';
grant all privileges on database [database name] to [user name];
```
> Note: Database defualt port is 5432 but you can change it in `src/utilities/config.ts`. For more details about postgres check [this](https://linuxhint.com/connect-to-postgresql-database-command-line-windows/)

### 4.Setting up database tables and structure with migration in development enviroment

```
  npm run dev:up
```
### 5.Build and watch production 

```
  npm run watch
```
### Or build and start production enviroment

```
  npm start
```
  ##### Server will run on 5200 port, you should see this after starting project in terminal/cmd
```
  server started at localhost:5200
```
### 5.Test project 
This will run db and server tests in `src/tests`
```
  npm test
```
> This command includes building project and setting up database tables and structure with migration for test

## Now you can run the project but if you need you can also:
### Setting up database tables and structure with migration for test enviroment

```
  npm run up
```
### Reset all database settings(tables and structure) with migration in development enviroment

```
  npm run dev:reset
```
### Reset all database settings(tables and structure) with migration for test enviroment

```
  npm run reset
```
### Making a migration with its name iin src/migration folder

```
  npx db-migrate create [migration name] --sql-file
```
## API Endpoints
 API documentation can be found in `REQUIRMENTS.md` file.

> If you prefer postman, here are all routes with HTTP verbs and endpoints in my workspace
 [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/17871201-26dd97ef-9a8b-4af2-b64a-2a65694c89dd?action=collection%2Ffork&collection-url=entityId%3D17871201-26dd97ef-9a8b-4af2-b64a-2a65694c89dd%26entityType%3Dcollection%26workspaceId%3D80ffffcc-149f-4589-a46a-5deb03de20e2)
## Technology stack:
- [typescript](https://www.npmjs.com/package/typescript) : For development.
- [pg](https://www.npmjs.com/package/pg) : PostgreSQL client for Node.js.
- [express](https://www.npmjs.com/package/express) : For creating server.  
- [express-validator](https://www.npmjs.com/package/express-validator): An express.js middleware for validator.
- [jasmine](https://www.npmjs.com/package/jasmine) : For unit testing.  
- [supertest](https://www.npmjs.com/package/supertest) : For unit testing HTTP .  
- [morgan](https://www.npmjs.com/package/morgan) : HTTP request logger middleware for node.js. 
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from .env file.
- [db-migrate](https://www.npmjs.com/package/db-migrate): Database migration framework for node.js.
- [db-migrate-pg](https://www.npmjs.com/package/db-migrate-pg): postgres driver for db-migrate.
- [bycrpt](https://www.npmjs.com/package/bycrpt): For hashing password.
- [jasnwebtoken](https://www.npmjs.com/package/jasnwebtoken): To secure/authenticate HTTP requests.
- [cors](https://www.npmjs.com/package/cors): Node.js CORS middleware.
- [npm](https://www.npmjs.com): For dependencies managment