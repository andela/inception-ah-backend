import chai from "chai";
import chaiHttp from "chai-http";
import models from "@models";
import { validUserData } from "@fixtures";
import app from "@app";

chai.use(chaiHttp);

const { Users } = models;

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
