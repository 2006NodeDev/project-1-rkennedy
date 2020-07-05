import express, { Request, Response, NextFunction } from 'express';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllUsers, getUserById, updateOneUser, saveOneUser } from '../daos/user-dao'
import { User } from '../models/User'
import { UserInputError } from "../errors/UserInputError";

export const userRouter = express.Router();

userRouter.use(authenticationMiddleware); // Authenticate User

// Get all Users
userRouter.get('/', authorizationMiddleware(['Admin', 'Finance']), async (req:Request, res:Response, next:NextFunction)=>{
    try{
        let allUsers = await getAllUsers()
        res.json(allUsers)
    } catch(e){
        next(e)
    }
})

// Get User by Id
userRouter.get('/:id', authorizationMiddleware (['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction)=>{
    let {id} = req.params
    if(isNaN(+id)){
        res.status(400).send('Id must be a number')
    } else {
        try {
            let user = await getUserById(+id)
            res.json(user)
            //res.json(userById)
        } catch (e) {
            next(e)
        }
    }
})

// Update User
userRouter.patch('/', authorizationMiddleware(['Admin']), async (req:Request, res:Response, next:NextFunction)=>{
    let { user_id,
        username,
        password,
        first_name,
        last_name,
        email,
        role } = req.body
    if(!user_id) { 
        res.status(400).send('Please enter a valid Id')
    }
    else if(isNaN(+user_id)) { 
        res.status(400).send('Id must be a number')
    }
    else {
        let updatedUser:User = {
            user_id,
            username,
            password,
            first_name,
            last_name,
            email,
            role
        }
        updatedUser.username = username || undefined
        updatedUser.password = password || undefined
        updatedUser.first_name = first_name || undefined
        updatedUser.last_name = last_name || undefined
        updatedUser.email = email || undefined
        updatedUser.role = role || undefined
        try {
            let result = await updateOneUser(updatedUser)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
}) 

// Save (Create) User
userRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { username,
        password,
        first_name,
        last_name,
        email,
        role } = req.body
    if(username && password && first_name && last_name && email && role) {
        let newUser: User = {
            user_id: 0,
            username,
            password,
            first_name,
            last_name,
            email,
            role
        }
        try {
            let savedUser = await saveOneUser(newUser)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
    else {
        next(new UserInputError)
    }
})