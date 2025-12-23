import { Address, Contact } from "@prisma/client";
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

  static async createMany(n: number) {
    for (let i = 0; i < n; i++) {
      await prismaClient.contact.create({
        data: {
          first_name: `John${i}`,
          last_name: `Doe${i}`,
          email: `test${i}@example.com`,
          phone: `12345678${i.toString().padStart(2, "0")}`,
          username: "testuser",
        },
      });
    }
  }

  static async get(): Promise<Contact> {
    return prismaClient.contact.findFirstOrThrow({
      where: {
        username: "testuser",
      },
    });
  }
}

export class AddressTest {
  static async create() {
    const contact = await ContactTest.get();
    await prismaClient.address.create({
      data: {
        contact_id: contact.id,
        street: "Jalan Sesama",
        city: "Gotham",
        province: "Province",
        country: "America",
        postal_code: "666666",
      },
    });
  }

  static async get(): Promise<Address> {
    return prismaClient.address.findFirstOrThrow({
      where: {
        contact: {
          username: "testuser",
        },
      },
    });
  }

  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "testuser",
        },
      },
    });
  }
}
