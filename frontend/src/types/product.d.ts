// src/types/product.d.ts

// Define a estrutura de um objeto Produto
export interface Product {
  id: string; // ID único do produto (gerado pelo backend)
  name: string; // Nome do produto
  description: string; // Descrição detalhada
  price: number; // Preço unitário do produto
  quantity: number; // Quantidade atual em estoque
  category: string; // Categoria do produto (ex: "Material Escolar")
  sku?: string; // Opcional: SKU (Stock Keeping Unit) - Código único do produto
  // Adicione outros campos se o backend e sistema exigirem
}