import { Request, Response } from "express";
import * as ProductDtos from "../models/dtos/productDtos.js"; // Importa todos os DTOs sob o namespace ProductDtos
import { ProductService } from "../models/services/productService.js"; // Ajuste o caminho conforme a estrutura do seu projeto
import { EHttpStatusCode } from "../@types/httpStatusCode.js"; // Importa EHttpStatusCode do seu arquivo compartilhado

/**
 * ProductController lida com as requisições HTTP para recursos de produto.
 * Ele recebe a requisição, valida dados, invoca o ProductService e envia a resposta HTTP.
 */
export class ProductController {
    constructor(private productService: ProductService) {}

    /**
     * Cria um novo produto no sistema.
     * Recebe os dados do produto no corpo da requisição.
     * Retorna 201 Created em caso de sucesso ou um erro.
     */
    public async createProduct(req: Request, res: Response): Promise<void> {
        const productData: ProductDtos.CreateProductDto = req.body;
        console.log("Tentativa de criação de produto com dados:", productData);

        // Validação básica das propriedades obrigatórias (name, price, sku, quantidade)
        // 'description' é opcional no DTO, então não validamos aqui. 'origin' foi removido.
        if (
            !productData.name ||
            !productData.price ||
            !productData.sku ||
            productData.quantidade === undefined // RENOMEADO: 'balance' para 'quantidade'
            // 'origin' REMOVIDO da validação
        ) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({ error: "Faltando propriedades obrigatórias (name, price, sku, quantidade)!" })
                .send();
            return;
        }

        try {
            const newProduct = await this.productService.create(productData);

            if (newProduct) {
                res.status(EHttpStatusCode.CREATED).json(newProduct);
                return;
            }
            // Se o serviço retornar null, pode indicar um conflito (ex: SKU duplicado)
            res.status(EHttpStatusCode.CONFLICT)
                .json({ error: "Já existe produto associado a este SKU!" });
            return;
        } catch (err: any) {
            console.error("Erro ao criar produto:", err);
            // Captura erros específicos lançados pelo serviço/repositório e os reflete no status HTTP
            if (err.message.includes("SKU do produto já existe")) {
                res.status(EHttpStatusCode.CONFLICT)
                   .json({ error: err.message });
            } else if (err.message.includes("preço do produto não pode ser negativo") ||
                       err.message.includes("quantidade inicial do produto não pode ser negativo") // RENOMEADO: balanço para quantidade
                       // 'origem do produto não pode ser vazia' REMOVIDO
            ) {
                res.status(EHttpStatusCode.BAD_REQUEST)
                   .json({ error: err.message });
            } else {
                res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                   .json({ error: err.message || "Erro interno do servidor ao criar produto." });
            }
        }
    }

    /**
     * Atualiza um produto existente.
     * Recebe o ID do produto nos parâmetros da URL e o campo a ser atualizado
     * junto com o novo valor no corpo da requisição.
     * Retorna 200 OK em caso de sucesso ou um erro.
     */
    public async updateProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params; // ID do produto a ser atualizado, vindo da URL
        const { field, valueToUpdateTo } = req.body; // Campo e novo valor, vindos do corpo da requisição

        // Validação básica dos parâmetros
        if (!id || !field || valueToUpdateTo === undefined) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({
                    status: EHttpStatusCode.BAD_REQUEST,
                    error: "Faltando parâmetros (id na URL, field ou valueToUpdateTo no corpo da requisição)!",
                })
                .send();
            return;
        }

        try {
            let updatedProduct: ProductDtos.FullProductDto | null = null;

            // Usa um switch para chamar o método de serviço correto com o DTO apropriado
            switch (field) {
                case "name":
                    const nameDto: ProductDtos.UpdateProductNameDto = { id, name: valueToUpdateTo };
                    updatedProduct = await this.productService.updateName(nameDto);
                    break;
                case "price":
                    // Converte para número, pois valueToUpdateTo virá como string do body
                    const priceDto: ProductDtos.UpdateProductPriceDto = { id, price: Number(valueToUpdateTo) };
                    updatedProduct = await this.productService.updatePrice(priceDto);
                    break;
                case "sku":
                    const skuDto: ProductDtos.UpdateProductSkuDto = { id, sku: valueToUpdateTo };
                    updatedProduct = await this.productService.updateSku(skuDto);
                    break;
                case "quantidade": // RENOMEADO: 'balance' para 'quantidade'
                    // Converte para número
                    const quantidadeDto: ProductDtos.UpdateProductQuantidadeDto = { id, quantidade: Number(valueToUpdateTo) }; // DTO RENOMEADO
                    updatedProduct = await this.productService.updateQuantidade(quantidadeDto); // MÉTODO RENOMEADO
                    break;
                case "categories":
                    // Assume que valueToUpdateTo é um array de strings
                    const categoriesDto: ProductDtos.UpdateProductCategoriesDto = { id, categories: valueToUpdateTo };
                    updatedProduct = await this.productService.updateCategories(categoriesDto);
                    break;
                case "description": // NOVO CASO: Para a descrição
                    const descriptionDto: ProductDtos.UpdateProductDescriptionDto = { id, description: valueToUpdateTo }; // NOVO DTO
                    updatedProduct = await this.productService.updateDescription(descriptionDto); // NOVO MÉTODO
                    break;
                // 'case "origin"' REMOVIDO: Não existe mais na entidade/serviço
                default:
                    res.status(EHttpStatusCode.BAD_REQUEST)
                        .json({ error: "Campo de atualização inválido!" })
                        .send();
                    return;
            }

            if (updatedProduct) {
                res.status(EHttpStatusCode.OK).json(updatedProduct);
            } else {
                // Se o serviço retornar null, pode ser que o produto não foi encontrado
                res.status(EHttpStatusCode.NOT_FOUND)
                    .json({ error: "Produto não encontrado." });
            }
        } catch (err: any) {
            console.error("Erro ao atualizar produto:", err);
            // Reflete erros específicos lançados pelo serviço/repositório
            if (err.message.includes("não encontrado") || err.message.includes("não existe")) {
                res.status(EHttpStatusCode.NOT_FOUND)
                   .json({ error: err.message });
            } else if (err.message.includes("SKU do produto já existe")) {
                res.status(EHttpStatusCode.CONFLICT)
                   .json({ error: err.message });
            } else if (err.message.includes("não pode ser negativo") ||
                       err.message.includes("não pode ser vazio") ||
                       err.message.includes("deve ser maior que zero") ||
                       err.message.includes("quantia solicitada para remoção de estoque é maior")) {
                res.status(EHttpStatusCode.BAD_REQUEST)
                   .json({ error: err.message });
            } else {
                res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                   .json({ error: err.message || "Erro interno do servidor ao atualizar produto." });
            }
        }
    }

    /**
     * Deleta um produto pelo seu ID.
     * Recebe o ID do produto nos parâmetros da URL.
     * Retorna 204 No Content em caso de sucesso ou um erro.
     */
    public async deleteProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({ error: "ID do produto faltando para deleção!" })
                .send();
            return;
        }

        try {
            const isDeleted = await this.productService.delete({ id }); // Passa um DTO de deleção

            if (isDeleted) {
                // CORREÇÃO: Usar 204 No Content para deleção bem-sucedida sem retorno de corpo.
                res.status(EHttpStatusCode.OK).json({ message: "Produto excluído com sucesso!" });
            } else {
                res.status(EHttpStatusCode.NOT_FOUND)
                    .json({ error: "Produto não encontrado para exclusão." });
            }
        } catch (err: any) {
            console.error("Erro ao deletar produto:", err);
            res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: err.message || "Erro interno do servidor ao deletar produto." });
        }
    }

    /**
     * Busca um produto pelo seu ID.
     * Recebe o ID do produto nos parâmetros da URL.
     * Retorna 200 OK com os dados do produto ou 404 Not Found.
     */
    public async getProductById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({ error: "ID do produto faltando!" })
                .send();
            return;
        }

        try {
            const product = await this.productService.findById(id);

            if (product) {
                res.status(EHttpStatusCode.OK).json(product);
            } else {
                res.status(EHttpStatusCode.NOT_FOUND)
                    .json({ error: "Produto não encontrado." });
            }
        } catch (err: any) {
            console.error("Erro ao buscar produto por ID:", err);
            res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: err.message || "Erro interno do servidor ao buscar produto." });
        }
    }

    /**
     * Busca um produto pelo seu nome.
     * Recebe o nome do produto nos parâmetros da URL.
     * Retorna 200 OK com os dados do produto ou 404 Not Found.
     */
    public async getProductByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params;

        if (!name) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({ error: "Nome do produto faltando!" })
                .send();
            return;
        }

        try {
            const product = await this.productService.findByName(name); 

            if (product) {
                res.status(EHttpStatusCode.OK).json(product);
            } else {
                res.status(EHttpStatusCode.NOT_FOUND)
                    .json({ error: "Produto não encontrado com este nome." });
            }
        } catch (err: any) {
            console.error("Erro ao buscar produto por nome:", err);
            res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: err.message || "Erro interno do servidor ao buscar produto por nome." });
        }
    }

    /**
     * Busca todos os produtos.
     * Retorna 200 OK com um array de produtos.
     */
    public async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.findAll();
            res.status(EHttpStatusCode.OK).json(products);
        } catch (err: any) {
            console.error("Erro ao buscar todos os produtos:", err);
            res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: err.message || "Erro interno do servidor ao buscar produtos." });
        }
    }
}
