CREATE TABLE orders(
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    userId bigint references users(id) NOT NULL,
    status STATUS_ENUM default 'pending'
);