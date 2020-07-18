import { HttpError } from "./HttpError";

export class ProfileNotFoundError extends HttpError {
    constructor(){
        super(404, 'Profile Not Found')
    }
}