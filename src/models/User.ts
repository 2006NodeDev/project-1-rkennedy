import { Role } from './Role'

export class User{
    user_id: number; // primary key
      username: string; // not null, unique
      password: string; // not null
      first_name: string; // not null
      last_name: string; // not null
      email: string; // not null
      role: Role; // not null
}