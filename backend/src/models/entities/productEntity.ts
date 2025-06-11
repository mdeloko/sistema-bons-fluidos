type ProductProps = {
	id?: string;
	name: string;
	price: number;
	sku: string;
	categories?: string[];
	balance: number;
};

export class Product {
	private constructor(readonly props: ProductProps) {}

	public static create(
		name: string,
		price: number,
		sku: string,
		balance: number,
		categories?: string[],
	) {
		if (categories)
			return new Product({ name, price, sku, balance, categories });
		return new Product({ name, price, sku, balance });
	}

	public get id() {
		if (this.props.id) return this.props.id;
		return new Error("O produto {" + this.props.name + "} não possui id!");
	}
	public get name() {
		return this.props.name;
	}
	public get price() {
		return this.props.price;
	}
	public get sku() {
		return this.props.sku;
	}
	public get categories() {
		if (this.props.categories) return this.props.categories;
		return new Error(
			"O produto {" +
				this.props.name +
				"} não possui categorias associadas!",
		);
	}
	public get balance() {
		return this.props.balance;
	}

	public increaseProduct(amount: number) {
		this.props.balance += amount;
	}
	public decreaseProduct(amount: number) {
		if (amount > this.props.balance)
			return new Error(
				"A quantia solicitada para remoção de estoque é maior que a quantia em estoque!",
			);
        this.props.balance -= amount
	}
}
