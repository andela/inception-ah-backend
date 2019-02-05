const getUserModel = (sequelize, Sequelize) => {
  const flags = {
    timestamps: false,
    freezeTableName: true
  };
  const userSchema = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Date.now,
      allowNull: false
    },
    imageURL: {
      type: Sequelize.TEXT
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Date.now
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
  };
  const User = sequelize.define("Users", userSchema, flags);

  User.hook("beforeCreate", instance => {
    if (instance.dataValues.id !== null) {
      throw new Error("User Id cannot be set manually");
    }
  });

  User.associate = db => {};
  return User;
};

export default getUserModel;
