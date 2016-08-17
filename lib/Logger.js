'use strict';

var chalk = require('chalk');

var LEVELS = ['all', 'debug', 'info', 'warn', 'error', 'quiet'];
var CLASS = 15;

var chalkInfo = chalk.grey,
  chalkWarn = chalk.yellow,
  chalkError = chalk.red,
  chalkDebug = chalk.cyan;

function truncate(str, length) {
  str = str || '';

  if (str.length >= length) {
    str = str.substr(0, length - 1) + '.';
  } else {
    var spaces = '';
    for (var i = 0; i < length - str.length; i++) {
      spaces += ' ';
    }
    str += spaces;
  }

  return str;
}

function getTime() {
  var time = new Date();
  var hours = (time.getHours().toString().length === 1) ? '0' + time.getHours() : time.getHours();
  var mins = (time.getMinutes().toString().length === 1) ? '0' + time.getMinutes() : time.getMinutes();
  var secs = (time.getSeconds().toString().length === 1) ? '0' + time.getSeconds() : time.getSeconds();
  return chalk.grey(hours + ':' + mins + ':' + secs);
}

function Logger(tag) {
  this.tag = tag;
  this.level = 2;
  this.filter = '';
}

Logger.prototype = {
  info: function (tag, msg) {
    if (this.level <= LEVELS.indexOf('info')) {
      if (typeof (msg) === 'undefined') {
        msg = tag;
        tag = this.tag;
      }

      if (this.filter.length === 0 || (this.filter.length > 0 && tag === this.filter)) {
        console.log('%s %s %s', getTime(), chalk.magenta(truncate(tag, CLASS)), chalkInfo(msg));
      }
    }
  },

  debug: function (tag, msg) {
    if (this.level <= LEVELS.indexOf('debug')) {
      if (typeof (msg) === 'undefined') {
        msg = tag;
        tag = this.tag;
      }

      if (this.filter.length === 0 || (this.filter.length > 0 && tag === this.filter)) {
        console.log('%s %s %s', getTime(), chalk.magenta(truncate(tag, CLASS)), chalkDebug(msg));
      }
    }
  },

  warn: function (tag, msg) {
    if (this.level <= LEVELS.indexOf('warn')) {
      if (typeof (msg) === 'undefined') {
        msg = tag;
        tag = this.tag;
      }

      if (this.filter.length === 0 || (this.filter.length > 0 && tag === this.filter)) {
        console.warn('%s %s %s', getTime(), chalk.magenta(truncate(tag, CLASS)), chalkWarn(msg));
      }
    }
  },

  error: function (tag, msg) {
    if (this.level <= LEVELS.indexOf('error')) {
      if (typeof (msg) === 'undefined') {
        msg = tag;
        tag = this.tag;
      }

      if (this.filter.length === 0 || (this.filter.length > 0 && tag === this.filter)) {
        console.error('%s %s %s', getTime(), chalk.magenta(truncate(tag, CLASS)), chalkError(msg));
      }
    }
  },

  setLevel: function (level) {
    if (typeof level === 'string') {
      this.level = LEVELS.indexOf(level.trim().toLowerCase());
    } else {
      this.level = level;
    }
    console.log('%s %s %s', getTime(), chalk.magenta(truncate('Logger', CLASS)), chalkInfo('Set logLevel=' + LEVELS[this.level]));
  },

  setFilter: function (filter) {
    this.filter = filter;
    console.log('%s %s %s', getTime(), chalk.magenta(truncate('Logger', CLASS)), chalkInfo('Set logFilter=' + LEVELS[this.filter]));
  },

  toString: function () {
    return 'Logger';
  }
};

Logger.ALL = LEVELS.indexOf('all');
Logger.INFO = LEVELS.indexOf('info');
Logger.DEBUG = LEVELS.indexOf('debug');
Logger.WARN = LEVELS.indexOf('warn');
Logger.ERROR = LEVELS.indexOf('error');
Logger.QUIET = LEVELS.indexOf('quiet');

module.exports = Logger;
