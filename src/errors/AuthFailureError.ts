import { HttpError } from "./HttpError";

export abstract class AuthFailureError extends Error {
constructor(){
        super(401, 'Authenication Failed')
    }
}