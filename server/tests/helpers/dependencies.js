import chai from "chai";
import chaiHttp from "chai-http";
import models from "@models";
import {
  validUserData,
  articleData,
  userData,
  commentData,
  tagData,
  category,
  registerUser,
  category as categoryData,
  articleSpec
} from "@fixtures";
import app from "@app";
import { ARTICLE_REACTION, COMMENT_REACTION } from "@helpers/constants";
import { generateJWT, getJWTConfigs } from "@helpers/jwt";

const jwtConfigs = getJWTConfigs({ option: "authentication" });

chai.use(chaiHttp);
const {
  Users,
  Articles,
  Categories,
  Reports,
  Ratings,
  Tags,
  Reactions,
  Comments
} = models;

export const userDependencies = async data => {
  const user = await Users.create(data);
  return user.dataValues;
};

export const logInUserDependencies = async (email, password) => {
  await Users.create(validUserData);
  const response = await chai
    .request(app)
    .post("/api/v1/auth/signin")
    .send({ email, password });
  const {
    id,
    data: { token }
  } = response.body;
  return Promise.resolve({
    id,
    token
  });
};

export const updateProfileDependencies = async (email, password, userScope) => {
  await Users.create(userScope);
  const response = await chai
    .request(app)
    .post("/api/v1/auth/signin")
    .send({ email, password });
  const {
    userId,
    data: { token }
  } = response.body;
  return Promise.resolve({
    userId,
    token
  });
};

/**
 * @description Create persistent Article data on the database.
 * @throws {Sequelice Constraint Error } similar
 * @param {object} articleOverride properties to be overrided in article fixture
 * @returns {Articles} instance of Article Model
 */
export const getArticleInstance = async (articleOverride = {}) => {
  let categoryInstance, author, article, authorId;
  categoryInstance = await Categories.create({ category: "computers" });

  //create an authorId if it is not provided in function argument
  if (!("authorId" in articleOverride)) {
    author = await getUserInstance();
    authorId = { authorId: author.get("id") };
  }

  const articleCopy = Object.assign({}, articleData);
  const articleFixture = Object.assign(articleCopy, authorId, articleOverride);
  articleFixture.categoryId = categoryInstance.get("id");
  article = await Articles.create(articleFixture);
  return Promise.resolve({ article, author, category });
};

/**
 * @description Create persistent User data on the database.
 * @param {object} userOverride properties to be overrided in users fixture
 * @returns {Users} instance of Users Model
 */
export const getUserInstance = async userOverride => {
  const userFixture = Object.assign(
    Object.assign({}, userData[0]),
    userOverride
  );
  const user = await Users.create(userFixture);
  return Promise.resolve(user);
};

/**
 * @description Create persistent User data on the database.
 * @param {object} reportOverride properties to be overrided in users fixture
 * @returns {Users} instance of Users Model
 */
export const getReportDependencies = async reportOverride => {
  const { article, author } = await getArticleInstance();
  const reporter = author;
  const reportData = {
    ...Object.assign({
      message: "this is a report",
      reporterId: reporter.get("id"),
      reportedArticleId: article.get("id")
    }),
    ...reportOverride
  };
  const report = await Reports.create(reportData);
  return Promise.resolve({ report, reporter, article });
};

export const commentDependencies = async (
  articleAuthorData,
  commentUserData,
  categoryName
) => {
  const articleAuthor = await Users.create(articleAuthorData);
  const authorId = articleAuthor.get("id");

  const categoryInstance = await Categories.create({ category: categoryName });
  const categoryId = categoryInstance.get("id");

  const articleInstance = await Articles.create(
    Object.assign(articleData, { authorId, categoryId })
  );

  const articleId = articleInstance.get("id");
  const articleSlug = articleInstance.get("slug");

  await Users.create(commentUserData);
  const { email, password } = commentUserData;
  const response = await chai
    .request(app)
    .post("/api/v1/auth/signin")
    .send({ email, password });
  const {
    userId,
    data: { token }
  } = response.body;

  const { content } = commentData;

  return Promise.resolve({
    token,
    userId,
    articleId,
    articleSlug,
    commentData: { content, articleId }
  });
};

/**
 * @description Create persistent Ratings data on the database.
 * @param {object} overrideFixture properties to be overrided in users fixture
 * @returns {Object} Depencies used to create the Rating {rating, article, author, rater }
 */
export const getRatingsDependencies = async (overrideFixture = {}) => {
  let rater, rating, articleInstance, author;
  try {
    rater = await getUserInstance(overrideFixture);
    const raterId = rater.get("id");
    author = await getUserInstance({ email: "author@email.com" });
    let { article } = await getArticleInstance({ authorId: author.get("id") });
    articleInstance = article;
    const ratingData = Object.assign(
      { raterId, score: 5, articleId: article.get("id") },
      overrideFixture
    );
    rating = await Ratings.create(ratingData);
  } catch (err) {
    throw new Error(`Failed to create Ratings Dependecies\n${err}`);
  }
  return Promise.resolve({ rating, rater, author, articleInstance });
};

export const tagDependencies = async tag => {
  const data = tag ? { tag } : tagData[0];
  const tagInstance = await Tags.create(data);
  const tagId = tagInstance.get("id");
  const userInstance = await Users.create(userData[0]);
  const categoryInstance = await Categories.create(category);
  const articleTemplate = Object.assign(articleData, {
    authorId: userInstance.get("id"),
    categoryId: categoryInstance.get("id")
  });
  const articleInstance = await Articles.create(articleTemplate);
  const articleId = articleInstance.get("id");

  return Promise.resolve({
    tagId,
    articleId,
    tagInstance,
    articleInstance
  });
};

export const favoriteDependencies = async () => {
  const createdUser = await Users.create(userData[0]);
  const userId = createdUser.get("id");
  const articleCategory = await Categories.create(categoryData);
  const categoryId = articleCategory.get("id");
  const articleTemplate = Object.assign(articleData, {
    authorId: userId,
    categoryId
  });
  const articleInstance = await Articles.create(articleTemplate);
  const articleId = articleInstance.get("id");
  const articleSlug = articleInstance.get("slug");

  const commentInstance = await Comments.create({
    userId,
    articleId,
    content: "This is a comment"
  });

  return Promise.resolve({
    userId,
    articleId,
    users: createdUser,
    articles: articleInstance,
    articleSlug,
    content: commentInstance.get("content"),
    commentId: commentInstance.get("id"),
    title: articleInstance.get("title")
  });
};

export const articleReactionsDependencies = async () => {
  const user1 = await Users.create(registerUser);
  const user2 = await Users.create(userData[0]);
  const user3 = await Users.create(userData[2]);

  const usersTokens = [];
  [user1, user2, user3].map(userInstance => {
    return usersTokens.push(
      generateJWT({ userId: userInstance.get("id") }, jwtConfigs)
    );
  });

  const categoryInstance = await Categories.create(categoryData);
  const categoryId = categoryInstance.get("id");

  const articleInstance = Object.assign(articleData, {
    categoryId,
    authorId: user1.get("id")
  });

  const articleCreated = await Articles.create(articleInstance);
  const articleSlug = articleCreated.get("slug");
  const title = articleCreated.get("title");

  const commentInstance = await Comments.create({
    userId: user2.get("id"),
    articleId: articleCreated.get("id"),
    content: "This is a comment"
  });

  const commentId = commentInstance.get("id");

  const user2ArticleReaction = await Reactions.create({
    userId: user2.get("id"),
    sourceType: ARTICLE_REACTION,
    reaction: false,
    articleId: articleCreated.get("id")
  });

  const user2CommentReaction = await Reactions.create({
    userId: user2.get("id"),
    sourceType: COMMENT_REACTION,
    reaction: false,
    commentId
  });
  const user3CommentReaction = await Reactions.create({
    userId: user3.get("id"),
    sourceType: COMMENT_REACTION,
    reaction: true,
    commentId
  });
  const user3ArticleReaction = await Reactions.create({
    userId: user3.get("id"),
    sourceType: ARTICLE_REACTION,
    reaction: true,
    articleId: articleCreated.get("id")
  });

  return Promise.resolve({
    articleSlug,
    usersTokens,
    title,
    commentId,
    user2ArticleReaction,
    user3ArticleReaction,
    user2CommentReaction,
    user3CommentReaction
  });
};

/**
 * @description Creates three user instances in the database
 * @returns {array} an array of objects
 */
export const followerDependencies = async () => {
  const user1 = await Users.create({
    ...userData[0],
    email: "user1@mail.test"
  });
  const user2 = await Users.create({
    ...userData[1],
    email: "user2@mail.test"
  });
  return Promise.resolve({
    author: user1.dataValues,
    follower: user2.dataValues
  });
};

export const signUpDependencies = async () => {
  const { firstName, lastName, email, password } = userData[0];
  const res = await chai
    .request(app)
    .post("/api/v1/auth/signup")
    .send({ firstName, lastName, email, password });
  return Promise.resolve({ email, password });
};

export const signUp = async () => {
  const { email, password } = await signUpDependencies();
  return { email, password };
};

export const login = async () => {
  const { email, password } = await signUp();
  const response = await chai
    .request(app)
    .post("/api/v1/auth/signin")
    .send({ email, password });
  const { token } = response.body.data;
  return token;
};

export const createArticle = async token => {
  if (!token) {
    token = await login();
  }
  const categoryInstance = await Categories.create(categoryData);
  const articleContent = Object.assign({}, articleSpec, {
    categoryId: categoryInstance.get("id")
  });

  const response = await chai
    .request(app)
    .post("/api/v1/articles")
    .send(articleContent)
    .set({ Authorization: token });
  const article = response.body.article;
  return { token, article };
};

export const publishArticle = async (article, token) => {
  if (!article) {
    article = await createArticle(token);
    token = article.token;
    article = article.article;
  }
  const response = await chai
    .request(app)
    .put(`/api/v1/articles/${article.slug}/publish`)
    .set({ Authorization: token });
  return { article, token, response: { response: response.body } };
};
