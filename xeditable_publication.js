
/**
Publication editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class publication
@extends abstractinput
@final
@example
<a href="#" id="publication" data-type="publication" data-pk="1">awesome</a>
<script>
$(function(){
    $('#publication').editable({
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
    
    var Publication = function (options) {
        this.init('publication', options, Publication.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Publication, $.fn.editabletypes.abstractinput);

    $.extend(Publication.prototype, {
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
				this.$input.filter('[name=title]').val(value.title);
				this.$input.filter('[name=publisher]').val(value.publisher);
				this.setMonthYear('dateMonth', 'dateYear', value.date);
				this.$tpl.find('.input_desc').html(value.desc);
      },       
       
			 /////////////////////////////////////////////////////////////////////////////
			 // get the selected month and year
			 setMonthYear: function(month, year, value){
					var arr = value.split('-'), mval = parseInt(arr[1]), yval = parseInt(arr[0]);
					var jsel1 = this.$tpl.find('[name='+month+']');
					jsel1.find("option[value=" + mval + "]").attr("selected", true);
					var jsel2 = this.$tpl.find('[name='+year+']');
					jsel2.find("option[value=" + yval + "]").attr("selected", true);
			 },

       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
				 return {
					title: 		this.$input.filter('[name=title]').val(), 
					publisher:		this.$input.filter('[name=publisher]').val(),
					date: 		this.getMonthYear('dateMonth', 'dateYear'),
					desc:			this.$tpl.find('.input_desc').html(),
				 };
       },        
       
			 /////////////////////////////////////////////////////////////////////////////
			 // get the selected month and year
			 getMonthYear: function(month, year){
					var
						sel1 = this.$tpl.find('[name='+month+']')[0],
						sel2 = this.$tpl.find('[name='+year+']')[0]
					;
					var str =
						sel2.options[sel2.selectedIndex].value + '-' +
						sel1.options[sel1.selectedIndex].value
					;
					//console.info(str);
					return str;
			 },
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
            //this.$input.filter('[name=title]').focus();
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
						var jdiv = $('<div class="publication_outer">')
									.append($('<div class="publication_title">').html(value.title))
									.append($('<span class="publication_publisher">').html(value.publisher))
									.append($('<div class="publication_date">').html(this.getDateFormat(value.date)))
									.append($('<div class="publication_desc">').html(value.desc))
							;
						//console.info(value.desc);
						$(element).html(jdiv);
        },
				
				////////////////////////////////////////////////
				// from yyyy-mm to mon-yyyy
				////////////////////////////////////////////////
				
				getDateFormat: function(value){
					var arr = value.split('-'), mval = parseInt(arr[1]) - 1, year = arr[0];
					var month = month_arr[mval];
					return month + ' ' + year;
				}
				
    });
		
		
		// edit interface

		
    Publication.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: 
						'<div class="publication_outer">' +
							'<div class="editable-publication">Title*</div><div class="editable-publication"><input type="text" name="title" autocomplete="off"></div>' +
							'<div class="editable-publication">Publisher</div><div class="editable-publication"><input type="text" name="publisher" autocomplete="off"></div>' +
							'<div class="editable-publication">Date</div>' +
							'<select name="dateMonth">' + monthopts + '</select>&nbsp;' +
							'<select name="dateYear">' + yearopts + '</select>' +
							'<div class="editable-publication">Description</div>'+
							'<div class="editable-publication">' +
								'<div contenteditable="true" class="input_desc contenteditable" autocomplete="off" onclick="$(this).focus()"></div>' + 
							'</div>' +
						'</div>'
				,
        inputclass: '',
    });

    $.fn.editabletypes.publication = Publication;

}(window.jQuery));