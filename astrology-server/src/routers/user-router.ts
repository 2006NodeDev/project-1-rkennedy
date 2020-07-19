import express, { Request, Response, NextFunction } from 'express';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllUsers, getUserById, updateOneUser, saveOneUser } from '../daos/user-dao'
import { User } from '../models/user'
import { UserInputError } from "../errors/UserInputError";
import { getAllUsersService, getUserByIDService, saveOneUserService } from '../services/user-service';

export const userRouter = express.Router();

userRouter.use(authenticationMiddleware); // Authenticate User

//Create a User(s)
userRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(username && password && firstName && lastName && email && role) {
        let newUser: User = {
            userId: 0,
            username,
            password,
            firstName,
            lastName,
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

//Find Users by Id
userRouter.get('/:id', authorizationMiddleware(['Admin', 'Finance Manager', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let {id} = req.params
    if(isNaN(+id)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        try {
            let userById = await getUserById(+id)
            res.json(userById)
        } catch (e) {
            next(e)
        }
    }
})

//Find all Users 
userRouter.get('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allUsers = await getAllUsers()
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//Update User
userRouter.patch('/', authorizationMiddleware(['Admin']), async (req:Request, res:Response, next:NextFunction) => {
    let { userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(!userId) { //update request must contain a userId
        res.status(400).send('Please enter a valid user Id')
    }
    else if(isNaN(+userId)) { //check if userId is valid
        res.status(400).send('Id must be a number')
    }
    else {
        let updatedOneUser:User = {
            userId,
            username,
            password,
            firstName,
            lastName,
            email,
            role
        }
        updatedOneUser.username = username || undefined
        updatedOneUser.password = password || undefined
        updatedOneUser.firstName = firstName || undefined
        updatedOneUser.lastName = lastName || undefined
        updatedOneUser.email = email || undefined
        updatedOneUser.role = role || undefined
        try {
            let result = await updateOneUser(updatedOneUser)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
}) 

// Get all
userRouter.get('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    //this function needs to get all the user data - outside its scope 
    // we should call a function that gets us the user data
    //if we get it successfully, we want to return it using res.json
    //if we get an error we want to pass that error to the error handler with next(err)
    // interacting with the database is asynchronous, which means the getAllUser function returns a promise
    // can this function execute with only a promise?
    try {
        //lets try not being async and see what happens
        let allUsers = await getAllUsersService()//thinking in abstraction
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//get by id
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        // send a response telling them they need to give us a number
        res.status(400).send('Id needs to be a number')// the error way is better because it scales easier, fewer places you have to change code if you want to refactor
    } else {
        try {
            let user = await getUserByIDService(+id)
            res.json(user)
        } catch (e) {
            next(e)
        }
    }
})

//save new
userRouter.post('/',  async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { username, password, firstName, lastName, email, role, image } = req.body//a little old fashioned destructuring
    //verify that input
    if (!username || !password || !role) {
        next(new UserInputError)
    } else {
        //try  with a function call to the dao layer to try and save the user
        let newUser: User = {
            username,
            password,
            firstName,
            lastName,
            role,
            userId: 0,
            email,
            image,
        }
        newUser.email = email || null
        try {
            let savedUser = await saveOneUserService(newUser)
            res.json(savedUser)// needs to have the updated userId
        } catch (e) {
            next(e)
        }
    }




    //catch with next(e)


})




//patch user

//delete user