import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../../index";
import models from "../../../models";
import userData from "../../fixtures/models/userData";

chai.use(chaiHttp);
const { expect } = chai;
const { Users } = models;
beforeEach(async () => {
  await models.sequelize.sync({ force: true }).catch(() => {});
});
const userDependencies = async () => {
  const user = await Users.create(userData);
  const userId = user.get("id");

  return Promise.resolve({ userId, email: user.get("email") });
};
describe("POST <API /api/v1/auth/signin>", () => {
  it("should login a valid user", async () => {
    const { email } = await userDependencies();
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send({ email, password: userData.password });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.not.be.null;
  });

  it("should not login an invalid user", async () => {
    const { email } = await userDependencies();
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send({
        email,
        password: "Pasdfggh4565@"
      });
    expect(res.statusCode).to.equal(401);
    expect(res.body.data).to.be.null;
    expect(res.body.success).to.be.false;
  });
});
