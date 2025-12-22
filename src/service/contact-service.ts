import { Contact, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
  UpdateContactRequest,
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

    const contact = await this.contactMustExist(user, validatedContactId);

    return toContactResponse(contact);
  }

  static async contactMustExist(
    user: User,
    contactId: number
  ): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: user.username,
        id: contactId,
      },
    });

    if (!contact) {
      throw new HTTPException(404, {
        message: "Contact not found",
      });
    }
    return contact;
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const validatedContact = (await ContactValidation.UPDATE.parse(
      request
    )) as UpdateContactRequest;

    const contact = await this.contactMustExist(user, validatedContact.id);
    const updatedContact = await prismaClient.contact.update({
      where: {
        id: contact.id,
        username: user.username,
      },
      data: request,
    });
    return toContactResponse(updatedContact);
  }

  static async delete(user: User, contactId: number): Promise<boolean> {
    contactId = (await ContactValidation.DELETE.parse(contactId)) as number;
    await this.contactMustExist(user, contactId);
    await prismaClient.contact.delete({
      where: {
        id: contactId,
        username: user.username,
      },
    });
    return true;
  }
}
