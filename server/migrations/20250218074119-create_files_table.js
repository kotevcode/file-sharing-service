module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('files', {
      id: {
        allowNull   : false,
        primaryKey  : true,
        defaultValue: Sequelize.UUIDV4,
        type        : Sequelize.UUID
      },
      s3Key: {
        type: Sequelize.STRING,
      },
      expiresAt: {
        allowNull: false,
        type     : Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type     : Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type     : Sequelize.DATE
      }
    });
    // add indexes
    await queryInterface.addIndex('files', ['expiresAt']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('files');
  }
};
