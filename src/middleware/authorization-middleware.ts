import { Request, Response, NextFunction } from "express"
import { AuthorizationError } from "../errors/AuthorizationError"

//Specifies which roles are allowed to do what 
export function authorizationMiddleware(roles:string[]) {
    return  (req:Request, res:Response, next:NextFunction) => {
        let isAllowed = false
        for(const role of roles) { 
            if(role === req.session.user.role.role) { 
                isAllowed = true
                next()
                //break;
            } 
            else if(role === 'Current') { //current Users can get their own reimByUserId and userById
                let id = req.url.substring(1) //.url gets URI, substring gets /id after URI
                console.log(`Session Id: ${req.session.user.userId}`); //Get userId of the user in the current session
                console.log((`Request Id: ${id}`)); //userId of requested information
                if(req.session.user.userId == id) { //If they match, they are authorized to see whatever they requested
                    isAllowed = true
                    next()
                    //break;
                }
            }
        }
        if(!isAllowed) {
            throw new AuthorizationError()
        }
    }
}