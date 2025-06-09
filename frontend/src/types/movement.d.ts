// src/types/movement.d.ts

export interface StockMovement {
  id: string;              // ID único da movimentação
  productId: string;       // ID do produto que foi movimentado
  productName: string;     // Nome do produto (para exibição fácil)
  quantity: number;        // Quantidade de produtos movimentados
  type: 'Entrada' | 'Saída'; // Tipo da movimentação
  reason?: string;         // Opcional: Razão da movimentação (venda, compra, ajuste, perda)
  date: string;            // Data e hora da movimentação (ISO string)
  // userId?: string;        // Opcional: ID do usuário que fez a movimentação
}