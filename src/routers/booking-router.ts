import { Router } from 'express';
import { getBooking, postBooking, updateBooking } from '@/controllers/bookings-controler';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', postBooking)
  .put('/:bookingId', updateBooking);

export { bookingRouter };
