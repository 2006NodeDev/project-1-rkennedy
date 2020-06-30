import { HttpError } from "./HttpError";

export class InvalidCredentialsError extends HttpError {
	constructor(){
        super(401, 'Your Credentials are Invalid')
    }
}