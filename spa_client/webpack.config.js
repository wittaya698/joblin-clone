var path = require("path");

module.exports = {
  // stats: "none",
  mode: "development",
  entry: ["./src/js/app.jsx"],
  output: {
    path: __dirname + "/dist/js/",
    filename: "app.js",
    publicPath: "/js/",
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: ["babel-loader"],
        include: path.join(__dirname, "./src/js/"),
      },
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/js/components"),
      models: path.resolve(__dirname, "./src/js/models"),
    },
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //    compress: {
    //       warnings: false
    //   }
    // }),
  ],
};
