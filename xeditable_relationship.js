

/**
Relationship editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class relationship
@extends abstractinput
@final
@example
<a href="#" id="relationship" data-type="relationship" data-pk="1">awesome</a>
<script>
$(function(){
    $('#relationship').editable({
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
    
    var Relationship = function (options) {
			this.init('relationship', options, Relationship.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Relationship, $.fn.editabletypes.abstractinput);

    $.extend(Relationship.prototype, {
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
          /*
            you may write parsing method to get value by element's html
            e.g. "Moscow, st. Lenina, bld. 15" => {city: "Moscow", street: "Lenina", building: "15"}
            but for complex structures it's not recommended.
            Better set value directly via javascript, e.g. 
            editable({
                value: {
                    city: "Moscow", 
                    street: "Lenina", 
                    building: "15"
                }
            });
          */ 
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
				if (!value){
					return;
				}
				//console.info(value);
				if (isNaN(value.min)) value.min = '';
				if (isNaN(value.max)) value.max = '';
				this.$input.filter('[name=min]').val(value.min);
				this.$input.filter('[name=max]').val(value.max);
      },       
       
       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
					var min = this.$input.filter('[name=min]').val(),
						max = this.$input.filter('[name=max]').val()
					;
					if (isNaN(min) || !min){
						min = '';
					} else {
						min = parseInt(min);
					}
					if (isNaN(max) || !max){
						max = '';
					} else {
						max = parseInt(max);
					}					
					return {
						min: min,
						max: max,
					};
       },        
       
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
          //this.$input.filter('[name=min]').focus();
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
/*					
					var s = '<span>';// class="relationship_output">';
					if (value.min == '' && value.max == ''){
						s += '';
					} else if (value.min == ''){
						s += 'Max. ' + value.max;
					} else if (value.max == ''){
						s += 'Min. ' + value.min;
					} else {
						s += value.min + ' - ' + value.max
						;
					}
					s += '</span>';
					//console.info(s);
*/					
					var s = '';// class="relationship_output">';
					if (value.min == '' && value.max == ''){
						//s = '';
					} else if (value.min == ''){
						s = 'Max. ' + value.max;
					} else if (value.max == ''){
						s = 'Min. ' + value.min;
					} else {
						s = value.min + ' - ' + value.max;
					}
					//s += '</span>';

					$(element).text(s);
        },
				
    });
		
		
		// edit interface
    Relationship.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
			tpl:
					'<div class="editable-relationship">'
						+ '<table>'
							+ '<tr>'
								+ '<td>Minimum:</td>'
								+ '<td><input type="text" name="min" class="input-small" autocomplete="off" onfocus="this.select()"/></td>'
							+ '</tr>'
							+ '<tr>'
								+ '<td>Maximum:</td>'
								+ '<td><input type="text" name="max" class="input-small" autocomplete="off" onfocus="this.select()"/></td>'
							+ '</tr>'
						+ '</table>'
				+ '</div>'
			,
			inputclass: '',
    });
		
    $.fn.editabletypes.relationship = Relationship;

}(window.jQuery));