import {Relationship} from "./Relationship";

export class Profile {
    profileId: number //primary key
    ownerId: number //foreign key -> user not null
    fullName: String //not null
    relationship: Relationship //not null
    birthDate: Date //not null
    birthLocation: String //not null
}