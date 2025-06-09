// src/pages/ProductsPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Product } from '../types/product.d.ts';
import styles from '../styles/ProductsPage.module.css';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // <-- NOVO: Estado para o termo de busca
  const navigate = useNavigate();

  // Função para buscar os produtos da API
  // Agora, fetchProducts aceita um termo de busca opcional
  const fetchProducts = useCallback(async (term?: string) => { // <-- ATUALIZADO: Aceita 'term'
    try {
      setLoading(true);
      // A API mockada terá que ser atualizada para filtrar por este 'term'
      // Passamos o termo de busca como parte da configuração da requisição (ex: params)
      const response = await api.get<Product[]>('/products', { params: { search: term } }); // <-- ATUALIZADO: Passa params
      setProducts(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar produtos:', err);
      setError(err.response?.data?.message || err.message || 'Falha ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para buscar os produtos ao montar o componente
  // e quando o termo de busca mudar
  useEffect(() => {
    const handler = setTimeout(() => { // <-- NOVO: Debounce para busca
        fetchProducts(searchTerm);
    }, 300); // Espera 300ms depois que o usuário para de digitar

    return () => {
        clearTimeout(handler); // Limpa o timeout se o componente desmontar ou termo mudar antes
    };
  }, [fetchProducts, searchTerm]); // <-- ATUALIZADO: Depende de fetchProducts e searchTerm

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      alert(`Produto excluído com sucesso (simulação)!`);
      fetchProducts(searchTerm); // <-- ATUALIZADO: Recarrega com o termo de busca atual
    } catch (err: any) {
      console.error('Erro ao excluir produto:', err);
      alert(`Falha ao excluir produto: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
    }
  };

  // Handler para o input de busca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingMessage}>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gerenciar Produtos</h1>
      <div className={styles.actionsBar}>
        {/* Campo de Busca */}
        <input
          type="text"
          placeholder="Buscar produtos por nome ou SKU..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput} // <-- Nova classe CSS
        />
        <button onClick={handleAddProduct} className={styles.primaryButton}>
          Adicionar Novo Produto
        </button>
      </div>

      {products.length === 0 ? (
        <p className={styles.noDataMessage}>
          {searchTerm ? `Nenhum produto encontrado para "${searchTerm}".` : 'Nenhum produto cadastrado. Adicione um novo!'}
        </p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.sku || 'N/A'}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>R$ {product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => handleEditProduct(product.id)} className={styles.editButton}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className={styles.deleteButton}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;