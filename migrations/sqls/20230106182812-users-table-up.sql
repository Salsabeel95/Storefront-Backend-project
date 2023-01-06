CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    password TEXT NOT NULL,
    firstName VARCHAR(10) NOT NULL UNIQUE,
    lastName VARCHAR(10),
    role ROLES_ENUM default 'user'
);