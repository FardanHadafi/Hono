import { Hono } from "hono";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UpdateUserRequest,
} from "../model/user-model";
import { ApplicationVariables } from "../model/app-model";
import { UserService } from "../service/user-service";
import { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";

export const userController = new Hono<{ Variables: ApplicationVariables }>();

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

userController.use(authMiddleware);

userController.get("/api/users/current", async (c) => {
  const user = c.get("user") as User;

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ data: toUserResponse(user) });
});

userController.patch("/api/users/current", async (c) => {
  const user = c.get("user") as User;
  const updatedData = (await c.req.json()) as UpdateUserRequest;
  const updatedUser = await UserService.update(user, updatedData);

  return c.json({ data: updatedUser });
});

userController.delete("/api/users/current", async (c) => {
  const user = c.get("user") as User;
  const deletedUser = await UserService.logout(user);

  return c.json({ data: deletedUser });
});
