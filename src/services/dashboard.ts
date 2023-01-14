import client from "../database"
import { Product } from "../models/product"


export class DashboardModel{
    static async staticsNumOrdersInLastDays(days:number):Promise<{count:string}>{
        try {
            const conn = await client.connect()
            const sql = `select getOrderCountInLastDays($1) as count`
            const result = await conn.query(sql,[days])
            conn.release()
            return result.rows[0]
          } catch (err) {
            throw new Error(`Could not get orders count. ${err}`)
          }

    }
    static async staticsTotalIncomeInLastDays(days:number):Promise<{total:string}>{
        try {
            const conn = await client.connect()
            const sql = `select getTotalIncomeInLastDays($1) as total`
            const result = await conn.query(sql,[days])
            conn.release()
            return result.rows[0]
          } catch (err) {
            throw new Error(`Could not get total income. ${err}`)
          }
    }
    static async most3UsersOrders():Promise<{user_id: number,orders_count: string}[]>{
        try {
            const conn = await client.connect()
            const sql = `with cte as  
                ( 
                    select user_id,count(id) from orders
                    where status='delivered'
                    group by user_id
                ) 
            select user_id,count as orders_count from cte order by count desc limit 3 `
            const result = await conn.query(sql)
            conn.release()
            return result.rows
          } catch (err) {
            throw new Error(`Could not get users. ${err}`)
          }
    }
    static async popular5Products():Promise<{product_id:string,count:string}[]>{
        try {
            const conn = await client.connect()
            const sql = `with cte as (
                        SELECT product_id,sum(quantity) as count FROM 
                        order_products group by product_id
                    ) 
                    select * from cte order by count desc limit 5`
            const result = await conn.query(sql)
            conn.release()
            return result.rows
          } catch (err) {
            throw new Error(`Could not get products. ${err}`)
          }
    }
    static async popular3Category():Promise<{category:string,rank:string}[]>{
        try {
            const conn = await client.connect()
            const sql = `with cte as 
            (
                select *, sum(op.quantity) over(partition by p.category) 
                from order_products op join products p
                on op.product_id=p.id
            )   

            select * from 
            (
                select distinct category ,dense_rank() over ( order by sum desc) as rank 
                from cte
            ) as t
            where rank<=3 order by rank `
            const result = await conn.query(sql)
            conn.release()
            return result.rows
          } catch (err) {
            throw new Error(`Could not get categories. ${err}`)
          }
    }
}