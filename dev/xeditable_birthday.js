
(function ($) {
    "use strict";

    var Birthday = function (options) {
			this.init('birthday', options, Birthday.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Birthday, $.fn.editabletypes.abstractinput);

    $.extend(Birthday.prototype, {
        /**
        Renders input from tpl

        @method render()
        **/
        render: function() {
          date_populate(
          	"xeditable_birth_date",
          	"xeditable_birth_month",
          	"xeditable_birth_year"
          );    
          this.$input = this.$tpl.find('select');
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

       	return value;
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
		var
			arr = value.split('-'),
			yyyy = arr[0],
			mm = arr[1],
			dd = arr[2]

		//this.$input.filter('[name=dd] option[value=' + dd + ']').prop('selected', true);
		//this.$input.filter('[name=mm] option[value=' + mm + ']').prop('selected', true);
		//this.$input.filter('[name=yyyy] option[value=' + yyyy + ']').prop('selected', true);

		this.$input.filter('[name=dd]').val(dd);
		this.$input.filter('[name=mm]').val(mm);
		this.$input.filter('[name=yyyy]').val(yyyy);
      },

       /**
        Returns value of input.

        @method input2value()
       **/
       input2value: function(){

		var
			dd = this.$input.filter('[name=dd]').val(),
			mm = this.$input.filter('[name=mm]').val(),
			yyyy = this.$input.filter('[name=yyyy]').val()
		;

		var birthday = yyyy + '-' + mm + '-' + dd;
		return birthday;
       },

        /**
        Activates input: sets focus on the first field.

        @method activate()
       **/
       activate: function() {
	      //console.debug(this);
          //$('#xeditable_birth_year')
          //$('#xeditable_birth_month option[value=' + 1 + ']')
          //$('#xeditable_birth_date')
       },

       /**
        Attaches handler to submit form in case of 'showbuttons=false' mode

        @method autosubmit()
       **/
       autosubmit: function() {
				 //this.$input.keydown(function (e) {
				//		if (e.which === 13) {
				//			$(this).closest('form').submit();
				//		}
				// });
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

					var arr = value.split('-');
					var s = arr[2] + ' ' + monthtext[arr[1]-1] + ' ' + arr[0];
					$(element).text(s);

        },

    });


		// edit interface
    Birthday.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
			tpl:
					'<div class="editable-birthday">'
          + '<table style="width:100px;">'
            + '<tr>'
              + '<td>'
                + '<select class="sel_birthday" id="xeditable_birth_date" name="dd"></select>'
              + '</td>'
              + '<td>'
                + '<select class="sel_birthday" id="xeditable_birth_month" name="mm"></select>'
              + '</td>'
              + '<td>'
                + '<select class="sel_birthday" id="xeditable_birth_year" name="yyyy"></select>'
              + '</td>'
            + '</tr>'
          + '</table>'
				+ '</div>'

			,
			inputclass: '',
    });

    $.fn.editabletypes.birthday = Birthday;

}(window.jQuery));
