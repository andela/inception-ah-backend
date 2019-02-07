export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "Users",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          unique: true,
          allowNull: false
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        middleName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: false
        },
        biography: {
          type: Sequelize.TEXT
        },
        mobileNumber: {
          type: Sequelize.CHAR
        },
        imageURL: {
          type: Sequelize.TEXT
        },
        isVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        isNotifiable: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        isAdmin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        lastLogin: {
          type: Sequelize.DATE,
          defaultValue: Date.now,
          allowNull: false
        }
      },
      { freezeTable: true }
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.DropTable("Users");
  }
};
