'use strict';

var chalk = require('chalk');

var LEVELS = ['all', 'debug', 'info', 'warn', 'error', 'quiet'];

var chalkInfo = chalk.grey,
  chalkWarn = chalk.grey.bgYellow,
  chalkWarnMsg = chalk.yellow,
  chalkError = chalk.white.bgRed,
  chalkErrorMsg = chalk.red,
  chalkDebug = chalk.cyan;

function processTag(tag) {
  if (tag.length >= 15) {
    tag = tag.substr(0, 14) + '.';
  } else {
    var spaces = '';
    for (var i = 0; i < 15 - tag.length; i++) {
      spaces += ' ';
    }
    tag += spaces;
  }

  return chalk.magenta(tag);
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
        console.log(getTime() + '  ' + chalkInfo('INFO') + '   ' + processTag(tag) + '  ' + chalkInfo(msg));
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
        console.log(getTime() + '  ' + chalkDebug('DEBUG ') + ' ' + processTag(tag) + '  ' + chalkDebug(msg));
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
        console.warn(getTime() + '  ' + chalkWarn('WARN') + '   ' + processTag(tag) + '  ' + chalkWarnMsg(msg));
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
        console.error(getTime() + '  ' + chalkError('ERROR') + '  ' + processTag(tag) + '  ' + chalkErrorMsg(msg));
      }
    }
  },

  setLevel: function (level) {
    if (typeof level === 'string') {
      this.level = LEVELS.indexOf(level.trim().toLowerCase());
    } else {
      this.level = level;
    }
    console.log(getTime() + '  ' + chalkInfo('ALL ') + '   ' + processTag(this.toString()) + '  ' + chalkInfo('Set logLevel=' + LEVELS[this.level]));
  },

  setFilter: function (filter) {
    this.filter = filter;
    console.log(getTime() + '  ' + chalkInfo('ALL ') + '   ' + processTag(this.toString()) + '  ' + chalkInfo('Set logFilter="' + this.filter + '"'));
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
