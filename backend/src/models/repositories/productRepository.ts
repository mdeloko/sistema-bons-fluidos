import DBConnection from "../../utils/db.js"; // Ajuste o caminho conforme necessário para sua conexão com o DB
import { Product } from "../entities/productEntity.js"; // Caminho para sua entidade Product
import { IProductRepository } from "./IProductRepository.js"; // Caminho para a interface que definimos
import { QueryResult, DatabaseError } from "pg"; // Removido QueryResultRow, pois pode causar problemas ou ser redundante

/**
 * Implementação concreta do repositório de produtos para PostgreSQL.
 * Responsável por todas as interações diretas com o banco de dados para a entidade Product.
 */
export class ProductRepository implements IProductRepository {

    /**
     * Cria um novo produto no banco de dados.
     * Insere os dados da entidade Product na tabela 'products'.
     * @param product A entidade Product a ser criada.
     * @returns A entidade Product criada, com o ID gerado pelo banco de dados.
     * @throws {Error} Se houver um erro de banco de dados (ex: SKU duplicado).
     */
    public async create(product: Product): Promise<Product> {
        // Conecta ao banco de dados usando a utilidade DBConnection
        await using db = await DBConnection.connect();
        // Desestruturando para incluir 'origin'
        const { name, price, sku, balance, categories, origin } = product; 

        try {
            // Executa o comando INSERT e retorna todos os campos para reconstruir a entidade
            const result: QueryResult = await db.query(
                `INSERT INTO products (name, price, sku, balance, categories, origin)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, name, price, sku, balance, categories, origin;`, // Retorna 'origin'
                [name, price, sku, balance, categories || [], origin] // Adiciona 'origin' aos parâmetros
            );

            // Reconstitui a entidade Product com os dados retornados pelo DB
            const newProductData = result.rows[0];
            return Product.fromExisting({
                id: newProductData.id,
                name: newProductData.name,
                price: parseFloat(newProductData.price),
                sku: newProductData.sku,
                balance: parseInt(newProductData.balance, 10),
                categories: newProductData.categories || [],
                origin: newProductData.origin, // Adiciona 'origin'
            });

        } catch (error: any) {
            // Verifica se o erro é de violação de unique constraint (código '23505' no PostgreSQL)
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
            const result: QueryResult = await db.query(
                "SELECT id, name, price, sku, balance, categories, origin FROM products WHERE id = $1;", // Seleciona 'origin'
                [id]
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                const originValue = (row.origin !== null && row.origin !== undefined) ? String(row.origin) : '';
                
                // Tenta criar a entidade. Se a origem for inválida ou outra validação falhar,
                // a entidade lançará um erro, que será capturado pelo catch externo.
                return Product.fromExisting({
                    id: row.id,
                    name: row.name,
                    price: parseFloat(row.price),
                    sku: row.sku,
                    balance: parseInt(row.balance, 10),
                    categories: row.categories || [],
                    origin: originValue, 
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
            const result: QueryResult = await db.query(
                "SELECT id, name, price, sku, balance, categories, origin FROM products WHERE sku = $1;", // Seleciona 'origin'
                [sku]
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                const originValue = (row.origin !== null && row.origin !== undefined) ? String(row.origin) : '';
                return Product.fromExisting({
                    id: row.id,
                    name: row.name,
                    price: parseFloat(row.price),
                    sku: row.sku,
                    balance: parseInt(row.balance, 10),
                    categories: row.categories || [],
                    origin: originValue, 
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
            const result: QueryResult = await db.query(
                "SELECT id, name, price, sku, balance, categories, origin FROM products WHERE name ILIKE $1;", // ILIKE para busca case-insensitive
                [`%${name}%`] // Adiciona curingas para busca parcial de nome
            );

            if (result.rowCount && result.rowCount > 0) {
                const row: any = result.rows[0];
                const originValue = (row.origin !== null && row.origin !== undefined) ? String(row.origin) : '';
                return Product.fromExisting({
                    id: row.id,
                    name: row.name,
                    price: parseFloat(row.price),
                    sku: row.sku,
                    balance: parseInt(row.balance, 10),
                    categories: row.categories || [],
                    origin: originValue, 
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
     * @param origin A origem dos produtos a serem buscados.
     * @returns Um array de entidades Product. Pode ser um array vazio se não houver produtos.
     * @throws {Error} Se houver um erro de banco de dados.
     */
    public async findByOrigin(origin: string): Promise<Product[]> {
        await using db = await DBConnection.connect();
        try {
            const result: QueryResult = await db.query(
                "SELECT id, name, price, sku, balance, categories, origin FROM products WHERE origin ILIKE $1;", // ILIKE para busca case-insensitive
                [`%${origin}%`] // Adiciona curingas para busca parcial de origem
            );

            // A correção está aqui: Filtra linhas que não podem formar uma entidade Product válida
            return result.rows.map((row: any) => {
                const originValue = (row.origin !== null && row.origin !== undefined) ? String(row.origin) : '';
                
                // Se a origem for vazia/inválida, retornamos null explicitamente
                // para que o filter remova este item do array final.
                if (originValue.trim() === '') { // Usando trim() para pegar strings com só espaços
                    console.warn(`Produto com ID ${row.id || 'N/A'} possui origem inválida (vazia/apenas espaços) no DB. Ignorando.`);
                    return null; 
                }

                try {
                    // Tenta criar a entidade SOMENTE se originValue não for vazia
                    return Product.fromExisting({
                        id: row.id,
                        name: row.name,
                        price: parseFloat(row.price),
                        sku: row.sku,
                        balance: parseInt(row.balance, 10),
                        categories: row.categories || [],
                        origin: originValue, 
                    });
                } catch (entityError: any) {
                    // Captura erros específicos da entidade durante o mapeamento (outras validações)
                    console.error(`Erro ao criar entidade Product a partir da linha do DB (ID: ${row.id || 'N/A'}):`, entityError);
                    return null; // Retorna null para filtrar produtos inválidos
                }
            }).filter((p): p is Product => p !== null); // Filtra os nulos e garante o tipo Product[]
        } catch (error: any) {
            console.error(`Erro no repositório ao buscar produtos por origem ${origin}:`, error);
            throw new Error(`Falha ao buscar produtos por origem: ${error.message}`);
        }
    }

    /**
     * Busca todos os produtos no banco de dados.
     * @returns Um array de entidades Product. Pode ser um array vazio se não houver produtos.
     * @throws {Error} Se houver um erro de banco de dados.
     */
    public async findAll(): Promise<Product[]> {
        await using db = await DBConnection.connect();
        try {
            const result: QueryResult = await db.query(
                "SELECT id, name, price, sku, balance, categories, origin FROM products;" // Seleciona 'origin'
            );

            // Mapeia todas as linhas retornadas para um array de entidades Product
            return result.rows.map((row: any) => {
                const originValue = (row.origin !== null && row.origin !== undefined) ? String(row.origin) : '';

                if (originValue.trim() === '') { // Usando trim() para pegar strings com só espaços
                    console.warn(`Produto com ID ${row.id || 'N/A'} possui origem inválida (vazia/apenas espaços) no DB. Ignorando.`);
                    return null;
                }

                try {
                    return Product.fromExisting({
                        id: row.id,
                        name: row.name,
                        price: parseFloat(row.price),
                        sku: row.sku,
                        balance: parseInt(row.balance, 10),
                        categories: row.categories || [],
                        origin: originValue, 
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
        // Desestruturando para incluir 'origin'
        const { name, price, sku, balance, categories, origin } = product;

        try {
            const result: QueryResult = await db.query(
                `UPDATE products
                 SET name = $1, price = $2, sku = $3, balance = $4, categories = $5, origin = $6
                 WHERE id = $7
                 RETURNING id, name, price, sku, balance, categories, origin;`, // Retorna todos os campos, incluindo 'origin'
                [name, price, sku, balance, categories || [], origin, id] // 'origin' e 'id' nos parâmetros
            );

            if (result.rowCount && result.rowCount > 0) {
                const updatedProductData: any = result.rows[0];
                const originValue = (updatedProductData.origin !== null && updatedProductData.origin !== undefined) ? String(updatedProductData.origin) : '';
                
                // Se a origem for inválida após a atualização, isso é um problema crítico.
                // Devemos lançar um erro, pois a atualização resultou em um estado inválido para a entidade.
                if (originValue.trim() === '') { // Usando trim() para pegar strings com só espaços
                    throw new Error(`O produto atualizado com ID ${id} resultou em uma origem inválida (vazia/apenas espaços) no DB.`);
                }

                return Product.fromExisting({
                    id: updatedProductData.id,
                    name: updatedProductData.name,
                    price: parseFloat(updatedProductData.price),
                    sku: updatedProductData.sku,
                    balance: parseInt(updatedProductData.balance, 10),
                    categories: updatedProductData.categories || [],
                    origin: originValue, 
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
                "DELETE FROM products WHERE id = $1;",
                [id]
            );
            return result.rowCount !== null && result.rowCount !== undefined && result.rowCount > 0; // Correção aqui
        } catch (error: any) {
            console.error(`Erro no repositório ao deletar produto ${id}:`, error);
            throw new Error(`Não foi possível deletar o produto: ${error.message}`);
        }
    }
}
