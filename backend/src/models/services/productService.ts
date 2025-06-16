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
        price: product.price,
        sku: product.sku,
        origin: product.origin, // Adicionado: inclui a propriedade 'origin'
        balance: product.balance,
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
            // Cria a entidade Product usando o método estático 'create', passando 'origin'
            const newProduct = Product.create(
                createDto.name,
                createDto.price,
                createDto.sku,
                createDto.origin, // Adicionado: passa a origem para a criação da entidade
                createDto.balance,
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
            // Assumindo que IProductRepository.findByName existe ou será criado
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
     * @param origin A origem dos produtos a serem buscados.
     * @returns Um array de FullProductDto. Pode ser um array vazio se não houver produtos.
     */
    public async findByOrigin(origin: string): Promise<ProductDtos.FullProductDto[]> {
        try {
            // Assumindo que IProductRepository.findByOrigin existe ou será criado
            const productEntities = await this.productRepository.findByOrigin(origin);
            return productEntities.map(mapProductToFullProductDto);
        } catch (error: any) {
            console.error(`Erro no serviço ao buscar produtos por origem ${origin}:`, error);
            throw new Error(`Falha ao buscar produtos por origem: ${error.message}`);
        }
    }

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
                throw new Error("Produto não encontrado para atualização de nome."); // Lança erro em vez de null
            }

            productToUpdate.updateName(updateDto.name);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            // O repositório deve retornar a entidade atualizada ou null se não encontrar.
            // Se chegou aqui, o findById encontrou, então o update deveria funcionar.
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
     * Atualiza o balanço (estoque) de um produto.
     */
    public async updateBalance(updateDto: ProductDtos.UpdateProductBalanceDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de balanço.");
            }

            // Calcula a diferença e usa os métodos de aumento/diminuição da entidade
            const currentBalance = productToUpdate.balance;
            const newBalance = updateDto.balance;

            if (newBalance > currentBalance) {
                productToUpdate.increaseProduct(newBalance - currentBalance);
            } else if (newBalance < currentBalance) {
                productToUpdate.decreaseProduct(currentBalance - newBalance);
            }

            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar balanço do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar balanço do produto: ${error.message}`);
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
     * Atualiza a origem de um produto.
     * @param updateDto DTO com o ID do produto e a nova origem.
     * @returns O produto atualizado como FullProductDto ou null se não for encontrado.
     */
    public async updateOrigin(updateDto: ProductDtos.UpdateProductOriginDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de origem.");
            }

            productToUpdate.updateOrigin(updateDto.origin); // Chama o método da entidade
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar origem do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar origem do produto: ${error.message}`);
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
