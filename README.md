Fancy Input
=============
Makes typing & deleting in input / Textarea fields exciting with CSS3 effects.

###[Demonstration page here](http://dropthebit.com/demos/fancy_input/fancyInput.html)

## Basic use example:
```html
<!-- ...previous page content... -->
<div>
	<input type='text' />
</div>
<div>
	<textarea></textarea>
</div>
<!-- ...other page content... -->
<script>
$('div :input').fancyInput();
</script>
<!-- You could also use any other way of getting
to the parent of the input/textarea, as long as you call .fancyInput(). -->
```
Call the .fancyInput() function on all parents of inputs.
With this example code, you need to make sure every input is actually wrapped in a div.

This plugin does have any current plans to support any version of IE.
