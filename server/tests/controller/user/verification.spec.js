import chai from "chai";
import uniqid from "uuid/v4";
import chaiHttp from "chai-http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { generateJWT, decodeJWT, getJWTConfigs } from "@helpers/jwt";
import app from "@app";
import models from "@models";
import { userData } from "@fixtures";
import { userDependencies } from "@dependencies";
import { verifyUserAccount } from "@controllers/user";

let token;
chai.use(chaiHttp);
chai.use(sinonChai);
const { expect, assert } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

afterEach(() => sinon.restore());

const verificationConfig = getJWTConfigs({ option: "verification" });

describe("GET <API /api/v1/auth/verification?token=token>", () => {
  it("should verify a user registration", async () => {
    const user = await userDependencies(userData[0]);
    token = generateJWT({ userId: user.id }, verificationConfig);
    const res1 = await chai
      .request(app)
      .get(`/api/v1/auth/verification?token=${token}`);
    expect(res1.statusCode).to.equal(200);
    expect(res1.body.user).to.be.an("object");
    expect(res1.body.message).to.equal("Account verification was successfull");
    expect(res1.body.user).to.haveOwnProperty("token");

    const res2 = await chai
      .request(app)
      .get(`/api/v1/auth/verification?token=${token}`);
    expect(res2.statusCode).to.equal(200);
    expect(res2.body.message).to.equal("Account has been verified");
  });

  it("should return user not found", async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/auth/verification?token=${token}`);
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("Sorry, user does not exist");
  });

  it("should return a server error", async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/auth/verification?token=234656`);
    expect(res.statusCode).to.equal(500);
    expect(res.body.success).to.be.false;
  });

  it("should return server error for verifyUserAccount", async () => {
    const user = await userDependencies(userData[0]);
    token = generateJWT({ userId: user.id }, verificationConfig);
    const req = { query: { token } };
    const res = {
      status() {},
      json() {}
    };
    sinon.stub(res, "status").returnsThis();
    sinon.stub(models.Users, "findByPk").throws();
    await verifyUserAccount(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});

describe("User Helpers", () => {
  it("should not generate a token and throw an exception", () => {
    try {
      generateJWT({ userId: uniqid() }, getJWTConfigs({ expiresIn: [] }));
    } catch (error) {
      assert.instanceOf(error, Error);
    }
  });

  it("should return the default jwt configs", () => {
    const configs = getJWTConfigs({ option: "verification" });
    assert.isObject(configs);
    assert.containsAllKeys(configs, ["issuer", "secret", "subject"]);
  });

  it("should decode a verification token", () => {
    const decoded = decodeJWT(token, verificationConfig);
    assert.isObject(decoded);
    assert.hasAllKeys(decoded, ["userId", "iat", "iss", "sub"]);
  });

  it("should return JWT configs", () => {
    const configs = getJWTConfigs({ option: "verification" });
    assert.isObject(configs);
    assert.hasAllKeys(configs, ["secret", "subject", "issuer"]);
  });

  it("should return JWT configs with expiresIn", () => {
    const configs = getJWTConfigs({ expiresIn: "7d", option: "verification" });
    assert.isObject(configs);
    assert.hasAllKeys(configs, ["secret", "subject", "issuer", "expiresIn"]);
  });

  it("should throw an error an error if option is not provided", () => {
    try {
      getJWTConfigs();
    } catch (error) {
      expect(error.message).to.equal(
        "An object with property option is required"
      );
    }
  });
});
