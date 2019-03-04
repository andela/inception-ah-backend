const getCategoriesModel = (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const categorySchema = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false
    }
  };
  const Category = sequelize.define("Categories", categorySchema, flags);
  Category.associate = db => {
    Category.hasMany(db.Articles, {
      foreignKey: "categoryId",
      target: "id"
    });
  };
  return Category;
};
export default getCategoriesModel;
