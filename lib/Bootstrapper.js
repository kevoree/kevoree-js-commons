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
    var self = this;
    this.resolver.resolve(deployUnit, forceInstall, function (err, EntityClass) {
      if (err) {
        self.log.error(self.toString(), 'Unable to install ' + deployUnit.name + '@' + deployUnit.version);
        callback(err);
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

    var self = this;
    this.resolver.uninstall(deployUnit, function (err) {
      if (err) {
        self.log.error(self.toString(), 'Unable to uninstall ' + deployUnit.name + '@' + deployUnit.version);
        callback(err);
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
