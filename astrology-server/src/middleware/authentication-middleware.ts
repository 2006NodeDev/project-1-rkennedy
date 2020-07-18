import { Request, Response, NextFunction } from "express";

// Authenticates Users
export function authenticationMiddleware(req:Request, res:Response, next:NextFunction) {
    if(!req.session.user) {
        res.status(401).send('Please login with Username and Password')
    }
    else {
        console.log(`User ${req.session.user.username} has a role of ${req.session.user.role.role}`);
        next()
    }
}