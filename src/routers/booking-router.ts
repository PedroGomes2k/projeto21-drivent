import { getBooking, postBooking, updateBooking } from "@/controllers/bookings-controler";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router()


bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', postBooking)
    .put('/:bookingId', updateBooking)

export  {bookingRouter}