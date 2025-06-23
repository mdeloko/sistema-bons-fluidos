// src/pages/NewMovementPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // API mockada
import type { Product } from '../types/product.d.ts'; // Para a lista de produtos
import type { StockMovement } from '../types/movement.d.ts'; // Para a interface de movimentação
import pageStyles from '../styles/PageLayout.module.css'; // Layout de página
import styles from '../styles/NewMovementPage.module.css'; // CSS específico da página

function NewMovementPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]); // Lista de produtos para o dropdown
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [movementType, setMovementType] = useState<'Entrada' | 'Saída'>('Entrada');
  const [reason, setReason] = useState<string>('');

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- Efeito para carregar a lista de produtos para o dropdown ---
  useEffect(() => {
    const fetchProductsForDropdown = async () => {
      try {
        setLoadingProducts(true);
        const response = await api.get<Product[]>('/products');
        setProducts(response.data);
        if (response.data.length > 0) {
          setSelectedProductId(response.data[0].id); // Seleciona o primeiro produto por padrão
        }
      } catch (err: any) {
        console.error('Erro ao carregar produtos para dropdown:', err);
        setErrorProducts(err.response?.data?.message || err.message || 'Falha ao carregar produtos.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductsForDropdown();
  }, []);

  // --- Handler para submeter a movimentação ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    if (!selectedProductId || quantity <= 0) {
      setSubmitError('Selecione um produto e insira uma quantidade válida.');
      setSubmitting(false);
      return;
    }

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) {
      setSubmitError('Produto selecionado inválido.');
      setSubmitting(false);
      return;
    }

    try {
      // Os dados enviados devem corresponder ao que o mock (e futuro backend) espera
      const movementData: Partial<StockMovement> = { // Usamos Partial porque o ID e data são gerados na API mock
        productId: selectedProductId,
        quantity: quantity,
        type: movementType,
        reason: reason,
        // productName não é enviado, mas sim gerado na API mock a partir do productId
      };

      await api.post<StockMovement>('/movements', movementData); // Chamada POST para a API
      alert('Movimentação registrada com sucesso!');
      navigate('/products'); // Redireciona para a página de produtos para ver o estoque atualizado
    } catch (err: any) {
      console.error('Erro ao registrar movimentação:', err);
      setSubmitError(err.response?.data?.message || err.message || 'Falha ao registrar movimentação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.loadingMessage}>Carregando produtos para movimentação...</p>
      </div>
    );
  }

  if (errorProducts) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.errorMessage}>{errorProducts}</p>
      </div>
    );
  }

  return (
    <div className={pageStyles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Registrar Nova Movimentação</h1>
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Seleção do Produto */}
          <div className={styles.formGroup}>
            <label htmlFor="product">Produto:</label>
            <select
              id="product"
              name="product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              className={styles.select}
            >
              {products.length === 0 ? (
                <option value="">Nenhum produto disponível</option>
              ) : (
                products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Estoque: {product.quantity})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Quantidade */}
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantidade:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder="0"
              min="1"
              required
              className={styles.input}
            />
          </div>

          {/* Tipo de Movimentação */}
          <div className={styles.formGroup}>
            <label htmlFor="movementType">Tipo de Movimentação:</label>
            <select
              id="movementType"
              name="movementType"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as 'Entrada' | 'Saída')}
              required
              className={styles.select}
            >
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>

          {/* Razão da Movimentação (Opcional) */}
          <div className={styles.formGroup}>
            <label htmlFor="reason">Razão (Opcional):</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Compra, Venda, Ajuste, Perda"
              className={styles.input}
            />
          </div>

          {/* Botões de Ação */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Movimentação'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => navigate('/products')} disabled={submitting}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewMovementPage;