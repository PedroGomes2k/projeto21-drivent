import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function findBooking(id: number) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
  });
}

async function findRoom(id: number) {
  return prisma.room.findUnique({
    where: {
      id,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
  });
}

export const bookingRepository = {
  findBookingByUserId,
  findRoom,
  findBookingByRoomId,
  createBooking,
  updateBooking,
  findBooking,
};
