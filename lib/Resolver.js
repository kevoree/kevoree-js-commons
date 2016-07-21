'use strict';

var KevoreeLogger = require('./KevoreeLogger');

/**
 * Resolver API
 * @type {Resolver}
 */
function Resolver(modulesPath, logger) {
  this.modulesPath = modulesPath || '';
  this.log = logger || new KevoreeLogger(this.toString());
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
