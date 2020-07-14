import { HttpError } from "./HttpError";

export class ProfileInputError extends HttpError {
	constructor(){
        super(400, 'Relationship ID is in the incorrect format')
    }
}