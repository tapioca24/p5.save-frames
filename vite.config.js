const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "p5.save-frames",
      fileName: (format) => `p5.save-frames.${format}.js`,
    },
  },
});
