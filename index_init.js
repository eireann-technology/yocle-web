
var g_recordAll = 0, g_playbackAll = 0,
		mydisplaygrp = 0, myedit = 0, myvideomode = 0,
		myinit = 0,
		g_basic_url = '',
		g_jspeakers
;

/////////////////////////////////////////////////////////////////////////////////////////////

function getRtcOptions(room, user, pwd){
	var rtcOptions = {
		// the id/element dom element that will hold "our" video
		//localVideoEl: 'localVideo',
		localVideoEl: '',
		// the id/element dom element that will hold remote videos
		remoteVideosEl: '',
		// immediately ask for camera access
		autoRequestMedia: true,
		debug: false,
		detectSpeakingEvents: true,
		autoAdjustMic: false,
	}

	// signaling server
	var url = 'https://'+location.hostname+':7501';
	if (url){
		rtcOptions.url = url;
	}
	var videoinput = getCookie('videoinput');
	var audioinput = getCookie('audioinput');
	var w = 0, h = 0;
	var size = getCookie('videosize');
	if (size && size.split('x').length){
		w = size.split('x')[0];
		h = size.split('x')[1];
	}
	rtcOptions.media = gumrtc.getConstraints(videoinput, audioinput, w, h);
	console.info('constraints', rtcOptions.media);

	// PeerConnectionConfig
	//console.info('rtcOptions', rtcOptions);
	//var pcc = getPeerConnectionConfig(room, user, pwd);
	//if (pcc){
		//rtcOptions.peerConnectionConfig = pcc; // comment for TURN REST API by alantypoon 20151122
	//}
	if (user){
		rtcOptions.nick = user;
	}
	return rtcOptions;
}

///////////////////////////////////////////////////////////////////////////
// ONLOAD
////////////////////////////////////////////////////////////////////////////
var webrtc = 0;

function checkDomain(){
	return 1; // testing

	var bSuccess = 0;
	if (window.location.href.indexOf("https://videoboard.hk") >= 0){
		bSuccess = 1;
	} else {
		document.location.replace("about:blank");
	}
	return bSuccess;
}

////////////////////////////////////////////////////////////////////

function select_tab(tab, tbl){

	showFrontPanel(0);

	$('#tbl_tabs td')
		.removeClass('selected');

	$('#tbl_tabs td path')
		.attr('fill', '#d0d0d0');

	$(tab)
		.attr('class', 'selected')
	;

	$(tab)
		.find('path')
		.attr('fill', 'white')
	;
	var id = $('#' + tbl).attr('id');
	$('.tbl_tab').each(function(){
		if (id == this.id){
			$(this).show();
		} else {
			$(this).hide();
		}
	});
}

///////////////////////////////////////////////////////////////////////////////////////////

function getRandomDigits(n){
	var m = Math.floor(Math.random() * Math.pow(10, n));
	var len = n - m.toString().length;
	for (var i = 0; i < len; i++){
		m = '0' + m;
	}
	return m + '';
}

////////////////////////////////////////////////////////////////////////////

function initMain(callback){
	console.info('initMain');

	// hide panel
	$('#inp_mypwd').prop("type", "text");	// avoid restoring password
	$('#div_front').hide();

	// stop panel
	gumrtc.stop();
	$('#video_gum, #video_gum_canvas').remove();

	// read from cookie
	mydisplaygrp = '';
	myedit = parseInt(getCookie('myedit', 0));
	g_display_mode = parseInt(getCookie('g_display_mode', 0));
	myvideomode = getCookie('myvideomode', 'equal');

	if (!g_playback_filename){
		initWebRtc(callback);
	}

	if (!myinit){
		
		disableIosDblClkZoom();

		// INIT EACH COMPONENTS
		initFTP();

		// whiteboard
		initWhiteboard();
		initWhiteboard_text();
		initWhiteboard_image();
		initWhiteboard_preload();
		initWhiteboard_zoom();
		initWhbInsert();	// requires FTP
		initText3();

		initDialog();
		initMessage();
		initChat();
		initFullscreen();		// aft whb
		initScreenShare();	// aft whb && webrtc
		initKeyboard();
		initCamera();
		initMouse();				// after chat
		initMinimap();
		initTopMenu();
		initProgress();
		initHammer();
		initCursor();
		initRmt();

		// toolbar
		initToolbar();

		window.addEventListener("beforeunload", function(e){
			goLogOut(LOGOUT_BFRULD);
			//var confirmationMessage = "\o/";
			//	e.returnValue = confirmationMessage;     // Gecko and Trident
			//	return confirmationMessage;              // Gecko and WebKit
		});

		myinit = 1;
	}

	// set my tool
	//setMyTool(mytool);	// 'tool_pen

	initConfig();

	/////////////////////////////////////////////
	// START LIST
	/////////////////////////////////////////////
	startWhiteboard();

	if (!bHasTouchScreen){
		initTooltip();
	}

	if (g_playback_filename){
		// case 1: playback a file
		if (!g_playbackAll){
			g_playbackAll = new PlaybackAll();
		}
		g_playbackAll.play(g_playback_filename, callback);

	} else {

		// case 2: start login session
		g_recordAll = new RecordAll();
	}

}


/////////////////////////////////////////////////////////////////////////////////////

function initWebRtc(callback){

	console.info('initWebRtc');

	// GETRTCOPTIONS
	var rtcOptions = getRtcOptions(g_my_room_id, mynick, mypwd);

	// CREATE OUR WEBRTC CONNECTION
	webrtc = new SimpleWebRTC(rtcOptions);

	// when it's ready, join if we got a room from the URL
	webrtc.on('readyToCall', function () {
		//console.info('***readyToCall');

		// you can name it anything
		if (g_my_room_id){
			var bHasVideo = true, bHasAudio = true;
			webrtc.joinRoom(g_my_room_id, mynick, bHasVideo, bHasAudio);
			//sendScreenSize();
			callback && callback();
		}
	});

	webrtc.on('channelMessage', function (peer, label, data) {
		if (data.type == 'volume') {
			showVolume(peer.id, data.volume);
		}
	});

	// CAMERAS
	webrtc.on('cameraAdded', function(peer){
		onCameraAdded(peer, peer.stream, function(video){
			var sw = video.videoWidth, sh = video.videoHeight;
			if (sw  > 0 && sh > 0){
				var nick = video.getAttribute('nick');
				if (!nick) nick = '';
				video.title = nick + " " + sw + "x" + sh;
				video.setAttribute("videoWidth", sw);	video.setAttribute("videoHeight", sh);	// add for jquery reference
				//video.muted = true;	// remote mic should not be muted
				//video.play();

				init_video(video);
				show_video(video);
				play_video(video);

				console.trace("***remoteCameraLoaded: " + nick + ' ' + sw + "x" + sh);
				calcLayout('onRemoteCameraAdded');
			}
		});
	});

	////////////////////////////////////////////////////////////////////////

	webrtc.on('cameraRemoved', function(peer) {
		onCameraRemoved(peer.id);
	});

	////////////////////////////////////////////////////////////////////////

	webrtc.on('volumeChange', function (volume, treshold) {
		//console.info('own volume', volume);
		showVolume(g_my_client_id, volume);
	});

	////////////////////////////////////////////////////////////////////////

	webrtc.on('remoteVolumeChange', function (peer, volume) {
		//console.info('volume', peer.id, volume);
		showVolume(peer.id, volume);
	});

}

/////////////////////////////////////////////////////////////////////////////////

function createImage(source) {
   var pastedImage = new Image();
   pastedImage.onload = function() {
		// You now have the image!
		console.info(pastedImage.src);
   }
   pastedImage.src = source;
}

////////////////////////////////////////////////////////////////////////////

function downloadTimelineList(onComplete){
	console.info('downloadTimelineList');

	function getOptionTxt(file){
		// e.g. 20151227161229-26
		var output = '';
		var arr = file.split('-');
		if (arr.length == 2){
			var dt = arr[0];
			dt = dt.substring(0,4) + '-' + dt.substring(4,6) + '-' + dt.substring(6,8) + ' ' + dt.substring(8, 10) + ':' + dt.substring(10, 12);
			var seconds = arr[1];
			output = dt + ' (' + seconds + 's)';
		}
		return output;
	}
	var jselect = $('#select_playback');
	var jparent = jselect.parent().parent();
	// clear select
	jselect.find('option').remove();//.end();

	call_svrop({
		type: 'dl_timelinelist',
		time: new Date().getTime(),
		pwd: mypwd,
	},

	function(obj){
/*
		// success
		var file_arr = obj.file_arr;
		jparent.css('visibility', file_arr.length ? 'visible' : 'hidden');
		var options = 0;
		file_arr.forEach(function(file){
			var text = getOptionTxt(file);
			if (text){
				jselect.append('<option value="'+file+'">'+text+'</option>');
				options++;
			}
		});
		if (myselectedindex == -1 && options > 0){
			myselectedindex = 0;
		}
		//console.info(myselectedindex);
		// set by cookie
		if (myselectedindex < options){
			$('#select_playback')[0].selectedIndex = myselectedindex;
		}
*/
		// for testing
		onComplete && onComplete(obj.file_arr);
	}, function(obj){
		// failed
		jparent.css('visibility', 'hidden');
	});
}



//////////////////////////////////////////////////////////////////

//function setFinalZoom(){
	//g_final_zoom = g_screenratio * g_whb_zoom;
	//g_final_zoom = g_whb_zoom;
//	console.info('final_zoom', g_screenratio, g_whb_zoom, g_final_zoom);
//}
//////////////////////////////////////////////////////////////////////////

function playAllBlankVideo(onAllPlayed){
	//console.info('playAllBlankVideo...1');
	var total = $('.blank_video').length;
	var nplayed = 0;
	$('.blank_video').each(function(){
		if (!this.paused){
			nplayed++;
		} else if ($(this).attr('isplayed') != 1){
			this.play();
			$(this).attr('isplayed', 1);
		}
	});
	console.info('playAllBlankVideo', 'played='+nplayed+'/'+total);
	if (nplayed >= total){
		$('.blank_video').each(function(){
			$(this).removeProp('loop');
		});
		onAllPlayed();
	} else {
		setTimeout(function(){
			playAllBlankVideo(onAllPlayed);
		}, 1000);
	}
}

////////////////////////////////////////////////////////////////////////////

function onStartPlay(){
	console.info('onStartPlay');

	//enable_chroma = $('.toggle_chroma').data('toggles').active ? 1 : 0;
	//setCookie('enable_chroma', enable_chroma);


	// playback now!
	g_playback_filename = $('#select_playback').val();

	// get current value
	g_my_room_id = $('#inp_my_room_id').val().trim();
	mynick = $('#inp_mynick').val().trim();
	myremember =  $('.toggle_remember').data('toggles').active ? 1 : 0;
	myselectedindex = $('#select_playback')[0].selectedIndex;

	setCookie('myremember', myremember);
	if (!myremember){
		mypwd = '';
	} else {
		mypwd = $('#inp_mypwd').val();
	}
	// set cookie
	setCookie('my_room_id', g_my_room_id);
	setCookie('mynick', mynick);
	setCookie('mypwd', mypwd);
	etCookie('myselectedindex', myselectedindex)

	console.info('setcookie', g_my_room_id, mynick, mypwd, myselectedindex);

	// PREPARE TO RELOAD
	initMain();
}


////////////////////////////////////////////////////////////////////////////

var g_my_room_id = "", mynick = "", mypwd = "", myremember = 0, myselectedindex = 0;
var gumrtc = 0;
var g_playback_filename = '';
var g_questionmark = 0;
var g_production = 0;
var golive = 0;

function initAll(bProduction){

	// init jquery
	initJquery();

	$("#loaded_body").fadeIn('', function(){
		$('#loading_body').hide();
	});


	g_production = bProduction?1:0;
	getHardwareSpec();

	console.info('initAll', g_production, g_platform, g_nScreenW, g_nScreenH);

	if (checkDomain()){

		// gumrtc
		gumrtc = new GumRTC();

		myremember 		= getCookie('myremember') == 1 ? 1 : 0;
		if (myremember){
			//golive			 	= gumrtc.getCookie('golive');
			g_my_room_id	= getCookie('my_room_id');
			mynick 				= getCookie('mynick');
			mypwd 				= getCookie('mypwd');

		}

		// find room from the url
		checkUrlForRoom();

		// find title
		document.title = 'videoboard' + (g_my_room_id?'('+g_my_room_id+')':'');

		// REMEMBER ME?
		// https://github.com/simontabor/jquery-toggles
		$('.toggle_remember, .toggle_chroma, .toggle_author').toggles({
			drag: true, // allow dragging the toggle between positions
			click: true, // allow clicking on the toggle
			text: {
				on: 'Yes', // text for the ON position
				off: 'No' // and off
			},
			on: false, // is the toggle ON on init
			animate: 150, // animation time (ms)
			easing: 'swing', // animation transition easing function
			checkbox: null, // the checkbox to toggle (for use in forms)
			clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
			width: 120, // width used if not set in css
			height: 30, // height if not set in css
			//type: 'select',
			type: 'compact', // if this is set to 'select' then the select style toggle will be used
		});

		$('.toggle_chroma').on('toggle', function(e, active) {
			if (!active){
				gumrtc.cancelChroma();
				for (var key in g_gumrtc_arr){
					g_gumrtc_arr[key].cancelChroma();
				}
			}
		});

		// REMEMBER
		$('#inp_my_room_id').val(g_my_room_id);
		$('#inp_mynick').val(mynick);
		$('#inp_mypwd').prop("type", "password").val(mypwd); 	// avoid saved password in browser
		$('.toggle_remember').toggles(myremember ? true : false);

		//////////////////////////////////////////////////////////////

		$('#div_loading').hide();

		// EACH TITLE
		$('td[svg1]').each(function(){
			var cell = $(this);
			var svg = cell.attr('svg1');
			cell.html(svg_obj[svg]);
			//cell.find('svg').addClass('panel_icon');
			var title = cell.attr('title');
			if (title){
				cell.append('&nbsp;'+title);
			}
		});
		//gumrtc.setChroma(0);
		//g_chromakey.disableChroma();
		initUploadPhoto();
		initFullscreen();

		$('#div_front_fullscreen').html(svg_obj['fullscreen0']).click(function(){
			toggleFullscreen();
		});

		// default tab
		select_tab($('#tbl_tabs td').eq(0), 'tbl_room');
		//select_tab($('#tbl_tabs td').eq(1), 'tbl_devices');	// testing

		// reset sizes
		$('#svg_sizes').click(function(){
			console.info('reset sizes');
			gumrtc.onChangeDevice(0, 1);
		});

		// my room
		var timeout = 0;
		if (!g_my_room_id) g_my_room_id = getRandomDigits(6);

		$('#inp_my_room_id, #inp_mypwd')
			.keyup(function(event){
				if (event.which == 13){
					if (g_bCloseErrMsg){
						g_bCloseErrMsg = 0;
					} else {
						$('#but_join').click();
					}

				}
		});

		// my nick
		$('#inp_mynick')
			.keyup(function(event){
				if (event.which == 13){
					$('#but_join').click();
				}
		});

		$('#inp_my_room_id, #inp_mypwd, #inp_mynick')
			.unbind('focus select')
			.focus(function(e){
				onFocusSelect(this);
			})


		// join
		$('#but_join').click(function(){
			checkLogin();
		});

		// PREPARE CAMERA FOR PLAY BACK USAGE
		if (bHasTouchScreen){
			var MAX_CAMERA_VIDEO_PREPARED = 8;
			for (var i = 0; i < MAX_CAMERA_VIDEO_PREPARED; i++){
				var jvideo = addCameraVideo('blank.mp3', 'blank_video');
				//jvideo.width(640).height(480).css('background', 'black').prop('controls', true).css('z-index',9999999).show().parent().show();
			}
		}

		// PLAY
		$('#but_play').click(function(){
			console.info('but_play', 'mobile='+(bHasTouchScreen?1:0));
			// For it is to playback in mobile to resolve: Failed to execute 'play' on 'HTMLMediaElement': API can only be initiated by a user gesture
			if (bHasTouchScreen){
				playAllBlankVideo(onStartPlay);
			} else {
				onStartPlay();
			}
		});

		// VOLUME CONTROL (SPEAKER)
		$('#div_volume1').empty();
		g_jspeakers = $('.div_speaker').html(svg_obj['speaker']);

		initSlider($('#div_volume1'),
			0, 100, getSpkVol('initVolume'),
			function(v, bChange){
				onSpkChange(v);
				setSpkVol(v);
			}
		);
		var g_timeout_resize = 0;
		$(document.body).resize(function(e){
			if (g_timeout_resize){
				//console.info('skipped resize');
				clearTimeout(g_timeout_resize);
				g_timeout_resize = 0;
			}
			g_timeout_resize = setTimeout(function(){
				g_timeout_resize = 0;
				checkOnResize(1, 1);
			}, 500);
		});
/*
		if (g_platform == 'safari'){

			// PREVENT BOUNCE-EFFECT
			// https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect
			document.ontouchmove = function(event){
				console.info('prevented ontouchmove');
				event.preventDefault();
			}

			// PREVENT ZOOM (previously user-scalable=no)
			// https://stackoverflow.com/questions/4389932/how-do-you-disable-viewport-zooming-on-mobile-safari
			document.addEventListener('gesturestart', function (e) {
				console.info('prevented gesturestart');
				e.preventDefault();
			});

			// https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari
			document.addEventListener('touchmove', function (event) {
				if (event.scale !== 1) { event.preventDefault(); }
			}, false);

			var lastTouchEnd = 0;
			document.addEventListener('touchend', function (event) {
				var now = (new Date()).getTime();
				if (now - lastTouchEnd <= 300) {
					event.preventDefault();
				}
				lastTouchEnd = now;
			}, false);
		}
*/
		// testing by alantypoon 20170923
		var check_more_sizes = getCookie('check_more_sizes') == 1 ? 1 : 0;
		var AUTO_LOGIN = 1;
		if (AUTO_LOGIN && g_my_room_id != '' && myremember == 1 && !check_more_sizes){
			checkLogin();
		} else {
			//showLoginPage();
			goLoginPage();
		}

	}
}

//////////////////////////////////////////////////////////////////

var g_loginconfig = 0;
function checkLogin(callback){

	g_playback_filename = '';

	// get current selections
	g_my_room_id 	= $('#inp_my_room_id').val();
	if (g_my_room_id == ''){
		errorDialog('No room name');
		return;
	}


	mynick				= $('#inp_mynick').val();
	mypwd 				= $('#inp_mypwd').val();
	myremember 		= $('.toggle_remember').data('toggles').active ? 1 : 0;

	console.info('checkLogin g_room_id=' + g_my_room_id +
		' pwd=' + mypwd +
		' remember=' + myremember
	);

	openProgress2('Logging in...');

	setTimeout(function(){

		call_svrop({
				type: 'check_login',
				pwd: mypwd,
			},

			function(obj){

				//closeProgress2();
				console.info('checkLogin.onSuccess', obj);

				// change title
				$('.modal-dialog.modal-m h3').html('Coordinating...');

				setCookie('myremember', myremember);
				if (myremember){
					setCookie('my_room_id', g_my_room_id);
					setCookie('mynick', mynick);
					setCookie('mypwd', mypwd);
				} else {
					// erase all values
					$('#inp_my_room_id').val('');
					$('#inp_mynick').val('');
					$('#inp_mypwd').val('');
					$('.toggle_remember').toggles(false);
					$('.toggle_chroma').toggles(false);
					$('.toggle_author').toggles(false);
					// erase all cookies
					setCookie('my_room_id', '');
					setCookie('mynick', '');
					setCookie('mypwd', '');
				}
				checkOwnership();
				gumrtc.initScreenShare();
				//hideToolbar();

				// init to start
				var loginConfig = obj.config;
				initMain(function(){
					g_loginconfig = loginConfig;
					closeProgress2();
					$('#div_main').show();
					setMyDisplayGrp('board', 1); // forcefully
					showToolbar();
					openToolbarMenu();
					callback && callback();
				});
			},
			function(obj){
				showLoginError(obj.error);
			});
	}, 500);
}

//////////////////////////////////////////////////////////

function showLoginError(error){
	console.error(error);
	closeProgress2();
	errorDialog(error, function(){
		goLoginPage();
	});
}

//////////////////////////////////////////////////////////

function checkUrlForRoom(){
	var url = window.location.href;
	g_questionmark = url.lastIndexOf('?');
	if (g_questionmark > 0){
		g_basic_url = url.substring(0, g_questionmark);
		var my_room_id = url.substring(g_questionmark + 1);
		if (my_room_id){
			$('#inp_my_room_id').val(my_room_id);
			if (my_room_id != g_my_room_id){
				g_my_room_id = my_room_id;
				mypwd = '';
				myselectedindex = 0;
				$('#inp_mypwd').val('');
				$('#select_playback')[0].selectedIndex = 0;
			}
		}
		//$('#inp_my_room_id').attr('disabled', true);
	} else {
		g_basic_url = url;
	}
}


//////////////////////////////////////////////

function toggleFrontPanel(){
	console.info('toggleFrontPanel');
	var jobj = $('#div_front_body');
	var collapsed = jobj.attr('collapsed') == 1 ? 1 : 0;
	showFrontPanel(collapsed?0:1);
}

//////////////////////////////////////////////

function showFrontPanel(collapsed){
	var jbut = $('#tbl_tabs .but_close');
	var jobj = $('#div_front_body');
	var collapsed2 = jobj.attr('collapsed') == 1 ? 1 : 0;
	if (collapsed != collapsed2){
		jobj.attr('collapsed', collapsed);
		if (collapsed){
			jobj.slideUp();
			jbut.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
		} else {
			jobj.slideDown();
			jbut.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
		}
	}
}

//////////////////////////////////////////////

var g_focus_id = 0;

function onFocusSelect(obj){
	var focus_id = $(obj).prop('id');
	console.info('focus', focus_id, g_focus_id);
	if (focus_id != g_focus_id){
		g_focus_id = focus_id;
		$(obj).select();
	}

}

//////////////////////////////////////////////
// https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari
//////////////////////////////////////////////

function disableIosDblClkZoom(){
/*
		if (g_platform == 'safari'){

			// PREVENT BOUNCE-EFFECT
			// https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect
			document.ontouchmove = function(event){
				console.info('prevented ontouchmove');
				event.preventDefault();
			}

			// PREVENT ZOOM (previously user-scalable=no)
			// https://stackoverflow.com/questions/4389932/how-do-you-disable-viewport-zooming-on-mobile-safari
			document.addEventListener('gesturestart', function (e) {
				console.info('prevented gesturestart');
				e.preventDefault();
			});

			// https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari
			document.addEventListener('touchmove', function (event) {
				if (event.scale !== 1) { event.preventDefault(); }
			}, false);

			var lastTouchEnd = 0;
			document.addEventListener('touchend', function (event) {
				var now = (new Date()).getTime();
				if (now - lastTouchEnd <= 300) {
					event.preventDefault();
				}
				lastTouchEnd = now;
			}, false);
		}
*/
	
 if (!(/iPad|iPhone|iPod/.test(navigator.userAgent))) return
  $(document.head).append(
    '<style>*{cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0)}</style>'
  )
  $(window).on('gesturestart touchmove', function (evt) {
    if (evt.originalEvent.scale !== 1) {
      evt.originalEvent.preventDefault()
      document.body.style.transform = 'scale(1)'
    }
  })	
}