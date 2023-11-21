import { prisma } from "@/config"


async function findHotels() {
    return prisma.hotel.findMany()
}

async function findHotelById(hotelId: number) {
    return prisma.hotel.findUnique({
        where: {
            id: hotelId
        },
        include: {
            Rooms: true
        }
    })
}

export const hotelsRepository = {
    findHotels,
    findHotelById
}