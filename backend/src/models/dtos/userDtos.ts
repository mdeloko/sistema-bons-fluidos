export type CreateUserDTO = {
	name: string;
	ra: string;
	email: string;
	password: string;
};
export type UpdateUserNameDTO = {
	ra?: string;
	email?: string;
	name: string;
};
export type UpdateUserPasswordDTO = {
	ra?: string;
	email?: string;
	password: string;
};
export type UpdateUserEmailDTO = {
	ra?: string;
	oldEmail?: string;
	newEmail: string;
};

export type DeleteUserDTO = {
	ra?: string;
	email?: string;
};

export type SafeUserDTO = {
    name: string;
    ra: string;
    email: string;
}

export type FullUserDTO = {
	name: string;
	ra: string;
	email: string;
	password: string;
};
