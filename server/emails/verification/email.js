import sgMail from "@sendgrid/mail";
import sendVerificationTemplate from "./config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendVerificationEmail = async options => {
  const { firstName, lastName, userEmail, verificationUrl } = options;
  const msg = {
    to: userEmail,
    from: process.env.EMAIL,
    subject: "Verify Email",
    html: sendVerificationTemplate(firstName, lastName, verificationUrl)
  };
  const mail = await sgMail.send(msg);
  return mail;
};

export default sendVerificationEmail;
