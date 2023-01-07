CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    price int NOT NULL,
    name VARCHAR(20) NOT NULL,
    category CATEGORY_ENUM default 'jewelry'
);
