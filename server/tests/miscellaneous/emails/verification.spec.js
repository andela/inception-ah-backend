import { expect } from "chai";
import { sendEmail } from "../../../emails/email";
import {
  validUser,
  invalidUser1,
  invalidUser2
} from "../../fixtures/email/emailData";
import { verifyConstants } from "../../../emails/constants/accountVerification";

describe("Send Verification Email", () => {
  it("should send an email to valid email address", async () => {
    const { firstName, lastName, userEmail, url } = validUser;
    const verifyEmail = await sendEmail(
      firstName,
      lastName,
      userEmail,
      "VERIFY EMAIL",
      url,
      verifyConstants
    );
    expect(verifyEmail[0].statusCode).to.equal(202);
  });
  it("should return an error message if email format is wrong", async () => {
    const { firstName, lastName, userEmail, url } = invalidUser1;
    try {
      const verifyEmail = await sendEmail(
        firstName,
        lastName,
        userEmail,
        "VERIFY EMAIL",
        url,
        verifyConstants
      );
      expect(verifyEmail[0].statusCode).not.equal(202);
    } catch (error) {
      expect(error.message).to.equal("Bad Request");
      expect(error.code).to.equal(400);
    }
  });
  it("should return an error if email is not supplied", async () => {
    const { firstName, lastName, userEmail, url } = invalidUser2;
    try {
      const verifyEmail = await sendEmail(
        firstName,
        lastName,
        userEmail,
        "VERIFY EMAIL",
        url,
        verifyConstants
      );
      expect(verifyEmail[0].statusCode).not.equal(202);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });
});
