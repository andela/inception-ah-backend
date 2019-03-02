const getTagModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };
  const tagSchema = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    }
  };

  const Tag = sequelize.define("Tags", tagSchema, flags);
  Tag.associate = db => {
    Tag.belongsToMany(db.Articles, {
      through: {
        model: "ArticleTags",
        unique: false
      },
      timestamps: false,
      foreignKey: "tagId",
      target: "id",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE"
    });
  };

  return Tag;
};
export default getTagModel;
