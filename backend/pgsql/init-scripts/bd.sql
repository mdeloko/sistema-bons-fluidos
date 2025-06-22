ALTER DATABASE bons_fluidos SET TIMEZONE = 'America/Sao_Paulo';
CREATE TYPE public.tipo_movimentacao AS ENUM
    ('entrada', 'saida');
CREATE TABLE IF NOT EXISTS usuarios
(
    id SERIAL NOT NULL,
    ra character varying(20) COLLATE pg_catalog."default" NOT NULL,
    nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    senha_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_admin boolean NOT NULL DEFAULT false,
    criado_em timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_email_key UNIQUE (email),
    CONSTRAINT usuarios_ra_key UNIQUE (ra)
);
CREATE TABLE IF NOT EXISTS produtos
(
    id SERIAL NOT NULL,
    sku character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nome character varying(100) COLLATE pg_catalog."default" NOT NULL,
    preco numeric(10,2) NOT NULL,
    quantidade integer NOT NULL DEFAULT 0,
    categoria_id text COLLATE pg_catalog."default" NOT NULL,
    origin character varying(255) NOT NULL,
    criado_em timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT produtos_pkey PRIMARY KEY (id),
    CONSTRAINT produtos_sku_key UNIQUE (sku),
    CONSTRAINT produtos_preco_check CHECK (preco >= 0::numeric),
    CONSTRAINT produtos_quantidade_check CHECK (quantidade >= 0)
);
CREATE TABLE IF NOT EXISTS movimentacoes
(
    id_vendas SERIAL NOT NULL,
    produto_id integer NOT NULL,
    usuario_id integer NOT NULL,
    tipo tipo_movimentacao NOT NULL,
    quantidade_movimentada integer NOT NULL,
    data_movimentacao timestamp WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacoes text COLLATE pg_catalog."default",
    CONSTRAINT movimentacoes_pkey PRIMARY KEY (id_vendas),
    CONSTRAINT movimentacoes_produto_id_fkey FOREIGN KEY (produto_id)
        REFERENCES produtos (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT movimentacoes_usuario_id_fkey FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT movimentacoes_quantidade_movimentada_check CHECK (quantidade_movimentada > 0)
);

INSERT INTO usuarios (ra,nome,email,senha_hash,is_admin) VALUES 
(
    'admin',
    'Administrador',
    'admin@bonsfluidos.com',
    '$2b$10$v4CeSB0/WVjO.tSWAy5cIOEODaagusQJER2z6RF1PfBYIqCIn6vji',
    true
);