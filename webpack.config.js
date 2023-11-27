const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/script.js",
  },
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "dist"),
  },
};
