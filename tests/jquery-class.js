

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
            use: ["events", "config", "attributes"]
        });
        var app = new App();
        ["_initEvents", "_initConfig", "_initAttributes"].forEach(function(name){
            expect(u.type(app[name])).toBe("function");
        });
    });

});

describe("Events", function(){

    var App = $.Class({
        use: ["events"]
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
        use: ["config"],
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
        use: ["attributes", "events"],
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

