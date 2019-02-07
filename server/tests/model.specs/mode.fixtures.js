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

  articles: {
    title: "The book of Eli",
    authorId: 1,
    categoryId: 5,
    body: "This is article body",
    favourited: true,
    numberOfReads: 2,
    createdAt: Date.now,
    updatedAt: Date.now
  }
};
