import { HttpError } from "./HttpError";

export class AuthenticationError extends HttpError {
    constructor() {
        super(400, 'Invalid Credentials')
    }
}