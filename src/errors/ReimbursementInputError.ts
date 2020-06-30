import { HttpError } from "./HttpError";

export class ReimbursementIdInputError extends HttpError {
	constructor(){
        super(400, 'Your ID is in an incorrect format')
    }
}