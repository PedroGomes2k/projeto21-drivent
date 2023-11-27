import { Payment } from '@prisma/client';

export const PaymentMock: Payment = {
  id: 1,
  ticketId: 2,
  value: 1000,
  cardIssuer: 'Banco Nupagamentos',
  cardLastDigits: '3333',
  createdAt: new Date(),
  updatedAt: new Date(),
};
