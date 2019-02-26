import uuid4 from "uuid/v4";

export const articleData = {
  authorId: null /*TODO: required. Should be provided by a Users Table */,
  title: "The book of Eli",
  categoryId: uuid4(),
  content: "This is article body",
  readTime: "3",
  description: "This the article description",
  slug: "Article"
};

export const articleSeed = {
  authorId: "ec723837-b941-4472-b654-97f3434cedce",
  title: "The book of Eli",
  categoryId: uuid4(),
  content: "This is article body",
  readTime: 3,
  description: "This the article description",
  slug: "Article",
  isPublished: true
};
