import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";

export async function loginWithUsernamePassword(username:String, password:String){
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let result:QueryResult = await client.query(`select "userid", "username", "password", "firstname", "lastname", "email", r."role" from fluffers_reimbursement."User" u left join fluffers_reimbursement."Role" r on u."role"=r.roleId where u.username='${username}' and u."password"='${password}';`)
        return result.rows
    }catch(e){
        console.log(e)
        throw new Error('un-implemented error handling')
    }finally{
        client && client.release()
    }
}