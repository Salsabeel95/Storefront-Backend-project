import client from "../database"
import bcrypt from "bcrypt"
import config from "../utilities/config"

export type User = {
  id?: number,
  email: string,
  username: string,
  password: string,
  role?: string
}

export class UserModel {
  static readonly papper: string | undefined = config.BCRYPT_PASSWORD
  static readonly saltRounds: number | undefined = parseInt(config.SALT_ROUNDS as string)
  static async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users;'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not get user. ${err}`)
    }
  }

  static async showByEmail(email: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE email=$1;'
      const result = await conn.query(sql, [email])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get user. ${err}`)
    }
  }
  static async create(email: string, username: string | null, password: string): Promise<User> {
    try {
      const sql = 'INSERT INTO users (email,username,password) VALUES($1,$2,$3) RETURNING *;'
      const conn = await client.connect()
      const hash = bcrypt.hashSync(
        password + UserModel.papper,
        UserModel.saltRounds as number
      );
      const result = await conn.query(sql, [email, username, hash])
      const User = result.rows[0]
      conn.release()
      return User
    } catch (err) {
      throw new Error(`Could not add new user ${email}. ${err}`)
    }
  }
  static async createAdmin(email: string, username: string | null, password: string): Promise<User> {
    try {
      const sql = "INSERT INTO users (email,username,password,role) VALUES($1,$2,$3,'admin') RETURNING *;"
      const conn = await client.connect()
      const hash = bcrypt.hashSync(
        password + UserModel.papper,
        UserModel.saltRounds as number
      );
      const result = await conn.query(sql, [email, username, hash])
      const User = result.rows[0]
      conn.release()
      return User
    } catch (err) {
      throw new Error(`Could not add new admin ${email}. ${err}`)
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
      throw new Error(`Could not get user. ${err}`)
    }
  }
  static async authentiacte(email: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE email=($1);'
      const conn = await client.connect()
      const result = await conn.query(sql, [email])
      const user: User = result.rows[0]
      if (user) {
        if (bcrypt.compareSync(password + UserModel.papper, user.password))
          return user
      }
      conn.release()
      return null
    } catch (err) {
      throw new Error(`Could not login user. ${err}`)
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