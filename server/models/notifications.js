const getNotificationsModel = (sequelize, DataTypes) => {
  const flags = {
    freezeTableName: true
  };

  const NotificationSchema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    userId: {
      type: DataTypes.UUID
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID
    }
  };

  const Notification = sequelize.define(
    "Notifications",
    NotificationSchema,
    flags
  );

  Notification.associate = db => {
    Notification.belongsTo(db.Users, {
      foreignKey: "userId",
      target: "id",
      onDelete: "CASCADE"
    });

    Notification.belongsTo(db.Articles, {
      foreignKey: "articleId",
      target: "id",
      onDelete: "CASCADE"
    });
  };

  return Notification;
};

export default getNotificationsModel;
