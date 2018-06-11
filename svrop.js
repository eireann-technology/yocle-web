var debug_svrop = 0;

var g_server_time = 0;

function call_svrop(inputs, onSuccess, onError){
	var async = !onSuccess ? false : true;	// default(with func)=true = multi-tasking
	var data = {
		//room: myroom,
	}
	$.extend(data, inputs);

	//data = JSON.stringify(data);

	if (debug_svrop){
		console.info('call_svrop1', data, async);
	}
	var output = 0;
	$.ajax({
		type: 'POST',
		url: 'svrop.php',
		async: async,
		dataType: 'json',
		data: data,
		success: function (obj){
			if (debug_svrop){
				console.info('call_svrop2', obj);
			}
			if (obj && obj.error){
				console.error(inputs.type + ' error', obj, obj?obj.error:'');
			}
			g_server_time = obj.server_time;
			onSuccess && onSuccess(obj);
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.error(inputs, jqXHR, textStatus, errorThrown, jqXHR.responseText);
			closeProgress2();
			var s = '<div style="color:red">Error</div>';
			if (textStatus) s += textStatus;
			if (jqXHR.responseText) s += jqXHR.responseText;
			errorDialog(s);
			onError && onError(textStatus);
		},
	});
	return output;
}
