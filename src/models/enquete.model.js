module.exports = (sequelize, Sequelize) => {
  const Enquete = sequelize.define('enquete', 
    {
      enqueteId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_ini: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_fin: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    }
  );
  
  return Enquete;
}