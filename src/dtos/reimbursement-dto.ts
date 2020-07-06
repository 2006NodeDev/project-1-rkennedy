export class ReimbursementDTO {
  reimbursement_id: number
    author: number
    amount: number
    date_submitted: Date
    date_resolved: Date
    description: string
    resolver: number
    status: string
    status_id: number
    type: string
    type_id: number
}