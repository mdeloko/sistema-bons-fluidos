import { validatePassword } from "../../utils/validations.js";
import {
	CreateUserDTO,
	SafeUserDTO,
	SearchUserEMailDTO,
	SearchUserRaDTO,
	UpdateUserEmailDTO,
	UpdateUserNameDTO,
    UpdateUserPasswordDTO,
    UpdateUserRaDTO,
} from "../dtos/userDtos.js";
import { User } from "../entities/userEntity.js";
import { UserRepository } from "../repositories/userRepository.js";
import { hash } from "bcrypt";

export class UserService {
	constructor(private repository: UserRepository) {}

	public async create(user: CreateUserDTO): Promise<SafeUserDTO | null> {
		if (!validatePassword(user.password)) {
			throw new Error(
				`Senha muito curta para usuário: ${user.name} - ${user.ra}`,
			);
		}
		if (
			(await this.repository.searchByEmail(user.email)) ||
			(await this.repository.searchByRa(user.ra))
		) {
			return null;
		}
		const hashedPw = await hash(user.password, 10);
		const userEnt = await User.create(
			user.name,
			user.email,
			user.ra,
			hashedPw,
			user.isAdmin,
		);
		if (await this.repository.create(userEnt)) {
			const safeUser: SafeUserDTO = {
				name: userEnt.name,
				email: userEnt.email,
				isAdmin: userEnt.isAdmin,
				ra: userEnt.ra,
			};
			return safeUser;
		}
		return null;
	}

	public async updateEmail(
		userToUpdate: UpdateUserEmailDTO,
	): Promise<SafeUserDTO | null> {
		const user = await this.repository.searchByRa(userToUpdate.ra);
		if (user) {
			user.email = userToUpdate.newEmail;
			if (await this.repository.updateEmail(user)) {
				const userDto: SafeUserDTO = {
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					ra: user.ra,
				};
				return userDto;
			}
		}
		return null;
	}

	public async updateName(userToUpdate: UpdateUserNameDTO) {
		const user = await this.repository.searchByRa(userToUpdate.ra);
		if (user) {
			user.name = userToUpdate.name;
			if (await this.repository.updateName(user)) {
				const userDto: SafeUserDTO = {
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					ra: user.ra,
				};
				return userDto;
			}
		}
	}

	public async updatePassword(
		userToUpdate: UpdateUserPasswordDTO,
	): Promise<SafeUserDTO | null> {
		const user = await this.repository.searchByRa(userToUpdate.ra);
		if (user) {
			user.password = userToUpdate.password;
			if (await this.repository.updatePassword(user)) {
				const userDto: SafeUserDTO = {
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					ra: user.ra,
				};
				return userDto;
			}
		}
		return null;
	}

	public async updateRa(
		userToUpdate: UpdateUserRaDTO,
	): Promise<SafeUserDTO | null> {
		const user = await this.repository.searchByEmail(userToUpdate.email);
		if (user) {
			user.ra = userToUpdate.newRa;
			if (await this.repository.updateRa(user)) {
				const userDto: SafeUserDTO = {
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					ra: user.ra,
				};
				return userDto;
			}
		}
		return null;
	}

	public async searchEmail(userToSearch: SearchUserEMailDTO) {
		const user = await this.repository.searchByEmail(userToSearch.email);
		if (user) {
			const userDto: SafeUserDTO = {
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				ra: user.ra,
			};
			return userDto;
		}
		return null;
	}

	public async searchRa(userToSearch: SearchUserRaDTO) {
		const user = await this.repository.searchByRa(userToSearch.ra);
		if (user) {
			const userDto: SafeUserDTO = {
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				ra: user.ra,
			};
			return userDto;
		}
		return null;
	}
}
