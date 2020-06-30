import { HttpError } from "./HttpError";

export class ReimbursementUserInputError extends HttpError {
	constructor(){
        super(400, 'Please fill out all reimbursement data fields')
    }
}