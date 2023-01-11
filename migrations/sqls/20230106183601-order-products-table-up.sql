create table order_products (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    order_id int references orders(id) ON DELETE CASCADE NOT NULL ,
    product_id int references products(id)ON DELETE CASCADE NOT NULL ,
    quantity int NOT NULL
);