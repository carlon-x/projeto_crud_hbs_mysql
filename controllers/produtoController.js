const Produto = require('../models/PAREI AQUI Produto');

// Organiza e converte os dados vindos do formulário HTML
function montarDadosProduto(body) {
  return {
    nome: body.nome,
    descricao: body.descricao,
    preco_custo: parseFloat(body.preco_custo) || 0.0,
    preco_venda: parseFloat(body.preco_venda) || 0.0,
    estoque_atual: parseInt(body.estoque_atual, 10) || 0,
    estoque_minimo: parseInt(body.estoque_minimo, 10) || 0,
    categoria: body.categoria,       // Captura o valor do botão de rádio selecionado
    unidade_medida: body.unidade_medida, // Captura o valor selecionado no dropdown
    ativo: body.ativo ? 1 : 0        // Mantido para controle de produto ativo/inativo
  };
}

// Validações de segurança para o cadastro do produto
function validarProduto(dadosProduto) {
  if (!dadosProduto.nome || !dadosProduto.categoria || !dadosProduto.unidade_medida) {
    return 'Preencha o nome, selecione uma categoria e uma unidade de medida.';
  }

  if (dadosProduto.preco_custo < 0 || dadosProduto.preco_venda < 0) {
    return 'Os preços de custo e venda não podem ser valores negativos.';
  }

  if (dadosProduto.preco_venda < dadosProduto.preco_custo) {
    return 'Alerta: O preço de venda é menor que o preço de custo (prejuízo).';
  }

  if (dadosProduto.estoque_atual < 0 || dadosProduto.estoque_minimo < 0) {
    return 'As quantidades de estoque não podem ser negativas.';
  }

  return null;
}

// Prepara e formata os dados brutos para exibição amigável na página de listagem
function prepararParaListagem(produto) {
  const formatadorMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  
  // Verifica se o estoque atingiu o nível crítico
  const precisaRepor = produto.estoque_atual <= produto.estoque_minimo;

  return {
    ...produto,
    precoCustoFormatado: formatadorMoeda.format(produto.preco_custo),
    precoVendaFormatado: formatadorMoeda.format(produto.preco_venda),
    estoqueTexto: `${produto.estoque_atual} ${produto.unidade_medida}`,
    statusEstoque: precisaRepor ? '⚠️ Estoque Baixo / Repor' : '✅ Regular',
    categoriaTexto: produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1), // Capitaliza a palavra
    ativoTexto: produto.ativo ? 'Sim' : 'Não'
  };
}

function renderizarErro(res, err) {
  console.error(err);
  return res.status(500).render('erro', {
    titulo: 'Erro no Sistema de Estoque',
    mensagem: 'Ocorreu um erro ao processar a solicitação dos produtos. Verifique o banco de dados.'
  });
}

function definirMensagem(req, texto) {
  req.session.mensagem = texto;
}

function definirErro(req, texto) {
  req.session.erro = texto;
}

module.exports = {
  // Lista todos os produtos cadastrados no estoque
  async listar(req, res) {
    try {
      const produtos = await Produto.listarTodos();
      const produtosFormatados = produtos.map(prepararParaListagem);

      return res.render('produtos/index', {
        titulo: 'Gerenciar Estoque de Produtos',
        produtos: produtosFormatados
      });
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  // Abre a tela do formulário para adicionar um novo produto
  formNovo(req, res) {
    return res.render('produtos/form', {
      titulo: 'Cadastrar Novo Produto',
      produto: { ativo: 1, estoque_atual: 0, estoque_minimo: 0, preco_custo: 0, preco_venda: 0 },
      acao: '/produtos',
      textoBotao: 'Adicionar ao Estoque'
    });
  },

  // Processa a criação e inserção do produto no banco de dados
  async criar(req, res) {
    const dadosProduto = montarDadosProduto(req.body);
    const erro = validarProduto(dadosProduto);

    if (erro) {
      return res.status(400).render('produtos/form', {
        titulo: 'Cadastrar Novo Produto',
        produto: dadosProduto,
        acao: '/produtos',
        textoBotao: 'Adicionar ao Estoque',
        erro
      });
    }

    try {
      await Produto.criar(dadosProduto);
      definirMensagem(req, 'Produto adicionado ao estoque com sucesso.');
      return res.redirect('/produtos');
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  // Busca um produto específico e abre o formulário preenchido para edição
  async formEditar(req, res) {
    try {
      const produto = await Produto.buscarPorId(req.params.id);

      if (!produto) {
        definirErro(req, 'Produto não encontrado no estoque.');
        return res.redirect('/produtos');
      }

      return res.render('produtos/form', {
        titulo: 'Editar Informações do Produto',
        produto,
        acao: `/produtos/${produto.id}/atualizar`,
        textoBotao: 'Salvar Alterações'
      });
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  // Processa a atualização dos dados do produto selecionado
  async atualizar(req, res) {
    const dadosProduto = montarDadosProduto(req.body);
    const erro = validarProduto(dadosProduto);

    if (erro) {
      return res.status(400).render('produtos/form', {
        titulo: 'Editar Informações do Produto',
        produto: { id: req.params.id, ...dadosProduto },
        acao: `/produtos/${req.params.id}/atualizar`,
        textoBotao: 'Salvar Alterações',
        erro
      });
    }

    try {
      await Produto.atualizar(req.params.id, dadosProduto);
      definirMensagem(req, 'Produto atualizado com sucesso.');
      return res.redirect('/produtos');
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  // Remove o produto definitivamente do estoque
  async excluir(req, res) {
    try {
      await Produto.excluir(req.params.id);
      definirMensagem(req, 'Produto removido do estoque.');
      return res.redirect('/produtos');
    } catch (err) {
      return renderizarErro(res, err);
    }
  }
};
