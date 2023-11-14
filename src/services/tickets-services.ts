import { notFoundError } from "@/errors"
import { CreatePostTicket } from "@/protocols"
import { enrollmentRepository, ticketRepository } from "@/repositories"

async function getTicketByType() {
    const ticketsTypes = await ticketRepository.findTicketByType()
    return ticketsTypes
}

async function getTicket(userId: number) {
    const enrollments = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollments) throw notFoundError()

    const ticket = await ticketRepository.findTicket(enrollments.id)
    if (!ticket) throw notFoundError()

    return ticket
}

async function createTicket(userId: number, ticketTypeId: number) {

    const enrollments = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollments) throw notFoundError()

    const newTicketParams: CreatePostTicket = {
        ticketTypeId,
        enrollmentId: enrollments.id,
        status: "RESERVED"

    }
    const newTickets = await ticketRepository.createTicket(newTicketParams)
    return newTickets
}

export const ticketService = {
    getTicket,
    getTicketByType,
    createTicket
}
