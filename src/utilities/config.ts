import dotenv from "dotenv"
dotenv.config();

const config = {
    POSTGRES_HOST: process.env.POSTGRES_HOST || "127.0.0.1",
    POSTGRES_DB: process.env.POSTGRES_DB || "storedb",
    POSTGRES_DB_TEST: process.env.POSTGRES_DB_TEST || "storedb_test",
    POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "postgres",
    ENV: process.env.ENV || "dev",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "ItS-a-ToP-sEcReT",
    BCRYPT_PASSWORD:process.env.BCRYPT_PASSWORD || "This - is - a - complex - password - paper",
    SALT_ROUNDS:process.env.SALT_ROUNDS || "10"
}

export default config