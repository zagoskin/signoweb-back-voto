module.exports = server => {
  const enquete = require('../controllers/enquete.controller');

  let router = require('express').Router();

  //Crear enquete
  router.post('/', enquete.create);

  //Listar todas
  router.get('/', enquete.findAll);

  //Listar finalizadas
  router.get('/finished', enquete.findAllFinished);

  //Listar não iniciadas
  router.get('/upcoming', enquete.findAllUpcoming);

  //Listar em andamento
  router.get('/in-progress', enquete.findAllInProgress);

  //Buscar enquete por id
  router.get('/:id', enquete.findOne);

  //Editar enquete por id
  router.put('/:id', enquete.update);

  //Excluir enquete por id
  router.delete('/:id', enquete.delete);

  //Excluir todas
  router.delete('/', enquete.deleteAll);

  server.use('/api/enquete', router);
}