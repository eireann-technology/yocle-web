function initTopmenu(){
	initTypeahead('#inp_topmenu_search', function(user_id){
		openUserPage(user_id);
		setTimeout(function(){
			$('#inp_topmenu_search').select();
		}, 100);
	});
}