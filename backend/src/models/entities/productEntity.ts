/**
 * Define as propriedades de um produto.
 * 'id', 'description' e 'categories' são opcionais.
 */
type ProductProps = {
    id?: string;
    name: string;
    description?: string; // Propriedade para a "Descrição"
    price: number;
    sku: string;
    quantidade: number; // <<-- RENOMEADO: 'balance' agora é 'quantidade'
    categories?: string[];
    // 'origin' removido
};

/**
 * Representa a entidade de um Produto, encapsulando dados e lógica de negócio.
 */
export class Product {
    private constructor(private props: ProductProps) {
        // Validações no construtor para garantir estado inicial válido
        if (props.price < 0) {
            throw new Error("O preço do produto não pode ser negativo.");
        }
        // Validação RENOMEADA: 'balance' para 'quantidade'
        if (props.quantidade < 0) {
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
        quantidade: number, // <<-- RENOMEADO: 'balance' agora é 'quantidade'
        description?: string, // Parâmetro opcional para descrição
        categories?: string[],
        // 'origin' removido dos parâmetros
    ): Product {
        // Objeto passado para o construtor, 'quantidade' e 'description'
        return new Product({ name, price, sku, quantidade, description, categories });
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
            // Lança um erro se tentar acessar o ID de um produto que ainda não foi persistido
            throw new Error(`O produto "${this.props.name}" ainda não possui um ID.`);
        }
        return this.props.id;
    }

    public get name(): string {
        return this.props.name;
    }

    public get description(): string | undefined { // Getter para a descrição
        return this.props.description;
    }

    public get price(): number {
        return this.props.price;
    }

    public get sku(): string {
        return this.props.sku;
    }

    // 'origin' getter removido

    public get categories(): string[] {
        // Retorna um array vazio se não houver categorias definidas, garantindo que nunca seja 'undefined'
        return this.props.categories || [];
    }

    // RENOMEADO: Getter para a quantidade
    public get quantidade(): number {
        return this.props.quantidade;
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
        this.props.quantidade += amount; // <<-- RENOMEADO
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
        // Validação RENOMEADA: 'balance' para 'quantidade'
        if (amount > this.props.quantidade) {
            throw new Error(
                "A quantia solicitada para remoção de estoque é maior que a quantia em estoque!",
            );
        }
        this.props.quantidade -= amount; // <<-- RENOMEADO
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

    // 'updateOrigin' método removido

    /**
     * Define ou atualiza as categorias do produto.
     * @param newCategories Um array de strings representando as novas categorias.
     * @throws {Error} Se as categorias não forem um array de strings.
     */
    public updateCategories(newCategories: string[]): void {
        if (!Array.isArray(newCategories) || newCategories.some(c => typeof c !== 'string')) {
            throw new Error("As categorias devem ser um array de strings.");
        }
        this.props.categories = newCategories;
    }
}
