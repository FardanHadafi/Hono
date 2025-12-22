import { User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    // Validate the request
    const validatedContact = (await ContactValidation.CREATE.parse(
      request
    )) as CreateContactRequest;

    let data = {
      ...validatedContact,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: data,
    });

    return toContactResponse(contact);
  }

  static async get(user: User, contactId: number): Promise<ContactResponse> {
    const validatedContactId = (await ContactValidation.GET.parse(
      contactId
    )) as number;

    const contact = await prismaClient.contact.findFirst({
      where: {
        username: user.username,
        id: validatedContactId,
      },
    });

    if (!contact) {
      throw new HTTPException(404, {
        message: "Contact not found",
      });
    }

    return toContactResponse(contact);
  }
}
