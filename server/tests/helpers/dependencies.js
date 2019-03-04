import chai from "chai";
import chaiHttp from "chai-http";
import models from "@models";
import { validUserData, articleData, userData } from "@fixtures";
import app from "@app";

chai.use(chaiHttp);
const { Users, Articles, Categories, Reports } = models;

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
export const getArticleInstance = async articleOverride => {
  const category = await Categories.create({ category: "computers" });
  const author = await getUserInstance();
  const authorId = { authorId: author.get("id") };
  const articleCopy = Object.assign({}, articleData);
  const articleFixture = Object.assign(articleCopy, authorId, articleOverride);
  articleFixture.categoryId = category.get("id");
  const article = await Articles.create(articleFixture);
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
