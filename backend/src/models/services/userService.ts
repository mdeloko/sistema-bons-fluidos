
import { validatePassword } from "../../utils/validations.js";
import { CreateUserDTO, SafeUserDTO, UpdateUserEmailDTO } from "../dtos/userDtos.js";
import { User } from "../entities/userEntity.js";
import { UserRepository } from "../repositories/userRepository.js";
import {hash} from "bcrypt"

export class UserService {
	constructor(private repository: UserRepository) {
    }
	public async create(
		user: CreateUserDTO,
	): Promise<SafeUserDTO | null> {
		if (validatePassword(user.password)) {
			throw new Error(
				`Senha muito curta para usuário: ${user.name} - ${user.ra}`,
			);
		}
		if (await this.repository.searchByEmail(user.email)) {
			return null;
		}
        const hashedPw = await hash(user.password,10);
        const newUser = await User.create(user.name,user.email,user.ra,hashedPw,false);
        return await this.repository.create(newUser);
	}
    public async updateEmail(userToUpdate:UpdateUserEmailDTO){
        const toConsult = userToUpdate.ra? 'ra': 'email'
        const id =  userToUpdate.oldEmail || userToUpdate.ra;
        if(toConsult == 'ra' && id){
            const user = await this.repository.searchByRa(id) as User;
            if(user){
                user.email = userToUpdate.newEmail;
                return await this.repository.updateEmail()
            }
        }
    }
}