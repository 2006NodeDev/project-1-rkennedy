import { ProfileDTO } from "../dtos/profile-dto";
import { Profile } from "../models/Profile";

export function ProfileDTOtoProfileConverter(udto: ProfileDTO): Profile {
    return {
        profileId: udto.profile_id,
        ownerId: udto.owner_id,
        fullName: udto.full_name,
        relationship: {
            relationshipId: udto.relationship_id,
            relationship: udto.relationship
        },
        birthDate: udto.birth_date,
        birthLocation: udto.birth_location
    }
}