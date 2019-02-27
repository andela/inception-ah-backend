import chai from "chai";
import uniqid from "uuid/v4";
import chaiHttp from "chai-http";
import app from "../../../index";
import models from "../../../models";
import { userData } from "../../fixtures/models/userData";
import { generateJWT, decodeJWT, getJWTConfigs } from "../../../helpers/jwt";
import { userDependencies } from "../../helpers/dependencies";

let token;
chai.use(chaiHttp);
const { expect, assert } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

chai.use(chaiHttp);
const verificationConfig = getJWTConfigs();

describe("GET <API /api/v1/auth/verification/:token>", () => {
  it("should verify a user registration", async () => {
    const user = await userDependencies(userData[0]);
    token = generateJWT(user.id, verificationConfig);
    const res1 = await chai
      .request(app)
      .get(`/api/v1/auth/verification/${token}`);
    expect(res1.statusCode).to.equal(200);
    expect(res1.body.user).to.be.an("object");
    expect(res1.body.message).to.equal("Account verification was successfull");
    expect(res1.body.user).to.haveOwnProperty("token");

    const res2 = await chai
      .request(app)
      .get(`/api/v1/auth/verification/${token}`);
    expect(res2.statusCode).to.equal(200);
    expect(res2.body.message).to.equal("Account has been verified");
  });

  it("should return user not found", async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/auth/verification/${token}`);
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("Sorry, user does not exist");
  });

  it("should return a server error", async () => {
    const res = await chai.request(app).get(`/api/v1/auth/verification/234656`);
    expect(res.statusCode).to.equal(500);
    expect(res.body.success).to.be.false;
  });
});

describe("User Helpers", () => {
  it("should not generate a token and throw an exception", () => {
    try {
      generateJWT(uniqid(), getJWTConfigs({ expiresIn: [] }));
    } catch (error) {
      assert.instanceOf(error, Error);
    }
  });

  it("should not decode a token and throw an exception", () => {
    try {
      decodeJWT(uniqid(), {});
    } catch (error) {
      assert.instanceOf(error, Error);
    }
  });

  it("should decode a verification token", () => {
    const decoded = decodeJWT(token, verificationConfig);
    assert.isObject(decoded);
    assert.hasAllKeys(decoded, ["userId", "iat", "iss", "sub"]);
  });

  it("should return JWT configs", () => {
    const configs = getJWTConfigs();
    assert.isObject(configs);
    assert.hasAllKeys(configs, ["secret", "subject", "issuer"]);
  });

  it("should return JWT configs with expiresIn", () => {
    const configs = getJWTConfigs({ expiresIn: "7d", subject: "Subject" });
    assert.isObject(configs);
    assert.hasAllKeys(configs, ["secret", "subject", "issuer", "expiresIn"]);
  });
});
