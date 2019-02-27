import { generateUniqueSlug } from "../helpers/generateUniqueSlug";
import { calculateReadTime } from "../helpers/calculateReadTime";

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
    categoryId: {
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
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  };
  return Article;
};
export default getArticleModel;
