import chai, { expect } from "chai";
import chaiHttp from "chai-http";

import app from "@app";
import models from "@models";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";
import { registerUser, articleSpec, category } from "@fixtures";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const { Notification, Users, Categories, Articles } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

const userDependencies = async data => {
  const user = await Users.create(data);
  return Promise.resolve({ userId: user.get("id") });
};

// const articleDependencies = async () => {
//   const categoryInstance = await Categories.create(category);
//   const categoryId = categoryInstance.get("id");
//   const articleInstance = Object.assign(articleSpec, { categoryId });
//   return Promise.resolve(articleInstance);
// };

describe("Email Notification Opt-in-out <api/v1/notification/optInOut>", () => {
  it("should opt user in for email notification", async () => {
    const user = await userDependencies(registerUser);
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    const res = await chai
      .request(app)
      .post("/api/v1/notification/optInOut")
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal(
      "You have successfully opted in for email notification"
    );
  });

  it("should opt user out for email notification", async () => {
    registerUser.isNotifiable = true;
    const user = await userDependencies(registerUser);
    const token = generateJWT({ userId: user.userId }, jwtConfigs);
    const res = await chai
      .request(app)
      .post("/api/v1/notification/optInOut")
      .set({ Authorization: token });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal(
      "You have successfully opted out for email notification"
    );
  });
});
