import { prismaClient } from "../src/application/database";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "testuser",
        name: "test",
        password: await Bun.password.hash("test12", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        token: "testtoken",
      },
    });
  }

  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "testuser",
      },
    });
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "testuser",
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: "JohnDoe",
        last_name: "DoeJhon",
        email: "example@example.com",
        phone: "1234567890",
        username: "testuser",
      },
    });
  }

  static async get() {
    return prismaClient.contact.findFirstOrThrow({
      where: {
        username: "testuser",
      },
    });
  }
}
