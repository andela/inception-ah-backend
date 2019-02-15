import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import database from "../../models/index";
import userData from "../fixtures/model/userData";
import { hashPassword } from "../../helpers/password";

chai.use(chaiHttp);
const { expect } = chai;

beforeEach(async () => {
  await database.sequelize.sync({ force: true });
});

const userDependencies = async () => {
  const { email, password } = userData;
  const hashedPassword = await hashPassword(password);
  const updatedUserData = Object.assign(userData, { password: hashedPassword });
  await database["Users"].create(updatedUserData);
  return {
    loginEmail: email,
    loginPassword: password
  };
};

describe("POST <API /api/v1/auth/login>", () => {
  it("should login a valid user", async () => {
    const userInfo = await userDependencies();
    const { loginEmail, loginPassword } = userInfo;
    const res = await chai
      .request(app)
      .post("/api/v1/auth/login")
      .send({ email: loginEmail, password: loginPassword });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.not.be.null;
  });

  it("should not login an invalid user", async () => {
    const loginEmail = userData.email;
    const loginPassword = userData.password;
    const res = await chai
      .request(app)
      .post("/api/v1/auth/login")
      .send({ email: loginEmail, password: loginPassword });
    expect(res.statusCode).to.equal(401);
    expect(res.body.data).to.be.null;
    expect(res.body.success).to.be.false;
  });
});
