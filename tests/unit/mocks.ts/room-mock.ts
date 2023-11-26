import faker from "@faker-js/faker";
import { Room } from "@prisma/client";


export const RoomMock = (): Room => {
    return {
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        capacity: faker.datatype.number(),
        hotelId: faker.datatype.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    }
}
