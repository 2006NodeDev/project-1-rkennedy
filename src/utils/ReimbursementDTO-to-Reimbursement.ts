import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConvertor(bto:ReimbursementDTO):Reimbursement{
    return{
        reimbursementId: bto.reimbursementid,
        author: bto.author,
        amount: bto.amount,
        datesubmitted: new Date(bto.datesubmitted),
        dateresolved: new Date(bto.dateresolved),
        description: bto.description,
        resolver: bto.resolver,
        status: {
            status: bto.status,
            statusId: bto.statusid
        },
        type: {
            type: bto.type,
            typeId: bto.typeid
        }
    }
}
