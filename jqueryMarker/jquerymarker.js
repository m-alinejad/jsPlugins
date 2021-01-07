/*
 * JqueryMarker v1.0.0
 * By Meghdad Alinejad
 * https://github.com/m-alinejad/JqueryMarker
 */

function JqueryMarker(element, options) {
	var defaults = {
		size: 			'larg',
		marks: null,
        imageurl: null,
        identifier: "id",
		tpl: {
			larg:	'<div class="jquerymarker jquerymarker-larg"></div>',
			medium:	'<div class="jquerymarker jquerymarker-medium"></div>',
			small:	'<div class="jquerymarker jquerymarker-small"></div>',
			mark:	'<div class="mark"></div>',
		},
		coef: {
			larg: 1,
			medium: 0.5,
			small: 0.25
		},
		message: {
			clearconfirm: 'Are you sure?'
		},
		label: {
			cleartext: 		'',
			cleartooltip:	'Clear all marks.'
		}
	};

	this.element 		= element;
	this.input			= $(this.element).hide();
	this.wrapper		= null;
	this.isInit			= false;
	this.isDisabled		= this.input.attr('disabled') === 'disabled';
	this.settings		= $.extend(true, defaults, options, this.input.data());
	
	this.markarea		= $('<div></div>').addClass('markarea');
    this.imageUrl = this.settings.imageurl;
    this.identifier = this.settings.identifier;
	if(this.imageUrl){
		this.markarea.css('background-image', 'url(' + this.imageUrl + ')');
	}
	if (this.settings.marks && this.settings.marks.length){
		this.marks = JSON.parse(this.settings.marks.replace(/'/gm, '"'));  // { [identifier]: guid, x: 20, y: 100 }
    }
    else if (this.input[0].value && (this.input[0].value.length > 10))
    {
        this.marks = JSON.parse(this.input[0].value.replace(/'/gm, '"')); 
    }
	else{
		this.marks = [];
	}
	this.init();
}

JqueryMarker.prototype.init = function(){
	this.creatElements();
}

JqueryMarker.prototype.creatElements = function(){
	this.isInit = true;
	this.input.wrap(this.settings.tpl[this.settings.size]);
	this.wrapper = this.input.parent();
	this.wrapper.attr('id', this.input.attr('id')+'-wrapper');
	this.markarea.insertBefore(this.input);
	
	var jquerymarkerObject = this;
	
	if (this.marks.length){
		$(this.marks).each(function(){
			var coef = jquerymarkerObject.settings.coef[jquerymarkerObject.settings.size];
            jquerymarkerObject.addmark(this[jquerymarkerObject.identifier], this.x*coef, this.y*coef);
		});
	}
	
	if (!this.disabled){
		this.enable();
	}
	
}

JqueryMarker.prototype.clear = function(){
	this.marks = [];
	this.markarea.empty();
	this.input[0].value = '';
}

JqueryMarker.prototype.addmark = function(id, x, y){
		
	var mark = $(this.settings.tpl.mark)
		.attr(this.identifier, id)
	    .appendTo(this.markarea);

	var offsetX = mark.css('width').slice(0,-2)/2;
	var offsetY = mark.css('height').slice(0,-2)/2;

	mark.css('left' , x - offsetX);
	mark.css('top'  , y - offsetY);
	
}

JqueryMarker.prototype.enable = function(){
	function getGuid()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
	}
	var jquerymarkerObject = this;
	
	$('<button type="button" class="btn-clear"></button>')
		.text(this.settings.label.cleartext)
		.attr('title', this.settings.label.cleartooltip)
		.insertAfter(this.markarea)
		.on('click', function(e){
			
			var ans = confirm(jquerymarkerObject.settings.message.clearconfirm);
			if(ans){
				jquerymarkerObject.clear();
				
			}
			e.stopPropagation();
		});
	
	
	
	this.markarea.on('click', '.mark', function(e){
        var markId = $(this).attr(jquerymarkerObject.identifier);
        var index = jquerymarkerObject.marks.map(function (m) { return m[jquerymarkerObject.identifier]; }).indexOf(markId);
		var left = jquerymarkerObject.marks.slice(0, index);
		var right = jquerymarkerObject.marks.slice(index+1);
		jquerymarkerObject.marks = left.concat(right);
		$(this).remove();
		jquerymarkerObject.settings.marks = jquerymarkerObject.marks;
		jquerymarkerObject.input[0].value = JSON.stringify(jquerymarkerObject.marks);
		jquerymarkerObject.input.trigger('change');
		e.stopPropagation();
	})
	.on('mousedown', '.mark', function(e){
		e.stopPropagation();
	});

	this.markarea.on('mousedown', function(event){
		if(event.button !== 0) return;
		var coef = jquerymarkerObject.settings.coef[jquerymarkerObject.settings.size];
		var markId = getGuid();		
		jquerymarkerObject.addmark(markId, event.offsetX, event.offsetY);

        var mark = {};

        mark[jquerymarkerObject.identifier] = markId;
        mark['x'] = event.offsetX / coef;
        mark['y'] = event.offsetY / coef;

        jquerymarkerObject.marks.push(mark);
		
		jquerymarkerObject.settings.marks = jquerymarkerObject.marks;
		jquerymarkerObject.input[0].value = JSON.stringify(jquerymarkerObject.marks);
		jquerymarkerObject.input.trigger('change');
	});
	
}

JqueryMarker.prototype.disable = function(){
	this.markarea
		.off('click', '.mark')
		.off('mousedown', '.mark');

	this.markarea.off('mousedown');
}

JqueryMarker.prototype.isJqueryMarker = function(){
	return this.isInit;
}

$.fn['jquerymarker'] = function(options) {
    this.each(function() {
        if (!$.data(this, 'jquerymarker')) {
            $.data(this, 'jquerymarker', new JqueryMarker(this, options));
        }
    });

    return this;
};
