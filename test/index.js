var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

'use strict';

var nodeUrl = require('url');
var Url = require('../');

describe('Url', function(){
	describe('#constructor', function(){
		it('should be a constructor.', function(){
			var url = new Url('http://example.com/path/a/');
			url.should.be.a('object');
		});
		it('should be a function type constructor.', function(){
			var url = Url('http://example.com/path/a/');
			url.should.be.a('object');
		});
		it('should have one argument which is a string or a object.', function(){
			var urlA = Url('http://example.com/path/a/');
			urlA.should.be.a('object');
			var urlB = Url(nodeUrl.parse('http://example.com/path/a/'));
			urlB.should.be.a('object');
			urlB.path.should.equal('/path/a/');
			Url.bind(Url, 1).should.throw(Error, 'a type of 1st argument should be string or object.');
			Url.bind(Url).should.throw(Error, 'a type of 1st argument should be string or object.');
		});
	});

	describe('#resolve', function(){
		it('should return Url object which is resolved with a argument.', function(){
			var stepA = Url('http://example.com/step/a');
			var stepB = stepA.resolve('b');
			stepB.href.should.equal('http://example.com/step/b');
		});
	});

	describe('#cd', function(){
		it('should change pathname like a path in file system.', function(){
			var url = Url('http://example.com/a/b/c');
			url.cd('d');
			url.href.should.equal('http://example.com/a/b/c/d');
		});
	});

	describe('#href', function(){
		describe('#get', function(){
			it('should return a string of href.', function(){
				var url = Url('http://example.com/step/a');
				url.href.should.equal('http://example.com/step/a');
			});
		});
		describe('#set', function(){
			it('should set href and refresh a internal url object.', function(){
				var url = Url('http://example.com/step/a?key=word#hash?dummy');
				url.href = 'http://somewhere.com/step/a?key=word#hash?dummy';
				url.href.should.equal('http://somewhere.com/step/a?key=word#hash?dummy');
			});
		});
	});

	describe('#protocol', function(){
		describe('#get', function(){
			it('should return a string of protocol.', function(){
				var url = Url('https://example.com/step/a');
				url.protocol.should.equal('https:');
			});
		});
		describe('#set', function(){
			it('should set protocol and refresh a internal url object.', function(){
				var url = Url('http://example.com/step/a?key=word#hash?dummy');
				url.protocol = 'websoket:';
				url.href.should.equal('websoket://example.com/step/a?key=word#hash?dummy');
			});
		});
	});

	describe('#auth', function(){
		describe('#get', function(){
			it('should return a string of auth.', function(){
				var url = Url('https://username:password@example.com/step/a');
				url.auth.should.equal('username:password');
			});
		});
		describe('#set', function(){
			it('should set auth and refresh a internal url object.', function(){
				var url = Url('http://username:password@example.com/step/a?key=word#hash?dummy');
				url.auth = 'user:pass';
				url.href.should.equal('http://user:pass@example.com/step/a?key=word#hash?dummy');
			});
		});
	});

	describe('#host', function(){
		describe('#get', function(){
			it('should return a string of host.', function(){
				var url = Url('http://example.com:8080/step/a');
				url.host.should.equal('example.com:8080');
			});
		});
		describe('#set', function(){
			it('should set host and refresh a internal url object.', function(){
				var url = Url('http://example.com:8080/step/a?key=word#hash?dummy');
				url.host = 'somewhere.com:80';
				url.href.should.equal('http://somewhere.com:80/step/a?key=word#hash?dummy');
			});
		});
	});

	describe('#hostname', function(){
		describe('#get', function(){
			it('should return a string of hostname.', function(){
				var url = Url('http://example.com:8080/step/a');
				url.hostname.should.equal('example.com');
			});
		});
		describe('#set', function(){
			it('should set hostname and refresh a internal url object.', function(){
				var url = Url('http://example.com:8080/step/a?key=word#hash?dummy');
				url.hostname = 'somewhere.com';
				url.href.should.equal('http://somewhere.com:8080/step/a?key=word#hash?dummy');
			});
		});
	});

	describe('#port', function(){
		describe('#get', function(){
			it('should return a string of port.', function(){
				var urlA = Url('http://example.com:8080/step/a');
				urlA.port.should.equal('8080');
				var urlB = Url('http://example.com/step/a');
				should.equal(urlB.port, null);
			});
		});
		describe('#set', function(){
			it('should set port and refresh a internal url object.', function(){
				var url = Url('http://example.com:1234/step/a?key=word#hash?dummy');
				url.port = '5678';
				url.href.should.equal('http://example.com:5678/step/a?key=word#hash?dummy');
			});
		});
	});

	describe('#path', function(){
		describe('#get', function(){
			it('should return a string of path.', function(){
				var url = Url('http://example.com/step/a?key=word#hash?dummy');
				url.path.should.equal('/step/a?key=word');
			});
		});
		describe('#set', function(){
			it('should set path and refresh a internal url object.', function(){
				var urlA = Url('http://example.com/step/a?key=word#hash?dummy');
				urlA.path = '/a/b?c=d';
				urlA.href.should.equal('http://example.com/a/b?c=d');
				var urlB = Url('http://example.com/step/a?key=word#hash?dummy');
				urlB.path = 'a/b?c=d';
				urlB.href.should.equal('http://example.com/a/b?c=d');
			});
		});
	});

	describe('#pathname', function(){
		describe('#get', function(){
			it('should return a string of pathname.', function(){
				var url = Url('http://example.com/step/a?key=word#hash?dummy');
				url.pathname.should.equal('/step/a');
			});
		});
		describe('#set', function(){
			it('should set pathname and refresh a internal url object.', function(){
				var url = Url('http://example.com/step/a?key=word#hash?dummy');
				url.pathname = '/a/b/c';
				url.href.should.equal('http://example.com/a/b/c?key=word#hash?dummy');
			});
		});
	});

	describe('#search', function(){
		describe('#get', function(){
			it('should return a string of search.', function(){
				var urlA = Url('http://example.com/step/a?key1=word1&key2=word2#hash?dummy');
				urlA.search.should.equal('?key1=word1&key2=word2');
				var urlB = Url('http://example.com/step/a');
				should.equal(urlB.search, null);
			});
		});
		describe('#set', function(){
			it('should set search and refresh a internal url object.', function(){
				var url = Url('http://example.com/a/b?c=d#e');
				url.search = '?f=g';
				url.href.should.equal('http://example.com/a/b?f=g#e');
			});
		});
	});

	describe('#query', function(){
		describe('#get', function(){
			it('should return a object of query.', function(){
				var urlA = Url('http://example.com/step/a?key1=word1&key2=word2#hash?dummy');
				urlA.query.should.equal('key1=word1&key2=word2');
				var urlB = Url('http://example.com/step/a?key1=word1&key2=word2#hash?dummy', true);
				urlB.query.should.deep.equal({key1: 'word1', key2: 'word2'});
				var urlC = Url('http://example.com/step/a');
				should.equal(urlC.query, null);
			});
		});
		describe('#set', function(){
			it('should set query and refresh a internal url object.', function(){
				var url = Url('http://example.com/a/b?c=d#e');
				url.query = {f: 'g', h: 'i'};
				url.href.should.equal('http://example.com/a/b?f=g&h=i#e');
			});
		});
	});

	describe('#hash', function(){
		describe('#get', function(){
			it('should return a string of hash.', function(){
				var urlA = Url('http://example.com/step/a?key=word#hash?dummy');
				urlA.hash.should.equal('#hash?dummy');
				var urlB = Url('http://example.com/step/a?key=word');
				should.equal(urlB.hash, null);
			});
		});
		describe('#set', function(){
			it('should set hash and refresh a internal url object.', function(){
				var urlA = Url('http://example.com/step/a?key=word#hash?dummy');
				urlA.hash = '#hashA';
				urlA.href.should.equal('http://example.com/step/a?key=word#hashA');
			});
		});
	});
});
