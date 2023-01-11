CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    username VARCHAR,
    role ROLES_ENUM default 'user'
);