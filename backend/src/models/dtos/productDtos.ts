/**
 * DTO para criação de um novo produto.
 */
export type CreateProductDto = {
    name: string;
    description?: string; // ADICIONADO: Propriedade para a descrição (opcional, conforme JSON de exemplo)
    price: number;
    sku: string;
    quantidade: number; // RENOMEADO: 'balance' agora é 'quantidade'
    categories?: string[];
    // 'origin' REMOVIDO: Não existe mais na entidade Product
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
export type UpdateProductQuantidadeDto = { // RENOMEADO: UpdateProductBalanceDto para UpdateProductQuantidadeDto
    id: string;
    quantidade: number; // RENOMEADO: 'balance' para 'quantidade'
};

/**
 * DTO para atualização das categorias de um produto.
 */
export type UpdateProductCategoriesDto = {
    id: string;
    categories: string[];
};

/**
 * DTO para atualização da descrição de um produto.
 */
export type UpdateProductDescriptionDto = { // NOVO DTO: Para atualizar a descrição
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
    description?: string; // ADICIONADO: Inclui a propriedade 'description'
    price: number;
    sku: string;
    quantidade: number; // RENOMEADO: 'balance' agora é 'quantidade'
    categories: string[];
    // 'origin' REMOVIDO: Não existe mais na entidade Product
    createdAt?: Date; // Opcional: Se seu DB gerencia
    updatedAt?: Date; // Opcional: Se seu DB gerencia
};

/**
 * DTO para representação segura de um produto.
 * Atualmente idêntico ao FullProductDto, mas pode ser diferenciado no futuro
 * para remover campos sensíveis se necessário.
 */
export type SafeProductDto = FullProductDto; // Reflete as mudanças em FullProductDto
