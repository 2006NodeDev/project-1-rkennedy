import {loginRouter} from "./Routers/login-router"
import { userRouter } from "./Routers/user-router"
import { reimbursementRouter } from "./Routers/reimbursement-router"
import express from 'express'
import { sessionMiddleware } from "./middleware/session-middleware"



    const app = express()
    app.use(express.json())
    
    app.use(sessionMiddleware)
    app.use("/login", loginRouter)
    app.use("/users", userRouter)
    app.use("/reimbursements", reimbursementRouter)
    app.listen(2020, () => {
        console.log("Yay! Server has started!")
    })
