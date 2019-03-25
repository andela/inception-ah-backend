import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import app from "@app";
import models from "@models";
import { userData } from "@fixtures";
import { updateProfileDependencies } from "@dependencies";
import { updateUserProfile } from "@controllers/user";

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

afterEach(() => sinon.restore());

const userProfileDependencies = async () => {
  const user1 = await updateProfileDependencies(
    userData[0].email,
    userData[0].password,
    userData[0]
  );

  const user2 = await updateProfileDependencies(
    userData[1].email,
    userData[1].password,
    userData[1]
  );

  return Promise.resolve({
    id1: user1.userId,
    token1: user1.token,
    id2: user2.userId,
    token2: user2.token,
    users: { user1, user2 }
  });
};

const wrongId = "bc302642-83e8-4c1b-80b4-c9ed35b6f908";
const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ";

describe("Test for User Profile", () => {
  describe("GET <API /api/v1/users/:userId>", () => {
    it("should return user profile if a valid user id is supplied", async () => {
      const { id1 } = await userProfileDependencies();
      const res = await chai.request(app).get(`/api/v1/users/${id1}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.user);
    });

    it("should return error if user does not exist", async () => {
      const res = await chai.request(app).get(`/api/v1/users/${wrongId}`);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
    });

    it("should return error if invalid user id is supplied in the params", async () => {
      const res = await chai.request(app).get("/api/v1/users/2222");
      expect(res.statusCode).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.errorMessages).to.equal("userId is not a valid uuid");
    });
  });

  describe("PUT <API /api/v1/users/:id/updateProfile>", () => {
    it("should return an error message if token is not supplied", async () => {
      const { id1 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/users/${id1}`)
        .send(userData[3]);
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("No valid token provided");
    });

    it("should return an error message if user does not exist", async () => {
      const { id1, token1 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/users/${wrongId}`)
        .set("Authorization", token1);
      expect(res.statusCode).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal("User not found");
    });

    it("should return an error message if user id is not correct", async () => {
      const { id1, token1 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put("/api/v1/users/ldkdkkdkdk")
        .set("Authorization", token1);

      expect(res.statusCode).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.errorMessages).to.eql("userId is not a valid uuid");
    });

    it("should update user profile if a valid user id is supplied", async () => {
      const { id1, token1 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/users/${id1}`)
        .set("Authorization", token1)
        .send(userData[3]);
      expect(res.statusCode).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.eql("User profile updated");
    });

    it("should return an error message if user supply another user's id", async () => {
      const { id1, token2 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/users/${id1}`)
        .set("Authorization", token2)
        .send(userData[3]);
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.eql(
        "Unauthorized. Can not update another user's profile"
      );
    });

    it("should return an error if the request body is invalid", async () => {
      const { id2, token2 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/users/${id2}`)
        .set("Authorization", token2)
        .send({
          firstName: "John",
          middleName: "Mark",
          lastName: "Drew",
          gender: "male",
          biography: "     A son from the sun   ",
          mobileNumber: 12345678909
        });
      expect(res.statusCode).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.errorMessages);
    });

    it("should return an error message if user supply invalid token", async () => {
      const { id2 } = await userProfileDependencies();
      const res = await chai
        .request(app)
        .put(`/api/v1/users/${id2}`)
        .set("Authorization", invalidToken)
        .send(userData[3]);
      expect(res.statusCode).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body.message);
    });

    it("should return server error for updateUserProfile", async () => {
      const user = await models.Users.create(userData[0]);
      const req = { user: {}, userDetails: {} };
      const res = {
        status() {},
        json() {}
      };
      sinon.stub(res, "status").returnsThis();
      sinon.stub(user, "updateProfile").throws();
      await updateUserProfile(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
  });
});
