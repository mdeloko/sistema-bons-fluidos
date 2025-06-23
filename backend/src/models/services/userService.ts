import { validatePassword,SECRET } from "../../utils/validations.js";
import {
	CreateUserDTO,
	FullUserDTO,
	isAdmin,
	LoginDTO,
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
import { hash,compare} from "bcrypt";
import jwt from "jsonwebtoken";

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

	public async manageLogin(
		userToSearch: LoginDTO,
	): Promise<{ role: string; token: string } | null | undefined> {
		const fullUser = await this.repository.searchByRa(userToSearch.ra);
		if (fullUser) {
			const userDto: FullUserDTO = {
				id: fullUser.id as number,
				name: fullUser.name,
				email: fullUser.email,
				password: fullUser.password,
				isAdmin: fullUser.isAdmin,
				ra: fullUser.ra,
			};
			if (await compare(userToSearch.password, fullUser.password)) {
				const role = userDto.isAdmin ? "admin" : "user";
				return {
					role,
					token: jwt.sign({ userId: userDto.id }, SECRET, {
						expiresIn: "4h",
					}),
				};
			} else return null;
		}
		return undefined;
	}

	public async listAllUsers(adminUser: isAdmin) {
		const user = await this.repository.searchById(adminUser.userId);
		if (user?.isAdmin) {
			const users = await this.repository.listUsers();
			return users;
		}
		return [];
	}

	public async deleteUser(userToDelete: { ra?: string; email?: string }) {
		if (userToDelete.ra) {
			const user = await this.repository.searchByRa(userToDelete.ra);
			if (user) {
				return await this.repository.delete(user);
			}
		} else if (userToDelete.email) {
			const user = await this.repository.searchByEmail(
				userToDelete.email,
			);
			if (user) {
				return await this.repository.delete(user);
			}
		}
		return null;
	}
}
