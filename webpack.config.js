const path    = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "/src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /(node_modules|dist|tmp|server)/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|dist|tmp|server)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|dist|tmp|server)/,
        use: ["vue-style-loader","css-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};