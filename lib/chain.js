/**
 * Main chain constructor
 * @param {Array} handlers
 */
var Chain = function(handlers) {
    //add handlers
    this.handlers = handlers || [];
    this.oncomplete = null;
    this.onbreak = null;

};

/**
 * Add handler to the end of chain
 * @param {function} handler
 */
Chain.prototype.add = function(handler) {
    this.handlers.push(handler);
};

/**
 * Start execution
 * @param  {Object} context
 * @param  {Function} oncomplete
 * @param  {Function} onbreak
 * @return
 */
Chain.prototype.start = function(context, oncomplete, onbreak) {
    this.oncomplete = oncomplete;
    this.onbreak = onbreak;
    this.next(0, context)();
};

/**
 * Create function for passing execution to next handler
 * @param  {Number}   i          index of handler
 * @param  {Object}   context
 * @return {Function} call this function you will pass execution to next handler
 */
Chain.prototype.next = function(i, context) {
    var self = this;
    return function() {
        if (arguments.length === 0 || arguments.length === 1 && arguments[0] === true) {

            if (self.handlers[i]) {
                self.handlers[i](context, self.next(i + 1, context));
            } else {
                self.oncomplete(context);
            }
        } else {
            if (self.onbreak) {
                self.onbreak(context);
            }
        }
    };
};

module.exports = exports = Chain;