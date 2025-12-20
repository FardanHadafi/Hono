import { Hono } from "hono";
import { RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export const userController = new Hono();

userController.post("/api/users", async (c) => {
  const user = (await c.req.json()) as RegisterUserRequest;

  // Send to service
  const response = await UserService.register(user);

  // Return the created user response
  return c.json({
    data: response,
  });
});
