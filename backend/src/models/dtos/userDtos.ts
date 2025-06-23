export type CreateUserDTO = {
	name: string;
	ra: string;
	email: string;
	password: string;
	isAdmin:boolean;
};
export type UpdateUserNameDTO = {
	ra: string;
	name: string;
};
export type UpdateUserPasswordDTO = {
	ra: string;
	password: string;
};
export type UpdateUserEmailDTO = {
	ra: string;
	newEmail: string;
};

export type UpdateUserRaDTO = {
	email: string;
	newRa:string;
}

export type DeleteUserDTO = {
	ra?: string;
	email?: string;
};

export type SafeUserDTO = {
    name: string;
    ra: string;
    email: string;
	isAdmin:boolean;
}

export type FullUserDTO = {
	id:number;
	name: string;
	ra: string;
	email: string;
	password: string;
	isAdmin:boolean;
};

export type SearchUserEMailDTO = {
	email:string
}

export type SearchUserRaDTO = {
	ra: string;
};

export type GeneralUserUpdateDTO = {
	field: string;
	valueToUpdateTo: string;
};

export type LoginDTO =  {
	ra:string;
	password:string;
}

export type isAdmin = {
	userId:number
}
