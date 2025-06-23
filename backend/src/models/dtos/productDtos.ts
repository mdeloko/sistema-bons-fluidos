/**
 * DTO para criação de um novo produto.
 */
export type CreateProductDto = {
    name: string;
    description?: string; // Propriedade para a descrição (opcional)
    price: number;
    sku: string;
    quantity: number; // RENOMEADO: 'quantidade' agora é 'quantity'
    category?: string; // 'categories' agora é 'category' (string única)
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
 * DTO para atualização da quantidade (estoque) de um produto.
 */
export type UpdateProductQuantityDto = { // RENOMEADO: UpdateProductQuantidadeDto para UpdateProductQuantityDto
    id: string;
    quantity: number; // RENOMEADO: 'quantidade' para 'quantity'
};

/**
 * DTO para atualização da categoria de um produto.
 */
export type UpdateProductCategoryDto = {
    id: string;
    category?: string; // 'categories' agora é 'category' (string única)
};

/**
 * DTO para atualização da descrição de um produto.
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
    description?: string; // Inclui a propriedade 'description'
    price: number;
    sku: string;
    quantity: number; // RENOMEADO: 'quantidade' agora é 'quantity'
    category?: string; // 'categories' agora é 'category' (string única)
    createdAt?: Date; // Opcional: Se seu DB gerencia
    updatedAt?: Date; // Opcional: Se seu DB gerencia
};

/**
 * DTO para representação segura de um produto.
 * Atualmente idêntico ao FullProductDto, mas pode ser diferenciado no futuro
 * para remover campos sensíveis se necessário.
 */
export type SafeProductDto = FullProductDto;
