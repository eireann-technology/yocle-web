
(function ($) {
    "use strict";

    var Password = function (options) {
			this.init('password', options, Password.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Password, $.fn.editabletypes.abstractinput);

    $.extend(Password.prototype, {
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
			//this.$input.filter('[name=password]').val(value.password);
      },

       /**
        Returns value of input.

        @method input2value()
       **/
       input2value: function() {
			var curr_pwd = this.$input.filter('[name=curr_pwd]').val();
			var new_pwd = this.$input.filter('[name=new_pwd]').val();
			var conf_pwd = this.$input.filter('[name=conf_pwd]').val();
       		var out_pwd = g_user.pwd;
       		var error = 0;
       		if (curr_pwd == '' || new_pwd == '' || conf_pwd == ''){
       			error = 'Password must not empty.';       			
       		} else if (curr_pwd != g_user.pwd){
       			error = 'Current password does not match.';
       		} else if (new_pwd != conf_pwd){
       			error = 'The new passwords do not match.';       			
       		}
			if (error){
				//showErrDialog('Error', error);
				alert(error);
			} else {
				g_user.pwd =
				out_pwd = new_pwd;
			}

			return out_pwd;
       },

        /**
        Activates input: sets focus on the first field.

        @method activate()
       **/
       activate: function() {
			if (g_platform == 'web'){
				this.$input.filter('[name=curr_pwd]').focus();
			}
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
          	var s = '<button class="btn btn-primary">Change password</button>';
			$(element).html(s);
        },

    });
		// edit interface
    Password.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
			tpl:
			'<div class="editable-password">'
			+ '<table>'
              + '<tr><td><input placeholder="Current password" type="password" name="curr_pwd" class="input-small" autocomplete="off" onfocus="this.select()"/></td></tr>'
			  + '<tr><td><input placeholder="New password" type="password" name="new_pwd" class="input-small" autocomplete="off" onfocus="this.select()"/></td></tr>'
			  + '<tr><td><input placeholder="Confirm password" type="password" name="conf_pwd" class="input-small" autocomplete="off" onfocus="this.select()"/></td></tr>'
			+ '</table>'
			+ '</div>'
			//+ '<input type="hidden" name="old_pwd"/>'
			,
			inputclass: '',
    });

    $.fn.editabletypes.password = Password;

}(window.jQuery));
