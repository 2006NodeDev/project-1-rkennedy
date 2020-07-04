import express, { Request, Response, NextFunction } from 'express'
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursement-author-router'
import { Reimbursement } from '../models/Reimbursement'
import { saveOneReimbursement, updatereimbursement } from '../daos/reimbursement-dao'
import { ReimbursementIdInputError } from '../errors/ReimbursementInputError'
//import { authorizationMiddleware } from '../middleware/authorization-middleware'
export const reimbursementRouter = express.Router()
reimbursementRouter.use('/status', reimbursementStatusRouter)
reimbursementRouter.use('/author/userid', reimbursementAuthorRouter)
// Save (Create) Reimbursement
reimbursementRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let {
        author,
        amount,
        datesubmitted,
        description,
        status,
        type } = req.body
    if(author && amount && datesubmitted && description && status && type) {
        let newReim: Reimbursement = {
            reimbursementId: 0,
            author,
            amount,
            datesubmitted,
            dateresolved: null,
            description,
            resolver: null,
            status,
            type
        }
        newReim.type = type || null
        try {
            let savedReim = await saveOneReimbursement(newReim)
            res.json(savedReim)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new ReimbursementIdInputError()
    }
})
// Update Reimbursement
reimbursementRouter.patch('/', async (req:Request, res:Response, next:NextFunction) => {
    let { reimbursementId,
        author,
        amount,
        datesubmitted,
        dateresolved,
        description,
        resolver,
        status,
        type } = req.body
    if(!reimbursementId) { 
        res.status(400).send('Please Fill Out All Fields')
    }
    else if(isNaN(+reimbursementId)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        let updatedReimInfo:Reimbursement = { 
            reimbursementId, 
            author,
            amount,
            datesubmitted,
            dateresolved,
            description,
            resolver,
            status,
            type
        }
        updatedReimInfo.author = author || undefined
        updatedReimInfo.amount = amount || undefined
        updatedReimInfo.datesubmitted = datesubmitted || undefined
        updatedReimInfo.dateresolved = dateresolved || undefined
        updatedReimInfo.description = description || undefined
        updatedReimInfo.resolver = resolver || undefined
        updatedReimInfo.status = status || undefined
        updatedReimInfo.type = type || undefined
        try {
            let results = await updatereimbursement(updatedReimInfo)
            res.json(results)
        } catch (e) {
            next(e)
        }
    }
})