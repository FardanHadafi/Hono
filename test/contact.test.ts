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

describe("GET /api/contacts/{idContact}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("Should get 404 if contact not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });

  it("Should get contact successfully", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + contact.id, {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(contact.id);
    expect(body.data.first_name).toBe(contact.first_name);
    expect(body.data.last_name).toBe(contact.last_name);
    expect(body.data.email).toBe(contact.email);
    expect(body.data.phone).toBe(contact.phone);
  });
});

describe("PUT /api/contacts/:idContact", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("Should reject invalid contact update request", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "PUT",
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

  it("Should reject contact update request if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "PUT",
      headers: {
        Authorization: "testtoken",
      },
      body: JSON.stringify({
        first_name: "JohnDoe",
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });

  it("Should update contact successfully", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + contact.id, {
      method: "PUT",
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

describe("DELETE /api/contacts/:idContact", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("Should get 404 if contactId not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "DELETE",
      headers: {
        Authorization: "testtoken",
      },
    });
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.errors).toBeDefined();
  });

  it("Should delete contact successfully", async () => {
    const contact = await ContactTest.get();
    const response = await app.request("/api/contacts/" + contact.id, {
      method: "DELETE",
      headers: {
        Authorization: "testtoken",
      },
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toBe(true);
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.createMany(25);
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("Should be able to search contacts", async () => {
    const response = await app.request("/api/contacts", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(3);
  });

  it("Should be able to search contacts with name", async () => {
    // Search for "John" (4 chars - meets min 3 requirement)
    let response = await app.request("/api/contacts?name=John", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(3);

    // Search for "Doe" (3 chars - meets min 3 requirement)
    response = await app.request("/api/contacts?name=Doe", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(3);
  });

  it("Should be able to search contacts with email", async () => {
    // Must use VALID email format - not partial strings
    let response = await app.request("/api/contacts?email=test0@example.com", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(1); // Should match only test0@example.com
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(1);
  });

  it("Should be able to search contacts with phone", async () => {
    // Phone must be at least 7 characters
    let response = await app.request("/api/contacts?phone=1234567800", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(1); // Should match contact with phone 1234567800
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(1);
  });

  it("Should be able to search contacts without result", async () => {
    // Name must be at least 3 characters
    let response = await app.request("/api/contacts?name=Connor", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(0);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(0);

    // Email must be valid email format
    response = await app.request("/api/contacts?email=wrong@nowhere.com", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(0);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(0);

    // Phone must be at least 7 characters
    response = await app.request("/api/contacts?phone=9999999", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(0);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(0);
  });

  it("Should be able to search contacts with paging", async () => {
    // Test page 1
    let response = await app.request("/api/contacts?page=1&size=10", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(3);

    // Test page 2
    response = await app.request("/api/contacts?page=2&size=10", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(2);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(3);

    // Test page 3 (last page with 5 items)
    response = await app.request("/api/contacts?page=3&size=10", {
      method: "GET",
      headers: {
        Authorization: "testtoken",
      },
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBe(5);
    expect(body.paging.current_page).toBe(3);
    expect(body.paging.size).toBe(10);
    expect(body.paging.total_page).toBe(3);
  });
});
