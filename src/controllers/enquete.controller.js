// const enqueteService = require('../services/enquete.service');
const db = require('../models/index');
const Enquete = db.enquete;
const Opcao = db.opcao;
const Op = db.Sequelize.Op;

// Enquete.hasMany(Opcao, { 
//   foreignKey: 'enqueteId',
//   as: 'opcoes'
// });

//create and save
exports.create = (req, res) => {
  //Validation
  if (!req.body.titulo) {
    res.status(400).send({
      message: "Titulo cannot be empty"
    });
    return;
  }

  if (!req.body.opcoes) {
    res.status(400).send({
      message: "Opcoes cannot be empty"
    });
    return;
  } else {
    if (req.body.opcoes.length < 3){
      res.status(400).send({
        message: "Have to send at least 3 opcoes"
      });
      return;
    }
  }

  const enquete = {
    titulo: req.body.titulo,
    data_ini: req.body.data_ini ?? new Date(),
    data_fin: req.body.data_fin ?? new Date().setDate(new Date().getDate() + 1),
    opcoes: req.body.opcoes
  }

  Enquete.create(enquete , { include: { model: Opcao, as: 'opcoes' }})
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred creating an Enquete"
      });
    });
};

//find all enquetes
exports.findAll = (req, res) => {
  // const title = req.query.title;
  // let condition = title ? { title: { [Op.like]: `%${title}%`} } : null;

  Enquete.findAll({ include: { model: Opcao, as: 'opcoes'} })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred retrieving Enquetes"
      });
    });
};

//find finished enquetes
exports.findAllFinished = (req, res) => {
  const today = new Date();
  let condition = { data_fin: { [Op.lt]: today } };

  Enquete.findAll({ where: condition, include: { model: Opcao, as: 'opcoes'} })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred retrieving Enquetes"
      });
    });
}

//find not started enquetes
exports.findAllUpcoming = (req, res) => {
  const today = new Date();
  let condition = { data_ini: { [Op.gt]: today } };

  Enquete.findAll({ where: condition, include: { model: Opcao, as: 'opcoes'} })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred retrieving Enquetes"
      });
    });
}

//find enquetes in progress
exports.findAllInProgress = (req, res) => {
  const today = new Date();
  let condition = { data_ini: { [Op.lt]: today },  data_fin: { [Op.gt]: today}};

  Enquete.findAll({ where: condition, include: { model: Opcao, as: 'opcoes'} })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error ocurred retrieving Enquetes"
      });
    });
}

//find one enquete by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Enquete.findByPk(id, { include: { model: Opcao, as: 'opcoes'} })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || `Some error ocurred retrieving Enquete with id: ${id}`
      });
    });
};

//update enquete by id
exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body.titulo) {
    res.status(400).send({
      message: "Titulo cannot be empty"
    });
    return;
  }

  if (!req.body.opcoes) {
    res.status(400).send({
      message: "Opcoes cannot be empty"
    });
    return;
  } else {
    if (req.body.opcoes.length < 3){
      res.status(400).send({
        message: "Have to send at least 3 opcoes"
      });
      return;
    }
  }

  const enquete = {
    enqueteId: req.body.enqueteId,
    titulo: req.body.titulo,
    data_ini: req.body.data_ini ?? new Date(),
    data_fin: req.body.data_fin ?? new Date().setDate(new Date().getDate() + 1),
  }

  const opcoes = req.body.opcoes;

  let currentOpcaos = opcoes.filter( opcao => opcao.opcaoId !== undefined && opcao.opcaoId !== null);
  let addOpcaos = opcoes.filter( opcao => opcao.opcaoId == undefined);
  let deleteOpcaos = opcoes.filter( opcao => opcao.operacao === "delete");

  console.log(`${currentOpcaos.length} + ${addOpcaos.lenght} - ${deleteOpcaos.length}`);
  if (currentOpcaos.length + addOpcaos.length - deleteOpcaos.length < 3){
    res.send({
      message: "Cannot have less than 3 opcaos. Add others first if you wish to delete more."
    });
  } else {
    Enquete.update(enquete, {
      where: { enqueteId: id }, include: { model: Opcao, as: 'opcoes'},
    })
    .then(async num =>{
      opcoes.forEach( async (opcao) => {      
        if (opcao.operacao !== "delete"){
          let findOpcao = await Opcao.findOne({ where: { opcaoId: opcao.opcaoId || 0, enqueteId: req.body.enqueteId }});
          if (findOpcao){
            await Opcao.update( { texto: opcao.texto}, { where: { opcaoId: opcao.opcaoId }})
          } else {
            await Opcao.create({ texto: opcao.texto , enqueteId: req.body.enqueteId });
          }
        }
      }); 
      deleteOpcaos.forEach( async (opcao) => {
        await Opcao.destroy({where: { opcaoId: opcao.opcaoId }});
      });
      if (num == 1){
        res.send({
          message: 'Enquete updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Enquete with id=${id}. Maybe Enquete was not found or req.body is empty!`
        });
      }
    })    
    .catch(err => {
      res.status(500).send({
        message: `Error updating Enquete with id: ${id}. ${err.message}`
      });
    });
  }
};

//delete enquete by id
exports.delete = (req, res) => {
  const id = req.params.id;

  Enquete.destroy({
    where: { enqueteId: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Enquete was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Enquete with id=${id}. Maybe Enquete was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete Enquete with id=${id}`
      });
    });
};

//delete all enquetes
exports.deleteAll = (req, res) => {

  Enquete.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Enquete were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all enquetes."
      });
    });
};
