import { TicketStatus, TicketType } from '@prisma/client';
import {
  enrollmentMock,
  enrollmentMock2,
  generateBookingMock,
  generateRoomMock,
  ramdomTicket,
  ramdomTicketType,
  ticketTypeMock,
  ticketPaidMock,
} from './mocks.ts';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services';
import { forbiddenError } from '@/errors/forbidden-error.js';
import { bookingRepository } from '@/repositories/booking-repository.js';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Unit test for service /booking', () => {
  it('Find the enrollment by user and the response is the enrollment', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock2);

    const enrollment = await bookingService.findEnrollmentByUserId(1);
    expect(enrollment).toEqual(enrollmentMock2);
    expect(enrollment).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        cpf: expect.any(String),
        birthday: expect.any(Date),
        phone: expect.any(String),
        userId: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('Test error not found when user not exist', async () => {
    const mockAddressById = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    mockAddressById.mockResolvedValue(null);

    const promise = await bookingService.findEnrollmentByUserId(75);
    expect(promise).rejects.toEqual({
      name: 'notFoundError',
      message: 'No result for this search!',
    });
  });

  it('Error in validade the user booking', async () => {
    const mockTicket = ramdomTicket();
    const mockTicketType = ramdomTicketType();
    const mockData = {
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: mockTicket.status,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock2);
    jest.spyOn(bookingService, 'findEnrollmentByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingService, 'findTicketByEnrollment').mockResolvedValueOnce(mockData);

    const promise = bookingService.verifyUserBooking(1);
    expect(promise).rejects.toEqual(forbiddenError());
  });

  it('Error not found when ticket is invalid', async () => {
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(null);

    const ticket = bookingService.findTicketByEnrollment(1);
    expect(ticket).rejects.toEqual({
      name: 'notFoundError',
      message: 'No result for this search!',
    });
  });

  it('Response is a ticket, when a find ticket by enrollment', async () => {
    const mockTicket = ramdomTicket();
    const mockTicketType = ramdomTicketType();

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce({
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: mockTicket.status,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    });

    const promise = await bookingService.findTicketByEnrollment(1);
    expect(promise).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ticketTypeId: expect.any(Number),
        enrollmentId: expect.any(Number),
        status: expect.any(String),
        createdAt: expect.any(Date),
        updmocktickatedAt: expect.any(Date),
        TicketType: expect.any(Number),
      }),
    );
  });

  it('Error not found when booking is null', async () => {
    const mockTicket = ramdomTicket();

    const mockTicketType = ramdomTicketType();
    mockTicketType.isRemote = false;
    mockTicketType.includesHotel = true;

    const mockData = {
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: TicketStatus.PAID,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock2);
    jest.spyOn(bookingService, 'findEnrollmentByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingService, 'findTicketByEnrollment').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(null);

    expect(bookingService.getBooking).rejects.toEqual({
      name: 'notFoundError',
      message: 'No result for this search!',
    });
  });

  it('Generete a new room', async () => {
    const mockBooking = generateBookingMock();
    const mockRoom = generateRoomMock();
    const mockTicket = ramdomTicket();
    const mockTicketType = ramdomTicketType();

    mockTicketType.isRemote = false;
    mockTicketType.includesHotel = true;

    const mockData = {
      id: mockTicket.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: 1,
      status: TicketStatus.PAID,
      createdAt: mockTicket.createdAt,
      updatedAt: mockTicket.updatedAt,
      TicketType: mockTicketType,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock2);
    jest.spyOn(bookingService, 'findEnrollmentByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingService, 'findTicketByEnrollment').mockResolvedValueOnce(mockData);
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce({
      ...mockBooking,
      Room: mockRoom,
    });

    const getBookingResponse = await bookingService.getBooking(1);
    expect(getBookingResponse).toEqual(
      expect.objectContaining({
        id: mockBooking.id,
        Room: mockRoom,
      }),
    );
  });

  it('Verify if post booking return a room ', async () => {
    jest.spyOn(bookingService, 'findRoomById').mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(bookingRepository, 'findRoom').mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(bookingService, 'verifyUserBooking').mockResolvedValueOnce();
    jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce([generateBookingMock()]);
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(null);

    jest
      .spyOn(bookingService, 'verifyReservedRoom')
      .mockResolvedValueOnce([generateBookingMock(), generateBookingMock()]);

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce({
      TicketType: { ...ticketTypeMock },
      ...ticketPaidMock,
    });

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(bookingService, 'verifyUserReserved').mockResolvedValueOnce();
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(generateBookingMock());

    const response = await bookingService.newBooking(1, 1);
    expect(response).toEqual({
      bookingId: expect.any(Number),
    });
  });

  it('Verify if update the booking is working', async () => {
    jest.spyOn(bookingService, 'findRoomById').mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(bookingRepository, 'findRoom').mockResolvedValueOnce(generateRoomMock());
    jest.spyOn(bookingService, 'verifyUserBooking').mockResolvedValueOnce();
    jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce([generateBookingMock()]);
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(null);

    jest
      .spyOn(bookingService, 'verifyReservedRoom')
      .mockResolvedValueOnce([generateBookingMock(), generateBookingMock()]);

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce({
      TicketType: { ...ticketTypeMock },
      ...ticketPaidMock,
    });

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(generateBookingMock());

    jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce({
      ...generateBookingMock(),
      Room: { ...generateRoomMock() },
    });
    jest.spyOn(bookingRepository, 'updateBooking').mockResolvedValueOnce(generateBookingMock());
    jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(generateBookingMock());

    const response = await bookingService.updateUserBooking(1, 1, 1);
    expect(response).toEqual({
      bookingId: expect.any(Number),
    });
  });
});
