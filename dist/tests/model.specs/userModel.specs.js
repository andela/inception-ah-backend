"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mocha = _interopRequireDefault(require("mocha"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

var _index = _interopRequireDefault(require("../../models/index"));

const expect = _chai.default.expect;

_chai.default.use(_chaiAsPromised.default);

const sequelize = _index.default.sequelize;
const assert = _chai.default.assert;
const userTemplate = {
  firstName: "John Doe",
  lastName: "Drew",
  email: "user@email.com",
  gender: "male"
};
const Users = _index.default["Users"];
beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync({
    force: true
  });
});
describe("User Database Model", () => {
  it("should create a User model", async () => {
    const user = await Users.create(userTemplate);
    assert.equal(user.dataValues.firstName, "John Doe");
    assert.equal(user.dataValues.lastName, "Drew");
    assert.equal(user.dataValues.email, "user@email.com");
    assert.equal(user.dataValues.gender, "male");
  });
  it("should delete a User model", async () => {
    const user = await Users.create(userTemplate);
    assert.equal(user.dataValues.email, "user@email.com");
    await Users.drop();
    let dropped = false;
    await Users.findOne({
      where: {
        email: "user@email.com"
      }
    }).catch(() => {
      dropped = true;
    });
    assert.isTrue(dropped);
  });
  it("should reject setting user id on creation", async () => {
    const badUser = Object.assign(userTemplate, {
      id: 1
    });
    expect(Users.create(badUser)).to.be.rejectedWith(Error);
  });
});
after(async () => {
  sequelize.drop().catch(err => {
    console.log("All tables dropped");
  }); // close database connection to avoid mocha process hanging

  await sequelize.close();
});