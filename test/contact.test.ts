import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { UserTest } from "./test-util";
import { ContactTest } from "./test-util";
import app from "../src";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("Should reject contact creation request if token is invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "wrong",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.errors).toBeDefined();
  });

  it("Should reject invalid contact creation request", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should create contact successfully (Only FirstName)", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        first_name: "JohnDoe",
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("JohnDoe");
    expect(body.data.last_name).toBeNull();
    expect(body.data.email).toBeNull();
    expect(body.data.phone).toBeNull();
  });

  it("Should create contact successfully (Full Detail)", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        first_name: "JohnDoe",
        last_name: "DoeJohn",
        email: "example@example.com",
        phone: "1234567890",
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("JohnDoe");
    expect(body.data.last_name).toBe("DoeJohn");
    expect(body.data.email).toBe("example@example.com");
    expect(body.data.phone).toBe("1234567890");
  });
});
