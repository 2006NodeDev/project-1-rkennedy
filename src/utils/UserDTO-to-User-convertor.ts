import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOtoUserConvertor( udto:UserDTO):User{
    return {
        userId:udto.userId,
        username: udto.username,
        password: udto.password,
        firstName: udto.firstName,
        lastName: udto.lastName,
        email: udto.email,
        role: udto.role
    }
}