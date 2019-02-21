const getFavoritesModel = (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const favoriteSchema = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    articleSlug: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    }
  };
  const Favorite = sequelize.define("Favorites", favoriteSchema, flags);

  Favorite.associate = db => {};
  return Favorite;
};
export default getFavoritesModel;
