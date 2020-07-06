import { Reimbursement } from "../models/Reimbursement";
import { PoolClient } from "pg";
import { connectionPool } from ".";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { ReimbursementUserInputError } from "../errors/ReimbursementUserInputError"
// Get all Reimbursements
export async function getAllReimbursements():Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted", 
                                                r."date_resolved", 
                                                r."description", 
                                                r."resolver", 
                                                rs."status",
                                                rs."status_id",
                                                rt."type",
                                                rt."type_id" from fluffers_reimbursement.reimbursements r
                                            left join fluffers_reimbursement.reimbursement_statuses rs
                                                on r."status" = rs."status_id"
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                            order by r.date_submitted;`)
        return results.rows.map(ReimbursementDTOtoReimbursementConverter)
    } catch (e) {
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

// Find Reimbursement(s) by Status
export async function getReimbursementByStatus(status:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description",
                                                r."resolver",
                                                rs."status_id", 
                                                rs."status",
                                                rt."type_id",
                                                rt."type"
                                                    from fluffers_reimbursement.reimbursements r 
                                            left join fluffers_reimbursement.reimbursement_statuses rs
                                                on r."status" = rs."status_id" 
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                                    where r."status" = $1
                                            order by r.date_submitted;`, [status])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Find Reimbursement(s) by User
export async function getReimbursementByUserId(userId:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description", r."resolver",
                                                rs."status_id", rs."status",
                                                rt."type_id", rt."type"
                                            from fluffers_reimbursement.reimbursements r 
                                            left join fluffers_reimbursement.reimbursement_statuses rs
                                                on r."status" = rs."status_id" 
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                            left join fluffers_reimbursement.users u 
                                                on r."author" = u."user_id"
                                                    where u."user_id" = $1
                                            order by r.date_submitted;`, [userId])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Submit a Reimbursement
export async function submitOneReimbursement(newReimbursement:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select t."type_id" from fluffers_reimbursement.reimbursement_types t 
                                            where t."type" = $1;`,
                                        [newReimbursement.type])
        if(typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id 
        
        let results = await client.query(`insert into fluffers_reimbursement.reimbursements ("author", "amount", 
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "reimbursement_id";`,
                                        [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted,
                                            newReimbursement.description, newReimbursement.status.statusId, typeId]) 
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        
        await client.query('COMMIT;')
        return newReimbursement
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new ReimbursementUserInputError()
        } 
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Update a Reimbursement
export async function updateOneReimbursement(updatedOneReimbursement:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedOneReimbursement.author) {
            await client.query(`update fluffers_reimbursement.reimbursements set "author" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.author, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.amount) {
            await client.query(`update fluffers_reimbursement.reimbursements set "amount" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.amount, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.dateSubmitted) {
            await client.query(`update fluffers_reimbursement.reimbursements set "date_submitted" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.dateSubmitted, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.dateResolved) {
            await client.query(`update fluffers_reimbursement.reimbursements set "date_resolved" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.dateResolved, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.description) {
            await client.query(`update fluffers_reimbursement.reimbursements set "description" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.description, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.resolver) {
            await client.query(`update fluffers_reimbursement.reimbursements set "resolver" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.resolver, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.status) {
            let statusId = await client.query(`select rs."status_id" from fluffers_reimbursement.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [updatedOneReimbursement.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].status_id
            await client.query(`update fluffers_reimbursement.reimbursements set "status" = $1 
                                where "reimbursement_id" = $2;`, 
                                [statusId, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.type) {
            let typeId = await client.query(`select rt."type_id" from fluffers_reimbursement.reimbursement_types rt 
                                            where rt."type" = $1;`, [updatedOneReimbursement.type])
            if(typeId.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            typeId = typeId.rows[0].type_id
            await client.query(`update fluffers_reimbursement.reimbursements set "type" = $1 
                                where "reimbursement_id" = $2;`, 
                                [typeId, updatedOneReimbursement.reimbursementId])
        }

        await client.query('COMMIT;')
        return updatedOneReimbursement
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new ReimbursementUserInputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}