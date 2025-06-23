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
                createDto.quantity, // Usando 'quantity' do DTO
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

    public async updateSku(updateDto: ProductDtos.UpdateProductSkuDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de SKU.");
            }
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

    public async updateQuantity(updateDto: ProductDtos.UpdateProductQuantityDto): Promise<ProductDtos.FullProductDto | null> { // Renomeado updateQuantidade para updateQuantity
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de quantidade."); 
            }
            const currentQuantity = productToUpdate.quantity; 
            const newQuantity = updateDto.quantity;

            if (newQuantity > currentQuantity) {
                productToUpdate.increaseProduct(newQuantity - currentQuantity); 
            } else if (newQuantity < currentQuantity) {
                productToUpdate.decreaseProduct(currentQuantity - newQuantity); 
            }
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);
            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar quantidade do produto ${updateDto.id}:`, error); 
            throw new Error(`Falha ao atualizar quantidade do produto: ${error.message}`); 
        }
    }

    public async updateCategory(updateDto: ProductDtos.UpdateProductCategoryDto): Promise<ProductDtos.FullProductDto | null> {
        try {
            const productToUpdate = await this.productRepository.findById(updateDto.id);
            if (!productToUpdate) {
                throw new Error("Produto não encontrado para atualização de categoria.");
            }

            productToUpdate.updateCategory(updateDto.category);
            const updatedProductEntity = await this.productRepository.update(productToUpdate.id, productToUpdate);

            if (!updatedProductEntity) {
                throw new Error("Falha inesperada ao atualizar o produto no repositório.");
            }
            return mapProductToFullProductDto(updatedProductEntity);
        } catch (error: any) {
            console.error(`Erro no serviço ao atualizar categoria do produto ${updateDto.id}:`, error);
            throw new Error(`Falha ao atualizar categoria do produto: ${error.message}`);
        }
    }

    public async updateDescription(updateDto: ProductDtos.UpdateProductDescriptionDto): Promise<ProductDtos.FullProductDto | null> { 
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
