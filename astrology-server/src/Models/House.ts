import { Sign } from "./Sign"

export class House {
    houseId: number//primary key
    asc: Sign //not null
    ic: Sign //not null
    dsc: Sign //not null
    mc: Sign //not null
}