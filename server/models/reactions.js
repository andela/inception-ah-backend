const getReactionsModel = (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const reactionSchema = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    sourceType: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    reaction: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  };
  const Reaction = sequelize.define("Reactions", reactionSchema, flags);
  Reaction.associate = db => {
    Reaction.belongsTo(db.Articles, {
      as: "articleReactions",
      foreignKey: "articleId",
      target: "id",
      onDelete: "CASCADE"
    });
    Reaction.belongsTo(db.Comments, {
      foreignKey: "commentId",
      target: "id",
      onDelete: "CASCADE"
    });
    Reaction.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "userComments"
    });
  };
  return Reaction;
};
export default getReactionsModel;
