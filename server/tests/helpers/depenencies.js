import models from "../../models";

const { Users } = models;

export const userDependencies = async data => {
  const { firstName, lastName, email, password } = data;
  const user = await Users.create(data);
  return user.dataValues;
};
