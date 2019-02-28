import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../../index";
import models from "../../../models";
import { userData } from "../../fixtures/models/userData";

chai.use(chaiHttp);
const { firstName, lastName, email, password } = userData[0];

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const signUp = async () => {
  const res = await chai
    .request(app)
    .post("/api/v1/auth/signup")
    .send({ firstName, lastName, email, password });
};

describe("POST <API /api/v1/auth/signin>", () => {
  it("should login a valid user", async () => {
    await signUp();
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send({ email, password });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.not.be.null;
  });

  it("should not login an invalid user", async () => {
    await signUp();
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signin")
      .send({ email, password: "bad password" });
    expect(res.statusCode).to.equal(401);
    expect(res.body.data).to.be.null;
    expect(res.body.success).to.be.false;
  });
});
