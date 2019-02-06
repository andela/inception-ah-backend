import { expect } from "chai";
import { validateInput } from "../../validations/validateInput";
import userData from "../fixtures/model/userData";
import { signUpSchema, signInSchema } from "../../validationSchemas/user";

describe("Input validation function", () => {
  const { firstName, lastName, email, password } = userData;

  describe("Sign up schema validation", () => {
    let value = {
      firstName,
      lastName,
      email,
      password
    };

    it("should not return an error when all the inputs are valid", async () => {
      const result = await validateInput(value, signUpSchema);
      expect(result).to.be.equal(true);
    });

    it("should return an error when firstname is invalid", async () => {
      value.firstName = "";
      const result = await validateInput(value, signUpSchema);
      expect(result.errorMessages)
        .to.be.an("array")
        .with.length(2);
      expect(result.errorMessages)
        .to.be.an("array")
        .that.include("First name is not allowed to be empty");
    });

    it("should return an error when firstname and lastname is invalid", async () => {
      value.lastName = "";
      const result = await validateInput(value, signUpSchema);
      expect(result.errorMessages)
        .to.be.an("array")
        .with.length(4);
      expect(result.errorMessages)
        .to.be.an("array")
        .that.include(
          "First name is not allowed to be empty",
          "Last name is not allow to be empty"
        );
    });

    it("should return an error when all input are invalid", async () => {
      value = {};
      const result = await validateInput(value, signUpSchema);
      expect(result.errorMessages)
        .to.be.an("array")
        .with.length(4);
      expect(result.errorMessages)
        .to.be.an("array")
        .that.include(
          "First name is required",
          "Last name is required",
          "Email is required",
          "Password must be atleast 6 chars with atleast 1 uppercase, 1 number, & 1 special char"
        );
    });
  });

  describe("Sign in schema validation", () => {
    let inputDate = {
      email,
      password
    };

    it("should not return an error when all the inputs are valid", async () => {
      const result = await validateInput(inputDate, signInSchema);
      expect(result).to.be.equal(true);
    });

    it("should return an error when email is invalid", async () => {
      inputDate.email = "";
      const result = await validateInput(inputDate, signInSchema);
      expect(result.errorMessages)
        .to.be.an("array")
        .with.length(2);
      expect(result.errorMessages)
        .to.be.an("array")
        .that.include("Email is not allowed to be empty");
    });

    it("should return an error when the password is invalid", async () => {
      inputDate.email = email;
      inputDate.password = "";
      const result = await validateInput(inputDate, signInSchema);
      expect(result.errorMessages)
        .to.be.an("array")
        .with.length(1);
      expect(result.errorMessages)
        .to.be.an("array")
        .that.include(
          "Password must be atleast 6 chars with atleast 1 uppercase, 1 number, & 1 special char"
        );
    });

    it("should return an error when all input are invalid", async () => {
      inputDate = {};
      const result = await validateInput(inputDate, signInSchema);
      expect(result.errorMessages)
        .to.be.an("array")
        .with.length(2);
      expect(result.errorMessages)
        .to.be.an("array")
        .that.include(
          "Email is required",
          "Password must be atleast 6 chars with atleast 1 uppercase, 1 number, & 1 special char"
        );
    });
  });
});
