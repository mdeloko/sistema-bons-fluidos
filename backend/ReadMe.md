# Documentação Backend

## Índice
1. [Scripts NPM](#scripts-npm)
2. [Versões Utilizadas](#versões-utilizadas)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
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
```
- `PORT` - Número da porta para o servidor backend abrir.

[Voltar ao Índice](#índice)