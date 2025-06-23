import { Product } from "../entities/productEntity.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import * as ProductDtos from "../dtos/productDtos.js";

function mapProductToFullProductDto(product: Product): ProductDtos.FullProductDto {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        quantity: product.quantity,
        category: product.category,
        // createdAt e updatedAt (se existirem na entidade)
    };
}

export class ProductService {
    constructor(private productRepository: IProductRepository) {}

    public async create(createDto: ProductDtos.CreateProductDto): Promise<ProductDtos.FullProductDto | null> {
        const existingProduct = await this.productRepository.findBySku(createDto.sku);
        if (existingProduct) {
            console.warn(`Tentativa de criar produto com SKU duplicado: ${createDto.sku}`);
            return null;
        }

        try {
            const newProduct = Product.create(
                createDto.name,
                createDto.price,
                createDto.sku,
                createDto.quantity,
                createDto.description,
                createDto.category
            );
            const createdProductEntity = await this.productRepository.create(newProduct);
            return mapProductToFullProductDto(createdProductEntity);
        } catch (error: any) {
            console.error("Erro no serviço ao criar produto:", error);
            throw new Error(`Falha ao criar produto: ${error.message}`);
        }
    }

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

    public async findAll(searchTerm?: string): Promise<ProductDtos.FullProductDto[]> {
        try {
            const productEntities = await this.productRepository.findAll(searchTerm);
            return productEntities.map(mapProductToFullProductDto);
        } catch (error: any) {
            console.error("Erro no serviço ao buscar todos os produtos:", error);
            throw new Error(`Falha ao buscar todos os produtos: ${error.message}`);
        }
    }

    /**
     * Atualiza múltiplos campos de um produto existente.
     * @param id O ID do produto a ser atualizado.
     * @param updateData O DTO com os campos a serem atualizados (UpdateProductDto).
     * @returns O produto atualizado como FullProductDto ou null se não for encontrado.
     * @throws {Error} Se houver erros de validação ou de banco de dados.
     */
    public async updateProductFields(id: string, updateData: ProductDtos.UpdateProductDto): Promise<ProductDtos.FullProductDto | null> {
        const productToUpdate = await this.productRepository.findById(id);
        if (!productToUpdate) {
            return null; // Retorna null se o produto não for encontrado
        }

        // Aplica as atualizações à entidade
        if (updateData.name !== undefined) {
            productToUpdate.updateName(updateData.name);
        }
        if (updateData.price !== undefined) {
            productToUpdate.updatePrice(updateData.price);
        }
        if (updateData.sku !== undefined) {
            // Lógica de negócio: Verificar se o novo SKU já existe para outro produto
            if (productToUpdate.sku !== updateData.sku) {
                const existingProductWithNewSku = await this.productRepository.findBySku(updateData.sku);
                if (existingProductWithNewSku && existingProductWithNewSku.id !== productToUpdate.id) {
                    throw new Error("SKU já utilizado por outro produto.");
                }
            }
            productToUpdate.updateSku(updateData.sku);
        }
        if (updateData.quantity !== undefined) {
            // A lógica de increase/decreaseProduct é mais complexa, então chamamos o método específico
            const currentQuantity = productToUpdate.quantity;
            const newQuantity = updateData.quantity;

            if (newQuantity > currentQuantity) {
                productToUpdate.increaseProduct(newQuantity - currentQuantity);
            } else if (newQuantity < currentQuantity) {
                productToUpdate.decreaseProduct(currentQuantity - newQuantity);
            }
        }
        if (updateData.category !== undefined) {
            productToUpdate.updateCategory(updateData.category);
        }
        if (updateData.description !== undefined) {
            productToUpdate.updateDescription(updateData.description);
        }

        // Chama o repositório para persistir as mudanças
        try {
            const updatedProductEntity = await this.productRepository.update(id, productToUpdate);
            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            // Propaga os erros específicos (SKU duplicado, validações da entidade)
            throw error; 
        }
    }


    // REMOVIDOS: Métodos updateName, updatePrice, updateSku, updateQuantity, updateCategory, updateDescription
    // Eles foram consolidados em updateProductFields

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
