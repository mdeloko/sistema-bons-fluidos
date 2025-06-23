import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext'; // Para o logout e estado de auth
import api from '../api';
import styles from '../styles/DashBoard.module.css';

// 1. Defina a interface para os dados que o backend vai retornar para o resumo do dashboard
interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  recentMovements: Array<{
    id: string;
    productName: string;
    type: 'Entrada' | 'Saída'; // Tipagem específica para tipo de movimento
    quantity: number;
    date: string; // Data como string ISO (ex: "2025-06-05T10:00:00Z")
  }>;
  totalValueInStock?: number; // Opcional: valor total do estoque
}

function DashboardPage() {
  const { logout } = useAuth(); // Obtém a função de logout do contexto
  const navigate = useNavigate(); // Hook para navegar para outras páginas

  // Estados para os dados do dashboard, carregamento e erros
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados do dashboard quando o componente é montado
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        // Usa a instância 'api' do Axios, que já adiciona o token automaticamente.
        const response = await api.get<DashboardSummary>('/dashboard/summary'); // Endpoint do backend para o resumo
        setSummary(response.data); // Define os dados do resumo
      } catch (err: any) {
        console.error('Erro ao buscar resumo do dashboard:', err);
        // Trata erros de autenticação (401) especificamente
        if (err.response && err.response.status === 401) {
          setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
          logout(); // Força o logout se o token for inválido/expirado
        } else {
          setError(err.message || 'Erro ao carregar os dados do dashboard.');
        }
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    fetchDashboardSummary(); // Chama a função de busca de dados
  }, [logout]); // Dependência: refaz a requisição se 'logout' mudar (improvável, mas boa prática)

  return (
    <div className={styles.container}> {/* <-- APLIQUE styles.container */}
      <h1 className={styles.title}>Bem-vindo ao Dashboard do Estoque!</h1> {/* <-- APLIQUE styles.title */}

      {loading && <p>Carregando dados do dashboard...</p>}
      {error && <p className={styles.error}>{error}</p>} {/* <-- APLIQUE styles.error */}

      {summary && (
        <>
          <div className={styles.summaryCards}> {/* <-- APLIQUE styles.summaryCards */}
            <div className={styles.card}> {/* <-- APLIQUE styles.card */}
              <h3>Total de Produtos</h3>
              <p>{summary.totalProducts}</p>
            </div>
            <div className={styles.card}> {/* <-- APLIQUE styles.card */}
              <h3>Produtos com Baixo Estoque</h3>
              <p style={{ color: summary.lowStockProducts > 0 ? 'orange' : 'inherit' }}>
                {summary.lowStockProducts}
              </p>
            </div>
            {summary.totalValueInStock !== undefined && (
              <div className={styles.card}> {/* <-- APLIQUE styles.card */}
                <h3>Valor Total em Estoque</h3>
                <p>R$ {summary.totalValueInStock.toFixed(2)}</p>
              </div>
            )}
          </div>

          <div className={styles.recentMovements}> {/* <-- APLIQUE styles.recentMovements */}
            <h2>Movimentações Recentes</h2>
            {summary.recentMovements.length > 0 ? (
              <ul>
                {summary.recentMovements.map((movement) => (
                  <li key={movement.id}>
                    Produto: **{movement.productName}** | Tipo: {movement.type} | Qtd: {movement.quantity} | Data: {new Date(movement.date).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma movimentação recente encontrada.</p>
            )}
          </div>

          <div className={styles.quickActions}> {/* <-- APLIQUE styles.quickActions */}
            <h3>Ações Rápidas</h3>
            <button onClick={() => navigate('/products')} className={styles.button}>Gerenciar Produtos</button> {/* <-- APLIQUE styles.button */}
            <button onClick={() => navigate('/movements/new')} className={styles.button}>Nova Entrada/Saída</button> {/* <-- APLIQUE styles.button */}
          </div>
        </>
      )}

      {!summary && !loading && !error && (
        <p>Nenhum dado de resumo disponível no momento.</p>
      )}

      <button onClick={logout} className={styles.logoutButton}>Sair da conta</button> {/* <-- APLIQUE styles.logoutButton */}
    </div>
  );
}

export default DashboardPage;