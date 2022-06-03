module.exports = (sequelize, Sequelize) => {
  const Opcao = sequelize.define('opcao', 
    {
      opcaoId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      texto: {
        type: Sequelize.STRING,
        validate: { len: 5 },
        allowNull: false,
      },
      votos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    }
  );

  return Opcao;
}