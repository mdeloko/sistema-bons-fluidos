// src/pages/MovementsHistoryPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importa a instância mockada da API
import type { StockMovement } from '../types/movement.d.ts'; // Importa a interface StockMovement
import pageStyles from '../styles/PageLayout.module.css'; // Estilos de layout de página
import styles from '../styles/MovementsHistoryPage.module.css'; // Vamos criar este CSS Module

function MovementsHistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Não será usado diretamente aqui, mas pode ser útil para outros links

  // Função para buscar as movimentações da API
  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<StockMovement[]>('/movements'); // Chama o endpoint para listar movimentações
      setMovements(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar movimentações:', err);
      setError(err.response?.data?.message || err.message || 'Falha ao carregar histórico de movimentações.');
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para esta função, ela é estável

  // Efeito para buscar as movimentações ao montar o componente
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]); // fetchMovements é uma dependência, mas é estável

  if (loading) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.loadingMessage}>Carregando histórico de movimentações...</p>
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

  return (
    <div className={pageStyles.pageContainer}>
      <h1 className={styles.title}>Histórico de Movimentações</h1>
      <div className={styles.actionsBar}>
        {/* Opcional: botão para adicionar nova movimentação direto daqui */}
        <button onClick={() => navigate('/movements/new')} className={styles.primaryButton}>
          Registrar Nova Movimentação
        </button>
      </div>

      {movements.length === 0 ? (
        <p className={styles.noDataMessage}>Nenhuma movimentação registrada ainda.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.movementsTable}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Razão</th>
                <th>ID do Produto</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(movement => (
                <tr key={movement.id}> {/* Use o ID da movimentação como chave */}
                  <td>{new Date(movement.date).toLocaleString('pt-BR')}</td> {/* Formata data e hora */}
                  <td>{movement.productName}</td>
                  <td>
                    <span className={movement.type === 'Entrada' ? styles.typeEntry : styles.typeExit}>
                      {movement.type}
                    </span>
                  </td>
                  <td>{movement.quantity}</td>
                  <td>{movement.reason || 'N/A'}</td>
                  <td>{movement.productId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MovementsHistoryPage;