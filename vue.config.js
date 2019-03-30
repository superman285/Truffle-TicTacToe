const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  publicPath: "./",
  devServer: {
    port: 3000,
    compress: true
  },
  productionSourceMap: false,
  configureWebpack: {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_debugger: true,
              drop_console: true
            },
          }
        })
      ],
    },
    plugins: [
      new CompressionPlugin(),
      //new BundleAnalyzerPlugin(),
    ]
  }
};
