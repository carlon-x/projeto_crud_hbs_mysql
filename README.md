# Projeto CRUD simples com Node.js, Express, MySQL e HBS

Este projeto é um exemplo didático de CRUD com interface gráfica usando **Node.js**, **Express**, **MySQL** e **HBS**.

## Estrutura do projeto

```text
projeto_crud/
├── controllers/
│   └── usuarioController.js
├── models/
│   └── Usuario.js
├── public/
│   └── css/
│       └── style.css
├── routes/
│   └── usuarioRoutes.js
├── views/
│   ├── partials/
│   │   ├── header.hbs
│   │   └── footer.hbs
│   ├── usuarios/
│   │   ├── form.hbs
│   │   └── index.hbs
│   └── erro.hbs
├── db.js
├── script_criar_db.txt
├── script_atualizar_tabela.txt
├── server.js
├── .env
├── .npmrc
└── package.json
```

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Crie o banco de dados usando o arquivo:

```text
script_criar_db.txt
```

Esse script cria o banco `atividade_crud`, cria a tabela `usuario` e insere dois registros de exemplo.

3. Confira as configurações do banco no arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=atividade_crud
DB_PORT=3306
```

4. Execute o projeto:

```bash
npm start
```

5. Acesse no navegador:

```text
http://localhost:3000/usuarios
```

## Campos da tabela `usuario`

```text
id
nome
email
curso
periodo
ativo
receber_noticias
tecnologias
```

O formulário possui exemplos de diferentes componentes HTML:

```text
input text      -> nome
input email     -> e-mail
select          -> curso
radio           -> período
checkbox        -> tecnologias, usuário ativo e receber notícias
```

## Rotas da interface HBS

| Método | Rota | Função |
|---|---|---|
| GET | `/usuarios` | Lista os usuários |
| GET | `/usuarios/novo` | Abre o formulário de cadastro |
| POST | `/usuarios` | Cadastra um usuário |
| GET | `/usuarios/:id/editar` | Abre o formulário de edição |
| POST | `/usuarios/:id/atualizar` | Atualiza um usuário |
| POST | `/usuarios/:id/excluir` | Exclui um usuário |

## Observação sobre `PUT` e `DELETE`

Formulários HTML tradicionais trabalham de forma simples com `GET` e `POST`. Para evitar complexidade adicional com `method-override`, este projeto usa `POST` nas ações de atualizar e excluir.

Essa escolha facilita o entendimento inicial de rotas, controllers, models, views e integração com banco de dados.

## Modal de exclusão

O modal de confirmação de exclusão foi feito apenas com **HTML e CSS**, sem JavaScript.

Ele usa um `checkbox` oculto para abrir e fechar a janela de confirmação. Dessa forma, o aluno consegue estudar o comportamento visual do modal sem precisar adicionar lógica JavaScript ao projeto.

## Banco já existente

Se você já criou a versão anterior da tabela `usuario`, pode usar o arquivo abaixo para adicionar os novos campos:

```text
script_atualizar_tabela.txt
```

Se estiver começando do zero, use apenas o arquivo:

```text
script_criar_db.txt
```
