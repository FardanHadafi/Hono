import { User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";

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
}
