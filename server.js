const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');

const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da template engine HBS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Helpers simples para marcar opções no formulário
hbs.registerHelper('selecionado', (valorAtual, valorEsperado) => {
  return valorAtual === valorEsperado ? 'selected' : '';
});

hbs.registerHelper('radioMarcado', (valorAtual, valorEsperado) => {
  return valorAtual === valorEsperado ? 'checked' : '';
});

hbs.registerHelper('checkboxMarcado', (valorAtual) => {
  return valorAtual ? 'checked' : '';
});

hbs.registerHelper('checkboxListaMarcado', (lista, valorEsperado) => {
  if (!lista) {
    return '';
  }

  if (Array.isArray(lista)) {
    return lista.includes(valorEsperado) ? 'checked' : '';
  }

  const itens = String(lista).split(',').map((item) => item.trim());
  return itens.includes(valorEsperado) ? 'checked' : '';
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

// Rota inicial
app.get('/', (req, res) => {
  res.redirect('/usuarios');
});

// Rotas da interface gráfica com HBS
app.use('/usuarios', usuarioRoutes);

// Página não encontrada
app.use((req, res) => {
  return res.status(404).render('erro', {
    titulo: 'Página não encontrada',
    mensagem: 'A página solicitada não foi encontrada.'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
