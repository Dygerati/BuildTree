const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: 'none',
   module: {
      rules: [
         {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: [ '@babel/preset-env' ],
                  plugins: [
                     '@babel/plugin-transform-async-to-generator',
                     '@babel/plugin-transform-runtime',
                     '@babel/plugin-proposal-class-properties'
                  ]
               }
            }
         },
         {
            test: /\.css$/i,
            use: [ 'raw-loader' ]
         },
         {
            test: /\.html$/i,
            use: [ 'raw-loader' ]
         }
      ]
   },
   entry: './src/index.js',
   output: {
      path: path.resolve(__dirname, 'build')
   },
   plugins: [ new CopyWebpackPlugin([{ from: 'static' }]) ]
};
