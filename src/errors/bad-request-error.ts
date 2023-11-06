import { ApplicationError } from "@/protocols";

export function badRequestError(): ApplicationError {
    return {
        name: "CannotEnrollBeforeStartDateError",
        message:""
    }
}