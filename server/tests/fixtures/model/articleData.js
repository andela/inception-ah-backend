import uuid4 from "uniqid";

export default {
  authorId: null /*TODO: required. Should be provided by a Users Table */,
  title: "The book of Eli",
  categoryId: uuid4(),
  content: "This is article body",
  readTime: "3:50",
  description: "This the article description"
};
