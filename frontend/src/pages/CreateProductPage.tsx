// src/pages/CreateProductPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importa a instância mockada da API
import type { Product } from '../types/product.d.ts'; // Importa a interface Product
import ProductForm from '../components/ProductForm'; // Importa o componente ProductForm
import pageStyles from '../styles/PageLayout.module.css'; // Para layout de página (fundo)

function CreateProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProduct = async (productData: Product) => {
    setLoading(true);
    setError(null);
    try {
      // A API mockada em api.ts já tem lógica para adicionar produtos a mockProducts
      await api.post<Product>('/products', productData); // Requisição POST para criar o produto
      alert('Produto adicionado com sucesso!');
      navigate('/products'); // Redireciona para a lista de produtos
    } catch (err: any) {
      console.error('Erro ao adicionar produto:', err);
      setError(err.response?.data?.message || err.message || 'Falha ao adicionar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products'); // Redireciona de volta para a lista de produtos
  };

  return (
    <div className={pageStyles.pageContainer}> {/* Usa um container global de layout */}
      <ProductForm
        onSubmit={handleCreateProduct}
        onCancel={handleCancel}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default CreateProductPage;