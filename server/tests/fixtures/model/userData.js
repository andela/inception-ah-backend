import uuid4 from "uniqid";

export default {
  id: uuid4(),
  firstName: "John",
  middleName: "Mark",
  lastName: "Drew",
  email: "user@email.com",
  password: "make.meProud2",
  gender: "male",
  isVerified: true,
  biography: "A son from the sun",
  mobileNumber: 12345678909,
  imageURL: "http://image.jpg",
  isNotifiable: true,
  isAdmin: true
};

export const validUser = {
  id: uuid4(),
  firstName: "John",
  middleName: "Mark",
  lastName: "Drew",
  email: "obasajujoshua31@gmail.com",
  password: "make.meProud2",
  gender: "male",
  isVerified: true,
  biography: "A son from the sun",
  mobileNumber: 12345678909,
  imageURL: "http://image.jpg",
  isNotifiable: true,
  isAdmin: false
};
export const socialUser = {
  id: "10828801445254545653",
  displayName: "Obasaju Joshua Fredrick",
  emails: [{ value: "obasajujoshua31@gmail.com", type: "account" }],
  photos: [
    {
      value:
        "https://t4.ftcdn.net/jpg/01/17/36/43/500_F_117364322_7awtHqkvQCiRggBCG1Fq5mt5jPMNjdKh.jpg"
    }
  ]
};
