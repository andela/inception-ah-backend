import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Authors Haven",
    link: "#"
  }
});

const sendVerificationTemplate = (firstName, lastName, verificationUrl) => {
  const email = {
    body: {
      name: `${firstName} ${lastName}`,
      intro:
        "Welcome to Authors Haven! We’re very excited to have you on board.",
      action: {
        instructions: "To get started, please click here: ",
        button: {
          color: "green",
          text: "Confirm Your Account",
          link: verificationUrl
        }
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  };
  return mailGenerator.generate(email);
};

export default sendVerificationTemplate;
