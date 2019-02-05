import mocha from "mocha";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models/index";

const expect = chai.expect;
chai.use(chaiAsPromise);
const sequelize = database.sequelize;
const assert = chai.assert;

const userTemplate = {
  firstName: "John Doe",
  lastName: "Drew",
  email: "user@email.com",
  gender: "male"
};

const Users = database["Users"];

beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync({ force: true });
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
    await Users.findOne({ where: { email: "user@email.com" } }).catch(() => {
      dropped = true;
    });
    assert.isTrue(dropped);
  });

  it("should reject setting user id on creation", async () => {
    const badUser = Object.assign(userTemplate, { id: 1 });
    expect(Users.create(badUser)).to.be.rejectedWith(Error);
  });
});

after(async () => {
  sequelize.drop().catch(err => {
    console.log("All tables dropped");
  });
  // close database connection to avoid mocha process hanging
  await sequelize.close();
});
