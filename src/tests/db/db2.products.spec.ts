import { Product, ProductModel } from "../../models/product";

describe("Product model", () => {
    it('should have an index method', () => {
      expect(ProductModel.index).toBeDefined();
    });
    it('should have an create method', () => {
      expect(ProductModel.create).toBeDefined();
    });
    it('should have an show method', () => {
      expect(ProductModel.show).toBeDefined();
    });
    it('should have an delete method', () => {
      expect(ProductModel.delete).toBeDefined();
    });
    const newProduct:Product={
      name:"test product",
      price:100,
      category:"mugs"
    }
    let createdProduct: Product={
      id:1,
      ...newProduct
    };
    it('create method should add a product successfully', async () => {
      const {name,price,category}=newProduct
      const result :Product= await ProductModel.create(name,category as string,price as unknown as string) as Product
      expect(createdProduct).toEqual(result)
      createdProduct= result
    })
    it('show method should return the just-created product', async () => {
      const result :Product= await ProductModel.show(createdProduct.id as unknown as string) as Product
      expect(result).toEqual(createdProduct)
    })    
    it('index method should return a list of products of length 1', async () => {
      const result:Product[] = await ProductModel.index()as Product[]
      expect(result.length).toBe(1)
      expect(result[0].name).toBe(createdProduct.name)
    })
    it('showBycategory method should return a list of products of 1 thats in just-created product category', async () => {
      const result:Product[] = await ProductModel.showByCategory(createdProduct.category as string)as Product[]
      expect(result.length).toBe(1)
      expect(result[0].name).toBe(createdProduct.name)
    })
    it('delete method should remove the just-created product', async () => {
      await ProductModel.delete(createdProduct.id as unknown as string);
      const result:Product[] = await ProductModel.index()as unknown as Product[]
      expect(result).toEqual([]);
    });
  })