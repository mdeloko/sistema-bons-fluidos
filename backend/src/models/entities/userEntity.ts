import { validatePassword } from "../../utils/validations.js";

type UserProps = {
	id?:number;
	name: string;
	email: string;
	ra: string;
	password: string;
	isAdmin: boolean;
};

export class User {
	private constructor(private readonly props: UserProps) {}
	public static create(
		name: string,
		email: string,
		ra: string,
		password: string,
		isAdmin: boolean,
		id?:number
	) {
		if (id && validatePassword(password))
			return new User({ name, email, ra, password, isAdmin, id });
		else if(validatePassword(password))
			return new User({ name, email, ra, password, isAdmin });
		throw new Error("Erro ao criar Entidade Usuário, senha fraca.");
	}
	public get name() {
		return this.props.name;
	}
	public get ra() {
		return this.props.ra;
	}
	public get password() {
		return this.props.password;
	}
	public get isAdmin() {
		return this.props.isAdmin;
	}
	public get email(){
		return this.props.email;
	}
	public get id(){
		return this.props.id;
	}
	/**
	 * Valida uma senha e atualiza caso passe.
	 * @param pw String de Senha a ser substituída e testada.
	 */
	public set password(pw: string) {
		if (validatePassword(pw)) {
			this.props.password = pw;
		} else
			throw new Error("Erro ao alterar senha de usuário: " + this.name);
	}
	public set name(name: string) {
		this.props.name = name;
	}
	public set ra(ra: string) {
		this.props.ra = ra;
	}
	public set email(email: string) {
		this.props.email = email;
	}
	public set isAdmin(isAdmin:boolean){
		this.props.isAdmin = isAdmin;	
	}
}
