import { Ticket, TicketStatus, TicketType } from "@prisma/client";
import faker from "@faker-js/faker";

export const ticketMock: Ticket = {
    id: 1,
    ticketTypeId: 2,
    enrollmentId: 3,
    status: TicketStatus.RESERVED,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const ticketPaidMock: Ticket = {
    id: 1,
    ticketTypeId: 2,
    enrollmentId: 3,
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const ticketTypeMock: TicketType = {
    id: 2,
    name: "Ingresso Simples",
    price: 500,
    isRemote: false,
    includesHotel: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const ramdomTicket = (): Ticket => {
    return {
        id: faker.datatype.number(),
        ticketTypeId: faker.datatype.number(),
        enrollmentId: faker.datatype.number(),
        status: faker.helpers.arrayElement(Object.values(TicketStatus)),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    }
}

export const ramdomTicketType = (): TicketType => {
    return {
        id: faker.datatype.number(),
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: faker.datatype.boolean(),
        includesHotel: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    }
}