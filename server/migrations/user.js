export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middleName: {
        type: Sequelize.STRING,
        allowNull: false
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
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now
      },
      imageURL: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE
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
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.DropTable("Users");
  }
};
