import { Request, Response } from "express";
import * as ProductDtos from "../models/dtos/productDtos.js";
import { ProductService } from "../models/services/productService.js";
import { EHttpStatusCode } from "../@types/httpStatusCode.js";

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

        // Validação das propriedades obrigatórias (name, price, sku, quantity)
        if (
            !productData.name ||
            !productData.price ||
            !productData.sku ||
            productData.quantity === undefined
        ) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({ error: "Faltando propriedades obrigatórias (name, price, sku, quantity)!" })
                .send();
            return;
        }

        try {
            const newProduct = await this.productService.create(productData);

            if (newProduct) {
                res.status(EHttpStatusCode.CREATED).json(newProduct);
                return;
            }
            res.status(EHttpStatusCode.CONFLICT)
                .json({ error: "Já existe produto associado a este SKU!" });
            return;
        } catch (err: any) {
            console.error("Erro ao criar produto:", err);
            if (err.message.includes("SKU do produto já existe")) {
                res.status(EHttpStatusCode.CONFLICT)
                   .json({ error: err.message });
            } else if (err.message.includes("preço do produto não pode ser negativo") ||
                       err.message.includes("quantidade inicial do produto não pode ser negativo")) {
                res.status(EHttpStatusCode.BAD_REQUEST)
                   .json({ error: err.message });
            } else {
                res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                   .json({ error: err.message || "Erro interno do servidor ao criar produto." });
            }
        }
    }

    /**
     * Atualiza um produto existente com múltiplos campos.
     * Recebe o ID do produto nos parâmetros da URL e os dados de atualização no corpo da requisição.
     * Retorna 200 OK em caso de sucesso ou um erro.
     */
    public async updateProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params; // ID do produto a ser atualizado, vindo da URL
        // AGORA RECEBE UM DTO COMPLETO DE ATUALIZAÇÃO DO CORPO
        const updateData: ProductDtos.UpdateProductDto = req.body; 

        // Validação básica: O ID é obrigatório
        if (!id) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({
                    status: EHttpStatusCode.BAD_REQUEST,
                    error: "ID do produto faltando na URL para atualização!",
                })
                .send();
            return;
        }

        // Validação: Pelo menos um campo deve ser fornecido para atualização
        if (Object.keys(updateData).length === 0) {
            res.status(EHttpStatusCode.BAD_REQUEST)
                .json({
                    status: EHttpStatusCode.BAD_REQUEST,
                    error: "Nenhum campo fornecido para atualização!",
                })
                .send();
            return;
        }

        try {
            // Chama um novo método no serviço que aceita o ID e o DTO de atualização
            const updatedProduct = await this.productService.updateProductFields(id, updateData);

            if (updatedProduct) {
                res.status(EHttpStatusCode.OK).json(updatedProduct);
            } else {
                res.status(EHttpStatusCode.NOT_FOUND)
                    .json({ error: "Produto não encontrado para atualização." });
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
            const isDeleted = await this.productService.delete({ id });

            if (isDeleted) {
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
        const searchTerm = req.query.search as string | undefined; 

        try {
            const products = await this.productService.findAll(searchTerm); 
            res.status(EHttpStatusCode.OK).json(products);
        } catch (err: any) {
            console.error("Erro ao buscar todos os produtos:", err);
            res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: err.message || "Erro interno do servidor ao buscar produtos." });
        }
    }
}
