
import { HttpError } from "./HttpError";

//for when trying to sign up

export class UserSignUpError extends HttpError {
    constructor (){
        super (400, `Please provide a username and password`)
    }
}