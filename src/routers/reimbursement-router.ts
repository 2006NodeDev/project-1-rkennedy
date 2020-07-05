import express, { Request, Response, NextFunction } from 'express'
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursement-author-router'
import { Reimbursement } from '../models/Reimbursement'
import { submitOneReimbursement, updateOneReimbursement } from '../daos/reimbursement-dao'
//import { reimbursement_idInputError } from '../errors/ReimbursementInputError'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { UserInputError } from '../errors/UserInputError'

export const reimbursementRouter = express.Router()

reimbursementRouter.use(authenticationMiddleware)
reimbursementRouter.use('/status', reimbursementStatusRouter)
reimbursementRouter.use('/author/user_id', reimbursementAuthorRouter)

// Save (Create) Reimbursement
reimbursementRouter.post('/', authorizationMiddleware(['Admin', 'Finance Manager', 'User']), async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let {
        author,
        amount,
        date_submitted,
        description,
        type } = req.body
    if(author && amount && date_submitted && description && type) {
        let newReim: Reimbursement = {
            reimbursement_id: 0,
            author,
            amount,
            date_submitted,
            date_resolved: null,
            description,
            resolver: null,
            status: //automatically pending
            {
                status: 'Pending',
                statusId: 1
            },
            type
        }
        newReim.type = type || null
        try {
            let savedReim = await submitOneReimbursement(newReim)
            res.json(savedReim)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new UserInputError()
    }
})
// Update Reimbursement
reimbursementRouter.patch('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => {
    let { reimbursement_id,
        author,
        amount,
        date_submitted,
        date_resolved,
        description,
        resolver,
        status,
        type } = req.body
    if(!reimbursement_id) { 
        res.status(400).send('Please Fill Out All Fields')
    }
    else if(isNaN(+reimbursement_id)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        let updatedReimInfo:Reimbursement = { 
            reimbursement_id, 
            author,
            amount,
            date_submitted,
            date_resolved,
            description,
            resolver,
            status,
            type
        }
        updatedReimInfo.author = author || undefined
        updatedReimInfo.amount = amount || undefined
        updatedReimInfo.date_submitted = date_submitted || undefined
        updatedReimInfo.date_resolved = date_resolved || undefined
        updatedReimInfo.description = description || undefined
        updatedReimInfo.resolver = resolver || undefined
        updatedReimInfo.status = status || undefined
        updatedReimInfo.type = type || undefined
        try {
            let results = await updateOneReimbursement(updatedReimInfo)
            res.json(results)
        } catch (e) {
            next(e)
        }
    }
})