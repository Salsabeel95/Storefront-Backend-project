create table order_products (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    orderId bigint references orders(id) NOT NULL,
    productId bigint references products(id)NOT NULL,
    quantity int NOT NULL
);