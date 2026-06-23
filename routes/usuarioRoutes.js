const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// Rotas web simples para formulários HTML
router.get('/', usuarioController.listar);
router.get('/novo', usuarioController.formNovo);
router.post('/', usuarioController.criar);
router.get('/:id/editar', usuarioController.formEditar);
router.post('/:id/atualizar', usuarioController.atualizar);
router.post('/:id/excluir', usuarioController.excluir);

module.exports = router;
