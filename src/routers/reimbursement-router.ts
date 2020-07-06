import express, { Request, Response, NextFunction } from 'express'
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursement-author-router'
import { Reimbursement } from '../models/Reimbursement'
import { submitOneReimbursement, updateOneReimbursement, getAllReimbursements } from '../daos/reimbursement-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { UserInputError } from '../errors/UserInputError'

export const reimbursementRouter = express.Router()

reimbursementRouter.use(authenticationMiddleware)
reimbursementRouter.use('/status', reimbursementStatusRouter)
reimbursementRouter.use('/author/user_id', reimbursementAuthorRouter)

//Get All Reimbursements
reimbursementRouter.get('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allReims = await getAllReimbursements()
        res.json(allReims)
    } catch (e) {
        next(e)
    }
})

//Submit Reimbursement
reimbursementRouter.post('/', authorizationMiddleware(['Admin', 'Finance Manager', 'User']), async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { 
        author,
        amount,
        dateSubmitted,
        description,
        type } = req.body
    if(author && amount && dateSubmitted && description && type) {
        let newReimbursement: Reimbursement = {
            reimbursementId: 0,
            author,
            amount,
            dateSubmitted,
            dateResolved: null,
            description,
            resolver: null,
            status: //status is automatically 1:"Pending"
                {
                    status: 'Pending',
                    statusId: 1
                },
            type
        }
        newReimbursement.type = type || null
        try {
            let savedReimbursement = await submitOneReimbursement(newReimbursement)
            res.json(savedReimbursement)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new UserInputError()
    }
})

//Update Reimbursement, we assume Admin and Finance Manager have userId for each user
reimbursementRouter.patch('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => {
    let { reimbursementId,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type } = req.body
    if(!reimbursementId) { //update request must contain a reimbursementId
        res.status(400).send('Please enter a valid reimbursement Id')
    }
    else if(isNaN(+reimbursementId)) { //check if reimbursementId is valid
        res.status(400).send('Id must be a number')
    }
    else { 
        let updatedOneReimbursement:Reimbursement = { 
            reimbursementId, 
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type
        }
        updatedOneReimbursement.author = author || undefined
        updatedOneReimbursement.amount = amount || undefined
        updatedOneReimbursement.dateSubmitted = dateSubmitted || undefined
        updatedOneReimbursement.dateResolved = dateResolved || undefined
        updatedOneReimbursement.description = description || undefined
        updatedOneReimbursement.resolver = resolver || undefined
        updatedOneReimbursement.status = status || undefined
        updatedOneReimbursement.type = type || undefined
        try {
            let results = await updateOneReimbursement(updatedOneReimbursement)
            res.json(results)
        } catch (e) {
            next(e)
        }
    }
})