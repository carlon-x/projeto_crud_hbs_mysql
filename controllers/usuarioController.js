const Usuario = require('../models/Usuario');

function transformarTecnologias(tecnologias) {
  if (!tecnologias) {
    return '';
  }

  if (Array.isArray(tecnologias)) {
    return tecnologias.join(', ');
  }

  return tecnologias;
}

function montarDadosUsuario(body) {
  return {
    nome: body.nome,
    email: body.email,
    curso: body.curso,
    periodo: body.periodo,
    ativo: body.ativo ? 1 : 0,
    receber_noticias: body.receber_noticias ? 1 : 0,
    tecnologias: transformarTecnologias(body.tecnologias)
  };
}

function validarUsuario(dadosUsuario) {
  if (!dadosUsuario.nome || !dadosUsuario.email || !dadosUsuario.curso || !dadosUsuario.periodo) {
    return 'Preencha nome, e-mail, curso e período.';
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosUsuario.email);
  if (!emailValido) {
    return 'Informe um e-mail válido.';
  }

  return null;
}

function prepararParaListagem(usuario) {
  return {
    ...usuario,
    ativoTexto: usuario.ativo ? 'Sim' : 'Não',
    noticiasTexto: usuario.receber_noticias ? 'Sim' : 'Não',
    tecnologiasTexto: usuario.tecnologias || 'Não informado'
  };
}

function renderizarErro(res, err) {
  console.error(err);
  return res.status(500).render('erro', {
    titulo: 'Erro interno',
    mensagem: 'Ocorreu um erro ao processar a solicitação. Verifique a conexão com o banco de dados.'
  });
}

function definirMensagem(req, texto) {
  req.session.mensagem = texto;
}

function definirErro(req, texto) {
  req.session.erro = texto;
}

module.exports = {
  async listar(req, res) {
    try {
      const usuarios = await Usuario.listarTodos();
      const usuariosFormatados = usuarios.map(prepararParaListagem);

      return res.render('usuarios/index', {
        titulo: 'Gerenciar usuários',
        usuarios: usuariosFormatados
      });
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  formNovo(req, res) {
    return res.render('usuarios/form', {
      titulo: 'Cadastrar usuário',
      usuario: { ativo: 1 },
      acao: '/usuarios',
      textoBotao: 'Cadastrar'
    });
  },

  async criar(req, res) {
    const dadosUsuario = montarDadosUsuario(req.body);
    const erro = validarUsuario(dadosUsuario);

    if (erro) {
      return res.status(400).render('usuarios/form', {
        titulo: 'Cadastrar usuário',
        usuario: dadosUsuario,
        acao: '/usuarios',
        textoBotao: 'Cadastrar',
        erro
      });
    }

    try {
      await Usuario.criar(dadosUsuario);
      definirMensagem(req, 'Usuário cadastrado com sucesso.');
      return res.redirect('/usuarios');
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  async formEditar(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.params.id);

      if (!usuario) {
        definirErro(req, 'Usuário não encontrado.');
        return res.redirect('/usuarios');
      }

      return res.render('usuarios/form', {
        titulo: 'Editar usuário',
        usuario,
        acao: `/usuarios/${usuario.id}/atualizar`,
        textoBotao: 'Salvar alterações'
      });
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  async atualizar(req, res) {
    const dadosUsuario = montarDadosUsuario(req.body);
    const erro = validarUsuario(dadosUsuario);

    if (erro) {
      return res.status(400).render('usuarios/form', {
        titulo: 'Editar usuário',
        usuario: { id: req.params.id, ...dadosUsuario },
        acao: `/usuarios/${req.params.id}/atualizar`,
        textoBotao: 'Salvar alterações',
        erro
      });
    }

    try {
      await Usuario.atualizar(req.params.id, dadosUsuario);
      definirMensagem(req, 'Usuário atualizado com sucesso.');
      return res.redirect('/usuarios');
    } catch (err) {
      return renderizarErro(res, err);
    }
  },

  async excluir(req, res) {
    try {
      await Usuario.excluir(req.params.id);
      definirMensagem(req, 'Usuário excluído com sucesso.');
      return res.redirect('/usuarios');
    } catch (err) {
      return renderizarErro(res, err);
    }
  }
};
