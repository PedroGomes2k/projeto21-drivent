import { prisma } from '@/config';
import faker from '@faker-js/faker';


export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      id: faker.datatype.number(),
      userId: userId === null ? faker.datatype.number() : userId,
      roomId: roomId === null ? faker.datatype.number() : roomId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
