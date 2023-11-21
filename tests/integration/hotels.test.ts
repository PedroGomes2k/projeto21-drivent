import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createTicket, createTicketType, createTicketTypeForHotel, createTicketTypeRemote, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';

import { TicketStatus } from "@prisma/client";


const server = supertest(app)

beforeAll(async () => {
    await init()
    await cleanDb()
})

beforeEach(async () => {
    await cleanDb()
})

describe("Get hotels/", () => {
    it("Response status 401 when token was not pass", async () => {
        const { status } = await server.get("/hotels")
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("Response status 401 when token is invalid", async () => {
        const token = faker.lorem.word()
        const { status } = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })
    it("Response status 401 when sessions of token was not pass", async () => {
        const userWithoutSession = await createUser()
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const { status } = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })
    it("Response status 402 when token is invalid", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const { status } = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.PAYMENT_REQUIRED)
    })
    it("Response status 404 when token is invalid", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        await createTicketTypeRemote()

        const { status } = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.NOT_FOUND)
    })

    it("Response status 200 and list of hotels", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeForHotel()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const hotel = await createHotel()

        const { status, body } = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual([
            {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updateAt: hotel.updatedAt.toISOString()

            }
        ])
    })

})

describe("Get hotels/:id", () => {

})