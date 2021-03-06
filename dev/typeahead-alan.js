//////////////////////////////////////////////////////////////////////////////
// typeahead
// https://twitter.github.io/typeahead.js/
// http://stackoverflow.com/questions/19387022/twitter-typeahead-js-not-updating-input
// https://github.com/bassjobsen/Bootstrap-3-Typeahead
//////////////////////////////////////////////////////////////////////////////
var tt_url = 'svrop.php?type=find_field&q=%QUERY'
var image_url = 'svrop.php?type=dl_img&img_id=';

//////////////////////////////////////////////////////////////////////////////////////////////////////

function getTTValue(jinput){
	var
		//jinput = $(selector);
		tokenfield = jinput.attr('tokenfield'),
		output = 0
	;
	if (tokenfield != 1){
		output = jinput.attr('ttval');
	} else {
		output = [];
		jinput.parent().find('div.token').each(function(){
			var ttval = $(this).attr('ttval');
			if (ttval){
				// add ttval
				output.push(ttval);
			} else {
				// add email
				output.push($(this).find('span.token-label').text());
			}
		});
	}
	return output;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function initTypeahead(selector, onChange){
	$(selector).focus(function(){
		$(this).select();
	});

	// Instantiate the Bloodhound suggestion engine
	var blood = new Bloodhound({
		datumTokenizer: function (datum){
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: tt_url + '&collection=users_activities',
			filter: function (items){
				console.log('filter', items.results.length, items, $(this));
				return $.map(items.results, function (item){
					{
						var obj = 0;
						switch (item.type){
							case 'users':
								obj = {
									type:						item.type,
									id:							item.id,
									value: 					item.username,// + ' ' + item.email,
									img_url:				getUserImgSrc(item.img_id),
								};
								break;

							case 'activities':
								obj = {
									type:						item.type,
									id:							item.id,
									value: 					item.title,
									img_url:				getUserImgSrc(item.img_id),
								};
								break;

						}
						return obj;

					}
				});
			}
		}
//*/
	});
	// Initialize the Bloodhound suggestion engine
	blood.initialize();

	$(selector)
		.typeahead(
			{
				hint: false,
				highlight: true,
				minLength: 1,
			},
			{
				displayKey: 'value',
				source: blood.ttAdapter(),
				templates: {
					suggestion: Handlebars.compile(
						'<table class="typeahead_res" border="0">'+
							'<tr>'+
								'<td rowspan="2">'+
									'<img src="{{img_url}}"/>'+
								'</td>'+
								'<td>{{value}}</td></tr>'+
						'</table>'
					),
					footer: 		Handlebars.compile('<span class="typeahead_footer">Searched for "{{query}}"</span>')
				}
			}
		)
	$(selector)
		.on('typeahead:selected typeahead:autocompleted', function(ev, suggestion, name) {
			//console.log('Selection1', suggestion, $(this));
			$(this).attr('ttval', suggestion.id);
			onChange && onChange(suggestion.type, suggestion.id);
		})
	;

}

//////////////////////////////////////////////////////////////////////////
// http://sliptree.github.io/bootstrap-tokenfield/
// http://stackoverflow.com/questions/23780501/bootstrap-tokenfield-with-typeahead-bloodhound-exclude-tokens
// http://stackoverflow.com/questions/28689175/how-to-prevent-duplicate-with-bootstrap-tokenfield-when-using-jquery-ui-autocomp

function initTypeahead_tokenfield_users(selector){
	selector += ' .my_tokenfield[tt_type=users]';

	if (!$(selector).length){
		console.error('initTypeahead_tokenfield_users', selector);
	}

	// Instantiate the Bloodhound suggestion engine
	var blood = new Bloodhound({
		datumTokenizer: function (datum){
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: tt_url + '&collection=users',
			filter: function (items){
				//console.info('filter', items, $(this));
				var tagged_users = $(selector).tokenfield('getTokens');
				//console.info('users', tagged_users);
				return $.map(items.results, function (item){
					var exists = false;
					for (var i = 0; i < tagged_users.length; i++) {
						if (item.user_id == tagged_users[i].value) {
							exists = true;
							break;
						}
					}
					if (!exists) {
						return {
							value: 								item.username,
							email: 								item.email,
							user_id:							item.id,
							img_url:							getUserImgSrc(item.img_id),
						};
					}
				});
			}
		}
	});

	// Initialize the Bloodhound suggestion engine
	blood.initialize();

	// Instantiate the Typeahead UI
	$(selector)
		.attr('tokenfield', 1)
		.tokenfield({
			typeahead: [
				{
					hint: false,
					highlight: true,
					minLength: 1,
				},
				{
					displayKey: 'value',
					source: blood.ttAdapter(),
					templates: {
						suggestion: Handlebars.compile(
							'<table class="typeahead_res">' +
							'<tr>' +
								'<td rowspan="2"><img src="{{img_url}}"/></td>' +
								'<td>{{value}}</td>' +
							'</tr>' +
							'<tr><td>{{email}}</td></tr></table>'
						),
						footer: 		Handlebars.compile('<span class="typeahead_footer">Searched for "{{query}}"</span>')
					}
				}
			]
		})
		.on('tokenfield:createtoken', function (e) {
			var item = e.attrs,
					value = item.value,
					bRepeated = 0
			;
			var existingTokens = $(this).tokenfield('getTokens');
			if (existingTokens.length) {
				$.each(existingTokens, function(index, token) {
					if (token.value === value){
						console.error('repeated', value);
						e.preventDefault();
						bRepeated = 1;
					}
				});
			}
		})
	var token_input = $(selector).parent().find('.token-input');
	if (!token_input){
		console.error('***users', $(selector))
	} else {
		token_input
			.on('typeahead:selected typeahead:autocompleted', function(ev, suggestion, name) {
				// put user_id to the token div
				$(this).parent().parent().find('div.token:last').attr('ttval', suggestion.user_id);
				//console.log('Selection', suggestion.user_id, getTokens(selector));
			})
		//var	btn_add = $(selector).parent().parent().parent().find('.but_additem');
		var	btn_add = $(selector).closest('.div_select_typeahead').find('.but_additem');
		postTypeaheadToken(btn_add);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function initTypeahead_tokenfield_skills(selector, jspan_num){
	selector += ' .my_tokenfield[tt_type=skills]';
	if (!$(selector).length){
		console.error('initTypeahead_tokenfield_skills', selector);
	} else {
		//console.info('initTypeahead_tokenfield_skills', $(selector).length);
	}
	// Instantiate the Bloodhound suggestion engine
	var blood = new Bloodhound({
		limit: 9999,
		datumTokenizer: function (datum){
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: tt_url + '&collection=skills',
			filter: function (items){
				//console.info('filter', items, $(this));
				var tokens = $(selector).tokenfield('getTokens');
				//console.info('users', tagged_users);
				return $.map(items.results, function (item){
					var exists = 0;
					for (var i = 0; i < tokens.length; i++) {
						if (item.value == tokens[i].value) {
							exists = 1;
							break;
						}
					}
					if (!exists) {
						//console.info(item);
						return { value:	item};
					}
				});
			}
		}
	});

	// Initialize the Bloodhound suggestion engine
	blood.initialize();

	// Instantiate the Typeahead UI
	$(selector)
		.attr('tokenfield', 1)
		.tokenfield({
			typeahead: [
				{
					hint: false,
					highlight: true,
					minLength: 1,
				},
				{
					displayKey: 'value',
					source: blood.ttAdapter(),
					templates: {
						suggestion: Handlebars.compile('<span class="typeahead_res">{{value}}</span>'),
						//footer: 		Handlebars.compile('<span class="typeahead_footer">Searched for "{{query}}"</span>')
					}
				}
			]
		})
		.on('tokenfield:createtoken', function (e) {
			var item = e.attrs,
					value = item.value,
					exists = 0
			;
			var existingTokens = $(this).tokenfield('getTokens');
			if (existingTokens.length) {
				$.each(existingTokens, function(index, token) {
					if (token.value === value){
						console.error('repeated', value);
						e.preventDefault();
						exists = 1;
					}
				});
			}
		})
	var token_input = $(selector).parent().find('.token-input');
	if (!token_input){
		console.error('***skills', $(selector))
	} else {
		token_input
			.on('typeahead:selected typeahead:autocompleted', function(ev, suggestion, name) {
				// put user_id to the token div
				$(this).parent().parent().find('div.token:last').attr('ttval', suggestion.value);
			})
		;
		//var	btn_add = $(selector).parent().parent().parent().parent().find('.but_additem');
		var	btn_add = $(selector).closest('.div_select_typeahead').find('.but_additem');
		postTypeaheadToken(btn_add);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function postTypeaheadToken(btn_add){
	var token_input = btn_add.closest('.div_select_typeahead').find('div.tokenfield span.twitter-typeahead input.token-input');
	/////////////////////////////////////////////////
	// TYPEAHEAD AND DATATABLE (GENERAL)
	/////////////////////////////////////////////////
	btn_add.click(function(){
		token_input
			.focus()	// else do nothing in bootstrap-tokenfield
			.trigger(jQuery.Event('keydown', {keyCode: 13, which: 13}))
			.trigger(jQuery.Event('keypress', {keyCode: 13, which: 13}))
		;
	});
	token_input.keypress(function(e){
		//console.info('keypress', e.which);
		if (e.which == 13){
			var jinput = $(this).closest('table').find('input[tokenfield=1]');
			//console.info(jinput);
			var type = jinput.attr('tt_type');
			var token = jinput.tokenfield('getTokens');
			if (token.length){
				switch (type){
					case 'users': 		addUsers(jinput); break;
					case 'skills':		addSkills(jinput); break;
				}
				jinput.tokenfield('setTokens', '');
			}
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setTokenfieldWidth(jtoken, nRetry){
	var
		jobj = jtoken.next().next().find('.token-input');
		jparent = jobj.parent().parent(),
		w = jparent.outerWidth()
	;
	//if (jparent.is(':visible'))
	{
		if (!jtoken.length){
			console.error('setTokenfieldWidth missing jtoken');
			//debugger;
		} else {
			//console.info('setTokenfieldWidth', jtoken, w);
			if (w < 150 && nRetry && nRetry-- > 0){
				setTimeout(function(){
					setTokenfieldWidth(jtoken, nRetry);
				}, 100);
			} else {
				jobj.width(w - 60);
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearTokenfield(jtoken, bSetWidth){
	jtoken.tokenfield('setTokens', '');
	if (bSetWidth)
	{
		setTokenfieldWidth(jtoken, 3)
	}
}

//////////////////////////////////////////////////

var g_import_jdiv = 0;

function import_users(obj){
	g_import_jdiv = $(obj).closest('.div_select_typeahead');
	var url = getMediaFolder() + '../import';
	g_lightbox = $.featherlight({
		iframe: url,
		iframeMaxWidth: '100%',
		iframeWidth: '100%',
		iframeHeight: '90%',
		iframeScrolling: "yes",
	});
}

//////////////////////////////////////////////////

function onselect_importusers(user_ids){
	console.log(user_ids);

	var jtokenfield = g_import_jdiv.find('.tokenfield.form-control');
	jtokenfield.find('.token').each(function(){
		var jtoken = $(this);
		var user_id = jtoken.attr('ttval');
		if (!isNaN(user_id)){
			user_id = parseInt(user_id);
			//remove_element_from_array(user_ids, user_id);
			for (var i = user_ids.length - 1; i >= 0; i--){
				var user = user_ids[i];
				if (user.user_id == user_id){
					user_ids.splice(i, 1);
				}
			}
		}
	})
	call_svrop(
		{
			type: 'check_users',
			users: user_ids,
		},
		function (obj){
			var users = obj.users;
			for (var i = 0; i < users.length; i++){
				var user = users[i];
				var s = '<div class="token" ttval="' + user.user_id + '">'
								+ '<span class="token-label" style="max-width: 600px;">'
								 + user.username
								 + '</span>'
								 + '<a href="#" class="close" tabindex="-1" onclick="closeToken(this)">x</a>'
								 + '</div>'
				;
				var jtoken = jtokenfield.find('.token:last');
				if (!jtoken.length){
					jtoken = jtokenfield.find('input.my_tokenfield');
				}
				$(s).insertAfter(jtoken);
			}
		}
	);
}

//////////////////////////////////////////////

function closeToken(obj){
	$(obj).closest('.token').remove();
	var e = window.event;
	if (e){
		e.stopPropagation();
		e.preventDefault();
	}
}
