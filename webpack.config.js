var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: "./src/script/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".ts", ".js"],
    alias: {
      'Immutable': path.join(__dirname, 'node_modules/immutable')
    }
  },
  module: {
    loaders: [
    {
      test: /\.tsx?$/,
      loader: "ts-loader",
      exclude: /node_modules/
    },
    {
      include: /\.pug$/,
      loader: ("pug-html-loader?pretty")
    },
    {
      include: /\.css$/,
      loader: "style-loader!css-loader"
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
      inject: 'body'
    })
  ]
};

module.exports = config;
