module.exports = server => {
  const opcao = require('../controllers/opcao.controller');

  let router = require('express').Router();

  //Crear opcao
  router.post('/', opcao.create);

  //Listar todas
  router.get('/', opcao.findAll);

  //Buscar opcao por id
  router.get('/:id', opcao.findOne);

  //Listar todas da enquete
  router.get('/:enqueteId', opcao.findAllByEnquete);

  //Editar opcao por id
  router.put('/:id', opcao.update);

  //Editar muitas
  router.put('/' , opcao.updateMany);

  //Excluir opcao por id
  router.delete('/:id', opcao.delete);

  //Excluir todas
  router.delete('/', opcao.deleteAll);

  server.use('/api/opcao', router);
}