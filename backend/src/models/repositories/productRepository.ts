import DBConnection from "../../utils/db.js";
import { Product } from "../entities/productEntity.js";
import { IProductRepository } from "./IProductRepository.js";
import { QueryResult, DatabaseError } from "pg";

export class ProductRepository implements IProductRepository {

    public async create(product: Product): Promise<Product> {
        await using db = await DBConnection.connect();
        const { name, price, sku, quantity, category, description } = product; 

        try {
            const result: QueryResult = await db.query(
                `INSERT INTO produtos (nome, preco, sku, quantidade, categoria_id, descricao)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, nome, preco, sku, quantidade, categoria_id, descricao;`, 
                [name, price, sku, quantity, category || null, description] 
            );

            const newProductData = result.rows[0];
            return Product.fromExisting({
                id: newProductData.id,
                name: newProductData.nome, 
                description: newProductData.descricao, 
                price: parseFloat(newProductData.preco), 
                sku: newProductData.sku,
                quantity: parseInt(newProductData.quantidade, 10), 
                category: newProductData.categoria_id, 
            });

        } catch (error: any) {
            if (error instanceof DatabaseError && error.code === "23505") {
                throw new Error("SKU do produto já existe no banco de dados.");
            }
            console.error("Erro no repositório ao criar produto:", error);
            throw new Error(`Não foi possível criar o produto: ${error.message}`);
        }
    }

    public async findById(id: string): Promise<Product | null> {
        await using db = await DBConnection.connect();
        try {
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos WHERE id = $1;", 
                [id]
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                return Product.fromExisting({
                    id: row.id,
                    name: row.nome, 
                    description: row.descricao, 
                    price: parseFloat(row.preco), 
                    sku: row.sku,
                    quantity: parseInt(row.quantidade, 10), 
                    category: row.categoria_id, 
                });
            }
            return null;
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produto por ID ${id}:`, error);
            throw new Error(`Falha ao buscar produto por ID: ${error.message}`);
        }
    }

    public async findBySku(sku: string): Promise<Product | null> {
        await using db = await DBConnection.connect();
        try {
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos WHERE sku = $1;", 
                [sku]
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                return Product.fromExisting({
                    id: row.id,
                    name: row.nome, 
                    description: row.descricao, 
                    price: parseFloat(row.preco), 
                    sku: row.sku,
                    quantity: parseInt(row.quantidade, 10), 
                    category: row.categoria_id, 
                });
            }
            return null;
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produto por SKU ${sku}:`, error);
            throw new Error(`Falha ao buscar produto por SKU: ${error.message}`);
        }
    }

    public async findByName(name: string): Promise<Product | null> {
        await using db = await DBConnection.connect();
        try {
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos WHERE nome ILIKE $1;", 
                [`%${name}%`] 
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                return Product.fromExisting({
                    id: row.id,
                    name: row.nome, 
                    description: row.descricao, 
                    price: parseFloat(row.preco), 
                    sku: row.sku,
                    quantity: parseInt(row.quantidade, 10), 
                    category: row.categoria_id, 
                });
            }
            return null;
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produto por nome ${name}:`, error);
            throw new Error(`Falha ao buscar produto por nome: ${error.message}`);
        }
    }

    public async findAll(searchTerm?: string): Promise<Product[]> {
        await using db = await DBConnection.connect();
        let query = "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos";
        const values: string[] = [];

        if (searchTerm) {
            query += " WHERE nome ILIKE $1 OR sku ILIKE $1 OR descricao ILIKE $1";
            values.push(`%${searchTerm}%`);
        }

        try {
            const result: QueryResult = await db.query(query, values);

            return result.rows.map((row: any) => {
                try {
                    return Product.fromExisting({
                        id: row.id,
                        name: row.nome, 
                        description: row.descricao, 
                        price: parseFloat(row.preco), 
                        sku: row.sku,
                        quantity: parseInt(row.quantidade, 10), 
                        category: row.categoria_id, 
                    });
                } catch (entityError: any) {
                    console.error(`Erro ao criar entidade Product a partir da linha do DB (ID: ${row.id || 'N/A'}):`, entityError);
                    return null;
                }
            }).filter((p): p is Product => p !== null);
        } catch (error: any) {
            console.error("Erro no repositório ao buscar todos os produtos:", error);
            throw new Error(`Falha ao buscar todos os produtos: ${error.message}`);
        }
    }

    /**
     * Atualiza um produto existente no banco de dados.
     * Recebe o ID e a entidade Product com os dados já atualizados (do serviço).
     * @param id O ID do produto a ser atualizado.
     * @param product A entidade Product com os campos já modificados.
     * @returns A entidade Product atualizada (com os dados mais recentes do DB), ou null se o produto não for encontrado.
     * @throws {Error} Se houver um erro de banco de dados (ex: SKU duplicado).
     */
    public async update(id: string, product: Product): Promise<Product | null> {
        await using db = await DBConnection.connect();
        // Desestruturando os campos da entidade Product (já atualizados pelo serviço)
        const { name, price, sku, quantity, category, description } = product;

        try {
            const result: QueryResult = await db.query(
                `UPDATE produtos
                 SET nome = $1, preco = $2, sku = $3, quantidade = $4, categoria_id = $5, descricao = $6
                 WHERE id = $7
                 RETURNING id, nome, preco, sku, quantidade, categoria_id, descricao;`, 
                [name, price, sku, quantity, category || null, description, id] 
            );

            if (result.rowCount && result.rowCount > 0) {
                const updatedProductData: any = result.rows[0];
                return Product.fromExisting({
                    id: updatedProductData.id,
                    name: updatedProductData.nome, 
                    description: updatedProductData.descricao, 
                    price: parseFloat(updatedProductData.preco), 
                    sku: updatedProductData.sku,
                    quantity: parseInt(updatedProductData.quantidade, 10), 
                    category: updatedProductData.categoria_id, 
                });
            }
            return null; // Nenhuma linha atualizada (produto não encontrado)
        } catch (error: any) {
            if (error instanceof DatabaseError && error.code === "23505") {
                throw new Error("SKU do produto já existe para outro produto.");
            }
            console.error(`Erro no repositório ao atualizar produto ${id}:`, error);
            throw new Error(`Não foi possível atualizar o produto: ${error.message}`);
        }
    }

    public async delete(id: string): Promise<boolean> {
        await using db = await DBConnection.connect();
        try {
            const result: QueryResult = await db.query(
                "DELETE FROM produtos WHERE id = $1;",
                [id]
            );
            return result.rowCount !== null && result.rowCount !== undefined && result.rowCount > 0; 
        } catch (error: any) {
            console.error(`Erro no repositório ao deletar produto ${id}:`, error);
            throw new Error(`Não foi possível deletar o produto: ${error.message}`);
        }
    }
}
