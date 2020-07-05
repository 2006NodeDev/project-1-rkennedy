import { Request, Response, NextFunction } from "express";

export function authorizationMiddleware(roles:string[]) {
    return  (req:Request, res:Response, next:NextFunction) => {
        let isAllowed = false
        for(const role of roles) { 
            if(role === req.session.user.role.role) { 
                isAllowed = true
                next()
            } 
            else if(role === 'Current') {
                let id = req.url.substring(1) 
                console.log(`Session Id: ${req.session.user.user_id}`); 
                console.log((`Request Id: ${id}`)); 
                if(req.session.user.user_id == id) {                     isAllowed = true
                    next()
                }
            }
        }
        if(!isAllowed) {
            res.status(401).send('The incoming token has expired');
        }
    }
}