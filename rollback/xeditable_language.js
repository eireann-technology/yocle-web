var prof_arr = {
	native: 'Native',
	fluent: 'Fluent',
	intermediate: 'Intermediate',
	basic: 'Basic',
};
var proficiencyopts = ''; //<option value="native">Native</option><option value="fluent">Fluent</option><option value="intermedia">Intermediate</option><option value="basic">Basic</option>';

for (var key in prof_arr){
	var value = prof_arr[key];
	proficiencyopts += '<option value="' + key + '">' + value + '</option>';
}
/**
Language editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class language
@extends abstractinput
@final
@example
<a href="#" id="language" data-type="language" data-pk="1">awesome</a>
<script>
$(function(){
    $('#language').editable({
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
    
    var Language = function (options) {
      this.init('language', options, Language.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Language, $.fn.editabletypes.abstractinput);

    $.extend(Language.prototype, {
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
          return null;  
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
				if (!value) {
					return;
				}
				//console.info(value);
				this.$input.filter('[name=language]').val(value.language);
				this.setProficiency('spoken', value.spoken);
				this.setProficiency('written', value.written);
				this.$tpl.find('.input_desc').html(value.remarks);
      },
			 setProficiency: function(name, val){
					var jsel1 = this.$tpl.find('[name=' + name + ']');
					//jsel1.find("option:contains(" + val + ")").attr("selected", true);
					jsel1.find("option[value=" + val + "]").attr("selected", true);
			 },
       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
				 return {
					language: 	this.$input.filter('[name=language]').val(), 
					spoken: 		this.getProficiencyValue('spoken'), 
					written:		this.getProficiencyValue('written'),
					remarks: 		this.$tpl.find('.input_desc').html(),
				 };
       },
			 
			 ////////////////////////////////////////////////////////////////////
			 
			 getProficiencyValue: function(name){
					var sel2 = this.$tpl.find('[name=' + name + ']')[0],
							str =	sel2.options[sel2.selectedIndex].value;
					return str;
			 },
			 
			 ////////////////////////////////////////////////////////////////////
			 
			//getProficiencyText: function(name){
			//	var sel2 = this.$tpl.find('[name=' + name + ']')[0],
			//			str =	sel2.options[sel2.selectedIndex].value;
			//		return str;
			//},
			 
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
          //this.$input.filter('[name=language]').focus();
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
						//var jparent = $(element).parent();
/*						
						// HEADER
						var bAddHeader = jparent.children().length == 1;
						if (bAddHeader)
						{
							var jtbl = 
										$('<table class="language_outer">')
											.append(
												$('<tr>')
													.append($('<td class="span_language_header">').html('Language'))
													.append($('<td class="span_language_header">').html('Spoken'))
													.append($('<td class="span_language_header">').html('Written'))
													.append($('<td class="span_language_header">').html('Remarks'))
											)
							;
							$(element).parent().prepend(jtbl);
						}
*/						
						// BODY
/*						
						var jtbl = 
									$('<table class="language_outer" border="0">')
									.append($('<tr>')
										.append($('<td class="span_language language_language">').html(value.language))
										.append($('<td class="span_language language_spoken">').html(prof_arr[value.spoken]))
										.append($('<td class="span_language language_written">').html(prof_arr[value.written]))
										.append($('<td class="span_language language_remarks">').html(value.remarks))
									)
						;
						$(element).html(jtbl);
						//jparent.append(jtbl);
*/

/*
						var s = '<span class="span_language"><span class="language_language">' + value.language + '</span>' +
							'<br/>&nbsp;&nbsp;&nbsp;<span class="language_spoken">Spoken: ' + prof_arr[value.spoken] + '</span> ' +
							'<br/>&nbsp;&nbsp;&nbsp;<span class="language_written">Written: ' + prof_arr[value.written] + '</span> ';
						if (value.remarks){
							s += '<br/>&nbsp;&nbsp;&nbsp;<span class="language_remarks">Remarks: ' + value.remarks + '</span>';
						}
						s += '</span>';
						$(element).html(s);
*/						
						var s = '<span class="span_language"><span class="language_language">' + value.language + '</span>' +
							'<br/><span class="language_spoken">Spoken: ' + prof_arr[value.spoken] + '</span> ' +
							'<br/><span class="language_written">Written: ' + prof_arr[value.written] + '</span> ';
						if (value.remarks){
							s += '<br/><span class="language_remarks">Remarks: ' + value.remarks + '</span>';
						}
						s += '</span>';
						$(element).html(s);
        },
    });
		
		
		// edit interface

		
    Language.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: 
						'<div class="language_outer">' +
							'<div class="editable-language">Language*</div><div class="editable-language"><input type="text" name="language" autocomplete="off"></div>' +
							'<div class="editable-language">Proficiency of speaking and listening</div><div class="editable-language">' +
								'<select name="spoken">' + proficiencyopts + '</select>' +
							'</div>' +
							'<div class="editable-language">Proficiency of reading and writing</div><div class="editable-language">' +
								'<select name="written">' + proficiencyopts + '</select>' +
							'</div>' +
							'<div class="editable-language">Remarks</div><div class="editable-language"><div contenteditable="true" class="input_desc contenteditable" autocomplete="off" onclick="$(this).focus()"></div>' + 
						'</div>',
        inputclass: '',
    });

    $.fn.editabletypes.language = Language;

}(window.jQuery));