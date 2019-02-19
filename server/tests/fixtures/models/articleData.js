import uuid4 from "uuid/v4";

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

export const articleData = {
  title: "The man called Erl",
  description: "This is the man of men",
  content:
    "Lorem Ipsum is simply dummy text of the printing" +
    "and typesetting industry. Lorem Ipsum has been the industry's" +
    "standard dummy text ever since the 1500s, when an unknown printer" +
    "standard dummy text ever since the 1500s, when an unknown printer" +
    "standard dummy text ever since the 1500s, when an unknown printer" +
    "standard dummy text ever since the 1500s, when an unknown printer",
  categoryId: "e2a4301a-28c5-461b-82bc-d23757877998"
};

export const articleSpec = {
  title: "The man called Erl",
  description: "This is the man of men",
  content:
    "Lorem Ipsum is simply dummy text of the printing" +
    "and typesetting industry. Lorem Ipsum has been the industry's" +
    "standard dummy text ever since the 1500s, when an unknown printer" +
    "standard dummy text ever since the 1500s, when an unknown printer" +
    "standard dummy text ever since the 1500s, when an unknown printer" +
    "standard dummy text ever since the 1500s, when an unknown printer",
  categoryId: "e2a4301a-28c5-461b-82bc-d23757877998"
};
