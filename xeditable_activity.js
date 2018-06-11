/////////////////////////////////////////////////////////////////////////////////////////////
//
/**
Activity editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class activity
@extends abstractinput
@final
@example
<a href="#" id="activity" data-type="activity" data-pk="1">awesome</a>
<script>
$(function(){
    $('#activity').editable({
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

    var Activity = function (options) {
        this.init('activity', options, Activity.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Activity, $.fn.editabletypes.abstractinput);

    $.extend(Activity.prototype, {
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
				//this.$input.filter('[name=title]').val(value.title);
				//this.$input.filter('[name=position]').val(value.position);
				//this.$input.filter('[name=type]').val(value.type);
				//this.$tpl.find('.activity_type]').text(value.type);
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
					act_id:			this.$tpl.find('.tbl_act').attr('id'),
					title: 			this.$input.filter('[name=title]').val(),
					type:				this.$input.filter('[name=type]').val(),
					organizer: 	this.$input.filter('[name=organizer]').val(),
					start: 			this.getMonthYear('startDateDay', 'startDateMonth', 'startDateYear'),
					end: 				this.getMonthYear('endDateDay', 'endDateMonth', 'endDateYear'),
					desc:				this.$tpl.find('.input_desc').html(),
				 };
       },

			 /////////////////////////////////////////////////////////////////////////////
			 // get the selected month and year
			 getMonthYear: function(day, month, year){
					var
						sel0 = this.$tpl.find('[name='+day+']')[0],
						sel1 = this.$tpl.find('[name='+month+']')[0],
						sel2 = this.$tpl.find('[name='+year+']')[0]
					;
					var str =
						sel2.options[sel2.selectedIndex].value + '-' +
						sel1.options[sel1.selectedIndex].value + '-' +
						sel0.options[sel0.selectedIndex].value
					;
					//console.info(str);
					return str;
			 },
        /**
        Activates input: sets focus on the first field.

        @method activate()
       **/
       activate: function() {
          //this.$input.filter('[name=privacy]').focus();
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
					if (!value){
						$(element).empty();
						return;
					}
					var act_id = value.act_id,
							sharing = value.sharing,
							stoggle = ''
					;
					
					if (value.act_gsscore > 0){
						stoggle = '<div class="toggle_showact toggle-light"></div>'
					}

					var s =
							'<table class="tbl_viewact" act_id="' + act_id + '">'
							+ '<tr>'

								+ '<td valign="top" class="td_showact">'
									+ '<img class="profile_actimg" src="' + getActImgSrc(value.img_id) + '">'
									+ stoggle
								+ '</td>'
								
								+ '<td>'
									+ '<span class="activity_title2" onclick="viewActivity(' + act_id + ')">'
										+	value.title
									+	'</span>'

									+ ' (<span class="activity_type">'
										+	getActType(value)
									+	'</span>)'

									+	' <span class="actpage_period"><b>Period:</b> '
										+	value.act_period
									+ '</span>'

									+ ' <span class="actpage_roles">'
										+ value.act_roles
									+ '</span>'

									+ ' <span class="actpage_status"><b>Status:</b> '
										+ value.act_status
									+ '<span>'

									+ ' <span class="actpage_status">'
										//+ getStarRatingWithScore(value.act_gsscore, 1)
										+ getDivStar(value.act_gsscore, 0, 1)
									+ '<span>'
									
								+ '</td>'
							+ '</tr>'
							+ '</table>'
					;
					$(element)
						.html(s)
						// for toggles
						.find('.toggle_showact').each(function(){
              var
								jobj = $(this),
								act_id = jobj.closest('.tbl_viewact').attr('act_id'),
                opts = jsonclone(g_toggle_showhide_opts),
								act = getActivityByID(g_user.profile.activity, act_id)
							;
              opts.on = (typeof(act.show) == 'undefined' || act.show == 1)
              if (!jobj.find('.toggle-slide').length){
                jobj
                  .toggles(opts)
                  .on('toggle', profileToggleAct)
                ;
              } else {
                debugger;
              }
          });
					
					// UPDATE THE STARS
					var jstars = $(element).find('.star_rating');
					setStarRating(jstars)

					// UPDATE MY SKILLS OF AN ACTIVITY ON PROFILE PAGE
					refreshMyActivitySkills(act_id);

        },

    });


		// edit interface
    Activity.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
    });

    $.fn.editabletypes.activity = Activity;

}(window.jQuery));

//////////////////////////////////////////////////////////////////////////////////////////////

function profileToggleAct(e, active){
	var
		jobj = $(this),
		act_id = parseInt(jobj.closest('.tbl_viewact').attr('act_id')),
		act = getActivityByID(g_user.profile.activity, act_id),
		active = active?1:0
	;
	//alert(act_id + ', ' + active);
	// REPORT TO SERVER
	call_svrop(
		{
			type: 'show_act',
			user_id: g_user.user_id,
			act_id: act_id,
			show: active,
		},
		function (obj){
			act.show = active;
		}
	);
	e.stopPropagation();

}
