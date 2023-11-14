import { prisma } from "@/config";
import { CreatePostTicket } from "@/protocols";
import { Ticket, TicketType } from "@prisma/client";

async function findTicketByType(): Promise<TicketType[]> {
    return prisma.ticketType.findMany()
}

async function findTicket(enrollmentId: number): Promise<Ticket> {
    return prisma.ticket.findUnique({
        where: { enrollmentId },
        include: { TicketType: true }
    })

}
async function createTicket(ticket: CreatePostTicket): Promise<Ticket> {

    const result = await prisma.ticket.create({
        data: ticket,
        include: { TicketType: true }
    })

    return result
}

export const ticketRepository = {
    findTicketByType,
    findTicket,
    createTicket
}
