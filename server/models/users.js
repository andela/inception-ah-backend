import bcrypt from "bcrypt";
import { expiryTime } from "@configs/config";
import { hashPassword } from "@helpers/password";
import { decryptToken, getTimeDifference, encryptToken } from "@helpers/crypto";
import { sendEmail } from "@emails/email";
import { resetConstants, verifyConstants } from "@emails/constants";

export default (sequelize, Sequelize) => {
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
      type: Sequelize.TEXT,
      defaultValue: process.env.IMAGE_URL
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

  const User = sequelize.define("Users", userSchema, {
    freezeTableName: true,
    // Hash password before creating instance
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        return user.password;
      }
    }
  });
  User.associate = db => {
    User.hasMany(db.Articles, {
      foreignKey: "authorId",
      target: "id",
      onDelete: "CASCADE"
    });

    User.hasMany(db.Favorites, {
      foreignKey: "userId",
      target: "id",
      onUpdate: "CASCADE"
    });
  };

  User.prototype.generateResetToken = async function() {
    this.resetToken = encryptToken();
    this.save();
    await this.reload();
    return this.resetToken;
  };

  User.prototype.sendPasswordResetEmail = async function(url) {
    const { firstName, lastName, email } = this;
    const resetToken = await this.generateResetToken();
    const resetUrl = `${url}/${resetToken}`;
    sendEmail(
      firstName,
      lastName,
      email,
      "RESET EMAIL",
      resetUrl,
      resetConstants
    );
  };

  User.prototype.resetPassword = async function(password, token) {
    if (getTimeDifference(decryptToken(token)) > Number(expiryTime)) {
      throw new Error("The Link has expired");
    }
    this.password = hashPassword(password);
    this.resetToken = "";
    this.save();
    await this.reload();
  };

  User.prototype.sendVerificationEmail = async function(url) {
    const { firstName, lastName, email } = this;
    await sendEmail(
      firstName,
      lastName,
      email,
      "Verification Email",
      url,
      verifyConstants
    );
  };

  User.prototype.activateAccount = async function() {
    this.isVerified = true;
    this.lastLogin = new Date();
    this.save();
    await this.reload();
    return this;
  };

  User.prototype.updateProfile = async function(user) {
    Object.keys(user).forEach(key => {
      this[key] = user[key] || this[key];
    });
    this.save();
    await this.reload();
    return this;
  };

  return User;
};
