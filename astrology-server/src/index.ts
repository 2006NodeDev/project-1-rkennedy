
import express, { Request, Response, NextFunction } from "express"
import { userRouter } from "./routers/user-router"
import { User } from "./models/User"

import { InvalidCredentials } from "./errors/Invalid-Credentials"
import { UserSignUpError } from "./errors/User-Sign-Up-Error"
import { NoUserLoggedInError } from "./errors/No-User-Logged-In-Error"

import { loggingMiddleware } from "./middleware/logging-middleware"
import { sessionMiddleware } from "./middleware/session-middleware"
import { corsFilter } from "./middleware/cors-filter"
import { saveNewUserService, getUserByUserNameAndPasswordService } from "./services/user-service"

const app = express() //our application from express

app.use(express.json({limit:'50mb'})) 
//need to increase max size of body we can parse, in order to allow for images

app.use(loggingMiddleware)

app.use(corsFilter)

app.use(sessionMiddleware)

app.use("/users", userRouter)

//Save a new user (here to avoid authentification)
app.post("/register", async (req:Request, res:Response, next:NextFunction)=>{    
    let {username, password, firstName, lastName, email, image} = req.body 

    if (!username || !password ){
        next(new UserSignUpError)
    } else {
        let newUser: User = {
            userId:0,
            username,
            password,
            firstName,
            lastName,
            email,
            role: 'user',
            image
        }
        newUser.firstName = firstName || null
        newUser.lastName = lastName || null
        newUser.email = email || null 
        newUser.image = image || null 

        try {
            let savedUser = await saveNewUserService(newUser) //using service function instead of DAO
            req.session.user = savedUser //set session user to current, new user
            res.json(savedUser) 
        } catch(e) {
            next(e)
        }
    }
})

//login
app.post("/login", async (req: Request, res: Response, next: NextFunction)=>{
    let {username, password} =  req.body

    if (!username || !password){
        next(new InvalidCredentials())
    } else {
       try {
            let user =await getUserByUserNameAndPasswordService(username, password)
            req.session.user = user
            res.json(user)
       } catch(e) {
           next(e)
       }
    }
})

//logout
app.delete("/logout", async (req: Request, res: Response, next: NextFunction)=>{
    if (!req.session.user) {
        next(new NoUserLoggedInError())
    } else {
        try {
            req.session.user = null
            res.json(req.session.user)
        } catch(e) {
            next(e)
        }
    }
})

//error handler we wrote that express redirects top level errors to
app.use((err, req, res, next) => {  
    if (err.statusCode) { 
        console.log(err);
        res.status(err.statusCode).send(err.message)
    } else { //if it wasn't one of our custom errors, send generic response
        console.log(err); 
        res.status(500).send("Oops, something went wrong")
    }
})

app.listen(2020, () => { //start server on port 2020er
    console.log("Server has started");
})