import models from "@models";
import { userData } from "@fixtures";

const { Users } = models;

/**
 * @description Creates three user instances in the database
 * @returns {array} an array of objects
 */
export const userDependencies = async () => {
  const users = await Users.bulkCreate([
    {
      ...userData[0],
      email: "user1@mail.test"
    },
    {
      ...userData[0],
      email: "user2@mail.test"
    },
    {
      ...userData[0],
      email: "user3@mail.test"
    }
  ]);
  return Promise.resolve([
    users[0].dataValues,
    users[1].dataValues,
    users[2].dataValues
  ]);
};
