import { getTickets, getTicketsByTypes, postTickets } from "@/controllers/ticekts-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { verifyTicketSchema } from "@/schemas";
import { Router } from "express";

const ticketRouter = Router()

ticketRouter

    .all('/*', authenticateToken)
    .get('/', getTickets)
    .get('/types', getTicketsByTypes)
    .post('/', validateBody(verifyTicketSchema), postTickets)

export default ticketRouter