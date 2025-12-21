import { prismaClient } from "../application/database";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    // Validate the request
    const validatedRegister = (await UserValidation.REGISTER.parse(
      request
    )) as RegisterUserRequest;

    // Check if username already exists
    const totalUsersWithUsername = await prismaClient.user.count({
      where: { username: validatedRegister.username },
    });

    if (totalUsersWithUsername !== 0) {
      throw new HTTPException(400, { message: "Username already exists" });
    }

    // Hash the password
    validatedRegister.password = await Bun.password.hash(
      validatedRegister.password,
      {
        algorithm: "bcrypt",
        cost: 10,
      }
    );

    // Store the user in the database
    const createdUser = await prismaClient.user.create({
      data: validatedRegister,
    });

    // Return the created user response
    return toUserResponse(createdUser);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    // Validate the request
    const validatedLogin = (await UserValidation.LOGIN.parse(
      request
    )) as LoginUserRequest;

    // Check if the user exists
    let user = await prismaClient.user.findUnique({
      where: { username: validatedLogin.username },
    });

    if (!user) {
      throw new HTTPException(400, { message: "Invalid username or password" });
    }

    // Verify the password
    const isPasswordValid = await Bun.password.verify(
      request.password,
      user.password,
      "bcrypt"
    );

    if (!isPasswordValid) {
      throw new HTTPException(400, { message: "Invalid username or password" });
    }

    // Generate a token
    user = await prismaClient.user.update({
      where: { username: user.username },
      data: {
        token: crypto.randomUUID(),
      },
    });

    // Return the user response with token
    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }
}
