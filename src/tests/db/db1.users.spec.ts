import { User, UserModel } from "../../models/users";

xdescribe("User model", () => {
  it('should have an index method', () => {
    expect(UserModel.index).toBeDefined();
  });
  it('should have an create method', () => {
    expect(UserModel.create).toBeDefined();
  });
  it('should have an show method', () => {
    expect(UserModel.show).toBeDefined();
  });
  it('should have an delete method', () => {
    expect(UserModel.delete).toBeDefined();
  });
  const newUser:User ={
    email:"test@test.com",
    username:"test username",
    password:"123456"
  }
  let createdUser: User={
    id:1,
    ...newUser,
    role:"user"
  };
  it('create method should add a user with email test@test.com', async () => {
    const {username,email,password}=newUser
    const result :User = await UserModel.create(email,username,password)  as User
    expect(createdUser.email).toBe(result.email)
    expect(createdUser.username).toBe(result.username)
    createdUser = result
  })
  it('show method should retrun the user with email test@test.com', async () => {
    const result :User = await UserModel.show(createdUser.id as unknown as string)  as User
    expect(result).toEqual(createdUser)
  })
  it('authentiacte method should return the just-created user', async () => {
    const {email,password}=newUser
    const result :User = await UserModel.authentiacte(email,password) as User
    expect(result).toEqual(createdUser)
  })
  it('authentiacte method should retrun null with wrong password', async () => {
    const {email,password}=newUser
    const result :User|null = (await UserModel.authentiacte(email,password+"x")) as User|null
    expect(result).toEqual(null)
  })
  it('index method should return a list of users of length 1', async () => {
    const result:User[] =( await UserModel.index()) as User[]
    expect(result.length).toBe(1)
  })
  it('delete method should remove the user with email test@test.com', async () => {
    UserModel.delete(createdUser.id as unknown as string);
    const result:User[] = (await UserModel.index()) as User[]
    expect(result).toEqual([]);
  });
})



