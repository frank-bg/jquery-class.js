

var u = {

    type: function(obj){
        var m = Object.prototype.toString.call(obj).match(/\[object\s(\w+?)\]/);
        return m ? m[1].toLowerCase() : null;
    }

};


describe("Common", function(){

    it("Initialize element", function(){
        var App = $.Class({
            el: "body"
        });
        var app = new App();
        expect(!! app.$el.jquery).toBe(true);
        expect(u.type(app.$el.get(0))).toBe("htmlbodyelement");
    });

    it("Extends features", function(){
        var App = $.Class({
            _extends: ["events", "config", "attributes"]
        });
        var app = new App();
        ["on", "off", "trigger", "config", "attr"].forEach(function(name){
            expect(u.type(app[name])).toBe("function");
        });
    });

    it("Extends other class", function(){
        var Foo = $.Class({
            _extends: ["events", "attributes", "config"],
            _initialize: function(){
                this.attr("foo", 1);
            }
        });
        var Bar = $.Class({
            _extends: [Foo],
            _initialize: function(){
                this.config("bar", 2);
            }
        });

        var app = new Bar();
        var stack = [];

        ["on", "off", "trigger", "config", "attr"].forEach(function(name){
            expect(u.type(app[name])).toBe("function");
        });

        app.on("state", function(){
            stack.push(this.attr("foo"));
            stack.push(this.config("bar"));
        });
        app.trigger("state");

        expect(stack).toEqual([1,2]);
    });

    it("Extends object", function(){
        var Foo = {
            stack: [],
            _initialize: function(){
                this.stack.push("foo");
            },
            a: function(){ this.stack.push(1) },
            b: function(){ this.stack.push(2) }
        };
        var Bar = $.Class({
            _extends: [Foo],
            _initialize: function(value){
                this.stack.push("bar");
            },
            c: function(){ this.stack.push(3); }
        });

        var app = new Bar(0);

        app.a();
        app.b();
        app.c();

        expect(app.stack).toEqual(["foo", "bar", 1,2,3]);
    });

    it("Delegate functions to the instance", function(){
        var stack;
        var emitter = new ($.Class({ _extends: ["events"] }));

        // By name string
        var Foo = $.Class({
            _initialize: function(){
                stack = [];

                this.delegate("foo");

                emitter.on("foo", this.foo);
                emitter.on("foo", this.bar);
                emitter.trigger("foo");

                expect(stack).toEqual([true, false]);
            },
            foo: function(){
                stack.push(this instanceof Foo);
            },
            bar: function(){
                stack.push(this instanceof Foo);
            }
        });
        new Foo();

        // By array of name string
        var Bar = $.Class({
            _initialize: function(){
                var my = this;

                stack = [];
                this.delegate(["foo", "bar"]);

                ["foo", "bar", "baz"].forEach(function(name){
                    emitter.on("bar", my[name]);

                });
                emitter.trigger("bar");

                expect(stack).toEqual([true, true, false]);
            },
            foo: function(){
                stack.push(this instanceof Bar);
            },
            bar: function(){
                stack.push(this instanceof Bar);
            },
            baz: function(){
                stack.push(this instanceof Bar);
            }
        });
        new Bar();

        // By regular expression
        var Baz = $.Class({
            _initialize: function(){
                var my = this;

                stack = [];
                this.delegate(/^b/);

                ["foo", "bar", "baz"].forEach(function(name){
                    emitter.on("baz", my[name]);
                });
                emitter.trigger("baz");

                expect(stack).toEqual([false, true, true]);
            },
            foo: function(){
                stack.push(this instanceof Baz);
            },
            bar: function(){
                stack.push(this instanceof Baz);
            },
            baz: function(){
                stack.push(this instanceof Baz);
            }
        });
        new Baz();
    });
    
    it("Delegate functions to any optional object", function(){
        var stack = [];
        var emitter = new ($.Class({_extends: ["events"]}));
        var app = {
            name: "app",
            foo: function(){
                stack.push(this.name === "app");
            },
            bar: function(){
                stack.push(this.name === "app");
            }
        };
        var delegate = $.Class.modules.common.delegate;

        delegate("foo", app);

        emitter.on("test", app.foo);
        emitter.on("test", app.bar);
        emitter.trigger("test");

        expect(stack).toEqual([true, false]);
    });

});

describe("Events", function(){

    var App = $.Class({
        _extends: ["events"]
    });

    it("Having methods", function(){
        var app = new App();
        ["on", "off", "trigger"].forEach(function(name){
            expect(u.type(app[name])).toBe("function");
        });
    });

    it("Add event listener", function(){
        var app = new App();
        var stack = [];
        app.on("state", function(){
            stack.push(1);
            stack.push(this instanceof App);
        });
        app.trigger("state");
        expect(stack).toEqual([1, true]);
    });

    it("Add and remove listener", function(){
        var app = new App();
        var stack = [];
        var on = {
            foo: function(){
                stack.push(1);
            },
            bar: function(){
                stack.push(2);
            },
            baz: function(){
                stack.push(3);
            }
        };

        app.on("state", on.foo);
        app.on("state", on.bar);
        app.on("state", on.baz);
        app.trigger("state");

        expect(stack).toEqual([1,2,3]);

        app.off("state", on.bar);
        app.trigger("state");

        expect(stack).toEqual([1,2,3,1,3]);
    });

});


describe("Config", function(){

    var App = $.Class({
        _extends: ["config"],
        defaults: {
            options: {
                foo: null,
                bar: null,
                baz: null
            }
        }
    });

    it("Set values", function(){
        var app = new App();
        app.config("foo", 1);
        app.config({
            bar: 2,
            baz: 3
        });

        expect(app.config("foo")).toBe(1);
        expect(app.config()).toEqual({foo: 1, bar: 2, baz: 3});
    });

    it("Not follow prototype chain", function(){
        var a = new App();
        var b = new App();
        a.options.foo = true;
        expect(a.options.foo).not.toEqual(b.options.foo);
    });

});

describe("Attributes", function(){

    var App = $.Class({
        _extends: ["attributes", "events"],
        defaults: {
            attributes: {
                foo: null,
                bar: null,
                baz: null
            }
        }
    });

    it("Set values", function(){
        var app = new App();
        app.attr("foo", 1);
        app.attr({
            bar: 2,
            baz: 3
        });

        expect(app.attr("foo")).toBe(1);
        expect(app.attr()).toEqual({foo: 1, bar: 2, baz: 3});
    });

    it("Not follow prototype chain", function(){
        var a = new App();
        var b = new App();
        a.attributes.foo = true;
        expect(a.attributes.foo).not.toBe(b.attributes.foo);
    });

    it("Fire change event", function(){
        var app = new App();
        var stack = [];

        app.on("change", function(e, data){
            stack.push(data.key + ":" + data.value);
        });
        app.attr("foo", 1);
        app.attr("bar", 2);
        app.attr("baz", 3);

        expect(stack).toEqual([
            "foo:1", "bar:2", "baz:3"
        ]);
    });

});


describe("Modules", function(){

    it("Export and require by name", function(){
        $.Class.exports("foo", {
            name: "foo"
        });
        expect($.Class.require("foo") instanceof $.Class.find("foo")).toBe(true);
    });

    it("Cannot named module which already exists (without `force`)", function(){
        try {
            $.Class.exports("foo", {});
            expect(true).toBe(false);
        } catch(e){
            expect(true).toBe(true);
        }

        try {
            $.Class.exports("foo", {}, true);
            expect(true).toBe(true);
        } catch(e){
            expect(true).toBe(false);
        }
    });

    it("Pass `true` to get a new instance forcely", function(){
        $.Class.exports("bar", {});

        var a = $.Class.require("bar");
        var b = $.Class.require("bar");
        var c = $.Class.require("bar", true);

        expect(a === b).toBe(true);
        expect(a === c).toBe(false);
        expect(b === c).toBe(false);
    });

    it("Extend ancestors", function(){
        $.Class.exports("person", {
            _extends: ["attributes"],
            _attributes: {
                name: null,
                age: null,
                email: null
            }
        });

        $.Class.exports("user", {
            _extends: ["person"],
            isUser: true,
            hello: function(){
                return "hello:" + this.attr("name");
            }
        });

        $.Class.exports("owner", {
            _extends: ["user"],
            isOwner: true
        });


        var owner = $.Class.require("owner");
        owner.attr({
            name: "john",
            age: 23,
            email: "john@example.com"
        });

        expect(owner.attr("name")).toBe("john");
        expect(owner.hello()).toBe("hello:john");
        expect(owner.isUser && owner.isOwner).toBe(true);
    });

});