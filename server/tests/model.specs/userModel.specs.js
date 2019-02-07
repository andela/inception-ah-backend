import mocha from "mocha";
import chai from "chai";
import database from "../../models/index";
import fixtures from "./mode.fixtures";

const sequelize = database.sequelize;
const assert = chai.assert;
const userTemplate = fixtures.users;
const Users = database["Users"];

beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync({ force: true }).catch(() => {
    //database initialized already from model index
  });
});

describe("User Database Model", () => {
  it("should create a User model", async () => {
    const user = await Users.create(userTemplate);
    assert.equal(
      user.dataValues.firstName,
      userTemplate.firstName,
      "firstName"
    );
    assert.equal(user.dataValues.lastName, userTemplate.lastName, "last");
    assert.equal(user.dataValues.email, userTemplate.email, "email");
    assert.equal(user.dataValues.gender, userTemplate.gender, "gender");
    assert.equal(
      user.dataValues.biography,
      userTemplate.biography,
      "biography"
    );
    assert.equal(
      user.dataValues.mobileNumber,
      userTemplate.mobileNumber,
      "mobileNumber"
    );
    assert.equal(user.dataValues.imageURL, userTemplate.imageURL, "imageURL");
    assert.equal(
      user.dataValues.isNotifiable,
      userTemplate.isNotifiable,
      "isNotifiable"
    );
    assert.equal(user.dataValues.isAdmin, userTemplate.isAdmin, "isAdmin");
  });

  it("should delete a User model", async () => {
    const user = await Users.create(userTemplate);
    assert.equal(user.dataValues.email, userTemplate.email);
    await Users.drop();
    let dropped = false;
    await Users.findOne({ where: { email: userTemplate.email } }).catch(() => {
      dropped = true;
    });
    assert.isTrue(dropped);
  });
});

after(async () => {
  sequelize.drop().catch(err => {
    console.log("All tables dropped");
  });
  // close database connection to avoid mocha process hanging
  await sequelize.close();
});
