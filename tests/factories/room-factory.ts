import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createRoom(id: number = null, hotelId: number = null, capacity: number = null) {
  return prisma.room.create({
    data: {
      id: id === null ? faker.datatype.number() : id,
      name: faker.datatype.string(),
      capacity: capacity === null ? faker.datatype.number() : capacity,
      hotelId: hotelId === null ? faker.datatype.number() : hotelId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
