import { authMiddleware } from "../middleware/auth-middleware";
import {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressService } from "../service/address-service";
import { ApplicationVariables } from "./../model/app-model";
import { Hono } from "hono";

export const addressController = new Hono<{
  Variables: ApplicationVariables;
}>();
addressController.use(authMiddleware);

addressController.post("/api/contacts/:idContact/addresses", async (c) => {
  const user = c.get("user");
  const contactId = Number(c.req.param("idContact"));
  const request = (await c.req.json()) as CreateAddressRequest;
  request.contact_id = contactId;
  const response = await AddressService.create(user, request);
  return c.json({
    data: response,
  });
});

addressController.get(
  "/api/contacts/:idContact/addresses/:idAddress",
  async (c) => {
    const user = c.get("user");
    const request: GetAddressRequest = {
      contact_id: Number(c.req.param("idContact")),
      id: Number(c.req.param("idAddress")),
    };
    const response = await AddressService.get(user, request);
    return c.json({
      data: response,
    });
  }
);

addressController.put(
  "/api/contacts/:idContact/addresses/:idAddress",
  async (c) => {
    const user = c.get("user");
    const contactId = Number(c.req.param("idContact"));
    const addressId = Number(c.req.param("idAddress"));
    const request = (await c.req.json()) as UpdateAddressRequest;
    request.contact_id = contactId;
    request.id = addressId;
    const response = await AddressService.update(user, request);
    return c.json({
      data: response,
    });
  }
);
