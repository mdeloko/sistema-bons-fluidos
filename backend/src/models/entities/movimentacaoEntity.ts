type MovimentacaoProps = {
    id_vendas?: number;
    produto_id: number;
    usuario_id: number;
    tipo: 'entrada' | 'saida';
    quantidade_movimentada: number;
    data_movimentacao: Date;
    observacoes?: string;
};
export class Movimentacao {
    private constructor(readonly props: MovimentacaoProps) {}

    static create(
        produto_id: number,
        usuario_id: number,
        tipo: 'entrada' | 'saida',
        quantidade_movimentada: number,
        data_movimentacao: Date,
        observacoes?: string,
        id_vendas?: number
    ) {
        return new Movimentacao(
            {id_vendas,
            produto_id,
            usuario_id,
            tipo,
            quantidade_movimentada,
            data_movimentacao,
            observacoes}
        );
    }
}