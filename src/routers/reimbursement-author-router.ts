import express, { Request, Response, NextFunction } from 'express';
import { getReimbursementByUserId } from '../daos/reimbursement-dao';
//import { authorizationMiddleware } from '../middleware/authorization-middleware';
export const reimbursementAuthorRouter = express.Router();
// Get Reimbursement by User Id
reimbursementAuthorRouter.get('/:userId', async (req:Request, res:Response, next:NextFunction) => {
    let { userId } = req.params
    if(isNaN(+userId)) {
        res.status(400).send('UserId Needs to be a Number')
    }
    else { 
        try {
            let reimByUserId = await getReimbursementByUserId(+userId)
            res.json(reimByUserId)
        } catch (e) {
            next(e)
        }
    }
})