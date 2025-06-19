import DBConnection from "../../utils/db.js";
import { Movimentacao } from "../entities/movimentacaoEntity.js";
import { CreateMovimentacaoDTO, UpdateMovimentacaoDTO, DeleteMovimentacaoDTO } from "../dtos/movimentacaoDtos.js";
import { DatabaseError } from "pg";

export class MovimentacaoRepository {
    public async create(mov: CreateMovimentacaoDTO): Promise<Movimentacao | null> {
        await using db = await DBConnection.connect();
        try {
            const result = await db.query(
                `INSERT INTO movimentacoes 
                    (produto_id, usuario_id, tipo, quantidade_movimentada, observacoes) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *;`,
                [mov.produto_id, mov.usuario_id, mov.tipo, mov.quantidade_movimentada, mov.observacoes ?? null]
            );
            if (result.rowCount && result.rowCount > 0) {
                const row = result.rows[0];
                return Movimentacao.create(
                    row.produto_id,
                    row.usuario_id,
                    row.tipo,
                    row.quantidade_movimentada,
                    row.data_movimentacao,
                    row.observacoes,
                    row.id_vendas
                );
            }
            return null;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw new Error("Erro ao criar movimentação: " + error.message);
            }
            throw error;
        }
    }

    public async list(): Promise<Movimentacao[]> {
        await using db = await DBConnection.connect();
        const result = await db.query("SELECT * FROM movimentacoes ORDER BY data_movimentacao DESC;");
        return result.rows.map((row: any) =>
            Movimentacao.create(
                row.produto_id,
                row.usuario_id,
                row.tipo,
                row.quantidade_movimentada,
                row.data_movimentacao,
                row.observacoes,
                row.id_vendas
            )
        );
    }

    public async getById(id_vendas: number): Promise<Movimentacao | null> {
        await using db = await DBConnection.connect();
        const result = await db.query("SELECT * FROM movimentacoes WHERE id_vendas = $1;", [id_vendas]);
        if (result.rowCount && result.rowCount > 0) {
            const row = result.rows[0];
            return Movimentacao.create(
                row.produto_id,
                row.usuario_id,
                row.tipo,
                row.quantidade_movimentada,
                row.data_movimentacao,
                row.observacoes,
                row.id_vendas
            );
        }
        return null;
    }

    public async update(mov: UpdateMovimentacaoDTO): Promise<boolean> {
        await using db = await DBConnection.connect();
        const fields = [];
        const values = [];
        let idx = 1;
        if (mov.produto_id !== undefined) {
            fields.push(`produto_id = $${idx++}`);
            values.push(mov.produto_id);
        }
        if (mov.usuario_id !== undefined) {
            fields.push(`usuario_id = $${idx++}`);
            values.push(mov.usuario_id);
        }
        if (mov.tipo !== undefined) {
            fields.push(`tipo = $${idx++}`);
            values.push(mov.tipo);
        }
        if (mov.quantidade_movimentada !== undefined) {
            fields.push(`quantidade_movimentada = $${idx++}`);
            values.push(mov.quantidade_movimentada);
        }
        if (mov.observacoes !== undefined) {
            fields.push(`observacoes = $${idx++}`);
            values.push(mov.observacoes);
        }
        if (fields.length === 0) return false;
        values.push(mov.id_vendas);
        const query = `UPDATE movimentacoes SET ${fields.join(", ")} WHERE id_vendas = $${idx};`;
        const result = await db.query(query, values);
        return !!(result.rowCount && result.rowCount > 0);
    }

    public async delete(mov: DeleteMovimentacaoDTO): Promise<boolean> {
        await using db = await DBConnection.connect();
        const result = await db.query("DELETE FROM movimentacoes WHERE id_vendas = $1;", [mov.id_vendas]);
        return !!(result.rowCount && result.rowCount > 0);
    }
}