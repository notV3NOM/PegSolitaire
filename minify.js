const terser = require("terser");
const fs = require("fs").promises;
const path = require("path");

const inputFiles = [
  "src/script.js",
  "src/board.js",
  "src/dfs.js",
  "src/theme.js",
];

const outputFilePath = "dist/script.js";

const minifyOptions = {
  compress: true,
  mangle: false,
  sourceMap: true,
};

async function minifyFiles() {
  try {
    const modules = await Promise.all(
      inputFiles.map((file) => fs.readFile(file, "utf8"))
    );
    const concatenatedCode = modules.join("\n");
    const result = await terser.minify(concatenatedCode, minifyOptions);

    if (result.error) {
      console.error("Error during minification:", result.error);
    } else {
      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
      await fs.writeFile(outputFilePath, result.code);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

minifyFiles();
