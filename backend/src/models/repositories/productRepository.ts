import DBConnection from "../../utils/db.js"; // Ajuste o caminho conforme necessário para sua conexão com o DB
import { Product } from "../entities/productEntity.js"; // Caminho para sua entidade Product
import { IProductRepository } from "./IProductRepository.js"; // Caminho para a interface que definimos
import { QueryResult, DatabaseError } from "pg";

/**
 * Implementação concreta do repositório de produtos para PostgreSQL.
 * Responsável por todas as interações diretas com o banco de dados para a entidade Product.
 */
export class ProductRepository implements IProductRepository {

    /**
     * Cria um novo produto no banco de dados.
     * Insere os dados da entidade Product na tabela 'produtos'.
     * @param product A entidade Product a ser criada.
     * @returns A entidade Product criada, com o ID gerado pelo banco de dados.
     * @throws {Error} Se houver um erro de banco de dados (ex: SKU duplicado).
     */
    public async create(product: Product): Promise<Product> {
        // Conecta ao banco de dados usando a utilidade DBConnection
        await using db = await DBConnection.connect();
        // Desestruturando: 'balance' agora é 'quantidade', 'origin' removido, 'description' adicionado
        const { name, price, sku, quantidade, categories, description } = product; 

        try {
            // Executa o comando INSERT e retorna todos os campos para reconstruir a entidade
            // COLUNAS SQL: nome, preco, sku, quantidade, categoria_id, descricao (novo)
            // PARÂMETROS: name, price, sku, quantidade, categories, description
            const result: QueryResult = await db.query(
                `INSERT INTO produtos (nome, preco, sku, quantidade, categoria_id, descricao)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, nome, preco, sku, quantidade, categoria_id, descricao;`, 
                [name, price, sku, quantidade, JSON.stringify(categories || []), description] 
            );

            // Reconstitui a entidade Product com os dados retornados pelo DB
            const newProductData = result.rows[0];
            return Product.fromExisting({
                id: newProductData.id,
                name: newProductData.nome, 
                description: newProductData.descricao, // <<-- Mapeando 'descricao' do DB para 'description' da entidade
                price: parseFloat(newProductData.preco), 
                sku: newProductData.sku,
                quantidade: parseInt(newProductData.quantidade, 10), // <<-- 'quantidade' do DB para 'quantidade' da entidade
                categories: JSON.parse(newProductData.categoria_id || '[]'), 
                // 'origin' removido completamente
            });

        } catch (error: any) {
            if (error instanceof DatabaseError && error.code === "23505") {
                throw new Error("SKU do produto já existe no banco de dados.");
            }
            console.error("Erro no repositório ao criar produto:", error);
            throw new Error(`Não foi possível criar o produto: ${error.message}`);
        }
    }

    /**
     * Busca um produto no banco de dados pelo seu ID.
     * @param id O ID único do produto a ser buscado.
     * @returns A entidade Product encontrada, ou null se nenhum produto for encontrado.
     * @throws {Error} Se houver um erro de banco de dados.
     */
    public async findById(id: string): Promise<Product | null> {
        await using db = await DBConnection.connect();
        try {
            // Selecionando 'descricao'
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos WHERE id = $1;", 
                [id]
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                
                return Product.fromExisting({
                    id: row.id,
                    name: row.nome, 
                    description: row.descricao, // <<-- Mapeando 'descricao' do DB para 'description' da entidade
                    price: parseFloat(row.preco), 
                    sku: row.sku,
                    quantidade: parseInt(row.quantidade, 10), 
                    categories: JSON.parse(row.categoria_id || '[]'), 
                    // 'origin' removido
                });
            }
            return null; // Nenhuma linha encontrada
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produto por ID ${id}:`, error);
            throw new Error(`Falha ao buscar produto por ID: ${error.message}`);
        }
    }

    /**
     * Busca um produto no banco de dados pelo seu SKU.
     * Utilizado para verificar a unicidade do SKU antes da criação/atualização.
     * @param sku O SKU do produto a ser buscado.
     * @returns A entidade Product encontrada, ou null se nenhum produto for encontrado.
     * @throws {Error} Se houver um erro de banco de dados.
     */
    public async findBySku(sku: string): Promise<Product | null> {
        await using db = await DBConnection.connect();
        try {
            // Selecionando 'descricao'
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos WHERE sku = $1;", 
                [sku]
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                return Product.fromExisting({
                    id: row.id,
                    name: row.nome, 
                    description: row.descricao, // <<-- Mapeando 'descricao' do DB para 'description' da entidade
                    price: parseFloat(row.preco), 
                    sku: row.sku,
                    quantidade: parseInt(row.quantidade, 10), 
                    categories: JSON.parse(row.categoria_id || '[]'), 
                    // 'origin' removido
                });
            }
            return null;
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produto por SKU ${sku}:`, error);
            throw new Error(`Falha ao buscar produto por SKU: ${error.message}`);
        }
    }

    /**
     * Busca um produto no banco de dados pelo seu nome.
     * @param name O nome do produto a ser buscado.
     * @returns A entidade Product encontrada, ou null se nenhum produto for encontrado.
     * @throws {Error} Se houver um erro de banco de dados.
     */
    public async findByName(name: string): Promise<Product | null> {
        await using db = await DBConnection.connect();
        try {
            // Selecionando 'descricao'
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos WHERE nome ILIKE $1;", 
                [`%${name}%`] 
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                return Product.fromExisting({
                    id: row.id,
                    name: row.nome, 
                    description: row.descricao, // <<-- Mapeando 'descricao' do DB para 'description' da entidade
                    price: parseFloat(row.preco), 
                    sku: row.sku,
                    quantidade: parseInt(row.quantidade, 10), 
                    categories: JSON.parse(row.categoria_id || '[]'), 
                    // 'origin' removido
                });
            }
            return null;
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produto por nome ${name}:`, error);
            throw new Error(`Falha ao buscar produto por nome: ${error.message}`);
        }
    }

    /**
     * Busca produtos no banco de dados pela sua origem.
     * REMOVIDO: Este método foi removido pois a coluna 'origin' não existe mais no esquema do DB.
     */
    // public async findByOrigin(origin: string): Promise<Product[]> { /* ... código ... */ }


    /**
     * Busca todos os produtos no banco de dados.
     * @returns Um array de entidades Product. Pode ser um array vazio se não houver produtos.
     * @throws {Error} Se houver um erro de banco de dados.
     */
    public async findAll(): Promise<Product[]> {
        await using db = await DBConnection.connect();
        try {
            // Selecionando 'descricao'
            const result: QueryResult = await db.query(
                "SELECT id, nome, preco, sku, quantidade, categoria_id, descricao FROM produtos;" 
            );

            // Mapeia todas as linhas retornadas para um array de entidades Product
            return result.rows.map((row: any) => {
                try {
                    return Product.fromExisting({
                        id: row.id,
                        name: row.nome, 
                        description: row.descricao, // <<-- Mapeando 'descricao' do DB para 'description' da entidade
                        price: parseFloat(row.preco), 
                        sku: row.sku,
                        quantidade: parseInt(row.quantidade, 10), 
                        categories: JSON.parse(row.categoria_id || '[]'), 
                        // 'origin' removido
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
     * O produto é identificado pelo seu ID.
     * @param id O ID do produto a ser atualizado.
     * @param product A entidade Product contendo os dados atualizados.
     * @returns A entidade Product atualizada (com os dados mais recentes do DB), ou null se o produto não for encontrado.
     * @throws {Error} Se houver um erro de banco de dados (ex: SKU duplicado).
     */
    public async update(id: string, product: Product): Promise<Product | null> {
        await using db = await DBConnection.connect();
        // Desestruturando: 'balance' agora é 'quantidade', 'origin' removido, 'description' adicionado
        const { name, price, sku, quantidade, categories, description } = product;

        try {
            // COLUNAS SQL: nome, preco, sku, quantidade, categoria_id, descricao (novo)
            // PARÂMETROS: name, price, sku, quantidade, categories, description
            const result: QueryResult = await db.query(
                `UPDATE produtos
                 SET nome = $1, preco = $2, sku = $3, quantidade = $4, categoria_id = $5, descricao = $6
                 WHERE id = $7
                 RETURNING id, nome, preco, sku, quantidade, categoria_id, descricao;`, 
                [name, price, sku, quantidade, JSON.stringify(categories || []), description, id] 
            );

            if (result.rowCount && result.rowCount > 0) {
                const updatedProductData: any = result.rows[0];
                
                return Product.fromExisting({
                    id: updatedProductData.id,
                    name: updatedProductData.nome, 
                    description: updatedProductData.descricao, // <<-- Mapeando 'descricao' do DB para 'description' da entidade
                    price: parseFloat(updatedProductData.preco), 
                    sku: updatedProductData.sku,
                    quantidade: parseInt(updatedProductData.quantidade, 10), 
                    categories: JSON.parse(updatedProductData.categoria_id || '[]'), 
                    // 'origin' removido
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

    /**
     * Deleta um produto do banco de dados pelo seu ID.
     * @param id O ID do produto a ser deletado.
     * @returns True se o produto foi deletado com sucesso, false caso contrário (produto não encontrado).
     * @throws {Error} Se houver um erro de banco de dados.
     */
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
