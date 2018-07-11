"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../../index"));

_chai.default.use(_chaiHttp.default);

const expect = _chai.default.expect;
describe("GET <API />", () => {
  it("should return successful connection", done => {
    _chai.default.request(_index.default).post("/api").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal("Success");
      expect(res.body.message).to.equal("Connection ok");
      done();
    });
  });
  it("should return a 404 error", done => {
    _chai.default.request(_index.default).post("/api/blahblahblah").end((err, res) => {
      expect(res.statusCode).to.equal(404);
      done();
    });
  });
  it("should return 200 as status code", done => {
    _chai.default.request(_index.default).get("/").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});