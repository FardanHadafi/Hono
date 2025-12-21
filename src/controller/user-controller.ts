import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest } from "../model/user-model";
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

userController.post("/api/users/login", async (c) => {
  const user = (await c.req.json()) as LoginUserRequest;

  // Send to service
  const response = await UserService.login(user);
  // Return the created user response
  return c.json({
    data: response,
  });
});
