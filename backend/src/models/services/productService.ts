import { Product } from "../entities/productEntity.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import * as ProductDtos from "../dtos/productDtos.js"; // Importa todos os DTOs sob o namespace ProductDtos

/**
 * Mapeia uma entidade Product para um DTO de resposta FullProductDto.
 */
function mapProductToFullProductDto(product: Product): ProductDtos.FullProductDto {
    return {
        id: product.id,
        name: product.name,
        description: product.description, // ADICIONADO: Inclui a propriedade 'description'
        price: product.price,
        sku: product.sku,
        // 'origin' REMOVIDO: Não existe mais na entidade
        quantidade: product.quantidade, // RENOMEADO: 'balance' agora é 'quantidade'
        categories: product.categories,
        // Adicione createdAt e updatedAt aqui se a sua entidade Product tiver essas propriedades
        // createdAt: product.createdAt,
        // updatedAt: product.updatedAt,
    };
}

/**
 * ProductService contém a lógica de negócio para operações relacionadas a produtos.
 */
export class ProductService {
    constructor(private productRepository: IProductRepository) {}

    /**
     * Cria um novo produto.
     * @returns O produto criado como FullProductDto ou null se já existir um produto com o mesmo SKU.
     */
    public async create(createDto: ProductDtos.CreateProductDto): Promise<ProductDtos.FullProductDto | null> {
        // Lógica de negócio: Verificar se já existe um produto com o mesmo SKU
        const existingProduct = await this.productRepository.findBySku(createDto.sku);
        if (existingProduct) {
            console.warn(`Tentativa de criar produto com SKU duplicado: ${createDto.sku}`);
            return null;
        }

        try {
            // Cria a entidade Product usando o método estático 'create',
            // ajustando os parâmetros para as novas propriedades (quantidade, description)
            // e removendo 'origin'.
            const newProduct = Product.create(
                createDto.name,
                createDto.price,
                createDto.sku,
                createDto.quantidade, // RENOMEADO: 'balance' para 'quantidade'
                createDto.description, // ADICIONADO: Passa a descrição
                // 'origin' REMOVIDO
                createDto.categories
            );

            // Persiste a entidade usando o repositório
            const createdProductEntity = await this.productRepository.create(newProduct);

            return mapProductToFullProductDto(createdProductEntity);
        } catch (error: any) {
            console.error("Erro no serviço ao criar produto:", error);
            throw new Error(`Falha ao criar produto: ${error.message}`);
        }
    }

    /**
     * Busca um produto pelo seu ID.
     */
    public async findById(id: string): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productEntity = await this.productRepository.findById(id);
            if (!productEntity) {
                return null;
            }
            return mapProductToFullProductDto(productEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao buscar produto por ID ${id}:`, error);
            throw new Error(`Falha ao buscar produto: ${error.message}`);
        }
    }

    /**
     * Busca um produto pelo seu nome.
     * @param name O nome do produto a ser buscado.
     * @returns O produto encontrado como FullProductDto ou null se nenhum produto for encontrado.
     */
    public async findByName(name: string): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productEntity = await this.productRepository.findByName(name);
            if (!productEntity) {
                return null;
            }
            return mapProductToFullProductDto(productEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao buscar produto por nome ${name}:`, error);
            throw new Error(`Falha ao buscar produto por nome: ${error.message}`);
        }
    }

    /**
     * Busca produtos pela sua origem.
     * REMOVIDO: Este método foi removido pois a propriedade 'origin' não existe mais na entidade Product.
     */
    // public async findByOrigin(origin: string): Promise<ProductDtos.FullProductDto[]> {
    //     try {
    //         const productEntities = await this.productRepository.findByOrigin(origin);
    //         return productEntities.map(mapProductToFullProductDto);
    //     } catch (error: any) {
    //         console.error(`Erro no serviço ao buscar produtos por origem ${origin}:`, error);
    //         throw new Error(`Falha ao buscar produtos por origem: ${error.message}`);
    //     }
    // }

    /**
     * Busca todos os produtos.
     */
    public async findAll(): Promise<ProductDtos.FullProductDto[]> {
        try {
            const productEntities = await this.productRepository.findAll();
            return productEntities.map(mapProductToFullProductDto);
        } catch (error: any) {
            console.error("Erro no serviço ao buscar todos os produtos:", error);
            throw new Error(`Falha ao buscar todos os produtos: ${error.message}`);
        }
    }

    /**
     * Atualiza o nome de um produto.
     */
    public async updateName(updateDto: ProductDtos.UpdateProductNameDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de nome."); 
            }

            productToUpdate.updateName(updateDto.name);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar nome do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar nome do produto: ${error.message}`);
        }
    }

    /**
     * Atualiza o preço de um produto.
     */
    public async updatePrice(updateDto: ProductDtos.UpdateProductPriceDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de preço.");
            }

            productToUpdate.updatePrice(updateDto.price);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar preço do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar preço do produto: ${error.message}`);
        }
    }

    /**
     * Atualiza o SKU de um produto.
     */
    public async updateSku(updateDto: ProductDtos.UpdateProductSkuDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de SKU.");
            }

            // Lógica de negócio: Verificar se o novo SKU já existe para outro produto
            if (productToUpdate.sku !== updateDto.sku) {
                const existingProductWithNewSku = await this.productRepository.findBySku(updateDto.sku);
                if (existingProductWithNewSku && existingProductWithNewSku.id !== productToUpdate.id) {
                    throw new Error("SKU já utilizado por outro produto.");
                }
            }

            productToUpdate.updateSku(updateDto.sku);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar SKU do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar SKU do produto: ${error.message}`);
        }
    }

    /**
     * Atualiza a quantidade (estoque) de um produto.
     */
    public async updateQuantidade(updateDto: ProductDtos.UpdateProductQuantidadeDto): Promise<ProductDtos.FullProductDto | null> { // RENOMEADO: updateBalance para updateQuantidade
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de quantidade."); // Mensagem ajustada
            }

            // Calcula a diferença e usa os métodos de aumento/diminuição da entidade
            const currentQuantidade = productToUpdate.quantidade; // RENOMEADO: balance para quantidade
            const newQuantidade = updateDto.quantidade; // RENOMEADO: balance para quantidade

            if (newQuantidade > currentQuantidade) {
                productToUpdate.increaseProduct(newQuantidade - currentQuantidade); // RENOMEADO: balance para quantidade
            } else if (newQuantidade < currentQuantidade) {
                productToUpdate.decreaseProduct(currentQuantidade - newQuantidade); // RENOMEADO: balance para quantidade
            }

            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar quantidade do produto ${updateDto.id}:`, error); // Mensagem ajustada
            throw new Error(`Falha ao atualizar quantidade do produto: ${error.message}`); // Mensagem ajustada
        }
    }

    /**
     * Atualiza as categorias de um produto.
     */
    public async updateCategories(updateDto: ProductDtos.UpdateProductCategoriesDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de categorias.");
            }

            productToUpdate.updateCategories(updateDto.categories);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar categorias do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar categorias do produto: ${error.message}`);
        }
    }

    /**
     * Atualiza a descrição de um produto.
     */
    public async updateDescription(updateDto: ProductDtos.UpdateProductDescriptionDto): Promise<ProductDtos.FullProductDto | null> { // NOVO MÉTODO
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de descrição.");
            }

            productToUpdate.updateDescription(updateDto.description);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar descrição do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar descrição do produto: ${error.message}`);
        }
    }


    /**
     * Deleta um produto.
     * @returns True se o produto foi deletado com sucesso, false caso contrário.
     */
    public async delete(deleteDto: ProductDtos.DeleteProductDto): Promise<boolean> {
        try {
            const isDeleted = await this.productRepository.delete(deleteDto.id);
            return isDeleted;
        } catch (error: any) {
            console.error(`Erro no serviço ao deletar produto ${deleteDto.id}:`, error);
            throw new Error(`Falha ao deletar produto: ${error.message}`);
        }
    }
}
