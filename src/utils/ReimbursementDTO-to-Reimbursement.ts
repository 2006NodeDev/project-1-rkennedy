import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConverter(bto:ReimbursementDTO):Reimbursement{
    return{
        reimbursement_id: bto.reimbursement_id,
        author: bto.author,
        amount: bto.amount,
        date_submitted: new Date(bto.date_submitted),
        date_resolved: new Date(bto.date_resolved),
        description: bto.description,
        resolver: bto.resolver,
        status: {
            status: bto.status,
            statusId: bto.statusid
        },
        type: {
            type: bto.type,
            type_id: bto.type_id
        }
    }
}
