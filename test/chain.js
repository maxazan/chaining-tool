var assert = require("assert");
var Chain = require("../lib/chain");

describe('Chain', function() {
    this.timeout(5000);

    it('complete test', function(done) {
        var handlers = [];
        handlers[0] = function(context, next) {
            next();
        };
        handlers[1] = function(context, next) {
            next();
        };
        handlers[2] = function(context, next) {
            next();
        };
        var context = {
            request: {},
            response: {}
        };
        var oncomplete = function() {
            assert.ok(true);
            done();
        };
        var oninterrupt = function() {
            assert.ok(false);
        };

        var chain = new Chain(handlers);
        chain.start(context, oncomplete, oninterrupt);
    });

    it('interrupt test', function(done) {
        var handlers = [];
        handlers[0] = function(context, next) {
            next();
        };
        handlers[1] = function(context, next) {
            next(false);
        };
        handlers[2] = function(context, next) {
            next();
        };
        var context = {
            request: {},
            response: {}
        };
        var oncomplete = function() {
            assert.ok(false);
        };
        var oninterrupt = function() {
            assert.ok(true);
            done();
        };

        var chain = new Chain(handlers);
        chain.start(context, oncomplete, oninterrupt);
    });

    it('change context test', function(done) {
        var handlers = [];
        handlers[0] = function(context, next) {
            context.request.test = 1;
            next();
        };
        handlers[1] = function(context, next) {
            next(false);
        };
        handlers[2] = function(context, next) {
            context.request.test = 2;
            next();
        };
        var context = {
            request: {},
            response: {}
        };
        var oncomplete = function(context) {
            assert.ok(false);
        };
        var oninterrupt = function(context) {
            assert.equal(context.request.test, 1);
            done();
        };

        var chain = new Chain(handlers);
        chain.start(context, oncomplete, oninterrupt);
    });

    it('add method test', function(done) {
        var handlers = [];
        handlers[0] = function(context, next) {
            context.request.test = 1;
            next();
        };
        handlers[1] = function(context, next) {
            next();
        };
        another_handler = function(context, next) {
            context.request.test = 2;
            next();
        };
        var context = {
            request: {},
            response: {}
        };
        var oncomplete = function(context) {
            assert.equal(context.request.test, 2);
            done();
        };
        var oninterrupt = function(context) {
            assert.ok(false);
        };

        var chain = new Chain(handlers);
        chain.add(another_handler);
        chain.start(context, oncomplete, oninterrupt);
    });

    it('add array method test', function(done) {
        var handlers = [];
        handlers[0] = function(context, next) {
            context.request.test = 1;
            next();
        };
        var another_handler = [];
        another_handler[0] = function(context, next) {
            next();
        };
        another_handler[1] = function(context, next) {
            context.request.test = 2;
            next();
        };
        var context = {
            request: {},
            response: {}
        };
        var oncomplete = function(context) {
            assert.equal(context.request.test, 2);
            done();
        };
        var oninterrupt = function(context) {
            assert.ok(false);
        };

        var chain = new Chain(handlers);
        chain.add(another_handler);
        chain.start(context, oncomplete, oninterrupt);
    });

    it('memory usage test', function(done) {
        var handlers = [];
        for (var i = 0; i < 1500; i++) {
            handlers.push(function(context, next) {
                var f="sdfsdfsfdsfsdd";
                next();
            });
        }
        var context = {
            request: {},
            response: {}
        };
        var oncomplete = function(context) {
            global.gc();
            var after = process.memoryUsage().heapUsed;
            var diff_kb = (after - before) / 1024;
            assert.ok(diff_kb < 300, "A lot memmory usage >300Kb");
            done();
        };
        var oninterrupt = function(context) {};
        var chain = new Chain(handlers);

        global.gc();
        var before = process.memoryUsage().heapUsed;
        chain.start(context, oncomplete, oninterrupt);
    });

});
