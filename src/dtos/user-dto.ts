import { Role } from "../models/Role"

export class UserDTO {
    userId:number
    username:string
    password:string
    firstName:string
    lastName:string
    email:string
    role:Role
}