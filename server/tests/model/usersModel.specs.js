import mocha from "mocha";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models/index";
import user from "../fixtures/model/userData";

chai.use(chaiAsPromise);
const sequelize = database.sequelize;
const assert = chai.assert;
const Users = database["Users"];

beforeEach(async () => {
  await sequelize.sync({ force: true }).catch(() => {});
});

describe("User table Model", async () => {
  it("should create a User model", async () => {
    const createdUser = await Users.create(user);
    assert.equal(createdUser.dataValues.firstName, user.firstName, "firstName");
    assert.equal(createdUser.dataValues.lastName, user.lastName, "last");
    assert.equal(createdUser.dataValues.email, user.email, "email");
    assert.equal(createdUser.dataValues.gender, user.gender, "gender");
    assert.equal(createdUser.dataValues.biography, user.biography, "biography");
    assert.equal(createdUser.dataValues.password, user.password, "password");
    assert.equal(
      createdUser.dataValues.mobileNumber,
      user.mobileNumber,
      "mobileNumber"
    );
    assert.equal(createdUser.dataValues.imageURL, user.imageURL, "imageURL");
    assert.equal(
      createdUser.dataValues.isNotifiable,
      user.isNotifiable,
      "isNotifiable"
    );
    assert.equal(createdUser.dataValues.isAdmin, user.isAdmin, "isAdmin");
  });

  it("should delete a User model", async () => {
    const createdUser = await Users.create(user);
    assert.equal(createdUser.dataValues.email, user.email);
    await Users.drop({ cascade: true });
    chai
      .expect(Users.findOne({ where: { email: user.email } }))
      .to.rejectedWith(Error);
  });
});

after(async () => {
  sequelize.drop();
  sequelize.close();
});
