import { AuthenticatedRequest } from '@/middlewares';
import { ParamsRoute } from '@/protocols';
import { hotelsServices } from '@/services';
import { Response } from 'express';
import httpStatus from 'http-status';
import { number } from 'joi';

export async function getHotels(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const hotels = await hotelsServices.getHotels(userId)

    return res.status(httpStatus.OK).send(hotels)
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {

    const { userId } = req
    
    const hotelId = Number(req.params.hotelId)

    const hotel = await hotelsServices.getHotel(userId, hotelId)

    return res.status(httpStatus.OK).send(hotel)
}


