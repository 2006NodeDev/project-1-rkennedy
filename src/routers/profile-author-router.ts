import express, { Request, Response, NextFunction } from 'express';
import { getProfileByUserId } from '../daos/profile-dao';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export const profileAuthorRouter = express.Router();

// Get profile by User Id
profileAuthorRouter.get('/:userId', authorizationMiddleware(['Admin', 'User', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let { userId } = req.params
    if(isNaN(+userId)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        try {
            let profileByUserId = await getProfileByUserId(+userId)
            res.json(profileByUserId)
        } catch (e) {
            next(e)
        }
    }
})