const connection = require('../db');

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

class Usuario {
  static async listarTodos() {
    const sql = 'SELECT * FROM usuario ORDER BY id DESC';
    return executarQuery(sql);
  }

  static async buscarPorId(id) {
    const sql = 'SELECT * FROM usuario WHERE id = ?';
    const resultado = await executarQuery(sql, [id]);
    return resultado[0];
  }

  static async criar(dadosUsuario) {
    const {
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias
    } = dadosUsuario;

    const sql = `
      INSERT INTO usuario
      (nome, email, curso, periodo, ativo, receber_noticias, tecnologias)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return executarQuery(sql, [
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias
    ]);
  }

  static async atualizar(id, dadosUsuario) {
    const {
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias
    } = dadosUsuario;

    const sql = `
      UPDATE usuario
      SET nome = ?, email = ?, curso = ?, periodo = ?, ativo = ?,
          receber_noticias = ?, tecnologias = ?
      WHERE id = ?
    `;

    return executarQuery(sql, [
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias,
      id
    ]);
  }

  static async excluir(id) {
    const sql = 'DELETE FROM usuario WHERE id = ?';
    return executarQuery(sql, [id]);
  }
}

module.exports = Usuario;
