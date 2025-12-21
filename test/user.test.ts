import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  beforeEach,
} from "bun:test";
import app from "../src";
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";

beforeAll(() => {
  const config = require("../prisma.config");
  process.env.DATABASE_URL = config.DATABASE_URL;
});

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject invalid user registration", async () => {
    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "",
        password: "",
        name: "",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should reject duplicate user registration", async () => {
    await UserTest.create();

    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "testpassword",
        name: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should register a new user", async () => {
    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "test12",
        name: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("testuser");
    expect(body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "test12",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data.token).toBeDefined();
  });

  it("shouldn't be able to login if username is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "wrong",
        password: "test12",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("shouldn't be able to login if password is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "wrongpassword",
      }),
    });
    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
});
