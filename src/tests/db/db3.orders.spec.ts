import { Order, OrderModel, OrderProducts } from "../../models/order";
import { Product, ProductModel } from "../../models/product";
import { User, UserModel } from "../../models/users";
import {  truncateOrdersTable, truncateProductsTable, truncateUsersTable } from "../../utilities/utilities";

let createdUser1: User;
let createdProduct1: Product;
let newOrder: Order;
let createdOrder1: Order;
let mockProductToOrder: OrderProducts
let expectedOrderProducts: OrderProducts
describe("Order model", () => {
  beforeAll(async () => {
    await truncateOrdersTable()

  })
  it('should have an index method', () => {
    expect(OrderModel.index).toBeDefined();
  });
  it('should have an create method', () => {
    expect(OrderModel.create).toBeDefined();
  });
  it('should have an show method', () => {
    expect(OrderModel.show).toBeDefined();
  });
  it('should have an delete method', () => {
    expect(OrderModel.delete).toBeDefined();
  });
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

        newOrder = {
          user_id: (createdUser1.id) as number,
        }
        createdOrder1 = {
          id: 1, ...newOrder, status: "pending"
        }
    } catch (error) {
        throw error

    }
})
  
  it('create method should add  order successfully', async () => {
    const result: Order = await OrderModel.create(newOrder.user_id as unknown as string) as Order
    expect(createdOrder1.user_id).toBe(result.user_id)
    expect(createdOrder1.status).toBe(result.status)
    expect(createdOrder1.id).toBe(result.id)
    createdOrder1 = result    
  })
  it('show method should return the just-created order', async () => {
    const result: Order = await OrderModel.show(createdOrder1.id as unknown as string) as Order
    expect(result).toEqual(createdOrder1)
  })
  it('index method should return a list of orders of length 1', async () => {
    const result: Order[] = await OrderModel.index() as Order[]
    expect(result.length).toBe(1)
  })
  it('addPrduct method should add justed-created product to the just-created order successfully', async () => {
    const result: {
      id: number;
      order_id: number;
      product_id: number;
      quantity: number;
    } = await OrderModel.addProduct(createdOrder1.id as unknown as string, createdProduct1.id as unknown as string, 2)
    expectedOrderProducts = {
      id: 1,
      order_id: createdOrder1.id as number,
      product_id: createdProduct1.id as number,
      quantity: 2
    }
    expect(result).toEqual(expectedOrderProducts)
  })
  it('deliverOrder method should deliver justed-created order of the just-created user successfully', async () => {
    createdOrder1 = await OrderModel.deliverOrder(createdOrder1.id as unknown as string)
    expect(createdOrder1.status).toBe("delivered")
    const isUserOrderPending: boolean = await OrderModel.checkIfUserHasPendingOrder(createdUser1.id as unknown as string)
    expect(isUserOrderPending).toBeFalse()
    const deliveredUserOrders = await OrderModel.showUserCompletedOrders(createdUser1.id as unknown as string)
    expect(deliveredUserOrders.length).toBe(1)
  })
  it('delete method should remove the just-created order', async () => {
    await OrderModel.delete(createdOrder1.id as unknown as string);
    const result: Order[] = await OrderModel.index() as unknown as Order[]
    expect(result).toEqual([]);
  });
})
