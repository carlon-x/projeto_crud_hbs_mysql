# Projeto CRUD simples com Node.js, Express, MySQL e HBS

Este projeto é um exemplo didático de CRUD de estoque com interface gráfica usando **Node.js**, **Express**, **MySQL** e **HBS**.

## Estrutura do projeto

```text
projeto_crud/
├── controllers/
│   └── produtoController.js
├── models/
│   └── Produto.js
├── public/
    └── Imagem/    
│   └── css/
│       └── style.css
├── routes/
│   └── produtoRoutes.js
├── views/
│   ├── partials/
│   │   ├── header.hbs
│   │   └── footer.hbs
│   ├── produtos/
│   │   ├── form.hbs
│   │   └── index.hbs
│   └── erro.hbs
├── db.js
├── script_criar_db.txt
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

Esse script cria o banco de dados `atividade_crud`, cria a tabela `produto` com as colunas de estoque e insere registros de exemplo.

3. Confira as configurações do banco no arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=seu_banco_de_dados
DB_PORT=3306
```

4. Execute o projeto:

```bash
npm start
```

5. Acesse no navegador:

```text
http://localhost:3000/produtos
```

## Campos da tabela `produto`

```text
id
nome
descricao
preco_custo
preco_venda
estoque_atual
estoque_minimo
categoria
unidade_medida
ativo
```

O formulário possui exemplos de diferentes componentes HTML adaptados para o estoque:

```text
input text      -> nome do produto
textarea        -> descrição / detalhes
input number    -> preços (custo/venda) e estoques (atual/mínimo)
select          -> unidade de medida (un, kg, cx, pct, litro)
radio           -> categoria do produto
checkbox        -> disponibilidade (produto ativo para venda)
```

## Rotas da interface HBS

| Método | Rota | Função |
|---|---|---|
| GET | `/produtos` | Lista os produtos do estoque |
| GET | `/produtos/novo` | Abre o formulário de cadastro |
| POST | `/produtos` | Adiciona um produto ao estoque |
| GET | `/produtos/:id/editar` | Abre o formulário de edição |
| POST | `/produtos/:id/atualizar` | Atualiza as informações do produto |
| POST | `/produtos/:id/excluir` | Remove o produto do estoque |

## Observação sobre `PUT` e `DELETE`

Formulários HTML tradicionais trabalham de forma simples com `GET` e `POST`. Para evitar complexidade adicional com `method-override`, este projeto usa `POST` nas ações de atualizar e excluir.

Essa escolha facilita o entendimento inicial de rotas, controllers, models, views e integração com banco de dados.

## Modal de exclusão

O modal de confirmação de exclusão foi feito apenas com **HTML e CSS**, sem JavaScript.

Ele usa um `checkbox` oculto para abrir e fechar a janela de confirmação. Dessa forma, o aluno consegue estudar o comportamento visual do modal sem precisar adicionar lógica JavaScript ao projeto.
