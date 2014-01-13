/*!
	fancyInput v1.3.2
	(c) 2013 Yair Even Or <http://dropthebit.com>
	
	MIT-style license.
*/

;(function($){
	"use strict";
	var isIe = !!window.ActiveXObject,
		isWebkit = 'webkitRequestAnimationFrame' in window,
		letterHeight;

	$.fn.fancyInput = function(){
		if( !isIe || 'ontouchstart' in document.documentElement )
			init( this );
		return this;
	}
	
	var fancyInput = {
		classToggler : 'state1',

		keypress : function(e){
			var charString = String.fromCharCode(e.charCode),
				textCont = this.nextElementSibling,
				appendIndex = this.selectionEnd,
				newLine = this.tagName == 'TEXTAREA' && e.keyCode == 13;
				
			if( (this.selectionEnd - this.selectionStart) > 0 && e.charCode && !(e.metaKey || e.ctrlKey) ){
				var rangeToDel = [this.selectionStart, this.selectionEnd];
				appendIndex = this.selectionStart;
				
				if( charDir.lastDir == 'rtl' ){ // BIDI support
					rangeToDel = [this.value.length - this.selectionEnd, this.value.length - this.selectionStart + 1];
					//appendIndex = this.value.length;
				}

				fancyInput.removeChars(textCont, rangeToDel);
			}
			
			if( e.charCode && !(e.metaKey || e.ctrlKey) || newLine ){
				var dir = charDir.check(charString); // BIDI support
				if( dir == 'rtl' || (dir == '' && charDir.lastDir == 'rtl' ) )
					appendIndex = this.value.length - this.selectionStart;
					
				if( newLine )
					charString = '';
				
/*				
				setTimeout(function(){
					console.log( e.target.value.slice(-1) );
				},0);
*/
				
				fancyInput.maskPassword(this);
				
				fancyInput.writer(charString, this, appendIndex);
			}
		},
		
		input : function(){
			fancyInput.textLength = this.value.length; // save a reference to later check if text was added in the "allEvents" callback
			fancyInput.inputResize( this );
		},
		
		// if password field, delete all content
		maskPassword : function(input){
			if( input.type == 'password' )
				$(input.nextElementSibling).find('span').each(function(){
					this.innerHTML = '';
				});
		},
		
		// Clalculate letter height for the Carot, after first letter have been typed, or text pasted (only once)
		setCaretHeight : function(input){
			var lettersWrap = $(input.nextElementSibling);
			if( !lettersWrap.find('span').length )
				return false;
			letterHeight = lettersWrap.find('span')[0].clientHeight;
			lettersWrap.find('b').height(letterHeight);
		},
		
		// writes a single character every time
		writer : function(charString, input, appendIndex){
			var chars = $(input.nextElementSibling).children().not('b'),  // select all characters including <br> (which is a new line)
				newCharElm = document.createElement('span');
			
			if( charString == ' ' ) // space
				charString = '&nbsp;';
			
			if( charString ){
				newCharElm.innerHTML = charString;
				this.classToggler = this.classToggler == 'state2' ? 'state1' : 'state2';
				newCharElm.className = this.classToggler;
			}
			else
				newCharElm = document.createElement('br');
			
			if( chars.length ){
				if( appendIndex == 0 ) 
					$(input.nextElementSibling).prepend(newCharElm);
				else{
					var appendPos = chars.eq(--appendIndex);
					appendPos.after(newCharElm);
				}
			}
			else
				input.nextElementSibling.appendChild(newCharElm);

			// let the render tree settle down with the new class, then remove it
			if( charString)
				setTimeout(function(){
					newCharElm.removeAttribute("class");
				},20);
			
			return this;
		},

		clear : function(textCont){
			var caret = $(textCont.parentNode).find('.caret');
			$(textCont).html(caret);
		},
		
		// insert bulk text (unlike the "writer" function which is for single character only)
		fillText : function(text, input){
			var charsCont = input.nextElementSibling, 
				newCharElm,
				frag = document.createDocumentFragment();

			fancyInput.clear( input.nextElementSibling );
			
			setTimeout( function(){
				var length = text.length;
					
				for( var i=0; i < length; i++ ){
					var newElm = 'span';
					//fancyInput.writer( text[i], input, i);
					if( text[i] == '\n' )
						newElm = 'br';
					newCharElm = document.createElement(newElm);
					newCharElm.innerHTML = (text[i] == ' ') ? '&nbsp;' : text[i];
					frag.appendChild(newCharElm);
				}
				charsCont.appendChild(frag);
			},0);
		},
		
		// Handles characters removal from the fake text input
		removeChars : function(el, range){
			var allChars = $(el).children().not('b').not('.deleted'), 
				caret = $(el).find('b'),
				charsToRemove;
			
			if( range[0] == range[1] )
				range[0]--;
				
			charsToRemove = allChars.slice(range[0], range[1]);
				
			if( range[1] - range[0] == 1 ){
				charsToRemove.css('position','absolute');
				if(isWebkit)
					charsToRemove[0].offsetLeft;
				charsToRemove.addClass('deleted');
				setTimeout(function(){
					charsToRemove.remove();
				},140);
			}
			else
				charsToRemove.remove();
		},
		
		// recalculate textarea height or input width
		inputResize : function(el){
			if( el.tagName == 'TEXTAREA' ){
				setTimeout(function(){
					el.style.top = '-999px';
					var newHeight = el.parentNode.scrollHeight;
					
					if( $(el).outerHeight() < el.parentNode.scrollHeight )
						newHeight += 10;
					
					el.style.height = newHeight + 'px';
					el.style.top = '0';
					
					// must re-adjust scrollTop after pasting long text
					setTimeout(function(){
						el.scrollTop = 0;
						el.parentNode.scrollTop = 9999;
					},50);
				},0);
			}
			if( el.tagName == 'INPUT' && el.type == 'text' ){
				el.style.width = 0;
				var newWidth = el.parentNode.scrollWidth
				// if there is a scroll (or should be) adjust with some extra width
				if( el.parentNode.scrollWidth > el.parentNode.clientWidth )
					newWidth += 20;
				
				el.style.width = newWidth + 'px';
				// re-adjustment
				//el.scrollLeft = 9999;
				//el.parentNode.scrollLeft += offset;
			}
		},
		
		keydown : function(e){
			var charString = String.fromCharCode(e.charCode),
				textCont = this.nextElementSibling,  // text container DIV
				appendIndex = this.selectionEnd,
				undo = ((e.metaKey || e.ctrlKey) && e.keyCode == 90) || (e.altKey && e.keyCode == 8),
				redo = (e.metaKey || e.ctrlKey) && e.keyCode == 89,
				selectAll = (e.metaKey || e.ctrlKey) && e.keyCode == 65,
				caretAtEndNoSelection = (this.selectionEnd == this.selectionStart && this.selectionEnd == this.value.length ),
				deleteKey = e.keyCode == 46 && !caretAtEndNoSelection;

			fancyInput.setCaret(this);
			
			if( selectAll )
				return true;

			if( undo || redo ){
				// give the undo time to actually remove the text from the DOM
				setTimeout( function(){
					fancyInput.fillText(e.target.value, e.target);
				}, 50);
				return true;
			}
			
			// if BACKSPACE or DELETE
			
			if( e.keyCode == 8 || deleteKey ){
				var selectionRange = [this.selectionStart, this.selectionEnd];
				if( charDir.lastDir == 'rtl' ) // BIDI support
					selectionRange = [this.value.length - this.selectionEnd, this.value.length - this.selectionStart + 1];
					
				// on pressing 'delete' while nothing is selected, and caret is not at the end
				if( deleteKey && (this.selectionEnd == this.selectionStart && this.selectionEnd < this.value.length) ){
					selectionRange[0] += 1;
					selectionRange[1] += 1;
					fancyInput.removeChars(textCont, selectionRange);
				}
				else
					setTimeout(function(){ 
						if( e.metaKey || e.ctrlKey ) // when doing CTRL + BACKSPACE, needs to wait until the text was actually removed
							selectionRange = [e.target.selectionStart, selectionRange[0]];
						fancyInput.removeChars(textCont, selectionRange);
					},0);
			}
			
			// make sure to reset the container scrollLeft when caret is the the START or ar the END
			if( this.selectionStart == 0 )
				this.parentNode.scrollLeft = 0;
				
			return true;
		},
		
		allEvents : function(e){
			fancyInput.setCaret(this);
			
			if( e.type == 'paste' ){
				setTimeout(function(){
					fancyInput.fillText(e.target.value, e.target);
					fancyInput.inputResize(e.target);
				},20);
			}
			if( e.type == 'cut' ){
				fancyInput.removeChars(this.nextElementSibling, [this.selectionStart, this.selectionEnd]);
			}
			
			// I use 50 but most numbers under 65 will do i believe
			if( !e.keyCode || e.keyCode < 50 )
				fancyInput.maskPassword(this);
			
			// The caret height should be set. only once after the first character was entered.
			if( !letterHeight ){
				// in case text was pasted, wait for it to actually render
				setTimeout(function(){ fancyInput.setCaretHeight(e.target) }, 150);
			}
			
			if( this.selectionStart == this.value.length )
				this.parentNode.scrollLeft = 999999; // this.parentNode.scrollLeftMax
				
			this.nextElementSibling.className = this.value ? '' : 'empty';
				
		},
		
		setCaret : function(input){
			var caret = $(input.parentNode).find('.caret'),
				allChars =  $(input.nextElementSibling).children().not('b'),
				chars = allChars.not('.deleted'),
				pos = fancyInput.getCaretPosition(input);

				if( charDir.lastDir == 'rtl' ) // BIDI support
					pos = input.value.length - pos;

			var	insertPos = chars.eq(pos);

			if(pos == input.value.length ){
				//if( !chars.length )
				//	caret.prependTo( input.nextElementSibling );
				//else
					caret.appendTo( input.nextElementSibling );
			}
			else
				caret.insertBefore( insertPos );
		},
		
		getCaretPosition : function(input){
			var caretPos, direction = getSelectionDirection.direction || 'right';
			if( input.selectionStart || input.selectionStart == '0' )
				caretPos = direction == 'left' ? input.selectionStart : input.selectionEnd;

			return caretPos || 0;
		}
	},

	getSelectionDirection = {
		direction : null,
		lastOffset : null,
		set : function(e){
			var d;
			if( e.shiftKey && e.keyCode == 37 )
				d = 'left';
			else if( e.shiftKey && e.keyCode == 39 )
				d = 'right';
			if( e.type == 'mousedown' )
				getSelectionDirection.lastOffset = e.clientX;
			else if( e.type == 'mouseup' )
				d = e.clientX < getSelectionDirection.lastOffset ? 'left' : 'right';
				
			getSelectionDirection.direction = d;
		}
	}, 

	charDir = {
		lastDir : null,
		check : function(s){
			var ltrChars        = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
				rtlChars        = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
				ltrDirCheck     = new RegExp('^[^'+rtlChars+']*['+ltrChars+']'),
				rtlDirCheck     = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

			var dir = rtlDirCheck.test(s) ? 'rtl' : (ltrDirCheck.test(s) ? 'ltr' : '');
			if( dir ) this.lastDir = dir;
			return dir;
		}
	}

	function init(inputs){
		var selector = inputs.selector;

		inputs.each(function(){
			var className = 'fancyInput',
				template = $('<div><b class="caret">&#8203;</b></div>');
				
			if( this.tagName == 'TEXTAREA' )
				className += ' textarea';
			// add needed DOM for the plugin to work
			$(this.parentNode).append(template).addClass(className);
	
			// populate the fake field with any text that might have been on real input at the time of initialization
			if( this.value )
				fancyInput.fillText(this.value, this);
			
			if( this.placeholder ){
				template.attr('data-placeholder', this.placeholder);
				if( !this.value )
					template.addClass('empty');
			}
				
		});
		
		// bind all the events to simulate an input type text (yes, alot)
		$(document)
		    .off('.fi', selector)
			.on('input.fi', selector, fancyInput.input)
			.on('keypress.fi', selector, fancyInput.keypress)
			.on('keyup.fi select.fi mouseup.fi cut.fi paste.fi blur.fi', selector, fancyInput.allEvents)
			.on('mousedown.fi mouseup.fi keydown.fi', selector, getSelectionDirection.set)
			.on('keydown.fi', selector , fancyInput.keydown);
	}

	window.fancyInput = fancyInput;
})(window.jQuery);
