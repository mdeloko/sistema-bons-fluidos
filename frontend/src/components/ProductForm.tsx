// src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import type { Product } from '../types/product'; // Importa a interface Product
import styles from '../styles/ProductForm.module.css'; 

// Define os props que o ProductForm pode receber
interface ProductFormProps {
  // Se 'initialData' for fornecido, o formulário está em modo de edição
  initialData?: Product | null;
  // Função que será chamada ao submeter o formulário (seja para criar ou atualizar)
  onSubmit: (productData: Product) => void;
  // Função opcional para cancelar a operação
  onCancel?: () => void;
  // Status de carregamento do botão (enquanto a API está sendo chamada)
  loading?: boolean;
  // Mensagem de erro para exibir, se houver
  error?: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState<Product>({
    id: initialData?.id || '', // ID só é relevante em edição, mas é parte da interface Product
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    quantity: initialData?.quantity || 0,
    category: initialData?.category || '',
    sku: initialData?.sku || '',
  });

  // Efeito para atualizar o formulário se initialData mudar (útil para edição)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handler para atualizar o estado do formulário quando os inputs mudam
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Converte valores numéricos para números
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value, // Garante que é número
    }));
  };

  // Handler para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Chama a função onSubmit passada como prop, passando os dados do formulário
    onSubmit(formData);
  };

  // Determina se o formulário está em modo de criação ou edição
  const isEditing = !!initialData?.id;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      {error && <p className={styles.errorMessage}>{error}</p>} {/* Exibe mensagens de erro */}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo Nome */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome do produto"
            required
            className={styles.input}
          />
        </div>

        {/* Campo Descrição */}
        <div className={styles.formGroup}>
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição detalhada do produto"
            className={styles.textarea} // Use textarea para descrições longas
          />
        </div>

        {/* Campo Preço */}
        <div className={styles.formGroup}>
          <label htmlFor="price">Preço:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01" // Permite valores decimais
            required
            className={styles.input}
          />
        </div>

        {/* Campo Quantidade */}
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Quantidade:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            required
            className={styles.input}
          />
        </div>

        {/* Campo Categoria */}
        <div className={styles.formGroup}>
          <label htmlFor="category">Categoria:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ex: Eletrônicos, Escritório"
            required
            className={styles.input}
          />
        </div>

        {/* Campo SKU */}
        <div className={styles.formGroup}>
          <label htmlFor="sku">SKU (Código do Produto):</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Código único (opcional)"
            className={styles.input}
          />
        </div>

        {/* Botões de Ação */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Produto' : 'Adicionar Produto')}
          </button>
          {onCancel && (
            <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;