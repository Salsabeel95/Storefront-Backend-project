import client from "../database"

export type Order = {
  id?: number,
  user_id: number,
  status?: string,
  order_date?: Date,
  total?:number,
}
export type OrderProducts={
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}
export type productsInOrder={
  id?: number;
  price: number;
  name: string;
  category: string;
  quantity: number;
}
export class OrderModel {
  static async index(): Promise<Order[]> {    
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders;'      
      const result = await conn.query(sql)
      conn.release()      
      return result.rows
    } catch (err) {
      throw new Error(`Could not get Order.  ${err}`)
    }
  }
  static async show(orderId:string): Promise<Order> {    
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE id=$1;'      
      const result = await conn.query(sql,[+orderId])
      conn.release()      
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get Order.  ${err}`)
    }
  }
  
  static async create(userId: string): Promise<Order> {
    try {
        const sql = 'INSERT INTO orders (user_id) VALUES($1) RETURNING *;'
        const conn = await client.connect()
        const result = await conn.query(sql, [+userId])
        const Order:Order = result.rows[0]
        conn.release()
        return Order
      } catch (err) {
      throw new Error(`Could not add new Order with user ${userId}. ${err}`)
    }
  }
   static async checkIfProdInOrder(ordId: string,prodId: string):Promise<boolean>{
    try {
      const sql = 'SELECT * FROM order_products WHERE order_id=$1 AND product_id=$2;'
      const conn = await client.connect()
      const result = await conn.query(sql, [+ordId,+prodId])
      const ordPrd = result.rows
      conn.release()
      return ordPrd.length ? true :false
    } catch (error) {
      throw new Error(`Could not get order products for order ${ordId} and prodId ${prodId}.  ${error}`)
    }
  }
   static async deliverOrder(ordId: string):Promise<Order>{
    try {
      const sql = "UPDATE orders SET status='delivered' WHERE id=$1 RETURNING *"
      const conn = await client.connect()
      const result = await conn.query(sql, [+ordId])
      const deliveredOrd = result.rows[0]
      conn.release()
      return deliveredOrd
    } catch (error) {
      throw new Error(`Could not deliver order : ${ordId}. ${error}`)
    }
  }
 static async checkIfUserHasPendingOrder(usrId: string):Promise<boolean>{
    try {
      const sql = "SELECT * FROM orders WHERE user_id=$1 AND status='pending';"
      const conn = await client.connect()
      const result = await conn.query(sql, [+usrId])
      const ord = result.rows
      conn.release()
      return ord.length ? true :false
    } catch (error) {
      throw new Error(`Could not get pending Order with user ${usrId}. ${error}`)
    }
  }
  static async addProduct(ordId: string,prodId: string,quantity:number): Promise<OrderProducts> {
    try {
      const sqlInsert = 'INSERT INTO order_products (order_id,product_id,quantity) VALUES($1,$2,$3) RETURNING *;'
      const sqlUpdate = 'UPDATE order_products SET quantity=quantity+$3 WHERE order_id=$1 AND product_id=$2 RETURNING *;'
      const sql =( await this.checkIfProdInOrder(ordId,prodId) )? sqlUpdate: sqlInsert
      const conn = await client.connect()
      const result = await conn.query(sql, [+ordId,+prodId,quantity])
      const ordPrd:{
        id: number;
        order_id: number;
        product_id: number;
        quantity: number;
      } = result.rows[0]
      conn.release()
      return ordPrd
    } catch (error) {
      throw new Error(`Could not add new Order with user ${ordId} and prodId ${prodId}. ${error}`)
    }
  }
  static async indexProducts(ordId: string): Promise<productsInOrder[]> {
    try {
      const sql = 'Select p.*,o.quantity from products as p inner join order_products o on p.id = o.product_id where o.order_id=$1;'
      const conn = await client.connect()
      const result = await conn.query(sql, [ordId])
      const products:productsInOrder[] = result.rows
      conn.release()
      return products
    } catch (error) {
      throw new Error(`Could get Order ${ordId} . ${error}`)
    }
  }
  static async showUserCurrentOrder(userId: string): Promise<Order>{
    try {
      const sql = "select o.id, o.status,o.order_date,o.user_id from orders o where o.status = 'pending' and user_id=$1 order by order_date desc"
      const conn = await client.connect()
      const result = await conn.query(sql, [+userId])
      const order:Order = result.rows[0]
      conn.release()
      return order
    } catch (error) {
      throw new Error(`Could get Order by user id: ${userId} . ${error}`)
    }
  }
  static async showUserCompletedOrders(userId: string): Promise<Order[]>{
    try {
      const sql = "select o.id, o.status,o.order_date,o.user_id from orders o where o.status = 'delivered' and user_id=$1 order by order_date desc"
      const conn = await client.connect()
      const result = await conn.query(sql, [+userId])
      const order = result.rows
      conn.release()
      return order
    } catch (error) {
      throw new Error(`Could get Order by user id: ${userId} . ${error}`)
    }
  }
  static async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM Orders WHERE id=($1) RETURNING *;'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      const Order = result.rows[0]
      conn.release()
      return Order
    } catch (err) {
      throw new Error(`Could not delete Order ${id}. ${err}`)
    }
  }
}