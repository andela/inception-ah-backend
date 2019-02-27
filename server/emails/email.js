import isEmpty from "lodash.isempty";
import sgMail from "@sendgrid/mail";
import { generateEmailTemplate } from "@emails/emailTemplate";

const isTest = process.env.NODE_ENV === "test";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (
  firstName,
  lastName,
  userEmails,
  subject,
  url,
  constants
) => {
  if (isEmpty(userEmails)) {
    throw new Error("Email address not valid");
  }
  const emailBody = {
    to: userEmails,
    from: process.env.EMAIL,
    subject,
    html: generateEmailTemplate(firstName, lastName, url, constants)
  };
  const mail = isTest
    ? Promise.resolve("Email sent")
    : await sgMail.send(emailBody);

  return mail;
};
