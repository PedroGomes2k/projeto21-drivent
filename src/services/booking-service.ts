import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { conflictError, forbianError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';

async function getBooking(userId: number) {
  await verifyUserBooking(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) throw notFoundError();

  const response = {
    id: booking.id,
    Room: booking.Room,
  };

  return response;
}

async function newBooking(userId: number, roomId: number) {
  await verifyUserBooking(userId);

  const room = await findRoomById(roomId);
  const reseved = await verifyReservedRoom(roomId);
  await verifyLengthRoom(room.capacity, reseved.length);
  await verifyUserReserved(userId);

  const newBooking = await bookingRepository.createBooking(userId, roomId);
  return {
    bookingId: newBooking.id,
  };
}

async function updateUserBooking(userId: number, roomId: number, bookingId: number) {
  const room = await findRoomById(roomId);
  const reseved = await verifyReservedRoom(roomId);
  await verifyLengthRoom(room.capacity, reseved.length);

  const booking = await bookingRepository.findBooking(bookingId);
  if (!booking) throw forbianError();

  const updateBooking = await bookingRepository.updateBooking(booking.id, roomId);
  return {
    bookingId: updateBooking.id,
  };
}

async function verifyUserBooking(userId: number) {
  const enrollment = await findEnrollmentByUserId(userId);
  const ticket = await findTicketByEnrollment(enrollment.id);
  const ticketStatus = ticket.TicketType;

  if (invalidBooking(ticket, ticketStatus)) {
    throw conflictError('Is not include de hotel,dont remote reservation or your ticket is not paid');
  }
}

async function findEnrollmentByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();
  return enrollment;
}

async function findTicketByEnrollment(enrollmentId: number) {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);

  if (!ticket) throw notFoundError();
  return ticket;
}

async function invalidBooking(ticket: Ticket, status: TicketType) {
  return ticket.status === TicketStatus.RESERVED || !status.isRemote || !status.includesHotel;
}

async function findRoomById(roomId: number) {
  const room = await bookingRepository.findRoom(roomId);

  if (!room) throw notFoundError;

  return room;
}

async function verifyReservedRoom(roomId: number) {
  const room = await bookingRepository.findBookingByRoomId(roomId);

  return room;
}

async function verifyLengthRoom(room: number, capacity: number) {
  if (capacity >= room) throw forbianError();
}

async function verifyUserReserved(userId: number) {
  const verify = await bookingRepository.findBookingByUserId(userId);
  if (!verify) throw forbianError;
}

export const bookingService = {
  getBooking,
  newBooking,
  updateUserBooking,
};
