var 
	 schoolopts = ''
	,degreeopts = '<option value="" selected>-</option><option value="High School">High School</option><option value="Associate’s Degree">Associate’s Degree</option><option value="Bachelor’s Degree">Bachelor’s Degree</option><option value="Master’s Degree">Master’s Degree</option><option value="Juris Doctor (J.D.)">Juris Doctor (J.D.)</option><option value="Doctor of Medicine (M.D.)">Doctor of Medicine (M.D.)</option><option value="Doctor of Philosophy (Ph.D.)">Doctor of Philosophy (Ph.D.)</option><option value="Engineer’s Degree">Engineer’s Degree</option><option value="other">Other</option>'
;

// <option value="Master of Business Administration (M.B.A.)">Master of Business Administration (M.B.A.)</option>

/**
Education editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class education
@extends abstractinput
@final
@example
<a href="#" id="education" data-type="education" data-pk="1">awesome</a>
<script>
$(function(){
    $('#education').editable({
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
    
    var Education = function (options) {
      this.init('education', options, Education.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Education, $.fn.editabletypes.abstractinput);

    $.extend(Education.prototype, {
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
				this.$input.filter('[name=school]').val(value.school);
				this.$input.filter('[name=field]').val(value.field);

				this.setDegree(value.degree);

				// startDateYear
				this.setYear('startDateYear', value.start);
			

				// endDateYear
				var til_now = this.$tpl.find('[name=til_now]')[0];
				if (value.end == sPresent){
					til_now.checked = 1;
					this.$tpl.find('.div_end_date').hide();
					this.$tpl.find('.div_present').show();
				} else {
					til_now.checked = 0;
					this.$tpl.find('.div_end_date').show();
					this.$tpl.find('.div_present').hide();
					this.setYear('endDateYear', value.end);
				}
				// desc
				this.$tpl.find('.input_desc').html(value.desc);
      },       
       
			 /////////////////////////////////////////////////////////////////////////////
			 // get the selected month and year
			 setYear: function(year, yval){
				var jsel2 = this.$tpl.find('[name='+year+']');
				jsel2.find("option[value=" + yval + "]").attr("selected", true);
			 },
			 setDegree: function(val){
					var jsel1 = this.$tpl.find('[name=degree]');
					if (val == ''){
						jsel1[0].selectedIndex = 0;
					} else {
						var joption = jsel1.find("option:contains(" + val + ")");
						if (joption.length){
							joption.attr("selected", true);
							this.$tpl.find('[name=inp_degree_other]').hide();
						} else if (val == 'other'){
							jsel1.find("option[value=other]").attr("selected", true);
							this.$tpl.find('[name=inp_degree_other]').val(val).show();
						}
					}
			 },

       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
				 return {
					school: 	this.$input.filter('[name=school]').val(), 
					degree:		this.getDegree(1),
					field: 		this.$input.filter('[name=field]').val(), 
					//location:	 this.$input.filter('[name=location]').val(),
					start: 			this.getYear('startDateYear'),
					end: 			this.$tpl.find('[name=til_now]').prop('checked')?sPresent:this.getYear('endDateYear'),
					desc:			this.$tpl.find('.input_desc').html(),
				 };
       },        
       
			 /////////////////////////////////////////////////////////////////////////////
			 // get the selected month and year
			 getYear: function(year){
					var
						sel2 = this.$tpl.find('[name='+year+']')[0],
						str =	sel2.options[sel2.selectedIndex].value;
					return str;
			 },
			 getDegree: function(bCheckOther){
					var
						sel2 = this.$tpl.find('[name=degree]')[0],
						str =	sel2.options[sel2.selectedIndex].value;
					if (str == 'other' && bCheckOther){
						str = this.$tpl.find('[name=inp_degree_other]').val();
					}
					return str;
			 },
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
					var self = this;
					this.$tpl.find('[name=degree]').change(function(event){
						//console.info(this);
						if (self.getDegree(0) == 'other'){
							self.$tpl.find('[name=inp_degree_other]').show();
						} else {
							self.$tpl.find('[name=inp_degree_other]').hide();
						}
					});
          //this.$input.filter('[name=school]').focus();
          //scroll2Element(this.$tpl);
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
						var jdiv = $('<div class="education_outer">')
								.append($('<div class="education_school">').html(value.school))
								.append($('<span class="education_degree">').html(value.degree))
									
						if (value.field){
						
							jdiv
								.append(getComma(value.school, value.degree))
								.append($('<span class="education_field">').html(value.field))
							;
						}
						jdiv
							.append(
								$('<div class="education_period">')
									.append($('<span>').html(value.start))
									.append(' - ')
									.append($('<span>').html(value.end))
							)
							.append(
								$('<div class="education_desc">')
									.append($('<span>').html(value.desc))
							);
						//console.info(value.desc);
						$(element).html(jdiv);
        },
				
				////////////////////////////////////////////////
				// from yyyy-mm to mon-yyyy
				////////////////////////////////////////////////
/*				
				getDateFormat: function(value){
					if (value == sPresent){
						return sPresent;
					} else {
						var arr = value.split('-'), mval = parseInt(arr[1]) - 1, year = arr[0];
						var month = month_arr[mval];
						return month + ' ' + year;
					}
				}
*/				
    });
		
		
		// edit interface
		
    Education.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: 
						'<div class="education_outer">' +
						
							'<div class="editable-education">School*</div>' +
							'<div class="editable-education"><input type="text" name="school" autocomplete="off"></div>' +
							
							'<div class="editable-education">Degree</div>' +
							'<div>' +
								'<select name="degree" type="singleselect">' + degreeopts + '</select>' +
							'</div>' +
							
							'<div class="editable-education div_degree_other">' +
								'<input type="text" name="inp_degree_other" autocomplete="off"/>' +
							'</div>' +
							
							'<div class="editable-education">Field of study</div>' +
							'<div class="editable-education"><input type="text" name="field" autocomplete="off"></div>' +
							
							'<div class="editable-education">Time Period*</div>' +
							'<div class="editable-education">' +
								'<table class="tbl_timeperiod"><tr>' +
									'<td>' +
										'<div class="div_start_date">' +
											//'<select name="startDateMonth">' + monthopts + '</select>&nbsp;' +
											'<select name="startDateYear">' + yearopts + '</select>' +
										'</div>' +
									'</td>' +
									'<td style="padding: 4px; font-size: 16px;">-</td>' +
									'<td>' +
										'<div class="div_end_date">' +
											//'<select name="endDateMonth">' + monthopts + '</select>&nbsp;' +
											'<select name="endDateYear">' + yearopts + '</select>' +
										'</div>' +
										'<div class="div_present" style="padding:6px 0px 6px 0px; display:none">' + sPresent + '</div>' +
									'</td>' +
								'</tr></table>' +
							'</div>' +
							
							'<div>'	+
								'<input style="width:200px" type="checkbox" name="til_now" data-labelauty="I don\'t study here now.|I study here currently."/>' +
							'</div>' +
							'<div class="editable-education">Description</div><div class="editable-education"><div contenteditable="true" class="input_desc contenteditable" autocomplete="off"  onclick="$(this).focus()"></div>' + 
						'</div>',
        inputclass: '',
    });

    $.fn.editabletypes.education = Education;

}(window.jQuery));

/*
	$('#country').editable({
		source: countries,
		select2: {
			width: 200,
			placeholder: 'Select country',
			allowClear: true
		}
	});
*/