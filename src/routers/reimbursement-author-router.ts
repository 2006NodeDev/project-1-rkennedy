import express, { Request, Response, NextFunction } from 'express';
import { getReimbursementByUserId } from '../daos/reimbursement-dao';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export const reimbursementAuthorRouter = express.Router();

// Get Reimbursement by User Id
reimbursementAuthorRouter.get('/:userId', authorizationMiddleware(['Admin', 'Finance Manager', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let { userId } = req.params
    if(isNaN(+userId)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        try {
            let reimbursementByUserId = await getReimbursementByUserId(+userId)
            res.json(reimbursementByUserId)
        } catch (e) {
            next(e)
        }
    }
})