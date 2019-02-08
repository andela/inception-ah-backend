import uuid4 from "uuid4";
//seeds is shared among models, treat as immutable
export default {
  users: {
    firstName: "John",
    middleName: "Mark",
    lastName: "Drew",
    email: "user@email.com",
    gender: "male",
    biography: "A son from the sun",
    mobileNumber: 12345678909,
    imageURL: "http://image.jpg",
    isNotifiable: true,
    isAdmin: true
  },

  article: {
    title: "The book of Eli",
    authorId: uuid4(),
    categoryId: uuid4(),
    content: "This is article body",
    readTime: "3:50",
    description: "This the article description"
  }
};
