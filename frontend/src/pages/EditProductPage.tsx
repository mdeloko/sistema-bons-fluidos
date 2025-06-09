// src/pages/EditProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Importa a instância mockada da API
import type { Product } from '../types/product.d.ts'; // Importa a interface Product
import ProductForm from '../components/ProductForm'; // Importa o componente ProductForm
import pageStyles from '../styles/PageLayout.module.css'; // Estilos de layout de página

function EditProductPage() {
  // Hook para obter os parâmetros da URL (neste caso, o 'id' do produto)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false); // Estado para o botão de salvar
  const [saveError, setSaveError] = useState<string | null>(null); // Erro ao salvar

  // --- Efeito para buscar os dados do produto quando a página é carregada ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID do produto não fornecido na URL.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Faz a requisição GET para buscar o produto específico por ID
        const response = await api.get<Product>(`/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar produto para edição:', err);
        setError(err.response?.data?.message || err.message || 'Falha ao carregar produto para edição.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Dependência: refaz a busca se o ID na URL mudar

  // --- Handler para submeter o formulário de edição ---
  const handleUpdateProduct = async (updatedProductData: Product) => {
    setSaving(true); // Ativa o estado de salvamento
    setSaveError(null); // Limpa erros anteriores
    try {
      if (!id) {
        throw new Error('ID do produto ausente para atualização.');
      }
      // Faz a requisição PUT para atualizar o produto
      await api.put<Product>(`/products/${id}`, updatedProductData);
      alert('Produto atualizado com sucesso!');
      navigate('/products'); // Redireciona para a lista de produtos
    } catch (err: any) {
      console.error('Erro ao atualizar produto:', err);
      setSaveError(err.response?.data?.message || err.message || 'Falha ao atualizar produto.');
    } finally {
      setSaving(false); // Desativa o estado de salvamento
    }
  };

  const handleCancel = () => {
    navigate('/products'); // Redireciona de volta para a lista de produtos
  };

  if (loading) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.loadingMessage}>Carregando dados do produto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.errorMessage}>{error}</p>
      </div>
    );
  }

  // Se não há produto e não está carregando nem com erro, significa que o produto não foi encontrado
  if (!product) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.noDataMessage}>Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className={pageStyles.pageContainer}>
      <ProductForm
        initialData={product} // Passa os dados do produto para pré-preencher o formulário
        onSubmit={handleUpdateProduct}
        onCancel={handleCancel}
        loading={saving} // Usa o estado de salvamento para o loading do formulário
        error={saveError} // Passa o erro de salvamento
      />
    </div>
  );
}

export default EditProductPage;