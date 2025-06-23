/**
 * DTO para criação de um novo produto.
 */
export type CreateProductDto = {
    name: string;
    description?: string;
    price: number;
    sku: string;
    quantity: number;
    category?: string;
};

/**
 * DTO para atualização de um produto com múltiplos campos.
 * Todos os campos são opcionais, pois nem todos precisam ser atualizados de uma vez.
 */
export type UpdateProductDto = {
    name?: string;
    description?: string;
    price?: number;
    sku?: string;
    quantity?: number;
    category?: string;
};

/**
 * DTO para atualização do nome de um produto (pode ser mantido se ainda houver rotas específicas).
 */
export type UpdateProductNameDto = {
    id: string;
    name: string;
};

/**
 * DTO para atualização do preço de um produto (pode ser mantido).
 */
export type UpdateProductPriceDto = {
    id: string;
    price: number;
};

/**
 * DTO para atualização do SKU de um produto (pode ser mantido).
 */
export type UpdateProductSkuDto = {
    id: string;
    sku: string;
};

/**
 * DTO para atualização da quantidade (estoque) de um produto (pode ser mantido).
 */
export type UpdateProductQuantityDto = {
    id: string;
    quantity: number;
};

/**
 * DTO para atualização da categoria de um produto (pode ser mantido).
 */
export type UpdateProductCategoryDto = {
    id: string;
    category?: string;
};

/**
 * DTO para atualização da descrição de um produto (pode ser mantido).
 */
export type UpdateProductDescriptionDto = {
    id: string;
    description?: string;
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
    description?: string;
    price: number;
    sku: string;
    quantity: number;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

/**
 * DTO para representação segura de um produto.
 * Atualmente idêntico ao FullProductDto, mas pode ser diferenciado no futuro
 * para remover campos sensíveis se necessário.
 */
export type SafeProductDto = FullProductDto;
