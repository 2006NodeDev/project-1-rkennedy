import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";

export async function loginWithUsernamePassword(username:String, password:String){
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let result:QueryResult = await client.query(`select "user_id", "username", "password", "first_name", "last_name", "email", "role" from project0.users u left join  project0.roles r on u."role_id"=r."role_id" where u."username"='${username}' and u."password"='${password}';`)
        return result.rows
    }catch(e){
        console.log(e)
        throw new Error('un-implemented error handling')
    }finally{
        client && client.release()
    }
}