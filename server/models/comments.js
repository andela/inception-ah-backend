import { COMMENT_REACTION } from "@helpers/constants";

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
    },
    numberOfLikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    numberOfDislikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  };

  const Comment = sequelize.define("Comments", commentSchema, flags);

  Comment.associate = db => {
    Comment.belongsTo(db.Users, {
      foreignKey: "userId",
      as: "reviews"
    });

    Comment.belongsTo(db.Articles, {
      foreignKey: "articleId",
      onDelete: "CASCADE",
      as: "articleComments"
    });
    Comment.hasMany(db.Reactions, {
      scopes: {
        commentReactions: {
          include: [
            {
              model: db.Reactions,
              where: { sourceType: COMMENT_REACTION }
            }
          ]
        }
      },
      as: "commentReactions",
      foreignKey: "commentId",
      target: "id",
      onDelete: "CASCADE"
    });
  };

  return Comment;
};

export default getCommentModel;
