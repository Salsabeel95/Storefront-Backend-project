

## API Endpoints
> Tip:You will need to create an admin user first.

#### Users
| Route |HTTP Verbs | Endpoints     | Description                
| :-------- | :------- | :------- | :------------------------- |
| create | [POST]| /user/admin | add new admin. **Body:** *(email: matches email format **Required**,password: minimum lenght 5 **Required**, username: **Optional** )* |
| create | [POST]| /user/add | add new user. **Body:** *(email: matches email format **Required**,password: minimum lenght 5 **Required**, username: **Optional** )* |
| index | [GET]| /user | show all users **[admin token required]**. |
| show | [GET]| /user/{id} | show details for a user by id **[admin token required]**. {id} is **Required**. |
| authentiacte | [POST]| /user/login | authentiacte user or admin. **Body:** *(email: matches email format **Required**,password: minimum lenght 5 **Required**)* |
| delete | [DELETE]| /user/{id} | delete a user by id **[admin token required]**. {id} is **Required**. |

#### Products
| Route |HTTP Verbs | Endpoints     | Description                
| :-------- | :------- | :------- | :------------------------- |
| create | [POST]| /product/add | add new product **[admin token required]**. **Body:** *(name: starting with char **Required**,price: number **Required**, category: **Optional** with defualt 'jewelry' )* |
| index | [GET]| /product | show all products. |
| show | [GET]| /product/{id} | show details for a product by id. {id} is **Required**. |
| show | [GET]| /product/category/{category} | show all products in a specific category. {category} is **Required**. |
| delete | [DELETE]| /product/{id} | delete a product by id **[admin token required]**. {id} is **Required**. |

#### Orders
| Route |HTTP Verbs | Endpoints     | Description                
| :-------- | :------- | :------- | :------------------------- |
| create | [POST]| /order/add | add new order **[token required]**. **Body:** *(userId: **Required**)* **user can have just one *pending* order at a time** |
| index | [GET]| /order | show all orders **[admin token required]**. |
| show | [GET]| /user/{id}/order | show details of current *pending* order for user by his id **[token required]**. {id} is **Required**. |
| show | [GET]| /user/{id}/order-completed | show details of all completed *delivered* orders for user by his id **[token required]**. {id} is **Required**. |
| create | [POST]| /order/{id}/products | add product to an order **[token required]**. {id} is order id **Required**.**Body:** *(productId: **Required**,quantity: **Required**)* |
| show  | [GET]| /order/{id}/products | show order products details to an order **[token required]**. {id} is order id **Required**. |
| update | [PUT]| /order/{id} | make order status *delivered* **[admin token required]**. {id} is order id **Required**. |
| delete | [DELETE]| /order/{id} | delete a order by id **[admin token required]**. {id} is **Required**. |

#### Dashboard
| Route |HTTP Verbs | Endpoints     | Description                
| :-------- | :------- | :------- | :------------------------- |
| show | [GET]| /products/top5| show top 5 best-seller products with its total amount sold **[admin token required]**. |
| show | [GET]| /categories/top3| show top 3 best-seller categories with its rank **[admin token required]**. |
| show | [GET]| /users/top3| show top 3 most-buying users **[admin token required]**. |
| show | [GET]| /statics/orders?days={days}| show no of orders occurred in last days **[admin token required]**.{days} is **Optional** with defualt 0 (today)  |
| show | [GET]| /statics/income?days={days}| show total store income in the last days **[admin token required]**.{days} is **Optional** with defualt 0 (today) |

## Database design
#### product table
-  id (serial primary key)
- name (varchar)
- price (int)
- category (CATEGORY_ENUM) *('mugs', 'decor','jewelry','handbags')*. default: 'jewelry'  

#### user table
- id (serial primary key)
- username (varchar)
- email (varchar) must be unique
- password (varchar) 
- role (ROLES_ENUM) *('user' or 'admin')*. defualt: 'user' 

#### orders table
- id  (serial primary key)
- user_id (int forign key for id in users table)
- status (STATUS_ENUM) *('pending', 'delivered', 'declined')* defualt: 'pending'
- order_date (TIMESTAMPTZ) default: NOW() (current date and time)

#### order_products table
- id  (serial primary key)
- order_id (int forign key for id in orders table)
- product_id (int forign key for id in products table)
- quantity int


