import { Product } from "../entities/productEntity.js";

/**
 * Interface para o repositório de produtos.
 * Define o contrato para as operações de persistência de dados de Produto.
 */
export interface IProductRepository {
    /**
     * Cria um novo produto no banco de dados.
     * @param product A entidade Product a ser criada.
     * @returns A entidade Product criada, com o ID gerado pelo banco de dados.
     */
    create(product: Product): Promise<Product>;

    /**
     * Busca um produto no banco de dados pelo seu ID.
     * @param id O ID único do produto a ser buscado.
     * @returns A entidade Product encontrada, ou null se nenhum produto for encontrado.
     */
    findById(id: string): Promise<Product | null>;

    /**
     * Busca um produto no banco de dados pelo seu SKU.
     * @param sku O SKU do produto a ser buscado.
     * @returns A entidade Product encontrada, ou null se nenhum produto for encontrado.
     */
    findBySku(sku: string): Promise<Product | null>;

    /**
     * Busca um produto no banco de dados pelo seu nome.
     * @param name O nome do produto a ser buscado.
     * @returns A entidade Product encontrada, ou null se nenhum produto for encontrado.
     */
    findByName(name: string): Promise<Product | null>; 

    /**
     * Busca todos os produtos no banco de dados.
     * @returns Um array de entidades Product. Pode ser um array vazio se não houver produtos.
     */
    findAll(): Promise<Product[]>;

    /**
     * Atualiza um produto existente no banco de dados.
     * O produto é identificado pelo seu ID.
     * @param id O ID do produto a ser atualizado.
     * @param product A entidade Product contendo os dados atualizados.
     * @returns A entidade Product atualizada, ou null se o produto não for encontrado.
     */
    update(id: string, product: Product): Promise<Product | null>;

    /**
     * Deleta um produto do banco de dados pelo seu ID.
     * @param id O ID do produto a ser deletado.
     * @returns True se o produto foi deletado com sucesso, false caso contrário.
     */
    delete(id: string): Promise<boolean>;
}
