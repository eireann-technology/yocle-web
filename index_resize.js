function checkOnResize(){
	//console.info('checkOnResize');

	// check platform
	checkPlatform();

	// gototop
	$('.gototop').css({'margin-right': g_nScreenW > 1000 ? (g_nScreenW - 1000) / 2 : 0});

	// align the bar
	$('.div_login_topmenu, .div_topmenu, .div_basemenu, .div_blog_searchbar').each(function(){
		var w = $(this).width();
		if (!$(this).hasClass('div_login_topmenu') && $(this).hasClass('div_blog_searchbar')){
			w += 20;
		}
		$(this).css({
			left: g_nScreenW > w ? (g_nScreenW - w) / 2 : 0,
		});
	});

	//$('#tbl_message_comm_input');
	var jobj = $('#tbl_message_comm_input');
	if (g_nScreenW > 1000){
		var w = jobj.width();
		jobj.css({left: (g_nScreenW - w) / 2});
	} else {
		jobj.css({left: 0});
	}

	// whatsup add
	$('.div_whatsup_top').css({
		right:  g_nScreenW > 1000 ? (g_nScreenW - 1000) / 2 : 0,
	})
	var w2 = g_nScreenW - 120;
	if (w2 > 1000){
		w2 = 1000;
	}
	if (w2 < 500){
		w2 = 500;
	}

	if (g_curr_user){

		// FOR PROFILE REVIEW
		var skills = getSkillsWithBreakdown_user(g_curr_user);
		drawSkillCanvas('cvs_skills_userpage', skills, 0);
		setTimeout(function(){
			resizeUserPage();
		}, 1000);

	} else {

		switch (g_curr_page){

			case TAB_HOME:
				var skills = getSkillsWithBreakdown_user(g_user);
				drawSkillCanvas('cvs_skills_home', skills, 0);
				break;

			case TAB_PROFILE:
				var skills = getSkillsWithBreakdown_user(g_user);
				drawSkillCanvas('cvs_skills_profile', skills, 0);
				break;

			case PAGE_VIEW_ACT:
				drawSkillCanvas('cvs_skills_act', g_uact_skills, 0);
				break;

			case TAB_SCHEDULE:
				refreshSchedule();
				break;

			case PAGE_MESSENGER_COMM:
				resizeMessenger();
				break;

			case PAGE_EDIT_ACT:
				break;
		}
	}

	// resize transdiv
	transdiv_resize();
	$('.iframe_pdf').each(function(){
		//resizeLightBox($(this), g_nScreenW, g_nScreenH);
	});
}

//////////////////////////////////////////////////////////////////////////////////

function resizeMessenger(){
	//var h = g_nScreenH - $('#tbl_message_comm_input').outerHeight() - $('.div_basemenu').height();
	//$('#div_messenger_comm .msg_output_container').height(h);
	//$('#div_messenger_comm').height(h);
	//console.log('resizeMessenger', h);
}
