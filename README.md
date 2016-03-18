# Roundish #
A lightweight (1160 bytes gzipped), standalone HTML5 JavaScript navigation API that automatically manages browser histories.

## Supported Browsers ##
* IE 10+ & Edge
* Firefox 4+
* Chrome 5+
* Safari 6+
* Opera 11.5+
* iOS Safari 5.1+
* Android Browser 4.3+

## Usage ##
```html
<script src="roundish.js"></script>
```
```javascript
Roundish.addRoute('/foo/:i_am_a_named_parameter', function(parameters) {
	console.log(parameters); // Object { i_am_a_named_parameter: "bar" }
});

Roundish.navigate('/foo/bar', {
	replaceState: true // Optional, default is false
});
```

## More Examples ##
[examples.html](https://github.com/SourceBoy/roundish/blob/master/examples.html)

## Notes ##
Routes with dynamic query strings are currently not supported.
