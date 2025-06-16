/**
 * DTO para criação de um novo produto.
 */
export type CreateProductDto = {
    name: string;
    price: number;
    sku: string;
    origin: string; // Adicionada: A origem é obrigatória na criação
    balance: number;
    categories?: string[];
};

/**
 * DTO para atualização do nome de um produto.
 */
export type UpdateProductNameDto = {
    id: string;
    name: string;
};

/**
 * DTO para atualização do preço de um produto.
 */
export type UpdateProductPriceDto = {
    id: string;
    price: number;
};

/**
 * DTO para atualização do SKU de um produto.
 */
export type UpdateProductSkuDto = {
    id: string;
    sku: string;
};

/**
 * DTO para atualização da origem de um produto.
 */
export type UpdateProductOriginDto = {
    id: string;
    origin: string;
};

/**
 * DTO para atualização do balanço (estoque) de um produto.
 */
export type UpdateProductBalanceDto = {
    id: string;
    balance: number;
};

/**
 * DTO para atualização das categorias de um produto.
 */
export type UpdateProductCategoriesDto = {
    id: string;
    categories: string[];
};

/**
 * DTO para remoção de um produto.
 */
export type DeleteProductDto = {
    id: string;
};

/**
 * DTO para representação completa de um produto.
 * Inclui todos os campos que podem ser retornados ao cliente.
 */
export type FullProductDto = {
    id: string;
    name: string;
    price: number;
    sku: string;
    origin: string; // Adicionada: Parte da representação completa
    balance: number;
    categories: string[];
    createdAt?: Date; // Opcional: Se seu DB gerencia
    updatedAt?: Date; // Opcional: Se seu DB gerencia
};

/**
 * DTO para representação segura de um produto.
 * Atualmente idêntico ao FullProductDto, mas pode ser diferenciado no futuro
 * para remover campos sensíveis se necessário.
 */
export type SafeProductDto = FullProductDto;