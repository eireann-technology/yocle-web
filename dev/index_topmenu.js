function initTopmenu(){
	initTypeahead('#inp_topmenu_search', function(type, id){
		switch (type){

			case 'users':
				openUserPage(id);
				break;

			case 'activities':
				viewActivity(id);
				break;
		}
		setTimeout(function(){
			$('#inp_topmenu_search').select();
		}, 100);
	});
}
