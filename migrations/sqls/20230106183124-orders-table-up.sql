CREATE TABLE orders(
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    user_id int references users(id) NOT NULL,
    status STATUS_ENUM default 'pending',
    order_date TIMESTAMPTZ default NOW()
);