/**
 * Define as propriedades de um produto.
 * 'id', 'description' e 'category' são opcionais.
 */
type ProductProps = {
    id?: string;
    name: string;
    description?: string;
    price: number;
    sku: string;
    quantity: number; // <<-- RENOMEADO: 'quantidade' agora é 'quantity'
    category?: string;
};

/**
 * Representa a entidade de um Produto, encapsulando dados e lógica de negócio.
 */
export class Product {
    private constructor(private props: ProductProps) {
        if (props.price < 0) {
            throw new Error("O preço do produto não pode ser negativo.");
        }
        if (props.quantity < 0) { // <<-- RENOMEADO
            throw new Error("A quantidade inicial do produto não pode ser negativa.");
        }
    }

    /**
     * Cria uma nova instância de Product.
     * Usado para novos produtos que ainda não possuem um ID persistido.
     */
    public static create(
        name: string,
        price: number,
        sku: string,
        quantity: number, // <<-- RENOMEADO
        description?: string,
        category?: string,
    ): Product {
        return new Product({ name, price, sku, quantity, description, category });
    }

    /**
     * Reconstitui uma instância de Product a partir de dados existentes (e.g., vindos do banco de dados).
     * Exige que o produto existente já tenha um ID.
     */
    public static fromExisting(props: ProductProps): Product {
        if (!props.id) {
            throw new Error("Produto existente deve ter um ID.");
        }
        return new Product(props);
    }

    // --- Getters para acesso às propriedades ---
    public get id(): string {
        if (!this.props.id) {
            throw new Error(`O produto "${this.props.name}" ainda não possui um ID.`);
        }
        return this.props.id;
    }

    public get name(): string {
        return this.props.name;
    }

    public get description(): string | undefined {
        return this.props.description;
    }

    public get price(): number {
        return this.props.price;
    }

    public get sku(): string {
        return this.props.sku;
    }

    public get category(): string | undefined {
        return this.props.category || '';
    }

    public get quantity(): number { // <<-- RENOMEADO
        return this.props.quantity;
    }

    // --- Métodos de Comportamento (Lógica de Negócio) ---

    /**
     * Aumenta a quantidade (estoque) do produto.
     * @param amount A quantidade a ser adicionada. Deve ser um número positivo.
     * @throws {Error} Se a quantidade for inválida.
     */
    public increaseProduct(amount: number): void {
        if (amount <= 0) {
            throw new Error("A quantidade para adicionar ao estoque deve ser maior que zero.");
        }
        this.props.quantity += amount; // <<-- RENOMEADO
    }

    /**
     * Diminui a quantidade (estoque) do produto.
     * @param amount A quantidade a ser removida. Deve ser um número positivo.
     * @throws {Error} Se a quantidade for inválida ou maior que o estoque disponível.
     */
    public decreaseProduct(amount: number): void {
        if (amount <= 0) {
            throw new Error("A quantidade para remover do estoque deve ser maior que zero.");
        }
        if (amount > this.props.quantity) { // <<-- RENOMEADO
            throw new Error(
                "A quantia solicitada para remoção de estoque é maior que a quantia em estoque!",
            );
        }
        this.props.quantity -= amount; // <<-- RENOMEADO
    }

    /**
     * Atualiza o nome do produto.
     * @param newName O novo nome do produto. Não pode ser vazio.
     * @throws {Error} Se o novo nome for vazio.
     */
    public updateName(newName: string): void {
        if (!newName || newName.trim() === "") {
            throw new Error("O nome do produto não pode ser vazio.");
        }
        this.props.name = newName;
    }

    /**
     * Atualiza o preço do produto.
     * @param newPrice O novo preço do produto. Não pode ser negativo.
     * @throws {Error} Se o novo preço for negativo.
     */
    public updatePrice(newPrice: number): void {
        if (newPrice < 0) {
            throw new Error("O preço do produto não pode ser negativo.");
        }
        this.props.price = newPrice;
    }

    /**
     * Atualiza o SKU (Stock Keeping Unit) do produto.
     * @param newSku O novo SKU do produto. Não pode ser vazio.
     * @throws {Error} Se o novo SKU for vazio.
     */
    public updateSku(newSku: string): void {
        if (!newSku || newSku.trim() === "") {
            throw new Error("O SKU do produto não pode ser vazio.");
        }
        this.props.sku = newSku;
    }

    /**
     * Atualiza a descrição do produto.
     * @param newDescription A nova descrição do produto. Pode ser vazio.
     */
    public updateDescription(newDescription?: string): void {
        this.props.description = newDescription;
    }

    /**
     * Define ou atualiza a categoria do produto.
     * @param newCategory A nova categoria como string.
     */
    public updateCategory(newCategory?: string): void {
        this.props.category = newCategory;
    }
}
