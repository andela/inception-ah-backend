const getArticleModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };
  const articleSchema = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
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
    favouriteCount: {
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
      type: DataTypes.TIME,
      allowNull: false
    }
  };
  const Article = sequelize.define("Articles", articleSchema);
  Article.associates = db => {
    Article.belongsTo(db["Users"], {
      foreignKey: {
        name: "authorId",
        target: "id"
      }
    });
  };

  return Article;
};

export default getArticleModel;
