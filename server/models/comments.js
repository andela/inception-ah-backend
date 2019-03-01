const getCommentModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };
  const commentSchema = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  };

  const Comment = sequelize.define("Comments", commentSchema, flags);

  Comment.associate = db => {
    Comment.belongsTo(db.Users, {
      foreignKey: "userId"
    });

    Comment.belongsTo(db.Articles, {
      foreignKey: "articleId"
    });
  };

  return Comment;
};

export default getCommentModel;