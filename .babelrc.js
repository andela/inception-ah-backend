const dotenv = require("dotenv/config");
const directory = process.env.NODE_ENV === "development" ? "server" : "dist";
module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ],
  plugins: [
    "@babel/transform-runtime",
    "@babel/proposal-object-rest-spread",
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        root: [__dirname],
        alias: {
          "@app": `./${directory}/index.js`,
          "@configs": `./${directory}/configs`,
          "@emails": `./${directory}/emails`,
          "@controllers": `./${directory}/controllers`,
          "@dependencies": `./${directory}/tests/helpers/dependencies.js`,
          "@fixtures": `./${directory}/tests/fixtures/index.js`,
          "@helpers": `./${directory}/helpers`,
          "@models": `./${directory}/models`,
          "@middlewares": `./${directory}/middlewares/index.js`,
          "@passport": `./${directory}/middlewares/passport/passport.js`,
          "@routes": `./${directory}/routes`,
          "@validations": `./${directory}/validations`,
          "@schemas": `./${directory}/validations/schemas/index.js`,
          underscore: "lodash"
        }
      }
    ]
  ]
};
