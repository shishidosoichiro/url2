/**
 *
 * Contructor variation
 *
 * ```js
 * // normal
 * var url = new Url('http://example.com/path/a/');
 *
 * // function type
 * var url = Url('http://example.com/path/a/');
 *
 * // with url string
 * var url = Url('http://example.com/path/a/');
 *
 * // with url object
 * var nodeUrl = require('url');
 * var nodeUrlObj = nodeUrl.parse('http://example.com/path/a/');
 * var url = Url(nodeUrlObj);
 *
 * ```
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                    href                                     │
 * ├──────────┬┬───────────┬─────────────────┬───────────────────────────┬───────┤
 * │ protocol ││   auth    │      host       │           path            │ hash  │
 * │          ││           ├──────────┬──────┼──────────┬────────────────┤       │
 * │          ││           │ hostname │ port │ pathname │     search     │       │
 * │          ││           │          │      │          ├─┬──────────────┤       │
 * │          ││           │          │      │          │ │    query     │       │
 * "  http:   // user:pass @ host.com : 8080   /p/a/t/h  ?  query=string   #hash "
 * │          ││           │          │      │          │ │              │       │
 * └──────────┴┴───────────┴──────────┴──────┴──────────┴─┴──────────────┴───────┘
 * (all spaces in the "" line should be ignored -- they're purely for formatting)
 *
 */

var url = require('url');
//var path = require('path');
var _ = require('lodash');

'use strict';

var defaults = {};

var slice = function(array, begin, end){
	return Array.prototype.slice.call(array, begin, end);
};
var slash = '/';
var resolve = function(start){
	return slice(arguments, 1).reduce(function(a, b){
		a = a.split(slash);
		b = b.split(slash);
		var el;
		while((el = b.shift()) != undefined) {
			if (el === '..') a.pop();
			else if (el === '.') continue;
			else a.push(el);

			if (a.length <= 0) return '';
		}
		return a.join(slash);
	}, start);
};

var Url = function(urlObj, parseQueryString, slashesDenoteHost){
	if (!(this instanceof Url)) return new Url(urlObj, parseQueryString, slashesDenoteHost);

	if (typeof urlObj === 'string') urlObj = url.parse(urlObj, parseQueryString, slashesDenoteHost);

	if (typeof urlObj != 'object') throw new Error('a type of 1st argument should be string or object.');

	this._url = urlObj;
};

Url.parse = function(urlString){
	return Url(urlString);
};
Url.format = function(urlObj){
	return url.format(urlObj);
};

Url.prototype.resolve = function(next){
	var resolved = url.resolve(this._url.href, next);
	return Url(resolved);
};
Url.prototype.cd = function(pathname){
	var resolved = resolve(this._url.pathname, pathname);
	this.pathname = resolved;
};
Url.prototype.format = function(){
	return this._url.href;
};
Url.prototype._refresh = function(){
	this._url = url.parse(url.format(this._url));
};
Object.defineProperties(Url.prototype, {
	"href": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.href;
		},
		set: function(val) {
			this._url = url.parse(val);
		}
	},
	"protocol": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.protocol;
		},
		set: function(val) {
			this._url.protocol = val;
			this._refresh();
		}
	},
	"host": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.host;
		},
		set: function(val) {
			this._url.host = val;
			this._refresh();
		}
	},
	"auth": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.auth;
		},
		set: function(val) {
			this._url.auth = val;
			this._refresh();
		}
	},
	"hostname": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.hostname;
		},
		set: function(val) {
			this._url.hostname = val;
			delete this._url.host;
			this._refresh();
		}
	},
	"port": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.port;
		},
		set: function(val) {
			this._url.port = val;
			delete this._url.host;
			this._refresh();
		}
	},
	"path": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.path;
		},
		set: function(val) {
			if (!/^\//.test(val)) val = '/' + val;
			this.href = url.resolve(this._url.href, val);
		}
	},
	"pathname": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.pathname;
		},
		set: function(val) {
			this._url.pathname = val;
			this._refresh();
		}
	},
	"search": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.search;
		},
		set: function(val) {
			this._url.search = val;
			this._refresh();
		}
	},
	"query": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.query;
		},
		set: function(val) {
			this._url.query = val;
			delete this._url.search;
			this._refresh();
		}
	},
	"hash": {
		configurable: true,
		enumerable: true,
		get: function() {
			return this._url.hash;
		},
		set: function(val) {
			this._url.hash = val;
			this._refresh();
		}
	}
});

module.exports = Url;
