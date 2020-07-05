import { HttpError } from "./HttpError";

export class reimbursement_idInputError extends HttpError {
	constructor(){
        super(400, 'Your ID is in an incorrect format')
    }
}