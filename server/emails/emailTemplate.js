import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Authors Haven",
    link: "#"
  }
});

export const generateEmailTemplate = (
  firstName,
  lastName,
  url,
  { intro, color, text, outro }
) => {
  const email = {
    body: {
      name: `${firstName} ${lastName}`,
      intro,
      action: {
        instructions: "To get started, please click here: ",
        button: {
          color,
          text,
          link: url
        }
      },
      outro
    }
  };
  return mailGenerator.generate(email);
};
