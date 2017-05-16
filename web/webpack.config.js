const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    app: ['whatwg-fetch', './app/index'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: [
          'latest',
          'react',
          'stage-0',
        ],
        plugins: [],
      },
    }]
  },
  plugins: [],
};
