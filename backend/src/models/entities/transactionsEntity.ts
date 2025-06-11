import { Product } from "./productEntity.js";

type TransactionsProps = {
	amount: number;
	id: number;
	product: Product;
	reason?: string;
};

export class Transaction {
	private constructor(readonly props: TransactionsProps) {}
	public static create(
		id: number,
		amount: number,
		product: Product,
		reason?: string,
	) {
		if (reason) return new Transaction({ id, amount, product, reason });
		return new Transaction({ id, amount, product });
	}
	public get id() {
		return this.props.id;
	}
	public get amount() {
		return this.props.amount;
	}
	public get product() {
		return this.props.product;
	}
	public get reason() {
		if (this.props.reason) return this.props.reason;
		return new Error(
			"A transação {" + this.props.id + "} não possui razão!",
		);
	}
}
