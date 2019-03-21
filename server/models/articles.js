import { generateUniqueSlug, calculateReadTime } from "@helpers/articles";
import { ARTICLE_REACTION } from "@helpers/constants";
import { pagination } from "@helpers/pagination";
import models from "@models";

const getArticleModel = (sequelize, DataTypes) => {
  const articleSchema = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
      onDelete: "CASCADE"
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    favoriteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    imageURL: {
      type: DataTypes.STRING
    },

    commentCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    numberOfReads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    readTime: {
      type: DataTypes.INTEGER
    },
    numberOfLikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    numberOfDislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  };

  const Article = sequelize.define("Articles", articleSchema, {
    freezeTableName: true,
    hooks: {
      beforeCreate: (article, options) => {
        article.slug = generateUniqueSlug(article.title);
        article.readTime = calculateReadTime(article.content);
        return article;
      }
    }
  });

  Article.associate = db => {
    Article.belongsTo(db.Users, {
      foreignKey: "authorId",
      target: "id",
      as: "author",
      onDelete: "CASCADE"
    });

    Article.hasMany(db.Favorites, {
      foreignKey: "articleId",
      target: "id",
      as: "favourite",
      onDelete: "CASCADE"
    });

    Article.hasMany(db.Comments, {
      foreignKey: "articleId",
      as: "articleComments",
      target: "id",
      onDelete: "CASCADE"
    });

    Article.hasMany(db.Reactions, {
      scopes: {
        articleReactions: {
          include: [
            {
              model: db.Reactions,
              where: { sourceType: ARTICLE_REACTION }
            }
          ]
        }
      },
      foreignKey: "articleId",
      target: "id",
      as: "articleReactions",
      onDelete: "CASCADE"
    });

    Article.belongsToMany(db.Tags, {
      through: {
        model: "ArticleTags",
        unique: false
      },
      timestamps: false,
      foreignKey: "articleId",
      target: "id",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE"
    });
  };
  Article.fetchArticles = function(options) {
    const { pageLimit, offset } = pagination(options.query);
    return this.findAll({
      order: [["createdAt", "DESC"]],
      // where: options.whereConditions,
      /* TODO: Add join for ArticleTags */
      include: [
        {
          model: models.Users,
          as: "author",
          attributes: ["firstName", "lastName", "imageURL"]
        },
        {
          model: models.Reactions,
          as: "articleReactions",
          required: false
        },
        {
          model: models.Comments,
          as: "articleComments",
          required: false
        }
      ],
      limit: pageLimit,
      offset
    });
  };

  return Article;
};
export default getArticleModel;
