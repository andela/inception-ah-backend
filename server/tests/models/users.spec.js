import chai, { assert } from "chai";
import chaiAsPromise from "chai-as-promised";
import database from "../../models";
import { userData } from "../fixtures/models/userData";
import { comparePassword } from "../../helpers/password";

chai.use(chaiAsPromise);
const sequelize = database.sequelize;
const Users = database["Users"];
const { expect } = chai;

beforeEach(async () => {
  await sequelize.sync({ force: true }).catch(() => {});
});

describe("User table Model", async () => {
  it("should create a User model", async () => {
    const createdUser = await Users.create(userData[0]);
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
    assert.equal(firstName, userData[0].firstName, "firstName");
    assert.equal(lastName, userData[0].lastName, "last");
    assert.equal(email, userData[0].email, "email");
    assert.equal(gender, userData[0].gender, "gender");
    assert.equal(biography, userData[0].biography, "biography");

    const validPassword = await comparePassword(
      userData[0].password,
      createdUser.get("password")
    );
    assert.isTrue(validPassword);

    assert.equal(mobileNumber, userData[0].mobileNumber, "mobileNumber");
    assert.equal(imageURL, userData[0].imageURL, "imageURL");
    assert.equal(isNotifiable, userData[0].isNotifiable, "isNotifiable");
    assert.equal(
      createdUser.dataValues.isAdmin,
      userData[0].isAdmin,
      "isAdmin"
    );
  });

  it("should delete a User model", async () => {
    const createdUser = await Users.create(userData[0]);
    assert.equal(createdUser.dataValues.email, userData[0].email);
    await Users.drop({ cascade: true });
    expect(
      Users.findOne({ where: { email: userData[0].email } })
    ).to.rejectedWith(Error);
  });
});

after(async () => {
  sequelize.drop();
  sequelize.close();
});
