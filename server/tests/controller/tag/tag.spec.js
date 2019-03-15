import chai from "chai";
import chaiHttp from "chai-http";
import app from "@app";
import models from "@models";
import { tagDependencies } from "@dependencies";

const { expect } = chai;
chai.use(chaiHttp);
const { Tags } = models;

beforeEach(async () => {
  await models.sequelize.sync({ force: true });
});

describe("GET <API /api/v1/tags", () => {
  it("should return a 404 error", async () => {
    const res = await chai.request(app).get("/api/v1/tags");
    expect(res.statusCode).to.equal(404);
  });

  it("should get all tags", async () => {
    await tagDependencies();
    const res = await chai
      .request(app)
      .get("/api/v1/tags")
      .redirects(0);
    expect(res.statusCode).to.equal(302);
    expect(res.body.message).to.equal("List of tags");
    expect(res.body.tags).to.be.an("array");
  });

  it("should get all tags that matches the search", async () => {
    await tagDependencies();
    const res = await chai
      .request(app)
      .get("/api/v1/tags?search=ast")
      .redirects(0);
    expect(res.statusCode).to.equal(302);
    expect(res.body.message).to.equal("List of tags");
    expect(res.body.tags).to.be.an("array");
  });

  it("should return a 404 error if no tags matches the search", async () => {
    await tagDependencies();
    const res = await chai
      .request(app)
      .get("/api/v1/tags?search=something else")
      .redirects(0);
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("No result matches your search");
  });
});

describe("GET <API /api/v1/tags:tagId", () => {
  it("should return a 404 error if tagId does not exist", async () => {
    const { tagInstance, tagId } = await tagDependencies();
    await tagInstance.destroy();
    const res = await chai
      .request(app)
      .put(`/api/v1/tags/${tagId}`)
      .send({ tag: tagInstance.get("tag") });
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("Tag does not exist");
  });

  it("should return a 400 for invalid uuid", async () => {
    const res = await chai.request(app).put("/api/v1/tags/qwewretrty");
    expect(res.statusCode).to.equal(400);
    expect(res.body.errorMessages).to.equal("tagId is not a valid uuid");
  });

  it("should get a specific tag", async () => {
    const { tagId } = await tagDependencies();
    const res = await chai
      .request(app)
      .get(`/api/v1/tags/${tagId}`)
      .redirects(0);
    expect(res.statusCode).to.equal(302);
    expect(res.body.message).to.equal("Tag successfully retrieved");
    expect(res.body.tag).to.be.an("object");
  });
});

describe("UPDATE <API /api/v1/tags:tagId", () => {
  it("should return a 400 for invalid uuid", async () => {
    const res = await chai.request(app).put("/api/v1/tags/qwewretrty");
    expect(res.statusCode).to.equal(400);
    expect(res.body.errorMessages).to.equal("tagId is not a valid uuid");
  });

  it("should return a 404 error if tagId does not exist", async () => {
    const { tagInstance, tagId } = await tagDependencies();
    await tagInstance.destroy();
    const res = await chai
      .request(app)
      .put(`/api/v1/tags/${tagId}`)
      .send({ tag: tagInstance.get("tag") });
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("Tag does not exist");
  });

  it("should update a specific tag", async () => {
    const { tagId } = await tagDependencies();

    const res = await chai
      .request(app)
      .put(`/api/v1/tags/${tagId}`)
      .send({ tag: "JavaScript and React" });
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal("Tag updated successfully");
    expect(res.body.tag).to.be.an("object");
  });

  it("should return a 409 error", async () => {
    await Tags.create({ tag: "React and Redux" });
    const { tagId } = await tagDependencies();

    const res = await chai
      .request(app)
      .put(`/api/v1/tags/${tagId}`)
      .send({ tag: "React and Redux" });
    expect(res.statusCode).to.equal(409);
    expect(res.body.message).to.equal("Tag already exist");
  });
});

describe("DELETE <API /api/v1/tags:tagId", () => {
  it("should return a 404 error", async () => {
    const res = await chai.request(app).delete(`/api/v1/tags/tryutyrtrer`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.success).to.equal(false);
    expect(res.body.errorMessages).to.equal("tagId is not a valid uuid");
  });

  it("should return a 404 error if tagId does not exist", async () => {
    const { tagInstance, tagId } = await tagDependencies();
    await tagInstance.destroy();
    const res = await chai
      .request(app)
      .put(`/api/v1/tags/${tagId}`)
      .send({ tag: tagInstance.get("tag") });
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal("Tag does not exist");
  });

  it("should not delete a tag instance if it has been used on an article", async () => {
    const { articleInstance, tagInstance, tagId } = await tagDependencies();
    await articleInstance.saveTags([tagInstance.get("tag")], Tags);
    const res = await chai.request(app).delete(`/api/v1/tags/${tagId}`);
    expect(res.statusCode).to.equal(403);
    expect(res.body.message).to.equal("Tag cannot be deleted");
  });

  it("should delete a tag instance", async () => {
    const { tagId } = await tagDependencies();

    const res = await chai.request(app).delete(`/api/v1/tags/${tagId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal("Astronomy tag succcessfully deleted");
  });
});
