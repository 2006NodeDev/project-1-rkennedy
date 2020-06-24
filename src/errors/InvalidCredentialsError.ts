import { HttpError } from "./HttpError";

export abstract class InvaildCredentialsError extends Error {
	constructor(){
        super(401, 'Your Credentials are Invalid')
    }
}