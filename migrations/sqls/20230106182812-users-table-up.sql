CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    username VARCHAR(10),
    role ROLES_ENUM default 'user'
);