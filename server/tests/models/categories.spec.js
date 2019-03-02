import chai, { assert, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import models from "@models";
import { category } from "@fixtures";

const { Categories, sequelize } = models;

chai.use(chaiAsPromised);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("Categories table model ", () => {
  it("should create a Category table with valid category", async () => {
    const articleCategory = await Categories.create(category);
    assert.instanceOf(articleCategory, Categories);
    assert.lengthOf(Object.keys(articleCategory.dataValues), "4");
  });

  it("should delete a Category table", async () => {
    const createdCategory = await Categories.create(category);
    assert.equal(createdCategory.dataValues.category, category.category);
    await Categories.drop({ cascade: true });
    expect(
      Categories.findOne({ where: { category: category.category } })
    ).to.rejectedWith(Error);
  });
});

after(async () => {
  await sequelize.drop({ force: true });
});
