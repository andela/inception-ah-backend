const getUserModel = (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const userSchema = {
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
      defaultValue: false,
      allowNull: false
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
  };

  const User = sequelize.define("Users", userSchema, flags);
  User.associate = db => {
    // Add association between user and article
    User.hasMany(db["Articles"]);
  };
  return User;
};

export default getUserModel;
