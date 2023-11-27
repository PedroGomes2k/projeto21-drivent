import { type } from 'os';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createTicketType,
  createUser,
  createTicket,
  createRoom,
  createHotel,
  createBooking,
} from '../factories';
import app, { init, close } from '@/app';

const server = supertest(app);

const createIncompletClient = async (isRemote = false, includesHotel = true, type?: TicketStatus) => {
  const user = await createUser();
  const hotel = await createHotel();
  const room = await createRoom(null, hotel.id, 1);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  await createTicket(enrollment.id, ticketType.id, type ? type : TicketStatus.PAID);
  const token = await generateValidToken(user);
  return { token, user, room };
};

const createCompleteClient = async (isRemote = false, includesHotel = true, type?: TicketStatus) => {
  const user = await createUser();
  const hotel = await createHotel();
  const room = await createRoom(null, hotel.id, 1);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  await createTicket(enrollment.id, ticketType.id, type ? type : TicketStatus.PAID);
  const booking = await createBooking(user.id, room.id);
  const token = await generateValidToken(user);
  return { token, user, room, booking };
};

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await close();
});

describe('Integration of the test get /booking', () => {
  it('Error Unauthorized(401) when token is not given - get /booking', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Error Unauthorized(401) when token invalid - get /booking', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Error Unauthorized(401) when dont have session for token - get /booking', async () => {
    const sessionForUser = await createUser();
    const token = jwt.sign({ userId: sessionForUser.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid ', () => {
    it('Error Forbian(403) when dont have a hotel ', async () => {
      const token = await createCompleteClient(false, false);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token.token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Error Forbian(403) when ticket isRemote', async () => {
      const token = await createCompleteClient(true, true);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token.token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Error Forbian(403) when ticketType is Reserved', async () => {
      const token = await createCompleteClient(false, true, TicketStatus.RESERVED);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token.token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Token is valid - status(201)', async () => {
      const token = await createCompleteClient(false, true);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token.token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(Date),
          updateAt: expect.any(Date),
        },
      });
    });
  });
});

describe('Integration of the test post /booking', () => {

  it('Error Unauthorized(401) when token is not given - get /booking', async () => {
    const body = { roomId: 2 }
    const response = (await server.post('/booking').send(body));
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Error Unauthorized(401) when token is invalid - post /booking', async () => {

    const body = { roomId: 1 }
    const token = faker.lorem.word();
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('Error Unauthorized(401) when dont have session for token - post /booking', async () => {

    const body = { roomId: 1 }
    const sessionForUser = await createUser()

    const token = jwt.sign({ userId: sessionForUser.id }, process.env.JWT_SECRET);
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('Error Unauthorized(401) when token is invalid - post /booking', async () => {

    const body = { roomId: 1 }
    const token = faker.lorem.word();
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  describe('When token is valid - post /booking', () => {

    it('Error NotFound(404) when dont have a room', async () => {
      const body = { roomId: 899 }

      const token = await createIncompletClient()
      const response = await server.post('/booking').set('Authorization', `Bearer ${token.token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND)

    })

    it('Error Forbiden(403) when room dont have no more capacity', async () => {
      const room = await createCompleteClient()
      const token = await createIncompletClient()
      const body = { roomId: room.room.id }

      const response = await server.post('/booking').set('Authorization', `Bearer ${token.token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN)

    })
  })

})


describe('When token is valid - post /booking', () => {

  it('', async () => {



  })
})

