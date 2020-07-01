import express, { Request, Response, NextFunction } from 'express';
import { getReimbursementByuserid } from '../daos/reimbursement-dao';
//import { authorizationMiddleware } from '../middleware/authorization-middleware';
export const reimbursementAuthorRouter = express.Router();
// Get Reimbursement by User Id
reimbursementAuthorRouter.get('/:userid', async (req:Request, res:Response, next:NextFunction) => {
    let { userid } = req.params
    if(isNaN(+userid)) {
        res.status(400).send('userid Needs to be a Number')
    }
    else { 
        try {
            let reimByuserid = await getReimbursementByuserid(+userid)
            res.json(reimByuserid)
        } catch (e) {
            next(e)
        }
    }
})