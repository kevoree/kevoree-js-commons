'use strict';

var path = require('path');

module.exports = {
  resolve: {
    extensions: ['', '.js']
  },
  entry: path.join(__dirname, 'kevoree-commons.js'),
  output: {
    path: path.join('browser'),
    filename: 'kevoree-commons.js',
    library: 'KevoreeCommons',
    libraryTarget: 'umd'
  }
};
