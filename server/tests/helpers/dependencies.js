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
