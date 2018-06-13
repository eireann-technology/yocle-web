var debug_svrop = 0;

function call_svrop(inputs, onSuccess, onError){
	var async = !onSuccess ? false : true;	// default(with func)=true = multi-tasking
	var data = {
		room: myroom,
	}
	$.extend(data, inputs);
	
	//data = JSON.stringify(data);
	
	if (debug_svrop){
		console.debug('call_svrop1', data, async);
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
				console.debug('call_svrop2', obj);
			}
			output = obj;
			if (obj && !obj.error){
				//console.debug(obj);
				onSuccess && onSuccess(obj);
			} else {
				console.error(inputs.type + ' error', obj, obj.responseText);
				onError && onError(obj);
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.error(inputs.type + ' error', jqXHR, textStatus, errorThrown, jqXHR.responseText);
			onError && onError(textStatus);
		},
	});
	return output;
}