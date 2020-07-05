import express, { Request, Response, NextFunction } from 'express';
import { getReimbursementByuser_id } from '../daos/reimbursement-dao';

export const reimbursementAuthorRouter = express.Router();

// Get Reimbursement by User Id
reimbursementAuthorRouter.get('/:user_id', async (req:Request, res:Response, next:NextFunction) => {
    let { user_id } = req.params
    if(isNaN(+user_id)) {
        res.status(400).send('user_id Needs to be a Number')
    }
    else { 
        try {
            let reimByuser_id = await getReimbursementByuser_id(+user_id)
            res.json(reimByuser_id)
        } catch (e) {
            next(e)
        }
    }
})