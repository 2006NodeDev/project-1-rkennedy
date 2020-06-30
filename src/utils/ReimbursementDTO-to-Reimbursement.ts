import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConvertor(bto:ReimbursementDTO):Reimbursement{
    return{
        reimbursementId: bto.reimbursementId,
        author: bto.author,
        amount: bto.amount,
        dateSubmitted: bto.dateSubmitted.getFullYear(),
        dateResolved: bto.dateResolved.getFullYear(),
        description: bto.description,
        resolver: bto.resolver,
        status: bto.status,
        type: bto.type
    }
}