var g_saved_activity = 0, g_curr_participants = 0, g_curr_impression_assessors = 0, g_curr_part_id = 0;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function initViewActivity(){
	var	jdiv = $('#div_activity_view');
	
	//jdiv.find('.btn_publish').click(function(){
	//	var act_id = parseInt(jdiv.attr('act_id'));
	//	publishActivity(act_id);
	//});
	
	jdiv.find('.btn_edit').click(function(){
		var act_id = parseInt(jdiv.attr('act_id'));
		editActivity(act_id);
	});

	jdiv.find('.btn_delete').click(function(){
		var act_id = parseInt(jdiv.attr('act_id'));
		deleteActivity(act_id);
	});
	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActivity(act_id){
	if (window.event){
		window.event.stopPropagation();
	}	
	console.info('viewActivity', act_id);
	// GET USER ACTIVITY
	var uact = getUact(act_id);
	if (!uact){
		// usually come from act page
		console.error('no uact in console');
		openHome();
		showErrDialog('Error', 'You are not participated in this activity.');
		return;
	}	
	if (uact.published == 0){
		
		// not published yet
		//var	jdiv = $('#div_activity_view');
		//jdiv.attr('act_id', act_id).show();
		//$('#div_activity_edit, #div_skill_breakdown').hide();
		//changeBodyView(PAGE_VIEW_ACT);
		$('#tab_activity, #div_activity_view').show();	// for better testing
		editActivity(act_id);
		
	} else {
	
		openProgress2('Loading...');
		// load user page
		call_svrop(
			{
				type: 'get_activity',
				act_id: act_id,
			},
			function (obj){
				console.info('succeeded', obj);
				closeProgress2();
				
				if (!obj.activity){
					// may be deleted
					console.error('return no activity', 'act_id='+act_id);
					openHome();
					showErrDialog('Error', 'This activity does not exist.');
					
					return;
				}
				// show the page
				var	jdiv = $('#div_activity_view');
				jdiv.attr('act_id', act_id).show();
				$('#div_activity_edit, #div_skill_breakdown').hide();
				changeBodyView(PAGE_VIEW_ACT);
				$('#tab_activity, #div_activity_view').show();	// for better testing
				var
					activity = obj.activity,
					selector = '#div_activity_view',
					jdiv = $(selector),
					coord_id = activity.coordinator_id,
					iamcoordinator = coord_id == g_user_id
				;
				
				// SET GLOBAL VARIABLE
				g_saved_activity = activity;

				console.info('viewActivity act_id=' + act_id);	//, 'roles='+sRoles, 'published='+activity.published);
				
				// TOPMENU SEARCH
				$('#inp_topmenu_search').val('');

				// ID
				jdiv.attr('act_id', act_id);
				
				// PHOTO
				jdiv.find('.actpage_photo')
					.css('visibility', 'hidden')
					.load(function(){
						$(this).css('visibility', 'visible')
					})
					.attr('src', getActImgSrc(activity.img_id))
				;
				
				// TITLE
				jdiv.find('.actpage_title').html('<b>Title:</b> ' +activity.title + ' (' + activity.act_type + ')');
				
				// PERIOD
				jdiv.find('.actpage_period').html('<b>Period:</b> ' + getUniformPeriod(activity.start, activity.end, 1));
				
				// COORDINATOR
				jdiv.find('.actpage_coordinator').html(
					'<b>Coordinator:</b> <span class="username" onclick="openUserPage(' + activity.coordinator_id + ')">'
						+	activity.coordinator_username
						+ '</span>'
				);
				
				// ROLE(S)
				var sRoles = getUactRoles(uact);
				jdiv.find('.actpage_roles').html(sRoles);
							
				// ACTIVITY STATUS
				//var act_status = getActStatus(uact, 0, 1);
				var act_status = getActStatus(activity, 0, 1);
				jdiv.find('.actpage_status').html('<b>Status:</b> ' + act_status.desc);
							
				// DESC
				jdiv.find('.actpage_desc').html('<b>Description:</b> ' + activity.desc);
				// http://stackoverflow.com/questions/25187774/how-to-implement-read-more-and-read-less-with-dotdotdot
/*				
				jdiv.find('.actpage_desc').height(100).dotdotdot({
					after: "a.more",	// not working yet
					callback: function(isTruncated, originalContent){
						if (!isTruncated) {
							$("a", this).remove();   
						}					
					}});
				jdiv.find('.actpage_desc a.more').on('click', 'a', function() {
					if ($(this).text() == "More"){
						var div = $(this).closest('div.ellipsis-text');
						div.trigger('destroy').find('a.more').hide();
						div.css('max-height', '');
						$("a.less", div).show();
					}	else {
						$(this).hide();
						$(this).closest('div.ellipsis-text').css("max-height", "50px").dotdotdot({
							after: "a.more",
							callback: function(isTruncated, originalContent){
								if (!isTruncated) {
									$("a", this).remove();   
								}}
						});
					}				
				});
*/				
				//////////////////////////////////////////////////////
				// PARTICIPANTS
				//////////////////////////////////////////////////////
				var jtbl = $(selector + ' .my_datatable[dt_type=actpage_participants]');
				if (activity.participants){
					
					actpage_addUsers(activity.participants, jtbl, 0, function(users){
					
						// STORE FULL PARTICIPANT INFO
						g_curr_participants = users;
						
						// SET PANELIST'S PEER ASSESSMENT
						if (activity.impression && activity.impression.enabled){
							$('#tr_actpage_impression').show();
							
							var bEditable = uact.uact_participant == 1 && act_status.status == ACTSTATUS_OPENING;
							if (g_curr_participants && g_curr_participants.length){
								
								// add what may be missing
								if (!uact.impression){
									uact.impression = {};
								}
								if (!uact.impression.panelists){
									uact.impression.panelists = {};
								}
								if (!uact.impression.panelists.peer_assessors){
									uact.impression.panelists.peer_assessors = [];
								}
								
								// HIDE PEER ASSESSMENT
								if (uact.impression.panelists.peers > 0){
									$('#tr_actpage_impression_peer_assessment').show();
									setPeerAssessment2(jdiv.find('.div_peer_assessment'), activity.impression.panelists, uact.impression.panelists, bEditable, act_id, 0);
								} else {
									$('#tr_actpage_impression_peer_assessment').hide();
								}
								
								// HIDE PRIMARY ASSESSORS
								var primary_assessors = getPrimaryAssessors(activity.coordinator_id, g_user_id, activity.impression.panelists, 0);
								if (primary_assessors.length){
									$('#tr_actpage_impression_primary_assessors').show();
								} else {
									$('#tr_actpage_impression_primary_assessors').hide();
								}
								
								// EXPAND/COLLAPSE ASSESSOR
								var jbut_expand = $('#tr_actpage_impression_primary_assessors .but_expand');
								var jdiv_expand = $('#div_actpage_impression_assessors');
								setExpandable(jbut_expand, jdiv_expand);
								
								// EXPAND/COLLAPSE PARTICIPANT
								var jbut_expand = $('[name=anchor_actview_participants] .but_expand');
								var jdiv_expand = $('#div_actpage_participant');
								setExpandable(jbut_expand, jdiv_expand);
								
							}
						} else {
							$('#tr_actpage_impression').hide();
						}
					});
				} else {
					jtbl.hide();
				}
				
				jdiv.find('.but_message').click(function(){
					openMessenger_act(activity);
				});
				
				
				//////////////////////////////////////////////////////
				// GET CURRENT PEER ASSESSEES
				//////////////////////////////////////////////////////				
				call_svrop(
					{
						type: 'get_peerassessee',
						act_id: act_id,
						user_id: g_user_id,
					},
					function (obj){
						console.info('succeeded', obj);
						
						var peer_assessees = {
							impression:  [],
							assessments: []
						};
						if (obj.error != ''){
							console.error('error get_peerassessee' + obj.error);
						} else {
							peer_assessees = obj.results;
						}
						
						// weight title
						var weight_imp = activity.impression.weight, weight_ass = activity.assessment.weight
						if (isNaN(weight_imp) || isNaN(weight_ass) || (parseInt(weight_imp) + parseInt(weight_ass) != 100)){
							weight_imp = weight_ass = 50;
						}							
						
						title_imp = 'Skills Rating and Comments (Based on Peer Impression, ' + weight_imp + '%)';
						title_ass = 'Assessment (' + weight_ass + '%)';
						
						$('#view_act_title_imp').text(title_imp);
						$('#view_act_title_ass').text(title_ass);

						//////////////////////////////////////////////////////
						// ASSESSMENTS
						//////////////////////////////////////////////////////				
						viewActAsst_all(activity, uact, peer_assessees.assessments);
						
						//////////////////////////////////////////////////////
						// IMPRESSION
						//////////////////////////////////////////////////////
						viewActImpr_all(activity, uact, peer_assessees.impression);
						
						// BUTTONS
						var show_edit = iamcoordinator;// && activity.published == 0;
						jdiv.find('.btn_edit').css('display', show_edit?'inline':'none');
						//jdiv.find('.btn_save').css('display', activity.published == 1?'none':'inline');
						jdiv.find('.btn_publish').css('display', show_edit?'inline':'none');
						var show_delete = iamcoordinator;
						jdiv.find('.btn_delete').css('display', show_delete?'inline':'none');
						
						// OTHER ENHANCEMENTS
						if (g_platform != 'ios' && g_platform != 'android'){
							jdiv.find('[data-toggle=tooltip]').tooltip(); 	// render bootstrap tooltip
						}
						////////////////////////
						// MEDIA UPLOAD
						////////////////////////
						var bEditable = 0;//iamcoordinator;	// leave to edit activity
						// INIT UPLOADER
						var juploadbut = jdiv.find('.uploader');
						if (bEditable){
							juploadbut.parent().show();
						} else {
							juploadbut.parent().hide();
							juploadbut = 0;
						}
						// initUploader(jbutton, jgallery, data_type, ids, onUpdate2, parentClass, bEditable)
						var jgallery = jdiv.find('.uploader_gallery');
						initUploader(juploadbut, jgallery, 'activity', {act_id: act_id},
							function(media_arr, media_id_arr){
								console.info('onUpdate', media_id_arr);
								g_saved_activity.media = media_id_arr;
							},
							0,
							bEditable
						);
						
						// DELETE BUTTON
						if (iamcoordinator){
							//jdiv.find('.btn_delete').css('display', 'table-cell');
							jdiv.find('.btn_panel').show();
						} else {
							jdiv.find('.btn_panel').hide();
						}
					},
					function (obj){
						console.error('failed', obj);
					}
				);	
			},
			
			function (obj){
				console.error('failed', obj);
			}
		);
	}
}

////////////////////////////////////////////////////////////////////////////

function getDtOrderComment(value){
	var len = value.toString().length;
	var s = value + '';
	for (var i = len; i < 11; i++){
		s = '0' + s;
	}
	return '<!--'+s+'-->';
}

///////////////////////////////////////////////////////////////
// timestage value can be sorted by importance (the smaller the more important)
///////////////////////////////////////////////////////////////
var
	TIMESTAGE_PENDING = 1,
	TIMESTAGE_OPENING = 2,
	TIMESTAGE_CLOSED = 3
;
function getTimeStage(start, end){
	var
		stage = 0,
		value = 0,
		desc = '',
		datetime = getDateTimeString()
	;
	if (datetime >= start && datetime <= end){
		
		////////////////////////////////////////////////////
		// TIMESTAGE 1: OPENED (WITHIN)
		////////////////////////////////////////////////////
		var diff = getDateTimeDiff(end, new Date());
		//console.info(start, end, diff);
		desc += diff.desc + ' to close';
		value = diff.value;
		stage = TIMESTAGE_OPENING;

	} else if (datetime < start){

		////////////////////////////////////////////////////
		// TIMESTAGE 2: PENDING (BEFORE)
		////////////////////////////////////////////////////
		var diff = getDateTimeDiff(start, new Date());
		desc += diff.desc + ' to open';
		value = 1000000000 + diff.value; // add 1000 years
		stage = TIMESTAGE_PENDING;

	} else {

		////////////////////////////////////////////////////
		// TIMESTAGE 3: CLOSED (AFTER)
		////////////////////////////////////////////////////
		desc += 'Closed';
		var diff = getDateTimeDiff(new Date(), end);
		value = 2000000000 + diff.value; // add 2000 years
		stage = TIMESTAGE_CLOSED;
	}
	desc += '';
	
	return {
		value: value,
		desc: desc,
		stage: stage,
	};
}

//////////////////////////////////////////////////////////////////

var sAbout = '~';
function getDateTimeDiff(a, b){
	var t1 = moment(a);
	var t2 = moment(b);
	var d = moment.duration(t1.diff(t2)), tmp = 0, value = parseInt(d.asMinutes()), desc = '';
	if ((tmp = parseInt(d.asYears())) > 0){
		desc = sAbout + tmp + ' year' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asMonths())) > 0){
		desc = sAbout + tmp + ' month' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asWeeks())) > 0){
		desc = sAbout + tmp + ' week' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asDays())) > 0){
		desc = sAbout + tmp + ' day' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asHours())) > 0){
		desc = sAbout + tmp + ' hour' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asMinutes())) > 0){
		desc = sAbout + tmp + ' miniute' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asSeconds())) > 0){
		desc = sAbout + tmp + ' second' + (tmp > 1 ? 's' : '');
	}
	if (!value || desc == ''){
		console.error('error in getDateTimeDiff', a, b);
	}
	return {
		value: value,
		desc: desc,
	};
}

///////////////////////////////////////////////////////////////
var
	ACTSTATUS_UNPUBLISHED = 0,
	ACTSTATUS_PENDING = 1,
	ACTSTATUS_OPENING = 2,
	ACTSTATUS_CLOSED = 3
;	
function getActStatus(activity, bAddDtOrderComment, bDetails){
	var
		status = 0;
		desc = ''
	;
	if (activity.published == 0){
		status = ACTSTATUS_UNPUBLISHED;
		if (bAddDtOrderComment){
			desc = getDtOrderComment(0);
		}
		desc += 'Unpublished';
	} else {
		var timestage = getTimeStage(activity.start, activity.end);
		if (bAddDtOrderComment){
			desc = getDtOrderComment(timestage.value);
		}
		switch (timestage.stage){
			case TIMESTAGE_OPENING:
				status = ACTSTATUS_OPENING;
				if (bDetails){
					desc += 'Opening (' + timestage.desc + ')';
				} else {
					desc += timestage.desc;
				}
				break;
			case TIMESTAGE_PENDING:
				status = ACTSTATUS_PENDING;
				if (bDetails){
					desc += 'Pending (' + timestage.desc + ')';
				} else {
					desc += timestage.desc;
				}
				break;
			case TIMESTAGE_CLOSED:
				status = ACTSTATUS_CLOSED;
				if (bDetails){
					desc += 'Closed';
				} else {
					desc += timestage.desc;
				}
				break;
		}
	}
	return {
		status: status, 
		desc: desc,
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////
// https://datatables.net/forums/discussion/16317/sorting-a-checkbox-column
/////////////////////////////////////////////////////////////////////////////////////////////

function actpage_addUsers(users, jtbl, selected, onSuccess){
	console.info('actpage_addusers', users);
	
	if (!jtbl.hasClass('dataTable')){
		jtbl.addClass('actpage_users');
		jtbl.DataTable({
			//ordering: true,	// otherwise, the list is difficult to trace
			//rowReorder: true,
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				//{	targets: [ 0 ],	orderable: false,	visible: false, },
				//{	targets: [ 1 ],	orderable: true, },
				//{	targets: [ 2 ],	orderable: true, type:'string'},
			],
		});
	}
	var dt = jtbl.show().DataTable().clear().draw();

	if (!users.length){
		onSuccess && onSuccess([]);
	} else {
		// check with server
		call_svrop(
			{
				type: 'check_users',
				users: users,
			},
			function (obj){
				var users2 = obj.users;
				if (users2){
					for (var i = 0; i < users2.length; i++){
						var user = users2[i],
							user_id = user.user_id ? user.user_id : 0,
							imgusername = getImgUserName(user, users2),
							last_col = 0
						;
						if (!selected){
							last_col = user.status ? user.status : ''
						} else if (selected[user_id]){
							last_col = '<input type="checkbox" class="editor-active" checked>'
						} else {
							last_col = '<input type="checkbox" class="editor-active">'
						}
						var arr = [
	//							user_id,
	//							i + 1,
								imgusername,
								//user.email ? user.email : '',
								//getUserPosition(user),
								last_col,
								user_id,
							];
						//console.info(arr);
						dt.row.add(arr);
					}
					dt.draw();
					if (g_platform != 'ios' && g_platform != 'android'){
						jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
					}
				}

				// onsuccess
				onSuccess && onSuccess(users2);
			}
		)
	}
}

/////////////////////////////////////////////////////////////////////////

function closeViewActivity(){
	//alert('closeViewActivity');
	console.info('closeViewActivity');
	slideUpParticipantList();
	changeBodyView(-1);
}