import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOtoUserConvertor( udto:UserDTO):User{
    return {
        userid:udto.userid,
        username: udto.username,
        password: udto.password,
        firstName: udto.firstName,
        lastName: udto.lastName,
        email: udto.email,
        role: udto.role
    }
}