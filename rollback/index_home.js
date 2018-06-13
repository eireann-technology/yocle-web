var	title_arr = {
	// 0: display name
	activity: 		['Activities'],
	objectives: 	['Objectives'], //['Personal Statement and Objectives'],
	education: 		['Education'],
	work: 				['Work Experience'],
	publication: 	['Publications'],
	award: 				['Awards'],
	language:			['Languages'],
	interest: 		['Interests'],
	media:				['Photos and Videos'],
};
	
/////////////////////////////////////////////////////////////////////////////////////

var g_init_home = 0;

function initHome(){
	g_init_home = 1;
	
	//updateUser();
	//updateHome();
	
	// tooltip
	if (g_platform == 'web'){
		// http://www.w3schools.com/bootstrap/bootstrap_ref_js_tooltip.asp
		$('[title]').each(function(){
			$(this).tooltip();
		});		
	}
	// sharing:0,1,2
	$('.switch_share input[type=radio]').change(function(){
		var sharing = $(this).val();
		var act_id = $(this).parents('.switch_share').attr('act_id');	// in numberic
		console.info('act_id=' + act_id, 'sharing=' + sharing);
		
		// REPORT TO SERVER (ADD DELAY TO CHANGE BUTTON COLOR FIRST)
		setTimeout(function(){
			call_svrop(
				{					
					type: 'activity_sharing',
					//email: g_user.email,
					user_id: g_user_id,
					act_id: act_id,
					sharing: sharing,
				},
				function (obj){
					console.info(obj);
				},
				function (obj){
					console.error(obj);
				}
			)
		}, 10);
	});
}

///////////////////////////////////////////////////////////////////////

function openHome2(){
	console.info('openHome');
	g_curr_user = 0;
	
	updateHome();
		
	changeBodyView(TAB_HOME);
	openHome3();
}

///////////////////////////////////////////////////////////////////////

function openHome3(){
	
	$('#div_topmenu').show();

	$('#inp_topmenu_search').val('');	
	
	var skills = getSkillsWithBreakdown_user(g_user);
	drawSkillCanvas('cvs_skills_home', skills, 1);

}

/////////////////////////////////////////////////////////////////////////////////////////////

function updateMyInfo(){
/*	
	$('.myinfo_username').html(g_user.username);
	$('.myinfo_objectives').html(g_user.objectives);
	$('.myinfo_position').html(g_user.position);
	$('.myinfo_location').html(g_user.location);
		
	$('.editable[data-name=position]').attr('show_trash', 0).attr('data-value', g_user.position);
	$('.editable[data-name=location]').attr('show_trash', 0).attr('data-value', g_user.location);
*/	

	['username', 'objectives', 'position', 'location', 'mood', 'relationship'].forEach(function(name){
		var value = g_user[name];
		if (!value) value = '';
		console.info('*updateMyInfo', name+'='+value);
		$('.myinfo_' + name).html(value);
		if (!value) value = '';
		$('.editable[data-name=' + name + ']').attr('data-value', value).attr('show_trash', 0);
		if (value){
			$('.editable[data-name=' + name + ']').editable('setValue', value);
		} else {
			$('.editable[data-name=' + name + ']').editable('setValue', '');
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////

function hideTemporarily(){
	// HIDE NETWORK TEMPORARILY
	$('.stat_network1, .stat_network2, .stat_network3').closest('table').closest('tr').hide();
	$('#tbl_todolist').parent().hide();
	//$('a[href="#tab_peers"]').parent().hide();
	//$('#topmenu_msg, #topmenu_notice, #topmenu_todolist, #topmenu_settings, #topmenu_lang').hide();
}

///////////////////////////////////////////////////////////////////////

function updateHome(){
	
	// SET LOGIN MYINFO (APP)
	var jsonstr = "{\"status\":\"2\",\"uri\":\"" + getImgUrl(g_user.img_id, 'user') + "\",\"name\":\"" + g_user.username + "\"}"; 
	changeprofile(jsonstr);	
	
	// SET LOGIN MYINFO (WEB)
	updateMyInfo();
	updateImgPhoto($('.myinfo_photo'), g_user.img_id, 'user');
	
	// SHOW MY SKILLS OF ALL THE ACTIVITY ON HOME PAGE
	refreshMySkills();

	// MY USER STAT
	updateMyUserStat();
}
///////////////////////////////////////////////////////////////////////

function updateProfile(){
	// PROFILE BLOCK
	updateProfileBlock();
}