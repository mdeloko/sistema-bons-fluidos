import { MovimentacaoRepository } from "../repositories/movimentacaoRepository.js";
import { CreateMovimentacaoDTO, UpdateMovimentacaoDTO, DeleteMovimentacaoDTO } from "../dtos/movimentacaoDtos.js";

export class MovimentacaoService {
    constructor(private movimentacaoRepository = new MovimentacaoRepository()) {}

    async createMovimentacao(dto: CreateMovimentacaoDTO) {
        return this.movimentacaoRepository.create(dto);
    }

    async listMovimentacoes() {
        return this.movimentacaoRepository.list();
    }

    async getMovimentacaoById(id_vendas: number) {
        return this.movimentacaoRepository.getById(id_vendas);
    }

    async updateMovimentacao(dto: UpdateMovimentacaoDTO) {
        return this.movimentacaoRepository.update(dto);
    }

    async deleteMovimentacao(dto: DeleteMovimentacaoDTO) {
        return this.movimentacaoRepository.delete(dto);
    }
}