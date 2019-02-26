import chai from "chai";
import chaiHttp from "chai-http";
import { sendEmail } from "../../../emails/email";
import { validUser, invalidUser } from "../../fixtures/email/emailData";

chai.use(chaiHttp);
const { expect } = chai;
const { fistName, lastName, userEmail } = validUser;

describe("Send Email", () => {
  it("should send an email to valid email address", async () => {
    const verifyEmail = await sendEmail(
      fistName,
      lastName,
      userEmail,
      "email subject",
      null,
      {}
    );
    expect(verifyEmail).to.equal("Email sent");
  });
  it("should return an error if email is not supplied", async () => {
    try {
      await sendEmail(invalidUser);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });
});
