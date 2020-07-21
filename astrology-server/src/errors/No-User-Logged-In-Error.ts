import { HttpError } from "./HttpError";

export class NoUserLoggedInError extends HttpError {
    constructor(){
        super(404,  "Must be logged in to log out")
    }
}