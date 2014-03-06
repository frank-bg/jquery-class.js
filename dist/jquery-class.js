/**
 * jquery-class.js
 * ---------------
 * Class-like object by jQuery
 *
 * @version 0.1.0 (2014-03-07)
 * @author mach3 <http://github.com/mach3>
 * @license MIT
 * @url https://github.com/mach3/jquery-class.js
 */
(function($){
    
    /**
     * Get class-like object
     * @param {Object} data
     * @returns {Function}
     */
    $.Class = function(data){
        var my = {};

        // collection of dependencies
        my.uses = [];

        // function to return
        my.func = function(){
            this._initExtends();
            if("function" === $.type(this.initialize)){
                this.initialize.apply(this, arguments);
            }
        };

        // append object to uses recursively
        my.append = function(items){
            if("array" !== $.type(items)){ return; }
            $.each(items, function(i, item){
                var obj = null;
                switch($.type(item)){
                    case "string": obj = $.Class.modules[item]; break;
                    case "function": obj = item.prototype; break;
                    case "object": obj = item; break;
                    default: break;
                }
                if(! obj){ return; }
                my.append(obj.use);
                my.uses.push(obj);
            });
        };

        // resolve dependencies, set as prop
        my.append(data.use);
        data.__extends__ = my.uses;

        // merge all
        my.args = [true, my.func.prototype, $.Class.modules.common];
        $.extend.apply($, my.args.concat(my.uses).concat([data]));

        return my.func;
    };

    /**
     * Prototypes with features
     * Initialize feature by `initialize` function in constructor
     */
    var modules = $.Class.modules = {};

    /**
     * Common
     * - Initialize dependencies
     * - Initialize element with `el`
     */
    modules.common = {
        el: null,
        $el: null,
        use: [],

        _initExtends: function(){
            var my = this;

            $.each(this.__extends__, function(i, o){
                if($.isFunction(o.initialize)){
                    o.initialize.call(my);
                }
            });
            if(!! this.el){
                this.$el = $(this.el);
            }
        }
    };

    /**
     * Events
     * - Extend jQuery's event feature (on, off, trigger)
     */
    modules.events = {
        initialize: function(){
            var jq, my = this;
            jq = $(this);
            $.each(["on", "off", "trigger"], function(i, name){
                my[name] = $.proxy(jq[name], jq);
            });
        }
    };

    /**
     * Config
     * - Configure values in `options` prop
     */
    modules.config = {
        defaults: {
            options: {}
        },
        options: null,

        initialize: function(){
            this.options = {};
            this.config(this.defaults.options);
        },

        /**
         * Set/get values of options
         *
         * - .config(key, value); // set value
         * - .config(key); // returns value
         * - .config(obj); // set values
         * - .config(); // returns values
         */
        config: function(){
            var args = Array.prototype.slice.call(arguments);
            switch($.type(args[0])){
                case "undefined":
                    return this.options;
                case "string": 
                    if(args.length > 1){
                        this.options[args[0]] = args[1];
                        return this;
                    }
                    return this.options[args[0]];
                case "object":
                    $.extend(true, this.options, args[0]);
                    return this;
                default: break;
            }
            return this;
        }
    };

    /**
     * Attributes
     * - Configure values in `attributes` prop
     * - If extended with `events`, 'change' event triggered when a value changed
     */
    modules.attributes = {
        EVENT_CHANGE: "change",

        defaults: {
            attributes: {}
        },
        attributes: null,

        initialize: function(){
            this.attributes = {};
            this.attr(this.defaults.attributes);
        },

        /**
         * Set/get values of options
         *
         * - .attr(key, value); // set value
         * - .attr(key); // returns value
         * - .attr(obj); // set values
         * - .attr(); // returns values
         */
        attr: function(){
            var my = this,
                args = Array.prototype.slice.call(arguments),
                changed = false;
            switch($.type(args[0])){
                case "undefined":
                    return this.attributes;
                case "string": 
                    if(args.length > 1){
                        changed = this.attributes[args[0]] !== args[1];
                        this.attributes[args[0]] = args[1];
                        if(changed && $.isFunction(this.trigger)){
                            this.trigger(this.EVENT_CHANGE, {key: args[0], value: args[1]});
                        }
                        return this;
                    }
                    return this.attributes[args[0]];
                case "object":
                    $.each(args[0], function(key, value){
                        my.attr(key, value);
                    });
                    return this;
                default: break;
            }
            return this;
        }
    };

}(jQuery));
