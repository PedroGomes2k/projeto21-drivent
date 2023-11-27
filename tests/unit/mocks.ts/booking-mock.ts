import faker from '@faker-js/faker';
import { Booking } from '@prisma/client';

export const BookingMock = (): Booking => {
  return {
    id: faker.datatype.number(),
    userId: faker.datatype.number(),
    roomId: faker.datatype.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};
