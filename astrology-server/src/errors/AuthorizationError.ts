import { HttpError } from "./HttpError";

export class AuthorizationError extends HttpError {
    constructor() {
        super(401, 'The incoming token has expired')
    }
}