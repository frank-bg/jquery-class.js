
# jquery-class.js

Class-like object by jQuery


## Features

- Create class-like object by jQuery method
- Implement features using `use` prop (module name string, object, function)
- Add module by extending `$.Class.modules`


## Get Started

Pass the object, which contains any properties you want, to `$.Class`,
then it returns class-like object.
`initialize` function will run when the object is initialized by 'new'.

```javascript
var App = $.Class({

	// Implement features
	use: ["events", "attributes"],

	// Constructor
	initialize: function(name, age){
		this.attr({
			name: name,
			age: age
		});
	},

	// its own method
	hello: function(){
		return "Hello, my name is "
			+ this.attr("name")
			+ ", "
			+ this.attr("age")
			+ " years old.";
	}
});

var app = new App("John", 23);
app.hello(); // "Hello, my name is John, 23 years old."
```

## Extends

`use` array accept string (as in $.Class.modules), object or function as its value.

```javascript
var Foo = $.Class({ ... });
var Bar = function(){ ... };
var Baz = { ... };

var App = $.Class({
	use: ["events", "attributes", Foo, Bar, Baz],
	initialize: function(){ ... }
});
```

## Modules

Some modules having basic features are defined at `$.Class.modules`.
You can implement them quickly by adding module name as string to `use` array.

### Common

Common module is always imported to class.
This initialize jQuery object named `$el` using `el` as selector or HTML element,
implement features specified in `use` array.

- **delegate()** - Bind function to the instance

```javascript
var App = $.Class({
	el: "#my-widget",
	initialize: function(){ ... }
});
```

Use `delegate` to bind function to the instance. `delegate` accept string name, array or regular expression as its first argument.

```javascript
var App = $.Class({
	initialize: function(){
		this.delegate("onClick");
		something.on("click", this.onClick);
	},
	onClick: function(e){
		// `this` is this instance
	}
});
```


### Events

Implement jQuery event features (on, off, trigger) as its own.

- **on()** - Alias to jQuery.on
- **off()** - Alias to jQuery.on
- **trigger()** - Alias to jQuery.trigger

```javascript
var App = $.Class({
	use: ["events"]
});
var app = new App();
app.on("state", function(){ ... });
app.trigger("state");
```

### Config

Config module implements features to configure values in `options`.

- **defaults.options** - Object to specify default values
- **options** - Object to store values
- **config()** - Setter or getter method

```javascript
var App = $.Class({
	use: ["config"],
	defaults: {
		options: {
			name: null,
			age: null
		}
	}
});

var app = new App();

app.config("name", "John");
app.config({ age: 23 });
app.config("name"); // "John"
app.config(); // {"name": "John", "age": 23}
```

### Attributes

Attributes module implements feature to set or get values in `attributes`.
If events module is enabled, "change" event is to be fired when a value changed by setter.

- **defaults.attributes** - Object to specify default values
- **attributes** - Object to store values
- **attr()** - Setter or getter method

```javascript
var App = $.Class({
	use: ["events", "attributes"],
	defaults: {
		options: {
			name: null,
			age: null
		}
	}
});

var app = new App();

app.on(app.EVENT_CHANGE, function(){
	// this will run when value changed
});

app.attr("name", "John");
app.attr({ age: 23 });
app.attr("name"); // "John"
app.attr(); // {"name": "John", "age": 23}
```


## Adding Modules

To add more modules to class, extend `$.Class.modules`.
You can initialize the feature with `initialize` method, it will be called in constructor before `initialize` of instance runs.

```javascript
$.extend($.Class.modules, {
	foo: {
		// initialize this feature
		initialize: function(){ ... }
	}
});

var App = $.Class({
	use: ["foo"],
	initialize: function(){ ... }
});
```


## Author

mach3 <http://github.com/mach3>






