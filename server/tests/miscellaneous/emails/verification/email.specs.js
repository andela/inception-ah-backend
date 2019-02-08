import chai from "chai";
import chaiHttp from "chai-http";
import sendMail from "../../../../emails/verification/email";
import {
  validUser,
  invalidUser1,
  invalidUser2
} from "../../../fixtures/email/emailData";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Send Email", () => {
  it("should send an email to valid email address", async () => {
    const verifyEmail = await sendMail(validUser);
    expect(verifyEmail[0].statusCode).to.equal(202);
  });
  it("should return an error message if email format is wrong", async () => {
    try {
      const verifyEmail = await sendMail(invalidUser1);
      expect(verifyEmail[0].statusCode).not.equal(202);
    } catch (error) {
      expect(error.message).to.equal("Bad Request");
      expect(error.code).to.equal(400);
    }
  });
  it("should return an error if email is not supplied", async () => {
    try {
      const verifyEmail = await sendMail(invalidUser2);
      expect(verifyEmail[0].statusCode).not.equal(202);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });
});
