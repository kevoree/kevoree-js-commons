(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.KevoreeCommons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.Resolver      = require('./lib/Resolver');
exports.Bootstrapper  = require('./lib/Bootstrapper');
exports.KevoreeLogger = require('./lib/Logger');
exports.Logger        = exports.KevoreeLogger;

},{"./lib/Bootstrapper":2,"./lib/Logger":3,"./lib/Resolver":4}],2:[function(require,module,exports){
'use strict';

/**
 *
 * @param {KevoreeLogger} logger
 * @param {Resolver} resolver
 */
function Bootstrapper(logger, resolver) {
  if (logger) {
    this.log = logger;
    if (resolver) {
      this.resolver = resolver;
    } else {
      throw new Error('No resolver given to ' + this.toString() + ' (you need to give a proper Resolver to your Bootstrapper)');
    }
  } else {
    throw new Error('No logger given to ' + this.toString() + ' (you need to give a proper KevoreeLogger to your Bootstrapper)');
  }
}

Bootstrapper.prototype = {
  /**
   *
   * @param nodeName
   * @param model
   * @param callback
   */
  bootstrapNodeType: function (nodeName, model, callback) {
    if (typeof callback !== 'function') {
      throw new Error(this.toString()+'.bootstrapNodeType() called without callback function');
    }

    var node = model.findNodesByID(nodeName);
    if (node) {
      var meta = node.typeDefinition.select('deployUnits[]/filters[name=platform,value=js]');
      if (meta.size() > 0) {
        this.bootstrap(meta.get(0).eContainer(), false, callback);
      } else {
        callback(new Error('No DeployUnit found for \'' + nodeName + '\' that matches the \'js\' platform'));
      }
    } else {
      callback(new Error('Unable to find \'' + nodeName + '\' in the given model.'));
    }
  },

  /**
   *
   * @param deployUnit
   * @param forceInstall [optional] boolean to indicate whether or not we should force re-installation
   * @param callback                function(Error, Clazz, ContainerRoot)
   */
  bootstrap: function (deployUnit, forceInstall, callback) {
    if (!callback) {
      // "forceInstall" parameter is not specified (optional)
      callback = forceInstall;
      forceInstall = false;
    }

    if (typeof callback !== 'function') {
      throw new Error(this.toString()+'.bootstrap() called without callback function');
    }

    // --- Resolvers callback
    this.resolver.resolve(deployUnit, forceInstall, function (err, EntityClass) {
      if (err) {
        callback(new Error('Unable to install ' + deployUnit.name + '@' + deployUnit.version));
      } else {
        // install success
        callback(null, EntityClass);
      }
    });
  },

  /**
   *
   * @param deployUnit
   * @param callback
   */
  uninstall: function (deployUnit, callback) {
    if (typeof callback !== 'function') {
      throw new Error(this.toString()+'.uninstall() called without callback function');
    }

    var bootstrapper = this;
    this.resolver.uninstall(deployUnit, function (err) {
      if (err) {
        bootstrapper.log.error(bootstrapper.toString(), err.stack);
        callback(new Error('\'' + deployUnit.name + '@' + deployUnit.version + '\' uninstall failed!'));
      } else {
        // uninstall success
        callback();
      }
    });
  },

  toString: function () {
    return 'Bootstrapper';
  }
};

module.exports = Bootstrapper;

},{}],3:[function(require,module,exports){
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

},{"chalk":7}],4:[function(require,module,exports){
'use strict';

/**
 * Resolver API
 * @type {Resolver}
 */
function Resolver(modulesPath, logger) {
  this.modulesPath = modulesPath;
  this.log = logger;
  this.repositories = [];
}

Resolver.prototype = {
  /**
   *
   * @param deployUnit Kevoree DeployUnit
   * @param force [optional] boolean that indicates whether or not we should force re-installation no matter what
   * @param callback function(err, Class, model)
   */
  resolve: function () {},

  uninstall: function () {},

  addRepository: function (url) {
    if (this.repositories.indexOf(url) === -1) {
      this.repositories.push(url);
    }
  },

  toString: function () {
    return 'Resolver';
  }
};

module.exports = Resolver;

},{}],5:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
};

},{}],6:[function(require,module,exports){
'use strict';

function assembleStyles () {
	var styles = {
		modifiers: {
			reset: [0, 0],
			bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	// fix humans
	styles.colors.grey = styles.colors.gray;

	Object.keys(styles).forEach(function (groupName) {
		var group = styles[groupName];

		Object.keys(group).forEach(function (styleName) {
			var style = group[styleName];

			styles[styleName] = group[styleName] = {
				open: '\u001b[' + style[0] + 'm',
				close: '\u001b[' + style[1] + 'm'
			};
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

},{}],7:[function(require,module,exports){
(function (process){
'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var stripAnsi = require('strip-ansi');
var hasAnsi = require('has-ansi');
var supportsColor = require('supports-color');
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;

}).call(this,require('_process'))
},{"_process":10,"ansi-styles":6,"escape-string-regexp":8,"has-ansi":9,"strip-ansi":11,"supports-color":12}],8:[function(require,module,exports){
'use strict';

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

},{}],9:[function(require,module,exports){
'use strict';
var ansiRegex = require('ansi-regex');
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);

},{"ansi-regex":5}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],11:[function(require,module,exports){
'use strict';
var ansiRegex = require('ansi-regex')();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

},{"ansi-regex":5}],12:[function(require,module,exports){
(function (process){
'use strict';
var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();

}).call(this,require('_process'))
},{"_process":10}]},{},[1])(1)
});