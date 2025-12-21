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
import { password } from "bun";

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

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to get current user", async () => {
    const currentUser = await app.request("/api/users/current", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    const body = await currentUser.json();
    logger.debug(body);

    expect(currentUser.status).toBe(200);
    expect(body.data.username).toBe("testuser");
    expect(body.data.name).toBe("test");
  });

  it("shouldn't be able to get current user if token is invalid", async () => {
    const currentUser = await app.request("/api/users/current", {
      method: "GET",
      headers: {
        Authorization: "wrong",
      },
    });
    const body = await currentUser.json();
    logger.debug(body);

    expect(currentUser.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("shouldn't be able to get current user if no Authorization Header", async () => {
    const currentUser = await app.request("/api/users/current", {
      method: "GET",
      headers: {
        Authorization: "",
      },
    });
    const body = await currentUser.json();
    logger.debug(body);

    expect(currentUser.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject invalid update request", async () => {
    const response = await app.request("/api/users/current", {
      method: "PATCH",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        name: "",
        password: "",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should update name", async () => {
    const response = await app.request("/api/users/current", {
      method: "PATCH",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        name: "updatedname",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe("updatedname");
  });

  it("should update password and be able to login", async () => {
    let response = await app.request("/api/users/current", {
      method: "PATCH",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        password: "newpassword",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe("test");

    response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "newpassword",
      }),
    });

    expect(response.status).toBe(200);
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should logout user", async () => {
    const response = await app.request("/api/users/current", {
      method: "DELETE",
      headers: {
        Authorization: "testtoken",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBe(true);
  });

  it("shouldn't logout user with invalid token", async () => {
    let response = await app.request("/api/users/current", {
      method: "DELETE",
      headers: {
        Authorization: "testtoken",
      },
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBe(true);

    response = await app.request("/api/users/current", {
      method: "DELETE",
      headers: {
        Authorization: "testtoken",
      },
    });

    expect(response.status).toBe(401);
  });
});
