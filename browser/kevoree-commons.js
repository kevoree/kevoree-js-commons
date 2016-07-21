!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.KevoreeCommons=t():e.KevoreeCommons=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports.Resolver=n(1),e.exports.Bootstrapper=n(12),e.exports.KevoreeLogger=n(2)},function(e,t,n){"use strict";function r(e,t){this.modulesPath=e||"",this.log=t||new o(this.toString()),this.repositories=[]}var o=n(2);r.prototype={resolve:function(){},uninstall:function(){},addRepository:function(e){this.repositories.indexOf(e)===-1&&this.repositories.push(e)},toString:function(){return"Resolver"}},e.exports=r},function(e,t,n){"use strict";function r(e){if(e.length>=15)e=e.substr(0,14)+".";else{for(var t="",n=0;n<15-e.length;n++)t+=" ";e+=t}return s.magenta(e)}function o(){var e=new Date,t=1===e.getHours().toString().length?"0"+e.getHours():e.getHours(),n=1===e.getMinutes().toString().length?"0"+e.getMinutes():e.getMinutes(),r=1===e.getSeconds().toString().length?"0"+e.getSeconds():e.getSeconds();return s.grey(t+":"+n+":"+r)}function i(e){this.tag=e,this.level=2,this.filter=""}var s=n(3),l=["all","debug","info","warn","error","quiet"],c=s.grey,f=s.grey.bgYellow,u=s.yellow,a=s.white.bgRed,g=s.red,p=s.cyan;i.prototype={info:function(e,t){this.level<=l.indexOf("info")&&("undefined"==typeof t&&(t=e,e=this.tag),(0===this.filter.length||this.filter.length>0&&e===this.filter)&&console.log(o()+"  "+c("INFO")+"   "+r(e)+"  "+c(t)))},debug:function(e,t){this.level<=l.indexOf("debug")&&("undefined"==typeof t&&(t=e,e=this.tag),(0===this.filter.length||this.filter.length>0&&e===this.filter)&&console.log(o()+"  "+p("DEBUG ")+" "+r(e)+"  "+p(t)))},warn:function(e,t){this.level<=l.indexOf("warn")&&("undefined"==typeof t&&(t=e,e=this.tag),(0===this.filter.length||this.filter.length>0&&e===this.filter)&&console.warn(o()+"  "+f("WARN")+"   "+r(e)+"  "+u(t)))},error:function(e,t){this.level<=l.indexOf("error")&&("undefined"==typeof t&&(t=e,e=this.tag),(0===this.filter.length||this.filter.length>0&&e===this.filter)&&console.error(o()+"  "+a("ERROR")+"  "+r(e)+"  "+g(t)))},setLevel:function(e){"string"==typeof e?this.level=l.indexOf(e.trim().toLowerCase()):this.level=e,console.log(o()+"  "+c("ALL ")+"   "+r(this.toString())+"  "+c("Set logLevel="+l[this.level]))},setFilter:function(e){this.filter=e,console.log(o()+"  "+c("ALL ")+"   "+r(this.toString())+"  "+c('Set logFilter="'+this.filter+'"'))},toString:function(){return"KevoreeLogger"}},i.ALL=l.indexOf("all"),i.INFO=l.indexOf("info"),i.DEBUG=l.indexOf("debug"),i.WARN=l.indexOf("warn"),i.ERROR=l.indexOf("error"),i.QUIET=l.indexOf("quiet"),e.exports=i},function(e,t,n){(function(t){"use strict";function r(e){this.enabled=e&&void 0!==e.enabled?e.enabled:a}function o(e){var t=function(){return i.apply(t,arguments)};return t._styles=e,t.enabled=this.enabled,t.__proto__=d,t}function i(){var e=arguments,t=e.length,n=0!==t&&String(arguments[0]);if(t>1)for(var r=1;r<t;r++)n+=" "+e[r];if(!this.enabled||!n)return n;var o=this._styles,i=o.length,s=c.dim.open;for(!p||o.indexOf("gray")===-1&&o.indexOf("grey")===-1||(c.dim.open="");i--;){var l=c[o[i]];n=l.open+n.replace(l.closeRe,l.open)+l.close}return c.dim.open=s,n}function s(){var e={};return Object.keys(h).forEach(function(t){e[t]={get:function(){return o.call(this,[t])}}}),e}var l=n(5),c=n(6),f=n(8),u=n(10),a=n(11),g=Object.defineProperties,p="win32"===t.platform&&!/^xterm/i.test(t.env.TERM);p&&(c.blue.open="[94m");var h=function(){var e={};return Object.keys(c).forEach(function(t){c[t].closeRe=new RegExp(l(c[t].close),"g"),e[t]={get:function(){return o.call(this,this._styles.concat(t))}}}),e}(),d=g(function(){},h);g(r.prototype,s()),e.exports=new r,e.exports.styles=c,e.exports.hasColor=u,e.exports.stripColor=f,e.exports.supportsColor=a}).call(t,n(4))},function(e,t){function n(){a&&f&&(a=!1,f.length?u=f.concat(u):g=-1,u.length&&r())}function r(){if(!a){var e=s(n);a=!0;for(var t=u.length;t;){for(f=u,u=[];++g<t;)f&&f[g].run();g=-1,t=u.length}f=null,a=!1,l(e)}}function o(e,t){this.fun=e,this.array=t}function i(){}var s,l,c=e.exports={};!function(){try{s=setTimeout}catch(e){s=function(){throw new Error("setTimeout is not defined")}}try{l=clearTimeout}catch(e){l=function(){throw new Error("clearTimeout is not defined")}}}();var f,u=[],a=!1,g=-1;c.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];u.push(new o(e,t)),1!==u.length||a||s(r,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},c.title="browser",c.browser=!0,c.env={},c.argv=[],c.version="",c.versions={},c.on=i,c.addListener=i,c.once=i,c.off=i,c.removeListener=i,c.removeAllListeners=i,c.emit=i,c.binding=function(e){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(e){throw new Error("process.chdir is not supported")},c.umask=function(){return 0}},function(e,t){"use strict";var n=/[|\\{}()[\]^$+*?.]/g;e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(n,"\\$&")}},function(e,t,n){(function(e){"use strict";function t(){var e={modifiers:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},colors:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39]},bgColors:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49]}};return e.colors.grey=e.colors.gray,Object.keys(e).forEach(function(t){var n=e[t];Object.keys(n).forEach(function(t){var r=n[t];e[t]=n[t]={open:"["+r[0]+"m",close:"["+r[1]+"m"}}),Object.defineProperty(e,t,{value:n,enumerable:!1})}),e}Object.defineProperty(e,"exports",{enumerable:!0,get:t})}).call(t,n(7)(e))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t,n){"use strict";var r=n(9)();e.exports=function(e){return"string"==typeof e?e.replace(r,""):e}},function(e,t){"use strict";e.exports=function(){return/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g}},function(e,t,n){"use strict";var r=n(9),o=new RegExp(r().source);e.exports=o.test.bind(o)},function(e,t,n){(function(t){"use strict";var n=t.argv,r=n.indexOf("--"),o=function(e){e="--"+e;var t=n.indexOf(e);return t!==-1&&(r===-1||t<r)};e.exports=function(){return"FORCE_COLOR"in t.env||!(o("no-color")||o("no-colors")||o("color=false"))&&(!!(o("color")||o("colors")||o("color=true")||o("color=always"))||!(t.stdout&&!t.stdout.isTTY)&&("win32"===t.platform||("COLORTERM"in t.env||"dumb"!==t.env.TERM&&!!/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(t.env.TERM))))}()}).call(t,n(4))},function(e,t){"use strict";function n(e,t){if(!e)throw new Error("No logger given to "+this.toString()+" (you need to give a proper KevoreeLogger to your Bootstrapper)");if(this.log=e,!t)throw new Error("No resolver given to "+this.toString()+" (you need to give a proper Resolver to your Bootstrapper)");this.resolver=t}n.prototype={bootstrapNodeType:function(e,t,n){if("function"!=typeof n)throw new Error(this.toString()+".bootstrapNodeType() called without callback function");var r=t.findNodesByID(e);if(r){var o=r.typeDefinition.select("deployUnits[name=*]/filters[name=platform,value=javascript]");o.size()>0?this.bootstrap(o.get(0).eContainer(),!1,n):n(new Error("No DeployUnit found for '"+e+"' that matches the 'javascript' platform"))}else n(new Error("Unable to find '"+e+"' in the given model."))},bootstrap:function(e,t,n){if(n||(n=t,t=!1),"function"!=typeof n)throw new Error(this.toString()+".bootstrap() called without callback function");var r=this;this.resolver.resolve(e,t,function(t,o){t?(r.log.error(r.toString(),t.stack),n(new Error("'"+e.name+"@"+e.version+"' bootstrap failed!"))):n(null,o)})},uninstall:function(e,t){if("function"!=typeof t)throw new Error(this.toString()+".uninstall() called without callback function");var n=this;this.resolver.uninstall(e,function(r){r?(n.log.error(n.toString(),r.stack),t(new Error("'"+e.name+"@"+e.version+"' uninstall failed!"))):t()})},toString:function(){return"Bootstrapper"}},e.exports=n}])});