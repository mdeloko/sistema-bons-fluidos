type UserProps = {
	id?: string;
	name: string;
	ra: string;
	password: string;
};

export class User {
	private constructor(readonly props: UserProps) {}

	public static create(
		name: string,
		ra: string,
		password: string,
		id?: string,
	) {
		if (id) return new User({ name, ra, password, id });
		return new User({ name, ra, password });
	}
	public get id() {
		if (this.props.id) return this.props.id;
		return new Error("Este User {" + this.props.name + "} não possui id!");
	}
    public get name(){
        return this.props.name
    }
    public get ra(){
        return this.props.ra
    }
    public get password(){
        return this.props.password
    }
    
}
