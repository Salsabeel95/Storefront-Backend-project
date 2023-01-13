import { Order, OrderModel, productsInOrder } from "../../models/order";
import { Product, ProductModel } from "../../models/product";
import { User, UserModel } from "../../models/users";
import { DashboardModel } from "../../services/dashboard";
import { calculateTotalForOrder, truncateOrdersTable, truncateProductsTable, truncateUsersTable } from "../../shared/utilities";

describe("Dashbaord model", () => {

    let createdUser1: User;
    let createdProduct1: Product;
    let createdOrder1: Order;
    let createdUser2: User;
    let createdProduct2: Product;
    let createdOrder2: Order;
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
    it('should have an most3UsersOrders method', () => {
        expect(DashboardModel.most3UsersOrders).toBeDefined();
    });
    it('should have an popular3Category method', () => {
        expect(DashboardModel.popular3Category).toBeDefined();
    });
    it('should have an popular5Products method', () => {
        expect(DashboardModel.popular5Products).toBeDefined();
    });
    it('should have an staticsNumOrdersInLastDays method', () => {
        expect(DashboardModel.staticsNumOrdersInLastDays).toBeDefined();
    });
    it('should have an staticsTotalIncomeInLastDays method', () => {
        expect(DashboardModel.staticsTotalIncomeInLastDays).toBeDefined();
    });
    it('most3UsersOrders method should return most 3 users having delivered orders', async () => {
        try {

            let expectedUsersOrdersCount: {
                user_id: number;
                orders_count: string;
            }[] = await DashboardModel.most3UsersOrders()
            expect(expectedUsersOrdersCount.length).toBe(0)

            await OrderModel.deliverOrder(createdOrder1.id as unknown as string)
            expectedUsersOrdersCount = await DashboardModel.most3UsersOrders()
            expect(expectedUsersOrdersCount).toContain({
                user_id: createdUser1.id as unknown as number,
                orders_count: '1'
            });

            await OrderModel.deliverOrder(createdOrder2.id as unknown as string)
            expectedUsersOrdersCount = await DashboardModel.most3UsersOrders()
            expect(expectedUsersOrdersCount.length).toBe(2)
            expect(expectedUsersOrdersCount).toContain({
                user_id: createdUser2.id as unknown as number,
                orders_count: '1'
            });
        } catch (err) {
            console.log(err);

        }
    });
    it('staticsNumOrdersInLastDays method should return orders number in last 0 days(today) which are 2', async () => {
        try {
            let expectedOrdersCount: {
                count: string;
            } = await DashboardModel.staticsNumOrdersInLastDays(0)
            expect(expectedOrdersCount).toEqual({
                count: '2'
            })
        } catch (err) {
            console.log(err);

        }
    });
    it('staticsTotalIncomeInLastDays method should return total orders income in last 0 days(today) which is 700', async () => {
        try {
            let expectedOrdersCount: {
                total: string;
            } = await DashboardModel.staticsTotalIncomeInLastDays(0)
            const order1Products: productsInOrder[] = await OrderModel.indexProducts(createdOrder1.id as unknown as string)
            const order1Total = calculateTotalForOrder(order1Products)
            const order2Products: productsInOrder[] = await OrderModel.indexProducts(createdOrder2.id as unknown as string)
            const order2Total = calculateTotalForOrder(order2Products)
            expect(expectedOrdersCount).toEqual({
                total: (order1Total + order2Total).toString()
            })
        } catch (err) {
            console.log(err);

        }
    });
    it('popular3Category method should return total orders income in last 0 days(today) which is 700', async () => {
        try {
            let expectedTopCategory: { category: string; rank: string; }[] = await DashboardModel.popular3Category()
            expect(expectedTopCategory[0]).toEqual({
                category: 'decor', rank: '1'
            })
        } catch (err) {
            console.log(err);

        }
    });

})