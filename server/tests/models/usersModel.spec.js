import chai, { assert } from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models/index";
import user from "../fixtures/models/userData";

chai.use(chaiAsPromise);
const sequelize = database.sequelize;
const Users = database["Users"];

beforeEach(async () => {
  await sequelize.sync({ force: true }).catch(() => {});
});

describe("User table Model", async () => {
  it("should create a User model", async () => {
    const createdUser = await Users.create(user);
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      biography,
      imageURL,
      mobileNumber,
      isNotifiable
    } = createdUser;
    assert.equal(firstName, user.firstName, "firstName");
    assert.equal(lastName, user.lastName, "last");
    assert.equal(email, user.email, "email");
    assert.equal(gender, user.gender, "gender");
    assert.equal(biography, user.biography, "biography");
    assert.isNotNull(password, "password");
    assert.equal(mobileNumber, user.mobileNumber, "mobileNumber");
    assert.equal(imageURL, user.imageURL, "imageURL");
    assert.equal(isNotifiable, user.isNotifiable, "isNotifiable");
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
