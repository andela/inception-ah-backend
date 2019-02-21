import chai from "chai";
import { chaiHttp } from "chai-http";
import { validateData } from "../../validations/validateData";
import userData from "../fixtures/models/userData";
import { signUpSchema } from "../../validationSchemas/user";
import models from "../../models";
import app from "../../index";

const { User } = models;

const { firstName, lastName, email, password } = userData;
const { expect } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true }).catch(() => {});
});

describe("Sign validation", () => {
  let value = {
    firstName,
    lastName,
    email,
    password
  };

  it("should not return an error when all the inputs are valid", async () => {
    const result = await validateData(value, signUpSchema);
    expect(result.hasError).to.be.false;
  });

  it("should return an error when firstname is invalid", async () => {
    value.firstName = "";
    const { errors } = await validateData(value, signUpSchema);
    expect(errors).to.be.an("object");
    expect(errors).to.haveOwnProperty("firstName");
    expect(errors.firstName).to.equal("First name is not allowed to be empty");
  });

  it("should return an error when firstname and lastname is invalid", async () => {
    value.lastName = "";
    const { errors } = await validateData(value, signUpSchema);
    expect(errors).to.be.an("object");
    expect(errors.lastName).to.equal("Last name is not allowed to be empty");
    expect(errors.firstName).to.equal("First name is not allowed to be empty");
  });

  it("should return an error when sign up inputs are undefined", async () => {
    value = {};
    const { errors } = await validateData(value, signUpSchema);
    expect(errors).to.be.an("object");
    expect(errors).to.have.any.keys(
      "firstName",
      "lastName",
      "email",
      "password"
    );
  });
});

describe("POST <API /api/v1/auth/signup>", () => {
  it("should return email has been used", async () => {
    const user = { firstName, lastName, email, password };
    await User.create(user);
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send(user);
    expect(res.statusCode).to.equal(409);
    expect(res.body.success).to.be.false;
    expect(res.body.message).to.equal("Email has already been used");
  });
});
