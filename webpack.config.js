const path = require("path");

module.exports = ["inline-source-map"].map((devtool) => ({
  mode: "development",
  entry: path.resolve(__dirname, "src/index.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    module: true,
  },
  devtool,
  optimization: {
    runtimeChunk: true,
  },
  experiments: {
    outputModule: true,
  },
}));
