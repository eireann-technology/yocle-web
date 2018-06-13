/////////////////////////////////////////////////////////////////////////////////////////////////////

function createActivity(){
	console.info('createActivity');
	g_curr_user = 0;
	cmenu();

	// CLEAR ACTIVITY
	clearEditActivity();
	
	// SAVE BEFORE EDIT
	g_saved_activity = getEditActivity();

	// SHOW THE PAGE
	var jdiv = $('#div_activity_edit');
	jdiv.find('.bodyview_title').html('Create Activity');
	changeBodyView(PAGE_EDIT_ACT);
	
	jdiv.find('.btn_panel .btn').hide();
	jdiv.find('.btn_panel').find('.btn_cancel, .btn_clear, .btn_save, .btn_publish').show();	
}

///////////////////////////////////////////////////////////////////////////////////////////

function deleteActivity(act_id){
	console.info('deleting activity','act_id=' + act_id);
	
	confirmDialog('Are you sure you want to delete this activity?', function(){
		call_svrop(
			{
				type: 'delete_activity',
				act_id: act_id,
			},
			function (obj){
				console.info('delete_activity succeeded', 'act_id='+obj.act_id);
				///////////////////////////////////////////////////////////////////////////////////
				// MODIFY LOCAL DATA
				///////////////////////////////////////////////////////////////////////////////////
				// UPDATE ACTIVITY
				removeActivityFromUser(act_id);

				// UPDATE PROFILE PAGE (FOR THIS ACTIVITY)
				updateMyInfoProfile('activity');

				// CLOSE PAGE AND RETURN TO SEARCH
				clearAllInputs();
				changeBodyView(-1);
				openActivityList2();
			},
			function (obj){
				//console.error('saveactivity failed', obj);
			}
		);	
	});
}
