import chai from "chai";
import chaiHttp from "chai-http";
import models from "@models";
import {
  validUserData,
  articleData,
  userData,
  commentData,
  tagData,
  category
} from "@fixtures";
import app from "@app";

chai.use(chaiHttp);
const { Users, Articles, Categories, Reports, Ratings, Tags } = models;

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

const destroyDependencies = function() {
  this.forEach(async dependency => {
    dependency.destroy();
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
  try {
    categoryInstance = await Categories.create({ category: "computers" });

    //create an authorId if it is not provided in function argument
    if (!("authorId" in articleOverride)) {
      author = await getUserInstance();
      authorId = { authorId: author.get("id") };
    }

    const articleCopy = Object.assign({}, articleData);
    const articleFixture = Object.assign(
      articleCopy,
      authorId,
      articleOverride
    );
    articleFixture.categoryId = categoryInstance.get("id");
    article = await Articles.create(articleFixture);
  } catch (err) {
    throw new Error(`Failed to create Article Dependecies\n${err}`);
  }
  const destroy = destroyDependencies.bind([category, author, article]);
  return Promise.resolve({ article, author, category, destroy });
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
  const destroy = destroyDependencies.bind([user]);
  return Promise.resolve(user, destroy);
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
  const destroy = destroyDependencies.bind([report, reporter, article]);
  return Promise.resolve({ report, reporter, article, destroy });
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
    commentData: { content }
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
