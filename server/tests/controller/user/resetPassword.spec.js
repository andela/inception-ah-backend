import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../../index";
import models from "../../../models";
import { validUser } from "../../fixtures/models/userData";

const { Users } = models;

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

let resetLink = "";
const baseUrl = "/api/v1/users/resetPassword";
chai.use(chaiHttp);

describe("Test for Password Reset", () => {
  it("should return a status code of 404 for unregistered User", async () => {
    const response = await chai
      .request(app)
      .post(baseUrl)
      .send({ email: "none@example.com" });
    expect(response.statusCode).to.equal(404);
  });

  it("should successfully send a link to a registered User with a status code of 200", async () => {
    await Users.create(validUser);
    const response = await chai
      .request(app)
      .post(baseUrl)
      .send({ email: "obasajujoshua31@gmail.com" });
    resetLink = response.body.data;
    expect(response.statusCode).to.equal(200);

    const passwordResetResponse = await chai
      .request(app)
      .put(`${baseUrl}/${resetLink}`)
      .send({ password: "four-figure-table" });
    expect(passwordResetResponse.statusCode).to.equal(200);

    const userResponse = await chai
      .request(app)
      .put(`${baseUrl}/${resetLink}`)
      .send({ password: "four-figure-two" });
    expect(userResponse.statusCode).to.equal(400);
  });

  it(`should successfully send a link to a registered 
  User with a status code of 200 and fail when the 
  request delays for password reset`, async () => {
    await Users.create(validUser);
    const response = await chai
      .request(app)
      .post(baseUrl)
      .send({ email: "obasajujoshua31@gmail.com" });
    resetLink = response.body.data;
    expect(response.statusCode).to.equal(200);

    return getTimeout(async () => {
      const userResponse = await chai
        .request(app)
        .put(`${baseUrl}/${resetLink}`)
        .send({ password: "four-figure-table" });
      expect(userResponse.statusCode).to.equal(500);
    }, 2000);
  });
});
