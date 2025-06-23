import { Product } from "../entities/productEntity.js";

/**
 * Interface para o repositório de produtos.
 * Define o contrato para as operações de persistência de dados de Produto.
 */
export interface IProductRepository {
    create(product: Product): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findBySku(sku: string): Promise<Product | null>;
    findByName(name: string): Promise<Product | null>; 
    findAll(searchTerm?: string): Promise<Product[]>; 

    /**
     * Atualiza um produto existente no banco de dados.
     * O produto é identificado pelo seu ID.
     * @param id O ID do produto a ser atualizado.
     * @param product A entidade Product contendo os dados atualizados.
     * @returns A entidade Product atualizada, ou null se o produto não for encontrado.
     */
    update(id: string, product: Product): Promise<Product | null>; // <<-- O MÉTODO UPDATE JÁ EXISTIA COM ESSA ASSINATURA

    delete(id: string): Promise<boolean>;
}
