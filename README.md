Fancy Input
=============
Makes typing & deleting in input/Textarea fields exciting & fun with CSS3 effects.

###[View Demo Page](http://dropthebit.com/demos/fancy_input/fancyInput.html)

## Basic use example:
```html
<!-- ...previous page content... -->
<div>
	<input type='text' >
</div>
<div>
	<textarea></textarea>
</div>
<!-- ...some more content (hopefully)... -->
<script>
    $('div :input').fancyInput();
</script>
```

## Public Events API
```javascript
var fancyInput = $('div :input').fancyInput();
fancyInput.on('fi.addLetter',function(e,data){
	console.log('add');
	console.log(data);
});
fancyInput.on('fi.deleteLetter',function(e,data){
	console.log('delete');
	console.log(data);
});
fancyInput.on('fi.linebreak',function(e){
	console.log('linebreak')
});
fancyInput.on('fi.space',function(e){
	console.log('space');
});
```
Call the .fancyInput() function on all parents of inputs.
With this example code, make sure every input is wrapped in a div.

This plugin does not have any current plans to support any version of IE.
