import { BodyTicket } from "@/protocols";
import Joi from "joi";

export const verifyTicketSchema = Joi.object<BodyTicket>({
    ticketTypeId: Joi.number().integer().required()
})