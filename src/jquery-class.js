(function($){
    
    /**
     * Get class-like object
     * @param {Object} data
     * @returns {Function}
     */
    $.Class = function(data){
        var func, args;
        func = function(){
            this._initExtends();
            if("function" === $.type(this.initialize)){
                this.initialize.apply(this, arguments);
            }
        };
        args = [true, func.prototype, $.Class.types.common];
        if("array" === $.type(data.use)){
            $.each(data.use, function(i, name){
                if(name in $.Class.types){
                    args.push($.Class.types[name]);
                }
            });
        }
        args.push(data);
        $.extend.apply($, args);
        return func;
    };

    /**
     * Prototypes with features
     * Initialize feature by `_initName` function in constructor
     */
    var types = $.Class.types = {};

    /**
     * Common
     * - Initialize dependencies
     * - Initialize element with `el`
     */
    types.common = {
        el: null,
        $el: null,
        use: [],

        _initExtends: function(){
            var my = this;
            $.each(this.use, function(i, name){
                var func = my["_init" + name.replace(/^[a-z]/, function(s){
                    return s.toUpperCase();
                })];
                if($.isFunction(func)){ func.call(my); }
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
    types.events = {
        _initEvents: function(){
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
    types.config = {
        defaults: {
            options: {}
        },
        options: null,

        _initConfig: function(){
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
    types.attributes = {
        EVENT_CHANGE: "change",

        defaults: {
            attributes: {}
        },
        attributes: null,

        _initAttributes: function(){
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
