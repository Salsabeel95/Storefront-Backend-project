import supertest from 'supertest'
import app from '../..'
import { OrderModel, Order, productsInOrder } from '../../models/order'
import { Product, ProductModel } from '../../models/product'
import { User, UserModel } from '../../models/users'
import config from '../../shared/config'
import { calculateTotalForOrder, tokenPayload, truncateOrdersTable, truncateProductsTable, truncateUsersTable } from '../../shared/utilities'
import jwt, { Secret } from "jsonwebtoken"
const request = supertest(app)

describe("Routes tests", () => {

    let createdUser1: User;
    let createdAdmin1: User;
    let createdProduct1: Product;
    let createdOrder1: Order;
    let createdUser2: User;
    let createdProduct2: Product;
    let createdOrder2: Order;
    let token: string;
    let adminToken: string;
    beforeAll(async () => {
        try {
            await truncateOrdersTable()
            await truncateProductsTable()
            await truncateUsersTable()
        } catch (error) {
            throw error
        }
    })
    beforeAll(async () => {
        try {
            createdUser1 = await UserModel.create("test1@test.com", null, "123456")
            createdProduct1 = await ProductModel.create("test test product", "decor", "200")

            createdUser2 = await UserModel.create("test2@test.com", null, "123456")
            createdProduct2 = await ProductModel.create("test test product2", "mugs", "100")

        } catch (error) {
            throw error

        }
    })
    beforeAll(async () => {
        try {
            createdOrder1 = await OrderModel.create(createdUser1.id as unknown as string) as Order
            await OrderModel.addProduct(createdOrder1.id as unknown as string, createdProduct1.id as unknown as string, 1)
            createdOrder2 = await OrderModel.create(createdUser2.id as unknown as string) as Order
            await OrderModel.addProduct(createdOrder2.id as unknown as string, createdProduct1.id as unknown as string, 2)
            await OrderModel.addProduct(createdOrder2.id as unknown as string, createdProduct2.id as unknown as string, 1)

        } catch (error) {
            throw error

        }
    })
    beforeAll(async () => {
        try {
            createdAdmin1 = await UserModel.createAdmin("admin1@test.com", null, "123456")
            const response = await request.post("/user/login").send({
                email: createdAdmin1.email,
                password: "123456"
            })
            adminToken = 'Bearer ' + response.body.data.token
        } catch (error) {
            throw error
        }
    })
    it("Main routes test", async () => {
        const response = await request.get("/")
        expect(response.status).toBe(200)
        expect(response.text).toContain("root route")
    })

    it("Authontication route test", async () => {
        const response = await request.post("/user/login").send({
            email: createdUser1.email,
            password: "123456"
        })
        expect(response.status).toBe(200)
        expect(response.body.data.token).not.toBeFalsy()
        expect(response.body.message).toContain("user login")
        const decoded: tokenPayload = jwt.verify(response.body.data.token as string, config.TOKEN_SECRET as Secret) as tokenPayload
        expect(decoded.user.email).toEqual(createdUser1.email)
        token = 'Bearer ' + response.body.data.token
    })
    describe("Access denied tests", () => {
        it("expect request DELETE /user/:id routes to fail without logged admin", async () => {
            const response = await request.delete("/user/" + createdUser1.id)
            expect(response.status).toBe(401)
        })
        it("expect request POST /product/add routes to fail without logged admin", async () => {
            const response = await request.post("/product/add").send({
                name: "prod 1",
                price: 50
            })
            expect(response.status).toBe(401)
        })
        it("expect request PUT /order/:id routes to fail without logged admin", async () => {
            const response = await request.put("/order/" + createdOrder1.id).send({
                userId: createdUser1.id
            })
            expect(response.status).toBe(401)
        })
        it("expect request GET /products/top5 routes to fail without logged admin", async () => {
            const response = await request.get("/products/top5")
            expect(response.status).toBe(401)
        })
        it("expect request GET /statics/income routes to fail without logged admin", async () => {
            const response = await request.get("/statics/income")
            expect(response.status).toBe(401)
        })
        it("expect request POST /order/add routes to fail without logged user", async () => {
            const response = await request.post("/order/add").send({
                userId: createdUser1.id
            })
            expect(response.status).toBe(401)
        })
        it("expect request GET /user/:id/order-completed routes to fail without logged user", async () => {
            const response = await request.get("/user/" + createdUser1.id + "/order-completed")
            expect(response.status).toBe(401)
        })
        it("expect request GET /user/:id/order routes to fail without logged user", async () => {
            const response = await request.get("/user/" + createdUser1.id + "/order")
            expect(response.status).toBe(401)
        })
        it("expect request POST /order/:id/products routes to fail without logged user", async () => {
            const response = await request.post("/order/" + createdOrder1.id + "/products").send({
                productId: createdProduct1.id, quantity: 1
            })
            expect(response.status).toBe(401)
        })
    })
    describe("Creation validations routes tests", () => {
        it("Create user route with pre-used email failed", async () => {
            const response = await request.post("/user/signup").send({
                email: createdUser1.email,
                password: "123456"
            })
            expect(response.status).toBe(409)
            expect(response.text).toContain("already used")
        })
        it("Create user route with wrong email format failed", async () => {
            const response = await request.post("/user/signup").send({
                email: "test@test",
                password: "123456"
            })
            expect(response.status).toBe(400)
            expect(response.text).toContain("must match email format")
        })
        it("Create product route without name failed", async () => {
            const response = await request.post("/product/add").set({ Authorization: adminToken }).send({
                price: 20
            })
            expect(response.status).toBe(400)
            expect(response.text).toContain("provide a product name")
        })
        it("Create order route without user id failed", async () => {
            const response = await request.post("/order/add").set({ Authorization: token })
            expect(response.status).toBe(400)
            expect(response.text).toContain("provide a user id")
        })
    })
    describe("User routes tests", () => {
        it("User route GET /user should return a list of users of length 3", async () => {
            const response = await request.get("/user").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(3)
        })
        it("User route GET /user/1 should return the user details with id=1", async () => {
            const response = await request.get("/user/" + createdUser1.id).set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.id).toBe(createdUser1.id)
        })
    })
    describe("Product routes tests", () => {
        it("Product route GET /product should return a list of products of length 3", async () => {
            const response = await request.get("/product").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(2)
        })
        it("Product route GET /product/2 should return the product details with id=2", async () => {
            const response = await request.get("/product/" + createdProduct2.id).set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.id).toBe(createdProduct2.id)
        })
        it("Product route GET /product/category/decor should return a list of products that're in category=decor ", async () => {
            const response = await request.get("/product/category/" + createdProduct1.category).set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(1)
            expect(response.body.data[0].category).toBe(createdProduct1.category)
        })
    })
    describe("Order routes tests", () => {
        it("Order route GET /order should return a list of orders of length 3", async () => {
            const response = await request.get("/order").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(2)
        })
        it("Order route GET /order/2/products should return a list of products in order id=2", async () => {
            const response = await request.get("/order/" + createdOrder2.id + "/products").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.products.length).toBe(2)
        })
        it("Order route GET /user/1/order should return the user current order", async () => {
            const response = await request.get("/user/" + createdUser1.id + "/order").set({ Authorization: token })
            expect(response.status).toBe(200)
            expect(response.body.data.id).toBe(createdOrder1.id)
        })
        it("Order route GET /user/1/order-completed should return the user current order", async () => {
            let response = await request.get("/user/" + createdUser1.id + "/order-completed").set({ Authorization: adminToken })
            expect(response.status).toBe(404)
            expect(response.text).toContain("There are no completed orders")
            expect(response.body.data.length).toBe(0)

            const deliveredRes = await request.put("/order/" + createdOrder1.id).set({ Authorization: adminToken })
            createdOrder1 = deliveredRes.body.data

            response = await request.get("/user/" + createdUser1.id + "/order-completed").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(1)
            expect(response.body.data[0].id).toBe(createdOrder1.id)
            expect(response.body.data[0].status).toBe(createdOrder1.status)
        })
    })
    describe("Dashboard routes tests", () => {
        it("Dashboard route GET /products/top5 should return the best-seller products of length 2", async () => {
            const response = await request.get("/products/top5").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(2)
            expect(response.body.data[0].product_id).toBe(createdProduct1.id)
        })
        it("Dashboard route GET /categories/top3 should return the best-seller category", async () => {
            const response = await request.get("/categories/top3").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(2)
            expect(response.body.data[0].category).toBe(createdProduct1.category)
        })
        it("Dashboard route GET /statics/orders/ should return the number of orders in last (0) days (today)", async () => {
            const response = await request.get("/statics/orders/").set({ Authorization: adminToken })
            expect(response.status).toBe(200)
            expect(response.body.data.count).toBe('1')
        })
        it("Dashboard route GET /statics/income should return the number of total income in last (0) days (today)", async () => {
            const response = await request.get("/statics/income").set({ Authorization: adminToken })
            expect(response.status).toBe(200)

            const order1Products: productsInOrder[] = await OrderModel.indexProducts(createdOrder1.id as unknown as string)
            const order1Total = calculateTotalForOrder(order1Products)

            expect(response.body.data.total).toBe(order1Total.toString())
        })
    })
})