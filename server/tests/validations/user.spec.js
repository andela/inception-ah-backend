/* eslint-disable import/no-unresolved */
import chai from "chai";
import chaiHttp from "chai-http";
import { validator, errorFormatter } from "@validations/validator";
import { userData } from "@fixtures";
import { signUpSchema, updateProfileSchema } from "@schemas";
import models from "@models";
import app from "@app";

const { Users } = models;

const { firstName, lastName, email, password } = userData[0];
const { middleName, gender, biography, mobileNumber, imageURL } = userData[2];
const { expect } = chai;

chai.use(chaiHttp);
beforeEach(async () => {
  await models.sequelize.sync({ force: true }).catch(() => {});
});

describe("Sign in validation", () => {
  let value = {
    firstName,
    lastName,
    email,
    password
  };

  it("should not return an error when all the inputs are valid", async () => {
    const { hasError } = await validator(value, signUpSchema);
    expect(hasError).to.be.false;
  });

  it("should return an error when firstname is invalid", async () => {
    value.firstName = "";
    const { errors } = await validator(value, signUpSchema);
    expect(errors).to.be.an("object");
    expect(errors).to.haveOwnProperty("firstName");
    expect(errors.firstName).to.equal("First name is not allowed to be empty");
  });

  it("should return an error when firstname and lastname is invalid", async () => {
    value.lastName = "";
    const { errors } = await validator(value, signUpSchema);
    expect(errors).to.be.an("object");
    expect(errors.lastName).to.equal("Last name is not allowed to be empty");
    expect(errors.firstName).to.equal("First name is not allowed to be empty");
  });

  it("should return an error when sign up inputs are undefined", async () => {
    value = {};
    const { errors } = await validator(value, signUpSchema);
    expect(errors).to.be.an("object");
    expect(errors).to.have.any.keys(
      "firstName",
      "lastName",
      "email",
      "password"
    );
  });

  it("should return a custom error message", async () => {
    const data = { firstName, lastName, email, password: "etrtyy" };
    const { hasError, errors } = await validator(data, signUpSchema);
    const msg = `Password must be atleast 6 chars with atleast 1 uppercase,`;
    expect(hasError).to.be.true;
    expect(errors.password).to.equal(`${msg} 1 number, & 1 special char`);
  });
});

describe("POST <API /api/v1/auth/signup>", () => {
  it("should return email has been used", async () => {
    const user = { firstName, lastName, email: "you@gmail.com", password };
    await Users.create(user);
    const res = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send(user);
    expect(res.statusCode).to.equal(409);
    expect(res.body.success).to.be.false;
    expect(res.body.message).to.equal("Email has already been used");
  });
});

describe("Update profile schema validation", () => {
  let inputData = {
    firstName,
    middleName,
    lastName,
    gender,
    biography,
    mobileNumber,
    imageURL
  };

  it("should return an error when all input are invalid", async () => {
    inputData = {};
    const result = await validator(inputData, updateProfileSchema);
    expect(result.hasError).to.be.true;
    expect(Object.keys(result.errors)).to.deep.equal(["firstName", "lastName"]);
  });
});
