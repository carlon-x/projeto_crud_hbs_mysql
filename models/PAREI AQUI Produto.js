const connection = require('../db');

// Função auxiliar para executar as queries SQL usando Promises (mantida igual)
function executarQuery(sql, parametros = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, parametros, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

class Produto {
  // Busca todos os produtos do estoque (os mais recentes aparecem primeiro)
  static async listarTodos() {
    const sql = 'SELECT * FROM produto ORDER BY id DESC';
    return executarQuery(sql);
  }

  // Busca um produto específico pelo ID
  static async buscarPorId(id) {
    const sql = 'SELECT * FROM produto WHERE id = ?';
    const resultado = await executarQuery(sql, [id]);
    return resultado[0];
  }

  // Insere um novo produto com os campos de estoque no banco de dados
  static async criar(dadosProduto) {
    const {
      nome,
      descricao,
      preco_custo,
      preco_venda,
      estoque_atual,
      estoque_minimo,
      categoria,
      unidade_medida,
      ativo
    } = dadosProduto;

    const sql = `
      INSERT INTO produto
      (nome, descricao, preco_custo, preco_venda, estoque_atual, estoque_minimo, categoria, unidade_medida, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return executarQuery(sql, [
      nome,
      descricao,
      preco_custo,
      preco_venda,
      estoque_atual,
      estoque_minimo,
      categoria,
      unidade_medida,
      ativo
    ]);
  }

  // Atualiza as informações de um produto existente
  static async atualizar(id, dadosProduto) {
    const {
      nome,
      descricao,
      preco_custo,
      preco_venda,
      estoque_atual,
      estoque_minimo,
      categoria,
      unidade_medida,
      ativo
    } = dadosProduto;

    const sql = `
      UPDATE produto
      SET nome = ?, descricao = ?, preco_custo = ?, preco_venda = ?, 
          estoque_atual = ?, estoque_minimo = ?, categoria = ?, unidade_medida = ?, ativo = ?
      WHERE id = ?
    `;

    return executarQuery(sql, [
      nome,
      descricao,
      preco_custo,
      preco_venda,
      estoque_atual,
      estoque_minimo,
      categoria,
      unidade_medida,
      ativo,
      id
    ]);
  }

  // Deleta o produto do banco de dados pelo ID
  static async excluir(id) {
    const sql = 'DELETE FROM produto WHERE id = ?';
    return executarQuery(sql, [id]);
  }
}

module.exports = Produto;
