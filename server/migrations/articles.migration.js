export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "Articles",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          unique: true,
          allowNull: false
        },
        title: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        authorId: {
          type: Sequelize.UUID,
          allowNull: false
        },
        categoryId: {
          type: Sequelize.UUID,
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        favouriteCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        },
        numberOfReads: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        },
        readTime: {
          type: Sequelize.TIME,
          allowNull: false
        }
      },
      { freezeTable: true }
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.DropTable("Articles");
  }
};
