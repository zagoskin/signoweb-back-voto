// const enqueteService = require('../services/enquete.service');
const db = require('../models/index');
const Opcao = db.opcao;
const Op = db.Sequelize.Op;


//create and save
exports.create = (req, res) => {
  //Validation
  if (!req.body.texto) {
    res.status(400).send({
      message: "Texto cannot be empty"
    });
    return;
  }

  const opcao = {
    texto: req.body.texto,
    votos: 0
  }

  Opcao.create(opcao)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred creating an Opcao"
      });
    });
};

//find all opcoes
exports.findAll = (req, res) => {
  Opcao.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred retrieving Opcoes"
      });
    });
};

//find one opcao by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Opcao.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || `Some error ocurred retrieving Opcao with id: ${id}`
      });
    });
};

//find opcoes by enquete id
exports.findAllByEnquete = (req, res) => {
  const enqueteId = req.params.enqueteId;

  Opcao.findAll({ where: { enqueteId: enqueteId }})
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || `Some error ocurried retrieving Opcoes with enqueteId: ${enqueteId}`
      })
    });
};

//update enquete by id
exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body.texto) {
    res.status(400).send({
      message: "Texto cannot be empty"
    });
    return;
  }

  const opcao = {
    texto: req.body.titulo,
  }

  Opcao.update(opcao, {
    where: { opcaoId: id }
  })
  .then(num =>{
    if (num == 1){
      res.send({
        message: 'Opcao updated successfully.'
      });
    } else {
      res.send({
        message: `Cannot update Opcao with id=${id}. Maybe Opcao was not found or req.body is empty!`
      });
    }
  })    
  .catch(err => {
    res.status(500).send({
      message: `Error updating Opcao with id: ${id}. ${err.message}`
    });
  });
  
};

//update opcoes array
exports.updateMany = (req, res) => {
  const opcoes = req.body.opcoes;


  opcoes.forEach(async(opcao) => {
    Opcao.findByPk(opcao.opcaoId)
      .then(data => {
        if (data !== null){
          Opcao.update(opcao, {
            where: { opcaoId: opcao.opcaoId }
          })
          .then(num =>{
            if (num != 1){
              res.send({
                message: `Cannot update Opcao with id=${opcao.opcaoId}. Maybe Opcao was not found or req.body is empty!`
              });
            }
          })    
          .catch(error => {
            res.status(500).send({
              message: `Error updating Opcao with id: ${opcao.opcaoId}. ${error.message}`
            });
          });
        }
      });  
  });

  res.send({
    message: 'Opcoes updated successfully.'
  });
};

//delete opcao by id
exports.delete = (req, res) => {
  const id = req.params.id;

  Opcao.destroy({
    where: { opcaoId: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Opcao was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Opcao with id=${id}. Maybe Opcao was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete Opcao with id=${id}`
      });
    });
};

//delete all opcoes
exports.deleteAll = (req, res) => {

  Opcao.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} opcoes were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all opcoes."
      });
    });
};
