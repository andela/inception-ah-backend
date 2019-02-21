import chai from "chai";
import chaiHttp from "chai-http";
import models from "../../models";
import { validUser } from "../fixtures/models/userData";
import app from "../../index";
import { articleSeed } from "../fixtures/models/articleData";

chai.use(chaiHttp);

const { Users, Articles } = models;

export const userDependencies = async data => {
  const { firstName, lastName, email, password } = data;
  const user = await Users.create(data);
  return user.dataValues;
};

export const logInUserDependencies = async (email, password) => {
  await Users.create(validUser);
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

export const favoriteDependencies = async () => {
  const { id, token } = await logInUserDependencies(
    "obasajujoshua31@gmail.com",
    "make.meProud2"
  );
  const articleTemplate = Object.assign(articleSeed, { authorId: id });
  const article = await Articles.create(articleTemplate);
  const slug = article.get("slug");
  const articleId = article.get("id");

  return Promise.resolve({
    slug,
    articleId,
    token
  });
};
