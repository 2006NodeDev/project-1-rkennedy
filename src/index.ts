import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router'
import { loggingMiddleware } from './middleware/logging-middleware'
import { sessionMiddleware } from './middleware/session-middleware'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'
import { getByUsernameAndPassword } from './daos/user-dao';
const app = express()
app.use(express.json())
app.use(loggingMiddleware)
app.use(sessionMiddleware)
app.use('/users', userRouter)
app.use('/reimbursements', reimbursementRouter)
// Login
app.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
    let username = req.body.username
    let password = req.body.password
    if(!username || !password){
        throw new InvalidCredentialsError()
    } else {
        try{
            let user = await getByUsernameAndPassword(username, password)
            req.session.user = user
            res.json(user)
        }catch(e){
            next(e)
        }
    }
})
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
  } else {
    console.log(err); 
    res.status(500).send("Oops, Something went wrong");
  }
})
app.listen(4200, () => {
    console.log("Server Is Running");
})