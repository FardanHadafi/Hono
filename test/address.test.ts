import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { ContactTest, UserTest, AddressTest } from "./test-util";
import app from "../src";

describe("POST /api/contacts/:idContact", () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();

    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("Should reject address creation request if request is not valid", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses",
      {
        method: "POST",
        headers: {
          Authorization: "testtoken",
        },
        body: JSON.stringify({
          country: "",
          postal_code: "",
        }),
      }
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("Should reject address creation request if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + (contact.id + 1) + "/addresses",
      {
        method: "POST",
        headers: {
          Authorization: "testtoken",
        },
        body: JSON.stringify({
          country: "America",
          postal_code: "666666",
        }),
      }
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });

  it("Should create new address successfully", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses",
      {
        method: "POST",
        headers: {
          Authorization: "testtoken",
        },
        body: JSON.stringify({
          street: "Jalan Sesama",
          city: "Gotham",
          province: "Province",
          country: "America",
          postal_code: "666666",
        }),
      }
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe("Jalan Sesama");
    expect(body.data.city).toBe("Gotham");
    expect(body.data.province).toBe("Province");
    expect(body.data.country).toBe("America");
    expect(body.data.postal_code).toBe("666666");
  });
});
