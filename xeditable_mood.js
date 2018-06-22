

/**
Mood editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class mood
@extends abstractinput
@final
@example
<a href="#" id="mood" data-type="mood" data-pk="1">awesome</a>
<script>
$(function(){
    $('#mood').editable({
        url: '/post',
        title: 'Enter city, street and building #',
        value: {
            city: "Moscow", 
            street: "Lenina", 
            building: "15"
        }
    });
});
</script>
**/
(function ($) {
    "use strict";
    
    var Mood = function (options) {
			this.init('mood', options, Mood.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Mood, $.fn.editabletypes.abstractinput);

    $.extend(Mood.prototype, {
        /**
        Renders input from tpl

        @method render() 
        **/        
        render: function() {
          this.$input = this.$tpl.find('input');
        },
        /**
        Gets value from element's html
        
        @method html2value(html) 
        **/        
        html2value: function(html) {        
          return '';  
        },
      
       /**
        Converts value to string. 
        It is used in internal comparing (not for sending to server).
        
        @method value2str(value)  
       **/
       value2str: function(value) {
           var str = '';
           if(value) {
               for(var k in value) {
                   str = str + k + ':' + value[k] + ';';  
               }
           }
           return str;
       }, 
       
       /*
        Converts string to value. Used for reading value from 'data-value' attribute.
        
        @method str2value(str)  
       */
       str2value: function(str) {
           /*
           this is mainly for parsing value defined in data-value attribute. 
           If you will always set value by javascript, no need to overwrite it
           */
           return str;
       },                
       
       /**
        Sets value of input.
        
        @method value2input(value) 
        @param {mixed} value
       **/         
      value2input: function(value) {
				this.$input.filter('[name=mood]').val(value.mood);
      },       
       
       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
					var mood = this.$input.filter('[name=mood]').val();
					return {
						mood: mood,
					};
       },        
       
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
          //this.$input.filter('[name=min]').focus();
					$('#inp_mood').focus();
       },  
       
       /**
        Attaches handler to submit form in case of 'showbuttons=false' mode
        
        @method autosubmit() 
       **/       
       autosubmit: function() {
				 this.$input.keydown(function (e) {
						if (e.which === 13) {
							$(this).closest('form').submit();
						}
				 });
       },
			 
        /**
        Default method to show value in element. Can be overwritten by display option.
        
        @method value2html(value, element) 
        **/
        value2html: function(value, element) {
					//console.info('value2html', value, element);
					if (!value) {
						$(element).empty();
						return; 
					}
				
					var s = value.mood;

					//s += '</span>';

					$(element).text(s);
        },
				
    });
		
		var options = ['Happy', 'Sad', 'Angry', 'Surprised', 'Grateful', 'Excited'];
		var optlist = '';
		for (var index in options){
			optlist += '<option>' + options[index] + '</option>';
		}
		// edit interface
    Mood.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
			tpl:
					'<div class="editable-mood">'
						+ '<table>'
							+ '<tr>'
								+ '<td rowspan="2">Mood:</td>'
								+ '<td>'
									+ '<input id="inp_mood" type="text" name="mood" class="input-small" autocomplete="off" onfocus="this.select()"/>'
								+ '</td>'
								+ '<td>'
									+ '<select id="select_mood" onchange="onChangeMood()">'
										+ optlist
									+ '</select>'
								+ '</td>'
							+ '</tr>'
						+ '</table>'
				+ '</div>'
			,
			inputclass: '',
    });
		
    $.fn.editabletypes.mood = Mood;

}(window.jQuery));

//////////////////////////////////////////////////////////////

function onChangeMood(){
	var jselect = $('#select_mood');
	//var index = jselect[0].selectedIndex;
	var text = jselect.find(':selected').text();
	//alert(text);
	$('#inp_mood').val(text);
}