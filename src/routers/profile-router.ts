import express, { Request, Response, NextFunction } from 'express'
import { profileStatusRouter } from './profile-status-router'
import { profileAuthorRouter } from './profile-author-router'
import { Profile } from '../models/Profile'
import { submitOneProfile, updateOneProfile, getAllProfiles } from '../daos/profile-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { ProfileInputError } from '../errors/ProfileInputError'

export const profileRouter = express.Router()

profileRouter.use(authenticationMiddleware)
profileRouter.use('/status', profileStatusRouter)
profileRouter.use('/author/user_id', profileAuthorRouter)

//Get All profiles
profileRouter.get('/', authorizationMiddleware(['Admin']), async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allReims = await getAllProfiles()
        res.json(allReims)
    } catch (e) {
        next(e)
    }
})

//Submit profile
profileRouter.post('/', authorizationMiddleware(['Admin', 'User']), async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { 
        ownerId,
        fullName,
        relationship,
        birthDate,
        birthLocation} = req.body
    if(ownerId && fullName && relationship && birthDate && birthLocation) {
        let newProfile: Profile = {
            profileId: 0,
            ownerId,
            fullName,
            relationship,
            birthDate,
            birthLocation,
        }
        try {
            let savedProfile = await submitOneProfile(newProfile)
            res.json(savedProfile)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new ProfileInputError()
    }
})

//Update profile, we assume Admin has userId for each user
profileRouter.patch('/', authorizationMiddleware(['Admin']), async (req:Request, res:Response, next:NextFunction) => {
    let { profileId,
        ownerId,
        fullName,
        relationship,
        birthDate,
        birthLocation} = req.body
    if(!profileId) { //update request must contain a profileId
        res.status(400).send('Please enter a valid profile Id')
    }
    else if(isNaN(+profileId)) { //check if profileId is valid
        res.status(400).send('Id must be a number')
    }
    else { 
        let updatedOneProfile:Profile = { 
            profileId, 
            ownerId,
            fullName,
            relationship,
            birthDate,
            birthLocation
        }
        updatedOneProfile.ownerId = ownerId || undefined
        updatedOneProfile.fullName = fullName || undefined
        updatedOneProfile.relationship = relationship || undefined
        updatedOneProfile.birthDate = birthDate || undefined
        updatedOneProfile.birthLocation = birthLocation || undefined
        try {
            let results = await updateOneProfile(updatedOneProfile)
            res.json(results)
        } catch (e) {
            next(e)
        }
    }
})