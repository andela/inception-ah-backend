const getRatingsModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };

  const ratingSchema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    raterId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  };

  const Rating = sequelize.define("Ratings", ratingSchema, flags);

  Rating.associate = db => {
    Rating.belongsTo(db.Users, {
      foreignKey: "raterId",
      target: "id",
      onDelete: "CASCADE"
    });
    Rating.belongsTo(db.Articles, {
      foreignKey: "articleId",
      target: "id",
      onDelete: "CASCADE"
    });
  };

  return Rating;
};

export default getRatingsModel;
