import { generateUniqueSlug, calculateReadTime } from "@helpers/articles";
import { ARTICLE_REACTION } from "@helpers/constants";
import { mapAsync } from "../helpers/utils";

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

  /**
   * @description Find or create a new instance of Tags
   *
   * @param {Array} tags array of tags
   * @param {object} tagModel the tag model
   * @returns {Promise} a promise that resolves to an array of object
   * @method saveTags
   */
  Article.prototype.saveTags = async function(tags, tagModel) {
    if (!tags) return;
    try {
      let tagInstance;
      const tagIdArray = await mapAsync(tags, async tag => {
        tag = tag.trim();
        tagInstance = await tagModel.findOne({
          /**
           * We are forcing our DBMS to make comparison in lowercase
           */
          where: sequelize.where(
            sequelize.fn("lower", sequelize.col("tag")),
            sequelize.fn("lower", tag)
          )
        });
        /**
         * To avoid Cyclic Reference issue, we have chosen to pass in the Tag model
         * as a parameter (tagModel) to this function
         */
        tagInstance = tagInstance || (await tagModel.create({ tag }));
        return tagInstance.get("id");
      });
      const result = await this.addTags(tagIdArray);
      return result[0];
    } catch (error) {
      throw error;
    }
  };

  return Article;
};
export default getArticleModel;
