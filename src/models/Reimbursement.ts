import { ReimbursementStatus } from "./ReimbursementStatus";
import { ReimbursementType } from "./ReimbursementTypes";

export class Reimbursement {
  reimbursementId: number //primary key
    author: number //foreign key -> user not null
    amount: number //not null
    dateSubmitted: Date //not null
    dateResolved: Date //allowed this to be null for Pending reimbursements
    description: string //not null
    resolver: number // foreign key -> User, allowed this to be null for Pending reimbursements
    status: ReimbursementStatus //foreign key -> ReimbursementStatus, not null
    type: ReimbursementType //foreign key -> ReimbursementType
}