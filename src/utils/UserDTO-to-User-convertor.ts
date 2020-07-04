import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOtoUserConverter(udto: UserDTO): User {
    return {
        userid: udto.userid,
        username: udto.username,
        password: udto.password,
        firstname: udto.firstname,
        lastname: udto.lastname,
        email: udto.email,
        role: {
            role: udto.role,
            roleid: udto.roleid
        }
    }
}