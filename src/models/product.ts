import client from "../database"

export type Product = {
  id?: number,
  price: number,
  name: string,
  category?:string
}

export class ProductModel {
  static async index(): Promise<Product[]> {    
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM products;'      
      const result = await conn.query(sql)
      conn.release()      
      return result.rows
    } catch (err) {
      throw new Error(`Could not get Product. ${err}`)
    }
  }
  
  static async create(name: string,category:string,price:string): Promise<Product> {
    try {
      const sql = 'INSERT INTO products (name,category,price) VALUES($1,$2,$3) RETURNING *;'
      const conn = await client.connect()
      const result = await conn.query(sql, [name,category,+price])
      const Product = result.rows[0]
      conn.release()
      return Product
    } catch (err) {
      throw new Error(`Could not add new Product ${name}. ${err}`)
    }
  }
  static async show(id: string): Promise<Product | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM products WHERE id=$1;'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get User. ${err}`)
    }
  }
  static async showByCategory(category: string): Promise<Product[] | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM products WHERE category=$1;'
      const result = await conn.query(sql, [category])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not get User. ${err}`)
    }
  }
  static async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *;'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      const Product = result.rows[0]
      conn.release()
      return Product
    } catch (err) {
      throw new Error(`Could not delete Product ${id}. ${err}`)
    }
  }
}