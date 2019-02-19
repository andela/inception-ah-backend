import chai from "chai";
import { validateData } from "../../validations/validateData";
import { userData } from "../fixtures/models/userData";
import {
  signUpSchema,
  updateProfileSchema
} from "../../validationSchemas/user";
import models from "../../models";
import app from "../../index";

const { User } = models;

const { firstName, lastName, email, password } = userData[0];
const { middleName, gender, biography, mobileNumber, imageURL } = userData[2];
const { expect } = chai;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
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

  it("should not return an error when all the inputs are valid", async () => {
    const result = await validateData(inputData, updateProfileSchema);
    expect(result).to.be.true;
  });

  it("should return an error when the biography and mobileNumber are invalid", async () => {
    inputData.biography = "    A son from the sun     ";
    inputData.mobileNumber = "  12345678909  ";
    const result = await validateData(inputData, updateProfileSchema);
    expect(result.errorMessages)
      .to.be.an("array")
      .that.include(
        "Biography must not have leading or trailing whitespace",
        "Mobile number must not have leading or trailing whitespace"
      );
  });

  it("should return an error when all input are invalid", async () => {
    inputData = {};
    const result = await validateData(inputData, updateProfileSchema);
    expect(result.errorMessages).to.be.an("array");
  });
});
