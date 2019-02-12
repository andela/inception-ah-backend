import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import database from "../../models/index";
import userData from "../fixtures/model/userData";
import { hashPassword } from "../../helpers";

chai.use(chaiHttp);
const expect = chai.expect;

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
    const responseBody = JSON.parse(res.text);
    expect(responseBody.data.token).to.not.be.null;
    expect(responseBody.success).to.be.true;
  });

  it("should not login an invalid user", async () => {
    const loginEmail = userData.email;
    const loginPassword = userData.password;
    const res = await chai
      .request(app)
      .post("/api/v1/auth/login")
      .send({ email: loginEmail, password: loginPassword });
    expect(res.statusCode).to.equal(401);
    const responseBody = JSON.parse(res.text);
    expect(responseBody.data).to.be.null;
    expect(responseBody.success).to.be.false;
  });
});
