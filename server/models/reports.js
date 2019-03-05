const getReportModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };

  const reportSchema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    reporterId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    reportedArticleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isResolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  };

  const Report = sequelize.define("Reports", reportSchema, flags);

  Report.associate = db => {
    Report.belongsTo(db.Users, {
      foreignKey: "reporterId",
      target: "id",
      onDelete: "CASCADE"
    });

    Report.belongsTo(db.Articles, {
      foreignKey: "reportedArticleId",
      target: "id",
      onDelete: "CASCADE"
    });
  };
  return Report;
};

export default getReportModel;
