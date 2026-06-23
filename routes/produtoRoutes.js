const express = require('express');
const produtoController = require('../controllers/produtoController'); 
const router = express.Router();

// Rotas web simples para o estoque de produtos
router.get('/', produtoController.listar);
router.get('/novo', produtoController.formNovo);
router.post('/', produtoController.criar);
router.get('/:id/editar', produtoController.formEditar);
router.post('/:id/atualizar', produtoController.atualizar);
router.post('/:id/excluir', produtoController.excluir);

module.exports = router;
