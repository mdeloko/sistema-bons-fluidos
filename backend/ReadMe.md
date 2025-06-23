# Documentação Backend

## Índice
1. [Scripts](#scripts)
2. [Versões Utilizadas](#versões-utilizadas)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Exemplos](#exemplos)
    1. [Endpoints](#endpoints)  
        a.[Users](#users)  
        b.[Products](#products)  
        c.[Transactions](#transactions)  
    2. [Funções](#funções)
---
[Voltar ao Topo](#documentação-backend)

### Scripts
#### NPM
Esses foram os scripts criados para o desenvolvimento:
- `npm run tsc:w` - Esse script por baixo dos panos inicia o transpilador do TypeScript em modo vigia para que detecte mudança nos códigos e "recompile" o código diferente para JavaScript, dentro da pasta `./dist`;
- `npm run dev` - Esse script inicia o Node.JS em modo vigia, que detecta quaisquer alterações no código JavaScript e reinicia o runtime do Node para recarregar essas alterações, lembrando que há a necessidade de um aquivo `.env.dev` aqui na pasta raíz que seguirá o modelo proposto em [Variáveis de Ambiente](#variáveis-de-ambiente).;
- `npm run build` - Ao término do desenvolvimento esse script foi utilizado para o último build do código, tamém para a pasta `./dist`;
- `npm start` - **Após o build** este é o comando a ser executado, onde ele apenas inicia o servidor Node.JS, lembrando que aqui também há a necessidade de um aquivo `.env` na pasta raíz que também seguirá o modelo proposto em [Variáveis de Ambiente](#variáveis-de-ambiente).

[Voltar ao Índice](#índice)
#### Docker
O script [docker compose](./pgsql/pg-compose.yaml) utilizado para desenvolvimento se encontra dentro de `backend/pgsql`.  
Para utilizá-lo entre em `backend/postgresql` via terminal e digite `docker compose -f ./pg-compose.yml up -d --build`.  
Ao terminar os testes/desenvolvimento, ainda dentro do diretório, utilizar `docker compose -f ./pg-compose.yml down` para finalizar o containers. Ou `docker compose -f ./pg-compose.yml down -v` com a flag `-v` para desassociar os containers dos seus respectivos volumes e poder apagar as pastas associadas.

[Voltar ao Índice](#índice)

### Versões Utilizadas
Nesta seção constam as versões das tecnologias utilizadas na construção deste projeto (que também podem ser consultadas [aqui](./package.json)).

- Node.JS: v24.0.2
- Express: v5.1
- TypeScript: v5.8.3
- bcrypt: v6.0.0
- JsonWebToken: v9.0.2
- pg: v8.16.0

[Voltar ao Índice](#índice)

### Variáveis de Ambiente
Aqui está detalhado o formato do arquivo `.env` necessário para a aplicação funcionar:
```bash
PORT=
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
JWT_SECRET=
```
- `PORT` - Número da porta para o servidor backend abrir;
- `DB_HOST` - Endereço DNS/IP do banco MariaDB;
- `DB_USER` - Usuário que vai acessar o banco de dados;
- `DB_PASS` - Senha desse usuário de acesso;
- `DB_NAME` - Nome da tabela que será usada na aplicação;
- `DB_PORT` - Porta do banco de dados a ser utilizado.
- `JWT_SECRET` - Secret usado na criação de tokens JWT.

Aqui está detalhado o formato do aqruivo docker.env necessário de ser criado em `/backend/pgsql`:
```bash
POSTGRES_PASSWORD=
POSTGRES_USER=
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```
- `POSTGRES_PASSWORD` - Senha do seu banco PostgreSQL que será criado.
- `POSTGRES_USER` - Usuário o seu banco PostgreSQL que será criado.
- `PGADMIN_DEFAULT_EMAIL` - Email utilizado para login na ferramenta PGAdmin4 criada em conjunto ao banco.
- `PGADMIN_DEFAULT_PASSWORD` - Senha utilizado para login na ferramenta PGAdmin4 criada em conjunto ao banco.

[Voltar ao Índice](#índice)

### Exemplos
Aqui estará detalhado a forma de utilização de cada endpoint e funções com recursos novos do Node v24.

---
#### Endpoints
Aqui ficarão listados os endpoints da aplicação e a forma de utilizá-los.

##### Users
- `/users/login`:
>POST - Envie o corpo abaixo e poderá obter algum retorno listado.
```json
//Enviar
{
    "ra":"",
    "password":""
}
//Receberá
//Sucesso (200)
{
    "auth":true,
    "token":"",
    "role":"admin|user"
}
// Faltando argumentos (400)
{
    "auth":false,
    "message":"Faltando argumentos",
    "status":400
}
// R.A. não encontrado (404)
{
    "auth":false,
    "message": "R.A. não encontrado.",
    "status": 404,
}
// Senha ou R.A. Errados (401)
{
    "auth":false,
    "message":"Senha ou R.A. errados.",
    "status":401
}
```

- `/users`:
>GET - Retornará uma lista de usuários se o requisitante for administrador, use o seguinte header de requisição:
```json
//Header
{
    "Authorization":"seu_JWT_admin"
}

//Receberá
//Sucesso (200)
[
    {
        //Lista de Usuários, sem os hashes de suas senhas.
    }
]
// Caso não for administrador (401)
{
    "message": "Acesso negado.",
    "status": 401,
}
```
>POST - Envie com o corpo listado abaixo, e caso a inserção no banco funcionar, retornará Criado (201) ou Erro interno do servidor (500).

```json
{
    "ra":"7654321",
    "name":"Foo Bar",
    "password":"123123",
    "email":"example@mail.com",
    "isAdmin":false,
}
```

>DELETE - Envie com um dos parâmetros abaixo, e caso a exclusão no banco funcionar, retornará OK (200) ou Não encontrado (404).
```json
//Header
{
    "Authorization":"seu_JWT_admin"
}
```
```ts
type Request = {
    ra?:string,
    email?:string
}
```

- `/users/email/${email}`
>PUT - Envie com o corpo listado abaixo.
**Obs.: Use essa rota apenas para atualizar o R.A.**
```json
//Header
{
    "Authorization":"seu_JWT"
}
//Body
{
    "field":"name|ra|email|password",
    "valueToUpdateTo":"string",
}
```

- `/users/ra/${ra}`
>PUT - Envie com o corpo listado abaixo, e caso a atualização no banco funcionar, retornará OK (200) ou Erro interno do servidor (500).  
**Obs.: Use esta rota para atualização de tudo, menos R.A.**
```json
{
    "field":"name|ra|email|password",
    "valueToUpdateTo":"str",
    "valueToSearch":"str",
}
```

> Ao usar a rota PUT terão o retorno parecido com isto:
```typescript
    type Response = {
    name: string;
    ra: string;
    email: string;
	isAdmin:boolean;
    status:number;
    message?:string;
    error?:string;
}
```

## 📦 Produtos

### 📍 `POST /products/` *(com token)*

**Cadastrar novo produto**

```json
{
  "name": "Caneta Esferográfica",
  "description": "Cor azul, ponta fina, ideal para escrita diária.",
  "price": 2.50,
  "sku": "CAN-ESP-PTA-300",
  "quantity": 500,
  "category": "Pequena"
}
```

**Resposta:** 201 Created

### 📍 `GET /products/` *(com token)*

**Listar todos os produtos**

### 📍 `GET /products/id/:id` *(com token)*

**Buscar produto por ID**

### 📍 `GET /products/name/:name` *(com token)*

**Buscar produto por nome**

### 📍 `PUT /products/:id` *(com token)*

**Atualizar produto por ID**

```json
{
  "name": "Chaveiro",
  "description": "para usar na chave",
  "price": 25.00,
  "sku": "SKU-ATUALIZADO-002",
  "quantity": 150,
  "category": "Brindes"
}
```

### 📍 `DELETE /products/:id` *(com token)*

**Excluir produto por ID**

---

## 🔄 Movimentações

### 📍 `POST /moviment/` *(com token)*

**Registrar nova movimentação (entrada ou saída)**

```json
{
  "produto_id": 1,
  "usuario_id": 2,
  "tipo": "entrada",
  "quantidade_movimentada": 10,
  "observacoes": "Entrada de estoque inicial"
}
```

**Resposta:** 201 Created

### 📍 `GET /moviment/` *(com token)*

**Listar todas as movimentações**

### 📍 `GET /moviment/:id_vendas` *(com token)*

**Buscar movimentação por ID**

### 📍 `PUT /moviment/:id_vendas` *(com token)*

**Atualizar movimentação**

```json
{
  "quantidade_movimentada": 20,
  "observacoes": "Ajuste na quantidade devido a erro de registro."
}
```

### 📍 `DELETE /moviment/:id_vendas` *(com token)*

**Remover movimentação por ID**

Os retornos irão conter sempre o status e o objeto que foi criado/atualizado/deletado/consultado.

[Voltar ao Índice](#índice)

##### Products

[Voltar ao Índice](#índice)
##### Transactions

[Voltar ao Índice](#índice)

---
#### Funções
Aqui ficarão listadas exemplos das implementações das funções da aplicação, esta seção é dedicada aos desenvolvedores do projeto.

- Utilizar conexão do banco de dados:
```typescript
async function example(){
    await using db = await DBConnection.connect();

    const rows = await db.query("USE bons_fluidos");
}
```
> Aqui acima está detalhado um modelo básico de função de query que será replicado nos Controllers do projeto, esta faz o uso da nova _keyword_ `using` do Node v24, que automatiza o processo de liberação de memória de um objeto assim que um bloco de código acaba, evitando vazamentos de memória e possibilitando a automatização do fechamento da conexão com o MariaDB em apenas um lugar no código, o que melhora códigos _boiler plates_ e ajuda o desenvolvedor a não esquecer mais as conexões de banco abertas.

[Voltar ao Índice](#índice)