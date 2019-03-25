import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import app from "@app";
import models from "@models";
import { validUserData } from "@fixtures";
import { passwordResetRequest } from "@controllers/user";

const { Users } = models;
beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

afterEach(() => sinon.restore());

const getTimeout = (func, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(func());
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
};

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

let resetLink = "";
const baseUrl = "/api/v1/users/resetPassword";
chai.use(chaiHttp);
chai.use(sinonChai);

describe("Test for Password Reset", () => {
  it("should return a status code of 404 for unregistered User", async () => {
    const response = await chai
      .request(app)
      .post(baseUrl)
      .send({ email: "none@example.com" });
    expect(response.statusCode).to.equal(404);
  });

  it(`should successfully send a link to a registered 
      user with a status code of 200`, async () => {
    const u = await Users.create(validUserData);

    const response = await chai
      .request(app)
      .post(baseUrl)
      .send({ email: validUserData.email });
    resetLink = response.body.data;
    expect(response.statusCode).to.equal(200);

    const passwordResetResponse = await chai
      .request(app)
      .put(`${baseUrl}?token=${resetLink}`)
      .send({ password: "four-figure-table" });
    expect(passwordResetResponse.statusCode).to.equal(200);

    const userResponse = await chai
      .request(app)
      .put(`${baseUrl}?token=${resetLink}`)
      .send({ password: "four-figure-two" });
    expect(userResponse.statusCode).to.equal(400);
  });

  it(`should successfully send a link to a registered 
  User with a status code of 200 and fail when the 
  request delays for password reset`, async () => {
    await Users.create(validUserData);
    const response = await chai
      .request(app)
      .post(baseUrl)
      .send({ email: validUserData.email });
    resetLink = response.body.data;
    expect(response.statusCode).to.equal(200);

    return getTimeout(async () => {
      const userResponse = await chai
        .request(app)
        .put(`${baseUrl}?token=${resetLink}`)
        .send({ password: "four-figure-table" });
      expect(userResponse.statusCode).to.equal(500);
    }, 2000);
  });

  it("should return server error for userLogin", async () => {
    const req = { body: {} };
    const res = {
      status() {},
      json() {}
    };
    sinon.stub(res, "status").returnsThis();
    sinon.stub(models.Users, "findOne").throws();
    await passwordResetRequest(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});

after(async () => {
  models.sequelize.drop();
});
