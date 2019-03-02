const getArticleLikesModel = (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const articleLikeSchema = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    like: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disLike: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  };
  const ArticleLike = sequelize.define(
    "ArticleLikes",
    articleLikeSchema,
    flags
  );
  ArticleLike.associate = db => {
    ArticleLike.belongsTo(db.Articles, {
      foreignKey: "articleId",
      target: "id",
      onDelete: "CASCADE"
    });
    ArticleLike.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return ArticleLike;
};
export default getArticleLikesModel;
