import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOtoUserConverter(udto: UserDTO): User {
    return {
        user_id: udto.user_id,
        username: udto.username,
        password: udto.password,
        first_name: udto.first_name,
        last_name: udto.last_name,
        email: udto.email,
        role: {
            role: udto.role,
            role_id: udto.role_id
        }
    }
}