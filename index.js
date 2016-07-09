/**
 *
 * Contructor variation
 *
 * ```js
 * // normal
 * var url = new Url2('http://example.com/path/a/');
 *
 * // function type
 * var url = Url2('http://example.com/path/a/');
 *
 * // with url string
 * var url = Url2('http://example.com/path/a/');
 *
 * // with url object
 * var nodeUrl = require('url');
 * var nodeUrlObj = nodeUrl.parse('http://example.com/path/a/');
 * var url = Url2(nodeUrlObj);
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
'use strict';

var url = require('url');
//var path = require('path');
var _ = require('lodash');

var defaults = {};

var slice = function(array, begin, end){
	return Array.prototype.slice.call(array, begin, end);
};
var slash = '/';
var resolve = function(start){
	return slice(arguments, 1).reduce(function(a, b){
		a = a.split(slash);
		if (b === undefined || b === null) return a;
		b = b.split(slash);
		var el;
		while((el = b.shift()) !== undefined) {
			if (el === '..') a.pop();
			else if (el === '.') continue;
			else a.push(el);

			if (a.length <= 0) return '';
		}
		return a.join(slash);
	}, start);
};

var properties = {
	'href': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.href;
		},
		set: function(val) {
			this.original = url.parse(val);
		}
	},
	'protocol': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.protocol;
		},
		set: function(val) {
			this.original.protocol = val;
			this._refresh();
		}
	},
	'host': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.host;
		},
		set: function(val) {
			this.original.host = val;
			this._refresh();
		}
	},
	'auth': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.auth;
		},
		set: function(val) {
			this.original.auth = val;
			this._refresh();
		}
	},
	'hostname': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.hostname;
		},
		set: function(val) {
			this.original.hostname = val;
			delete this.original.host;
			this._refresh();
		}
	},
	'port': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.port;
		},
		set: function(val) {
			this.original.port = val;
			delete this.original.host;
			this._refresh();
		}
	},
	'path': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.path;
		},
		set: function(val) {
			if (!/^\//.test(val)) val = '/' + val;
			this.href = url.resolve(this.original.href, val);
		}
	},
	'pathname': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.pathname;
		},
		set: function(val) {
			this.original.pathname = val;
			this._refresh();
		}
	},
	'search': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.search;
		},
		set: function(val) {
			this.original.search = val;
			this._refresh();
		}
	},
	'query': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.query;
		},
		set: function(val) {
			this.original.query = val;
			delete this.original.search;
			this._refresh();
		}
	},
	'hash': {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.original.hash;
		},
		set: function(val) {
			this.original.hash = val;
			this._refresh();
		}
	}
};

function Url2(urlObj, parseQueryString, slashesDenoteHost){
	if (!(this instanceof Url2)) return new Url2(urlObj, parseQueryString, slashesDenoteHost);

	if (typeof urlObj === 'string') urlObj = url.parse(urlObj, parseQueryString, slashesDenoteHost);

	if (typeof urlObj !== 'object') throw new Error('a type of 1st argument should be string or object.');

	Object.defineProperties(this, properties);
	this.original = urlObj;
};

Url2.parse = function(urlString){
	return Url2(urlString);
};
Url2.format = function(urlObj){
	return url.format(urlObj);
};

Url2.prototype.resolve = function(next){
	var resolved = url.resolve(this.original.href, next);
	return Url2(resolved);
};
Url2.prototype.cd = function(path){
	if (path === undefined) return Url2(this.href);
	if (typeof path === 'object') path = Url2(Url2.format(path)).path;
	if (/^\?/.test(path)) path = this.original.path + path;
	else path = resolve(this.original.path, path);
	return this.resolve(path);
};
Url2.prototype.format = function(){
	return this.original.href;
};
Url2.prototype.toString = function(){
	return this.original.href;
};
Url2.prototype._refresh = function(){
	this.original = url.parse(url.format(this.original));
};

module.exports = Url2;
