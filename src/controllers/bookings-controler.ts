import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { bookingService } from "@/services";
import { number } from "joi";

export async function getBooking(req: AuthenticatedRequest, res: Response) {

    const userId = Number(req.userId)

    const booking = await bookingService.getBooking(userId)

    res.status(httpStatus.OK).send(booking)
}


export async function postBooking(req: AuthenticatedRequest, res: Response) {

    const userId = Number(req.userId)
    const roomId = Number(req.body.roomId)

    const booking = await bookingService.newBooking(userId, roomId)

    res.status(httpStatus.OK).send(booking)
}


export async function updateBooking(req: AuthenticatedRequest, res: Response) {

    const userId = Number(req.userId)
    const roomId = Number(req.body.roomId)
    const params = Number(req.params.bookingId)


    const booking = await bookingService.updateUserBooking(userId,roomId,params)

    res.status(httpStatus.OK).send(booking)
}