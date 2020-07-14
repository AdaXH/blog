const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
console.log(
  'path.resolve(__dirname, "public")',
  path.resolve(__dirname, "public")
);
module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./cache")
  },
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: "./src",
    host: "localhost",
    port: 8000,
    open: false,
    inline: true,
    openPage: "",
    hot: true,
    historyApiFallback: true,
    overlay: {
      errors: true
    },
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
        pathRewrite: { api: "/" }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/")
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less"]
  },
  stats: {
    children: false,
    warningsFilter: warn => warn.indexOf("Conflicting order between:") > -1
  },

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        include: [path.resolve(__dirname, "src")],
        use: ["source-map-loader", "babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "css-hot-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          "css-hot-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[name]_[local]-[hash:base64:5]"
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ],
        exclude: /src/
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              outputPath: "./assets/"
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: "empty",
    module: "empty"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.(css|less)/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      filename: "index.html",
      hash: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "public")
      }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ]
};
