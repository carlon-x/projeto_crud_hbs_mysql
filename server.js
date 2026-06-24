require('dotenv').config(); // Garante o carregamento das variáveis de ambiente do seu arquivo .env
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const produtoRoutes = require('./routes/produtoRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da template engine HBS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Helpers para marcar opções no formulário de produtos
hbs.registerHelper('selecionado', (valorAtual, valorEsperado) => {
  return valorAtual === valorEsperado ? 'selected' : '';
});

hbs.registerHelper('radioMarcado', (valorAtual, valorEsperado) => {
  return valorAtual === valorEsperado ? 'checked' : '';
});

// Ajustado para aceitar tanto booleano quanto o formato numérico 1 ou 0 do MySQL
hbs.registerHelper('checkboxMarcado', (valorAtual) => {
  return valorAtual === 1 || valorAtual === true ? 'checked' : '';
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares para receber dados de formulários HTML
app.use(express.urlencoded({ extended: true }));

// Sessão usada para exibir mensagens temporárias sem enviá-las pela URL
app.use(session({
  secret: process.env.SESSION_SECRET || 'crud-node-hbs-segredo',
  resave: false,
  saveUninitialized: false
}));

// Envia mensagens temporárias para as views e remove após exibir
app.use((req, res, next) => {
  res.locals.mensagem = req.session.mensagem;
  res.locals.erro = req.session.erro;

  delete req.session.mensagem;
  delete req.session.erro;

  next();
});

// Rota inicial redireciona direto para o estoque de produtos
app.get('/', (req, res) => {
  res.redirect('/produtos');
});

// Rotas da interface gráfica vinculadas ao estoque
app.use('/produtos', produtoRoutes);

// Página não encontrada
app.use((req, res) => {
  return res.status(404).render('erro', {
    titulo: 'Página não encontrada',
    mensagem: 'A página solicitada não foi encontrada no sistema de estoque.'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
