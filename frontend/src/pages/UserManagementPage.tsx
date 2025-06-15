// src/pages/UserManagementPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Instância mockada da API
import type { User } from '../types/user.d.ts'; // Importa a interface User
import pageStyles from '../styles/PageLayout.module.css'; // Estilos de layout de página
import styles from '../styles/UserManagementPage.module.css'; // Vamos criar este CSS Module

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null); // Erros de ação (editar/excluir)

  // Função para buscar os usuários da API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Chama o endpoint de listagem de usuários
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
      setError(null); // Limpa erros de busca anteriores
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.response?.data?.message || err.message || 'Falha ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para buscar os usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handler para mudar a role de um usuário
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    setActionError(null); // Limpa erros de ação anteriores
    if (!window.confirm(`Tem certeza que deseja mudar a role do usuário para '${newRole}'?`)) {
      return;
    }
    try {
      // Chama o endpoint PUT para atualizar a role
      await api.put(`/users/${userId}/role`, { role: newRole });
      alert(`Role do usuário ${userId} alterada para ${newRole} (simulação)!`);
      fetchUsers(); // Recarrega a lista para mostrar a mudança
    } catch (err: any) {
      console.error('Erro ao mudar role do usuário:', err);
      setActionError(err.response?.data?.message || err.message || 'Falha ao mudar role do usuário.');
    }
  };

  // Handler para excluir um usuário (Opcional - só se o backend permitir)
  const handleDeleteUser = async (userId: string) => {
    setActionError(null);
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    try {
      // Chama o endpoint DELETE para excluir o usuário
      await api.delete(`/users/${userId}`);
      alert(`Usuário ${userId} excluído (simulação)!`);
      fetchUsers(); // Recarrega a lista
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      setActionError(err.response?.data?.message || err.message || 'Falha ao excluir usuário.');
    }
  };

  if (loading) {
    return (
      <div className={pageStyles.pageContainer}>
        <p className={pageStyles.loadingMessage}>Carregando usuários...</p>
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
      <div className={styles.container}>
        <h1 className={styles.title}>Gerenciamento de Usuários</h1>
        {actionError && <p className={styles.actionErrorMessage}>{actionError}</p>}

        {users.length === 0 ? (
          <p className={styles.noDataMessage}>Nenhum usuário cadastrado.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>RA</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.ra}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleUser}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuário Comum'}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      {/* Botão para mudar role */}
                      <button
                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                        className={user.role === 'admin' ? styles.demoteButton : styles.promoteButton}
                        // Desabilita se for o único admin (exemplo: se user.id === 'user1' que é o admin principal)
                        // ou se for o próprio usuário logado (precisaria do id do user logado do AuthContext)
                        disabled={user.id === 'user1'} // Exemplo simples para o admin principal mockado
                      >
                        {user.role === 'admin' ? 'Tornar Usuário' : 'Tornar Admin'}
                      </button>
                      {/* Botão de Excluir Usuário */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className={styles.deleteButton}
                        disabled={user.id === 'user1'} // Evita excluir o admin principal
                      >
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
    </div>
  );
}

export default UserManagementPage;