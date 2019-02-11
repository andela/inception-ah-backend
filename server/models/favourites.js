const getFavoutesModel = (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const favouriteSchema = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
    },

    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },

    articleId: {
      type: Sequelize.UUID,
      allowNull: false
    }
  };
  const Favourite = sequelize.define("Favourites", favouriteSchema, flags);

  Favourite.associate = db => {};
  return Favourite;
};
export default getFavoutesModel;
