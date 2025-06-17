import { Request, Response } from "express";
import { MovimentacaoService } from "../models/services/movimentacaoService.js";
import { EHttpStatusCode as StatusCode } from "../@types/httpStatusCode.js";

export class MovimentacaoController {
    constructor(private movimentacaoService = new MovimentacaoService()) {}

    public async createMovimentacao(req: Request, res: Response) {
        try {
            const mov = await this.movimentacaoService.createMovimentacao(req.body);
            if (mov) {
                res.status(StatusCode.CREATED).json(mov);
            } else {
                res.status(StatusCode.BAD_REQUEST).json({ message: "Não foi possível registrar a movimentação." });
            }
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    public async listMovimentacoes(req: Request, res: Response) {
        try {
            const movs = await this.movimentacaoService.listMovimentacoes();
            res.status(StatusCode.OK).json(movs);
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    public async getMovimentacaoById(req: Request, res: Response) {
        try {
            const id_vendas = Number(req.params.id_vendas);
            const mov = await this.movimentacaoService.getMovimentacaoById(id_vendas);
            if (mov) {
                res.status(StatusCode.OK).json(mov);
            } else {
                res.status(StatusCode.NOT_FOUND).json({ message: "Movimentação não encontrada." });
            }
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    public async updateMovimentacao(req: Request, res: Response) {
        try {
            const dto = { ...req.body, id_vendas: Number(req.params.id_vendas) };
            const updated = await this.movimentacaoService.updateMovimentacao(dto);
            if (updated) {
                res.status(StatusCode.OK).json({ message: "Movimentação atualizada com sucesso." });
            } else {
                res.status(StatusCode.NOT_FOUND).json({ message: "Movimentação não encontrada." });
            }
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    public async deleteMovimentacao(req: Request, res: Response) {
        try {
            const id_vendas = Number(req.params.id_vendas);
            const deleted = await this.movimentacaoService.deleteMovimentacao({ id_vendas });
            if (deleted) {
                res.status(StatusCode.OK).json({ message: "Movimentação deletada com sucesso." });
            } else {
                res.status(StatusCode.NOT_FOUND).json({ message: "Movimentação não encontrada." });
            }
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}