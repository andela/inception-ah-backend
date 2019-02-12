import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import userResponse from "../../helpers/userResponse";
import database from "../../models/index";
import testUser from "../fixtures/model/userData";

const User = database["Users"];

const baseUrl = "/api/v1";
chai.use(chaiHttp);

describe("Social Platform Authentication Test", () => {
  it("should return a status code of 200 for all endpoints", async () => {
    const response = await chai.request(app).get(baseUrl);
    expect(response.statusCode).to.equal(200);
  });

  it("should successfully authenticate via facebook ", async () => {
    const response = await chai.request(app).get(`${baseUrl}/auth/facebook`);
    expect(response.statusCode).to.equal(200);
  });

  it("should return a status code of 200 for facebook redirect", async () => {
    const response = await chai
      .request(app)
      .get(`${baseUrl}/auth/facebook/redirect`);
    expect(response.statusCode).to.equal(200);
  });
  it("User Response function should return an object with 5 keys", async () => {
    const newUser = await User.create(testUser);
    expect(userResponse(newUser)).to.have.all.keys([
      "id",
      "email",
      "biography",
      "token",
      "imageURL"
    ]);
  });
});
