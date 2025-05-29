# Documentação Backend

## Índice
1. [Scripts NPM](#scripts-npm)
2. [Versões Utilizadas](#versões-utilizadas)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Exemplos](#exemplos)
    1. [Endpoints](#endpoints)
    2. [Funções](#funções)
---
[Voltar ao Topo](#documentação-backend)

### Scripts NPM
Esses foram os scripts criados para o desenvolvimento:
- `npm run tsc:w` - Esse script por baixo dos panos inicia o transpilador do TypeScript em modo vigia para que detecte mudança nos códigos e "recompile" o código diferente para JavaScript, dentro da pasta `./dist`;
- `npm run dev` - Esse script inicia o Node.JS em modo vigia, que detecta quaisquer alterações no código JavaScript e reinicia o runtime do Node para recarregar essas alterações, lembrando que há a necessidade de um aquivo `.env.dev` aqui na pasta raíz que seguirá o modelo proposto em [Variáveis de Ambiente](#variáveis-de-ambiente).;
- `npm run build` - Ao término do desenvolvimento esse script foi utilizado para o último build do código, tamém para a pasta `./dist`;
- `npm start` - **Após o build** este é o comando a ser executado, onde ele apenas inicia o servidor Node.JS, lembrando que aqui também há a necessidade de um aquivo `.env` na pasta raíz que também seguirá o modelo proposto em [Variáveis de Ambiente](#variáveis-de-ambiente).

[Voltar ao Índice](#índice)

### Versões Utilizadas
Nesta seção constam as versões das tecnologias utilizadas na construção deste projeto (que também podem ser consultadas [aqui](./package.json)).

- Node.JS: v24.0.2
- Express: v5.1
- TypeScript: v5.8.3

[Voltar ao Índice](#índice)

### Variáveis de Ambiente
Aqui está detalhado o formato do arquivo `.env` necessário para a aplicação funcionar:
```bash
PORT=
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
```
- `PORT` - Número da porta para o servidor backend abrir;
- `DB_HOST` - Endereço DNS/IP do banco MariaDB;
- `DB_USER` - Usuário que vai acessar o banco de dados;
- `DB_PASS` - Senha desse usuário de acesso;
- `DB_NAME` - Nome da tabela que será usada na aplicação.

[Voltar ao Índice](#índice)

### Exemplos
Aqui estará detalhado a forma de utilização de cada endpoint e funções com recursos novos do Node v24.

---
#### Endpoints
Aqui ficarão listados os endpoints da aplicação e a forma de utilizá-los.

- `/users`:
>GET - Retornará erro de requisição (400).

>POST - Envie com o corpo listado abaixo, e caso a inserção no banco funcionar, retornará Criado (201) ou Erro interno do servidor (500).

```json
{
    "ar":"7654321",
    "name":"Foo Bar",
    "password":"123123",
    "email":"example@mail.com",
    "isAdmin":false,
}
```
>PUT - Envie com o corpo listado abaixo, e caso a atualização no banco funcionar, retornará OK (200) ou Erro interno do servidor (500).
```json
{
    "valueToSearch":"ar | email",
    "valueToUpdateTo":"1234567 | foo@bar.com",
}
```
>DELETE - Envie com o corpo listado abaixo, e caso a exclusão no banco funcionar, retornará OK (200) ou Erro interno do servidor (500).
```json
{
    "valueToSearch":"ar | email"
}
```

- `/users/email/${email}`
>GET - Envie com o corpo listado abaixo, e caso a consulta no banco funcionar, retornará OK (200) ou Erro interno do servidor (500).
```json
{
    "email":"example@mail.com"
}
```

- `/users/ar/${ar}`
>GET - Envie com o corpo listado abaixo, e caso a consulta no banco funcionar, retornará OK (200) ou Erro interno do servidor (500).
```json
{
    "ar":"7654321"
}
```

Os retornos irão conter sempre o status e o objeto que foi criado/atualizado/deletado/consultado.

[Voltar ao Índice](#índice)

---
#### Funções
Aqui ficarão listadas exemplos das implementações das funções da aplicação, esta seção é dedicada aos desenvolvedores do projeto.

- Utilizar conexão do banco de dados:
```typescript
async function example(){
    await using db = await DBConnection.connect();

    const rows = db.query("USE bons_fluidos")
}
```
> Aqui acima está detalhado um modelo básico de função de query que será replicado nos Controllers do projeto, esta faz o uso da nova _keyword_ `using` do Node v24, que automatiza o processo de liberação de memória de um objeto assim que um bloco de código acaba, evitando vazamentos de memória e possibilitando a automatização do fechamento da conexão com o MariaDB em apenas um lugar no código, o que melhora códigos _boiler plates_ e ajuda o desenvolvedor a não esquecer mais as conexões de banco abertas.

[Voltar ao Índice](#índice)