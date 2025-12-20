import { prismaClient } from "../application/database";
import {
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    // Validate the request
    const validatedRequest = (await UserValidation.REGISTER.parse(
      request
    )) as RegisterUserRequest;

    // Check if username already exists
    const totalUsersWithUsername = await prismaClient.user.count({
      where: { username: validatedRequest.username },
    });

    if (totalUsersWithUsername !== 0) {
      throw new HTTPException(400, { message: "Username already exists" });
    }

    // Hash the password
    validatedRequest.password = await Bun.password.hash(
      validatedRequest.password,
      {
        algorithm: "bcrypt",
        cost: 10,
      }
    );

    // Store the user in the database
    const createdUser = await prismaClient.user.create({
      data: validatedRequest,
    });

    // Return the created user response
    return toUserResponse(createdUser);
  }
}
