import chai, { assert } from "chai";
import chaiAsPromise from "chai-as-promised";
import models from "../../models";
import { userData } from "../fixtures/models/userData";

chai.use(chaiAsPromise);
const sequelize = models.sequelize;
const { Users } = models;

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("User table Model", async () => {
  it("should create a User model", async () => {
    const createdUser = await Users.create(userData);
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
    assert.equal(firstName, userData.firstName, "firstName");
    assert.equal(lastName, userData.lastName, "last");
    assert.equal(email, userData.email, "email");
    assert.equal(gender, userData.gender, "gender");
    assert.equal(biography, userData.biography, "biography");
    assert.isNotNull(password, "password");
    assert.equal(mobileNumber, userData.mobileNumber, "mobileNumber");
    assert.equal(imageURL, userData.imageURL, "imageURL");
    assert.equal(isNotifiable, userData.isNotifiable, "isNotifiable");
    assert.equal(createdUser.dataValues.isAdmin, userData.isAdmin, "isAdmin");
  });

  it("should delete a User model", async () => {
    const createdUser = await Users.create(userData);
    assert.equal(createdUser.dataValues.email, userData.email);
    await Users.drop({ cascade: true });
    chai
      .expect(Users.findOne({ where: { email: userData.email } }))
      .to.rejectedWith(Error);
  });
});

after(async () => {
  sequelize.drop();
  sequelize.close();
});
