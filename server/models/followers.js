const getFollowersModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };

  const followersSchema = {
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

  const Followers = sequelize.define("Followers", followersSchema, flags);

  Followers.associate = db => {
    Followers.belongsTo(db.Users, {
      foreignKey: "followerId",
      target: "id",
      as: "follower",
      onDelete: "CASCADE"
    });

    Followers.belongsTo(db.Users, {
      foreignKey: "authorId",
      target: "id",
      as: "author",
      onDelete: "CASCADE"
    });
  };
  return Followers;
};

export default getFollowersModel;
