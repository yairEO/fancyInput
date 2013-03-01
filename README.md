Fancy Input
=============
Makes typing in `input` / `textarea` fields fun with CSS3 effects. Deleting is also fun!

##[Demo page](http://dropthebit.com/demos/fancy_input/fancyInput.html)

## Basic use-case example:
	<div>
		<input type='text'>
	</div>
	<div>
		<textarea></textarea>
	</div>
	<script>
		$('div :input').fancyInput();
	</script>
	
This will add the 'fancyInput' class to all parents of inputs. Make sure every input is actually wrapped in a `div`.

(this plugin does not support any version of IE)
