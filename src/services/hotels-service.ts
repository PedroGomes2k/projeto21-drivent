import { PaymentRequiredError, notFoundError } from "@/errors"
import { enrollmentRepository, hotelsRepository, ticketsRepository } from "@/repositories"

async function getHotels(userId: number) {

    await listHotels(userId)

    return await hotelsRepository.findHotels()
}

async function getHotel(userId: number, hotelId: number) {
    await listHotels(userId)

    const hotel = await hotelsRepository.findHotelById(hotelId)

    if (!hotel) throw notFoundError()

    return hotel
}

async function listHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if (!enrollment) throw notFoundError()

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) throw notFoundError()
    if (ticket.status === "PAID") throw PaymentRequiredError()
}




export const hotelsServices = {
    getHotels,
    getHotel
}