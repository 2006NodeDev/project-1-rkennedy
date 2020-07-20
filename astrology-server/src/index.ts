import express, { Request, Response, NextFunction } from 'express'
import { sessionMiddleware } from './middleware/session-middleware'
import { userRouter } from './routers/user-router'
import { profileRouter } from './routers/profile-router'
import { loginByUsernameAndPassword } from './daos/user-dao'
import { AuthenticationError } from './errors/AuthenticationError'
import { loggingMiddleware } from './middleware/logging-middleware'
import { corsFilter } from './middleware/cors-filter'

const app = express() //Creates complete express application
app.use(express.json()) //Matches every HTTP verb, middleware
app.use(corsFilter)
app.use(loggingMiddleware) //Logs out request method, ip address making request, and path of request
app.use(sessionMiddleware) //Attaches a session object to the request where each unique connection to the server has a unique session
app.use('/users', userRouter) //Redirect all requests on /users to user-router
app.use('/profile', profileRouter) //Redirect all requests on /reimbursements to reimbursement-router

// Login 
app.post('/login', async (req:Request, res:Response, next:NextFunction) => {
    let username = req.body.username
    let password = req.body.password

    if(!username || !password) {
        throw new AuthenticationError();
    }
    else { 
        try {
            let user = await loginByUsernameAndPassword(username, password)
            req.session.user = user
            res.json(user)
        } catch (e) {
            next(e)
        }
    }
})

// Error Handling
app.use((err, req, res, next) => {
    if(err.statusCode) { //if it's one of my custom HTTP errors
        res.status(err.statusCode).send(err.message) //send custom error
    }
    else { //not ready for this specific error, debug whatever comes out here
        console.log(err);
        res.status(500).send('Oops, something went wrong')
    }
})


//Set port for sending/receiving requests
app.listen(2020, () => {
    console.log('Server Is Running');
})