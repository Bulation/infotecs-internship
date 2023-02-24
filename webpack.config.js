const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/ts/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle[hash].js',
    assetModuleFilename: '[hash][ext][query]',
    clean: true,
  },
  devtool: !isProduction ? 'source-map' : false,
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    host: '0.0.0.0',
    hot: true,
    port: 8080,
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, './src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};