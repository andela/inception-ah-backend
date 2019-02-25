import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../../index";
import { userResponse } from "../../helpers/userResponse";
import models from "../../models";
import testUser, { userData, socialUser } from "../fixtures/models/userData";
import { getUserProfileFromApis } from "../../helpers/passportCallback";
import database from "../../models/index";

beforeEach(async () => {
  await database.sequelize.sync({ force: true }).catch(() => {});
});

const { Users } = models;

const baseUrl = "/api/v1";
chai.use(chaiHttp);

const confirmSocialUser = async () => {
  const user = await Users.findOne({
    where: {
      email: socialUser.emails[0].value
    }
  });
  return user;
};

describe("Social Platform Authentication Test", () => {
  it("should return a status code of 200 for all endpoints", async () => {
    const response = await chai.request(app).get(baseUrl);
    expect(response.statusCode).to.equal(200);
  });

  it("should successfully authenticate via google ", async () => {
    const response = await chai.request(app).get(`${baseUrl}/auth/google`);
    expect(response.statusCode).to.equal(200);
  });

  it("should successfully authenticate via facebook ", async () => {
    const response = await chai.request(app).get(`${baseUrl}/auth/facebook`);
    expect(response.statusCode).to.equal(200);

    const redirectResponse = await chai
      .request(app)
      .get(`${baseUrl}/auth/facebook/redirect`);
    expect(redirectResponse.statusCode).to.equal(200);
  });

  it("should save a socially authenticated users data into the database", async () => {
    const done = sinon.spy();
    getUserProfileFromApis(null, null, socialUser, done);
    expect(await confirmSocialUser()).to.not.be.undefined;
  });
  it("User Response function should return an object with 5 keys", async () => {
    const newUser = await Users.create(userData);
    expect(userResponse(newUser)).to.have.all.keys([
      "id",
      "email",
      "biography",
      "token",
      "imageURL"
    ]);
  });
});
