const getFollowersModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };

  const FellowersSchema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  };

  const Followers = sequelize.define("Followers", FellowersSchema, flags);

  Followers.associate = db => {
    Followers.belongsTo(db.Users, {
      foreignKey: "followerId",
      target: "id",
      onDelete: "CASCADE"
    });

    Followers.belongsTo(db.Users, {
      foreignKey: "authorId",
      target: "id",
      onDelete: "CASCADE"
    });
  };
  return Followers;
};

export default getFollowersModel;
