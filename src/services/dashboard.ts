import client from "../database"
import { Product } from "../models/product"


export class DashboardModel{
    static async staticsNumOrdersInlast7Days(days:number):Promise<{count:number}>{
        try {
            const conn = await client.connect()
            const sql = `select count(id) from orders
            where status='delivered' and 
            order_date< current_date-${days}`
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
          } catch (err) {
            throw new Error(`Could not get orders count. ${err}`)
          }

    }
    static async staticsTotalIncomeInlast7Days(days:number):Promise<{total:number}>{
        try {
            const conn = await client.connect()
            const sql = `select sum(quantity*price) as total
            from orders o join order_products op 
            on o.id =op.order_id
            join products p on op.product_id=p.id
            where status='delivered' and 
            order_date< current_date-${days}`
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
          } catch (err) {
            throw new Error(`Could not get total income. ${err}`)
          }

    }
    static async most3UsersOrders():Promise<{user_id: number,orders_count: number}[]>{
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
    static async popular5Products():Promise<Product[]>{
        try {
            const conn = await client.connect()
            const sql = `with cte as (
                        SELECT product_id,sum(quantity) FROM 
                        order_products group by product_id
                    ) 
                    select * from cte order by sum desc limit 5`
            const result = await conn.query(sql)
            conn.release()
            return result.rows
          } catch (err) {
            throw new Error(`Could not get products. ${err}`)
          }
    }
    static async popular3Category():Promise<{category:string,rank:number}[]>{
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
            where rank<=3`
            const result = await conn.query(sql)
            conn.release()
            return result.rows
          } catch (err) {
            throw new Error(`Could not get categories. ${err}`)
          }
    }
}