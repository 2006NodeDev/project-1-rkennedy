import { User } from "../models/User";
import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConverter } from "../utils/UserDTO-to-User-convertor";
import { UserInputError } from "../errors/UserInputError";
import { AuthenticationError } from "../errors/AuthenticationError";
import { UserNotFoundError } from "../errors/UserNotFoundError";

// Find all Users
export async function getAllUsers():Promise<User[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                            u."username", 
                                            u."password", 
                                            u."first_name", 
                                            u."last_name", 
                                            u."email", 
                                            r."role_id", 
                                            r."role" from fluffers_reimbursement.users u
                                            left join fluffers_reimbursement.roles r 
                                            on u."role" = r."role_id"
                                            order by u.user_id;`)
        return results.rows.map(UserDTOtoUserConverter)
    } catch (e) {
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Create a User(s)
export async function saveOneUser(newUser:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" 
                                        from fluffers_reimbursement.roles r 
                                        where r."role" = $1`,
                                        [newUser.role])
        if(roleId.rowCount === 0) {
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into fluffers_reimbursement.users 
                                        ("username", "password", 
                                            "first_name", "last_name", 
                                            "email", "role")
                                        values($1,$2,$3,$4,$5,$6) 
                                        returning "user_id"`,
                                        [newUser.username, newUser.password, 
                                            newUser.firstName, newUser.lastName, 
                                            newUser.email, roleId])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// User login
export async function loginByUsernameAndPassword(username:string, password:string):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                            u."username", 
                                            u."password", 
                                            u."first_name", 
                                            u."last_name", 
                                            u."email", 
                                            r."role_id", 
                                            r."role" from fluffers_reimbursement.users u
                                        left join fluffers_reimbursement.roles r 
                                        on u."role" = r."role_id"
                                        where u."username" = $1 
                                            and u."password" = $2;`,
                                        [username, password])
        if(results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConverter(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found') {
            throw new AuthenticationError()
        }
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Find User by Id
export async function getUserById(id:number):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                                 u."username", 
                                                 u."password", 
                                                 u."first_name",
                                                 u."last_name",
                                                 u."email",
                                                 r."role_id", 
                                                 r."role" 
                                              from fluffers_reimbursement.users u 
                                            left join fluffers_reimbursement.roles r 
                                              on u."role" = r."role_id" 
                                                where u."user_id" = $1;`, [id])
        if(results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConverter(results.rows[0]) //should only be one row with the user corresponding to ID
    } catch (e) {
        if(e.message === 'User Not Found') {
            throw new UserNotFoundError()
        }
        //For errors we don't recognize
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Update User(s)
export async function updateOneUser(updatedOneUser:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedOneUser.username) {
            await client.query(`update fluffers_reimbursement.users set "username" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedOneUser.username, updatedOneUser.userId])
        }
        if(updatedOneUser.password) {
            await client.query(`update fluffers_reimbursement.users set "password" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedOneUser.password, updatedOneUser.userId])
        }
        if(updatedOneUser.firstName) {
            await client.query(`update fluffers_reimbursement.users set "first_name" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedOneUser.firstName, updatedOneUser.userId])
        }
        if(updatedOneUser.lastName) {
            await client.query(`update fluffers_reimbursement.users set "last_name" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedOneUser.lastName, updatedOneUser.userId])
        }
        if(updatedOneUser.email) {
            await client.query(`update fluffers_reimbursement.users set "email" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedOneUser.email, updatedOneUser.userId])
        }
        if(updatedOneUser.role) {
            let roleId = await client.query(`select r."role_id" from fluffers_reimbursement.roles r 
                                        where r."role" = $1`,
                                        [updatedOneUser.role])
            if(roleId.rowCount === 0) {
                throw new Error('Role Not Found')
            }
            roleId = roleId.rows[0].role_id
            await client.query(`update fluffers_reimbursement.users set "role" = $1 
                                    where "user_id" = $2;`, 
                                    [roleId, updatedOneUser.userId])
        }

        await client.query('COMMIT;')
        return updatedOneUser
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}