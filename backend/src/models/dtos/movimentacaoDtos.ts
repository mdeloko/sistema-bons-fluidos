export type CreateMovimentacaoDTO = {
    produto_id: number;
    usuario_id: number;
    tipo: 'entrada' | 'saida';
    quantidade_movimentada: number;
    observacoes?: string;
};

export type UpdateMovimentacaoDTO = {
    id_vendas: number;
    produto_id?: number;
    usuario_id?: number;
    tipo?: 'entrada' | 'saida';
    quantidade_movimentada?: number;
    observacoes?: string;
};

export type DeleteMovimentacaoDTO = {
    id_vendas: number;
};

export type FullMovimentacaoDTO = {
    id_vendas: number;
    produto_id: number;
    usuario_id: number;
    tipo: 'entrada' | 'saida';
    quantidade_movimentada: number;
    data_movimentacao: Date;
    observacoes?: string;
};