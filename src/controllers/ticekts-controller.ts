import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { ticketService } from "@/services";
import httpStatus from "http-status";
import { BodyTicket } from "@/protocols";


export async function getTicketsByTypes(req: AuthenticatedRequest, res: Response) {
    const ticektsType = await ticketService.getTicketByType()
    return res.status(httpStatus.OK).send(ticektsType)
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req

    const ticket = await ticketService.getTicket(userId)
    return res.status(httpStatus.OK).send(ticket)
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const { ticketTypeId } = req.body as BodyTicket

    const newTicket = await ticketService.createTicket(userId, ticketTypeId)
    return res.status(httpStatus.CREATED).send(newTicket)
}