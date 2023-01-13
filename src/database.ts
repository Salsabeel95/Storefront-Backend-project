import { Pool } from "pg";
import config from "./shared/config";

const { 
  POSTGRES_HOST,
  POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV,
} = config

let client: Pool = new Pool();

if (ENV?.trim() == 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: +POSTGRES_PORT
  });
}

if (ENV?.trim() == 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD
    });
  }
  
  export default client;