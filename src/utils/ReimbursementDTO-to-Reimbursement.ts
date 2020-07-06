import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConverter(bto:ReimbursementDTO):Reimbursement{
    return{
        reimbursementId: bto.reimbursement_id,
        author: bto.author,
        amount: bto.amount,
        dateSubmitted: new Date(bto.date_submitted),
        dateResolved: new Date(bto.date_resolved),
        description: bto.description,
        resolver: bto.resolver,
        status: {
            status: bto.status,
            statusId: bto.status_id
        },
        type: {
            type: bto.type,
            typeId: bto.type_id
        }
    }
}
