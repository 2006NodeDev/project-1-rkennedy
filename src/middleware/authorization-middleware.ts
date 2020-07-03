// different users have different roles
// different roles allow you to do different things
// different endpoints require different roles
//before I allow someone to access an endpoint, I want to make sure they have a role that matches that endpoints allowed roles

import { Request, Response, NextFunction } from "express";



export function authorizationMiddleware(roles: string[], userId?: boolean){
    return (req:Request, res:Response, next:NextFunction) => {
        let allowed = false
console.log(req.session.user.role.role)
            if(req.session.user.role.role == roles){
                console.log(roles);

                allowed = true

            }
        if(userId){
            let id = +req.params.userId

            if(!isNaN(id)){
                if(req.session.user.userId == id) {
                    allowed = true
                }
            }
        }

        if(allowed){
            next()
        }else{
            res.status(401).send('The incoming token has expired');
        }
    }

}