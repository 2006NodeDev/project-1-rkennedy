import express, {Request, Response} from 'express'
import {loginWithUsernamePassword} from '../daos/login-dao'

export const loginRouter  = express.Router()



loginRouter.post('/', async (req: Request, res: Response) => {

    let {username,
    password} = req.body
    if(!password || !username){
        res.status(400).send('Invalid Credentials')
    }
    else{
        try{
            let foundUser = await loginWithUsernamePassword(username, password)
            let [user] = foundUser
            req.session.user = user
            if(foundUser[0]){
                res.json(foundUser)
            }else{
                res.status(400).send('Invalid Credentials')
            }
                

        
        }catch(e){
            
        }

    }
    })


