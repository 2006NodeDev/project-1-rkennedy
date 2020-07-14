import express, { Request, Response, NextFunction } from 'express';
import { getProfileByStatus } from '../daos/profile-dao';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export const profileStatusRouter = express.Router();

// Get Profile by Status
profileStatusRouter.get('/:statusId', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => {
    let { statusId } = req.params
    if(isNaN(+statusId)) {
        res.status(400).send('Status Id must be a number')
    }
    else { 
        try {
            let reimById = await getProfileByStatus(+statusId)
            res.json(reimById)
        } catch (e) {
            next(e)
        }
    }
})