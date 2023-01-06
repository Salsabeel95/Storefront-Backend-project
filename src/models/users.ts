import client from "../database"
import bcrypt from "bcrypt"
export type User = {
  id: number,
  firstName: string,
  lastName: string,
  password: string,
  role: string
}

export class UserModel {
  static readonly papper: string | undefined = process.env.BCRYPT_PASSWORD
  static readonly saltRounds: number | undefined = parseInt(process.env.SALT_ROUNDS as string)
  static async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users;'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not get User. ${err}`)
    }
  }

  static async showByName(firstName: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE firstName=$1;'
      const result = await conn.query(sql, [firstName])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get User. ${err}`)
    }
  }
  static async create(firstname: string, lastname: string | null, password: string): Promise<User> {
    try {
      const sql = 'INSERT INTO users (firstName,lastName,password) VALUES($1,$2,$3) RETURNING *;'
      const conn = await client.connect()
      const hash = bcrypt.hashSync(
        password + UserModel.papper,
        UserModel.saltRounds as number
      );
      const result = await conn.query(sql, [firstname, lastname, hash])
      const User = result.rows[0]
      conn.release()
      return User
    } catch (err) {
      throw new Error(`Could not add new User ${firstname}. ${err}`)
    }
  }
  static async show(id: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE id=$1;'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get User. ${err}`)
    }
  }
  static async authentiacte(firstname: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE firstName=($1);'
      const conn = await client.connect()
      const result = await conn.query(sql, [firstname])
      const user: User = result.rows[0]
      if (user) {
        if (bcrypt.compareSync(password + UserModel.papper, user.password))
          return user
      }
      conn.release()
      return null
    } catch (err) {
      throw new Error(`${err}`)
    }
  }


  static async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *;'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      const User = result.rows[0]
      conn.release()
      return User
    } catch (err) {
      throw new Error(`Could not delete user with id: ${id}. ${err}`)
    }
  }
}