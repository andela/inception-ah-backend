import { hashPassword } from "../helpers/password";
import {
  decryptToken,
  getTimeDifference,
  encryptToken
} from "../helpers/crypto";
import { expiryTime } from "../configs/config";
import { sendEmail } from "../emails/email";
import { resetConstants } from "../emails/constants/passwordReset";

export default (sequelize, Sequelize) => {
  const flags = {
    freezeTableName: true
  };
  const userSchema = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
      onDelete: "CASCADE"
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    middleName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.STRING
    },
    biography: {
      type: Sequelize.TEXT
    },
    mobileNumber: {
      type: Sequelize.CHAR
    },
    imageURL: {
      type: Sequelize.TEXT
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isNotifiable: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    lastLogin: {
      type: Sequelize.DATE,
      defaultValue: Date.now,
      allowNull: false
    },
    resetToken: {
      type: Sequelize.TEXT
    },
    isBlocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  };

  const User = sequelize.define("Users", userSchema, flags);
  User.associate = db => {
    // Add association between user and Favourites table
    User.hasMany(db["Favourites"], {
      foreignKey: "userId",
      target: "id",
      onUpdate: "CASCADE"
    });
    User.hasMany(db["Articles"], {
      foreignKey: "authorId",
      target: "id",
      onDelete: "CASCADE"
    });
  };

  User.prototype.generateResetToken = function() {
    this.resetToken = encryptToken();
    this.save();
    this.reload();
    return this.resetToken;
  };

  User.prototype.sendPasswordResetEmail = function(url) {
    const { firstName, lastName, email } = this;
    const resetUrl = `${url}/${this.generateResetToken()}`;
    sendEmail(
      firstName,
      lastName,
      email,
      "RESET EMAIL",
      resetUrl,
      resetConstants
    );
  };

  User.prototype.resetPassword = function(password, token) {
    if (getTimeDifference(decryptToken(token)) > parseInt(expiryTime, 10)) {
      throw new Error("The Link has expired");
    }
    this.password = hashPassword(password);
    this.resetToken = "";
    this.save();
    this.reload();
  };

  return User;
};
