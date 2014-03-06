
# jquery-class.js

Class-like object by jQuery


## Features

- Create class-like object by jQuery method
- Implement some basic features using `use` prop
- Add more features by extending `$.Class.types`


## Get Started

Pass the object, which contains any properties you want, to `$.Class`,
then it returns class-like object.
`initialize` function will run when the object is initialized by 'new'.

```javascript
var App = $.Class({

	// Implement some features
	use: ["events", "attributes"],

	// Default values for attributes
	defaults: {
		attributes: {
			name: null,
			age: null
		}
	},

	// Constructor
	initialize: function(name, age){
		this.attr({
			name: name,
			age: age
		});
	},

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

## Prototypes

Some prototypes having basic features are defined at `$.Class.types`

### Common

Initialize jQuery object named `$el` using `el` as selector or HTML element,
implement features specified in `use` array.

### Events

Implement jQuery event features (on, off, trigger) as its own.

- **on()** - Alias to jQuery.on
- **off()** - Alias to jQuery.on
- **trigger()** - Alias to jQuery.trigger

### Config

Implement feature to configure values in `options`.

- **defaults.options** - Object to specify default values
- **options** - Object to store values
- **config()** - Setter or getter method

### Attributes

Implement feature to set or get values in `attributes`.
'change' event is to be fired when a value changed by setter.

- **defaults.attributes** - Object to specify default values
- **attributes** - Object to store values
- **attr()** - Setter or getter method


## Adding more features

To add more features to class, extend `$.Class.types`.
You can initialize the feature with `_init[Name]` method, it will be called in constructor before `initialize` run.

```javascript
$.extend($.Class.types, {
	foo: {
		// initialize this feature
		_initFoo: function(){ ... }
	}
});

var App = $.Class({
	use: ["foo"],
	initialize: function(){ ... }
});
```


## Author

mach3 <http://github.com/mach3>






