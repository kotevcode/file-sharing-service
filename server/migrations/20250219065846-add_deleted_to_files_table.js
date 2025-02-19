module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('files', 'deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addIndex('files', ['deleted', 'expiresAt'], {
      name: 'files_deleted_expiresAt_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('files', 'files_deleted_expiresAt_idx');
    await queryInterface.removeColumn('files', 'deleted');
  },
};
