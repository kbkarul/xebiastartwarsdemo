const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'bundle.js' : [
      '@babel/polyfill',
      './src/home.js',
      './src/search.js',
      './src/login.js',
      './src/planet.js',
      './src/appConstants.js',
      './src/dispatcher.js',
      './src/dataStore.js',
      './src/searchActions.js',
      './src/searchAPI.js',
      './src/loginActions.js',
      './src/loginAPI.js',
      './src/css/style.css'
    ]
  },
  output: {
    path: __dirname+'/dist',
    // filename: 'bundle.js'
    filename: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options:{
            presets: ['@babel/preset-env', '@babel/react']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new copyWebpackPlugin([{from:'./src/logo.png', to: ''}])
  ],
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
}
