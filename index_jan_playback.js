/////////////////////////////////////////////////////////////////////////////////////////////////////

var ENABLE_PLAYBACK_MP4 = 1;
var PLAYBACK_ADDKEYFRAME = 0;
var MAX_PLAYBACK_POS = 1000;
var PLAYING_INTERVAL = 250;

var debug_playback = 1;

var
 	g_playback_w = 0,
	g_playback_h = 0
;


var PlaybackAll = function(){

	// STATIC VARIABLES
	var jplaybackbut = $('#playback_but');

	/////////////////////////////////////////////////////////////////////////////////////////////////

	// PRIVATE VARIABLES
	var self = this,

		timeNodeArr = 0,
		timeNodeIndex = 0,
		timeNodeLength = 0,

		keyFrameArr = 0,
		keyFrameObj = 0,
		keyFrameKeys = 0,

		startTime = 0,
		totalTime = 0,
		janusPlayObj = {},
		timer_nextTimeNode = 0,
		timer_onPlaying = 0,
		savedDate = 0,
		bPlaying = 0
	;

	/////////////////////////////////////////////////////////////////////////////////////////////////

	// PRIVATE METHODS
	function init(){
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////

	this.uninit = function(){
		console.info('playback uninit');

		clearAllTimeout();

		// stop chrome
		if (g_configobj.chroma && g_chromakey){
			g_chromakey.disableChroma();
		}


		// remove mp4
		$('video').each(function(){
			$(this).remove();
		});

		for (var key in janusPlayObj){
			console.info('playback uninit', key);
			janusPlayObj[key].uninit();
		}



	}

	/////////////////////////////////////////////////////////////////////////////////////////////////

	this.play = function(fileName, callback){

		//g_my_room_id = $('#inp_my_room_id').val();

		console.info("playback: ", g_my_room_id, fileName);

		var obj = call_svrop(
			{
					type: 'dl_timeline',
					fileName: fileName
			},

			function (obj){
				if (!obj.error){

					// init
					setSlideMyOp(0);

					// prepare variables
					timeNodeArr = JSON.parse(obj.timeNodeArr);
					timeNodeLength = timeNodeArr.length;
					timeNodeIndex = 0;

					// key frame
					initKeyFrameArr();
					keyFrameArr = obj.keyFrameArr ? JSON.parse(obj.keyFrameArr) : 0;
					savedDate = new Date();

					// set v=0
					g_jslider_playback.setValue(0);

					// hide chat input
					$('#tbl_chatbox').hide();
					$('#chatfile').hide();
					$('.div_chat1').css('height', 'calc(100% - 50px)');

					// video camera
					//$('.video_camera').click(function(){
					//	console.info('onvideoclick', this.paused, this.src);
					//	this.play();
					//});

					totalTime = parseInt(fileName.split('-')[fileName.split('-').length-1] * 1000);
					$('#div_playback_totaltime').text(time2string(totalTime));

					// preload all the stream first (then getNextTimeNode)
					setMyEdit(0);
					//setMyTool('tool_move');

					loadAllVideo(function(){

						//onSeek(0);
						self.resumePlay();

						callback && callback();
					});
				}
		});
	};

	/////////////////////////////////////////////////////////////////////

	var loadAllVideo = function(callback){

		console.info('loadAllVideo...');

		callback && callback();
	}

	/////////////////////////////////////////////////////////////////////

	var addVideoStream = function(janus, stream){
		var data = janus._data;
		var recordingID = data.recordingID;
		var media = data.media;
		var peer_id = data.peer_id;
		var nick = data.nick;
		//console.info('addVideoStream', data);
		var jvideo = 0;
		switch (media){

			case 'camera':
				jvideo = onCameraAdded(data, stream, function(video){
					init_video2(video);
					calcLayout('playback_camera');
					play_video(video);
				})
				break;

			case 'screen':
				jvideo = onScreenAdded(data, stream, function(video){
					init_video2(video);
					resetBoard();
					changeDispMode(0, DISPMODE_SCREEN);	// CHANGE DISPMODE
					calcLayout('playback_screen');
					play_video(video);
				})
				break;
		}
		jvideo
			.attr('recording_id', recordingID)
			.attr('nick', nick);
	}

	//////////////////////////////////////////////////////////////////////////////////

	var addVideoMp4 = function(data){
		var recordingID = data.recordingID;
		var url = g_basic_url + 'rooms/' + g_my_room_id + '/video/' + recordingID + '.mp4';
		var media = data.media;
		var peer_id = data.peer_id;
		data.id = recordingID;	// for 1 peer many screens
		var nick = data.nick;
		var jvideo = $('#video_' + recordingID);

		// remove first
		//if (jvideo.length){
		//	jvideo.remove();
		//	jvideo = $('#video_' + recordingID);
		//}

		if (!jvideo.length){

			console.info('addVideoMp4', data);

			switch (media){

				case 'camera':
					jvideo = onCameraAdded(data, url, function(video){
						// add time param
						video.startplaytime = data.startplaytime;
						video.endplaytime = Math.floor(data.startplaytime + (video.duration*1000));
						//console.info('start='+video.startplaytime, 'end='+video.endplaytime, 'duration='+video.duration);
						if (bPlaying){
							init_video2(video);
							//if (!g_playbackAll){
							//	calcLayout('playback_camera');
							//}
							play_video(video);
						} else {
							video.currentTime =	0;
						}
					})
					break;

				case 'screen':
					jvideo = onScreenAdded(data, url, function(video){
						video.startplaytime = data.startplaytime
						video.endplaytime = Math.floor(data.startplaytime + (video.duration*1000));
						if (bPlaying){
							init_video2(video);
							resetBoard();
							changeDispMode(0, DISPMODE_SCREEN);	// CHANGE DISPMODE
							calcLayout('playback_screen');
							play_video(video);
						}
					})
					break;
			}
			jvideo
				.attr('recording_id', recordingID)
				.attr('nick', nick);

			//initVideoByUserGesture(jvideo);

		} else if (bPlaying){
			//console.info('play5...');
			var video = jvideo[0];
			init_video2(video);
			switch (media){

				case 'camera':
					calcLayout('playback_camera');
					break;

				case 'screen':
					resetBoard();
					changeDispMode(0, DISPMODE_SCREEN);	// CHANGE DISPMODE
					calcLayout('playback_screen');
					break;
			}
			play_video(video);
		}

		if (media == 'camera'){

			// find the proposion
			$('#div_cameras')
				.attr('cx', data.cx)
				.attr('cy', data.cy)
				.attr('cw', data.cw)
				.attr('ch', data.ch)
				.attr('sw', data.sw)
				.attr('sh', data.sh)
			;
			resizePlaybackCamera();
		}

	}

	/////////////////////////////////////////////////////////////////////////////////////

	var getTimeLineUrl = function(fileName){
		return window.location.protocol + '//' + window.location.host + '/record/timeline/' + fileName;
	}

	/////////////////////////////////////////////////////////////////////////////////////

	var time2string = function(t){
		//console.info('time2string', t);
		var t2 = Math.floor(t / 1000),
				h = Math.floor(t2 / 3600),
				m = Math.floor(t2 / 60) - h * 60,
				s = t2 - m * 60 - h * 3600
		;
		return get2Digits(h) + ':' + get2Digits(m) + ':' + get2Digits(s);
	}

	//////////////////////////////////////////////////////////////////////

	function showTimestamp(time){
		var s = '';
		if (time < totalTime){
			d = new Date(time + savedDate.getTimezoneOffset() * 60000),
			hr = d.getHours(),
			min = d.getMinutes(),
			sec = d.getSeconds()
			s = get2Digits(hr)+':'+get2Digits(min)+':'+get2Digits(sec);
		} else {
			s = time2string(totalTime);
		}
		$('#div_playback_timestamp').text(s);
	}

	/////////////////////////////////////////////////////////////

	this.togglePlay = function(){

		var
			pos = g_jslider_playback.getValue(),
			sliderPlayTime = totalTime * pos / MAX_PLAYBACK_POS,
			state = jplaybackbut.attr('state') == 1 ? 0 : 1
		;

		console.info('togglePlay', 'state=' + state, time2string(sliderPlayTime));

		if (!state){

			self.suspendPlay();

		} else {

			// rewind to the beginning
			if (pos >= MAX_PLAYBACK_POS){
				g_jslider_playback.setValue(0);
			}
			self.resumePlay();
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////

	function setBtnState(state){
		jplaybackbut
			.attr('state', state)
			.attr('src', './images/btn_play' + state + '.png' )
		;
	}


	//////////////////////////////////////////////////////////////////////

	this.onSeek = function(pos){
		console.info('onSeek', pos);
		if (bPlaying){
			//bPlaying = 0;
			this.suspendPlay();
		}

		var sliderPlayTime = totalTime * pos / MAX_PLAYBACK_POS
		g_jslider_playback.setValue(pos);	// put it back

		// show time stamp
		showTimestamp(sliderPlayTime);

		// stop all timeout
		clearAllTimeout();

		// set paused
		setBtnState(0);

		// replay the gapped actions
		setPlaybackPos(0);

	}

	/////////////////////////////////////////////////////////////////////
	// find the time in array element just pass the given time
	/////////////////////////////////////////////////////////////////////

	function binary_search(arr, time){
		var mid = 0;
		if (arr){
			var lo = 0, len = arr.length, hi = len - 1, time2;
			if (!time || !len) return 0;
			while (lo <= hi){
				mid = Math.floor((lo+hi)/2);
				time2 = arr[mid].time;
				if (time2 > time){
					hi = mid - 1;
				} else if (time2 < time){
					lo = mid + 1;
				} else {
					return mid;
				}
			}
			if (time2 < time){
				if (++mid > len - 1){
					mid = len - 1;
				}
			}
		}
  	  	return mid;
	}

	/////////////////////////////////////////////////////////////////////////////////////////

	this.getTimeNodeIndex = function(){
		return timeNodeIndex;
	}

	/////////////////////////////////////////////////////////////////////////////////////

	this.debug = function(){
		//console.info(JSON.stringify(timeNodeArr[1].data.obj_arr));
	}

	//////////////////////////////////////////////////////////////////////////////////////

	var bPlaybackBarOpened = 1;
	this.closePlaybackBar = function(){
		if (bPlaybackBarOpened){
			bPlaybackBarOpened = 0;
			$('#div_playback_bar').animate(
				{
					top:g_nScreenH,
				},
				300,
				"swing",
				function(){
					$('#div_playback_bar').hide();
				}
			);
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////

	this.isPinned = function(){
		return $('#div_playback_pin').attr('svg') == 'pin1';
	}

	//////////////////////////////////////////////////////////////////////

	this.suspendPlay = function(){

		console.info('suspendPlay');
		bPlaying = 0;

		var v = g_jslider_playback.getValue(),	// current pos
			sliderPlayTime = totalTime * v / MAX_PLAYBACK_POS
		;
		// VIDEO HANDLING
		$('video').each(function(){
			var video = this;
			pause_video(video);
			// hide after playback
			//if (sliderPlayTime < video.startplaytime || sliderPlayTime > video.endplaytime){
			//	$(video).hide();
			//}
		});

		clearAllTimeout();
	}

	//////////////////////////////////////////////////////////////////////

	this.resumePlay = function(){

		console.info('resumePlay');

		// START PLAY
		bPlaying = 1;

		// start play here
		var sliderPlayTime = setPlaybackPos(1);

		/////////////////////////////////////////
		// TIMER HANDLING
		/////////////////////////////////////////
		var date = new Date(),
			timeNow = date.getTime()
		;
		startTime = timeNow - sliderPlayTime;
		//showTimestamp(sliderPlayTime);

		// playing thread
		//clearInterval(timer_onPlaying);	// okay to clear with undefined timer
		//timer_onPlaying = setInterval(onPlaying, PLAYING_INTERVAL);
		onPlaying();
	}

	///////////////////////////////////////////////////////////////////////////////////////

	var onPlaying = function(){
		// adjust start time by video playing
		var totalPlayTime = 0, nVideo = 0, videoPlayTime = -1;
		var date = new Date(),
			timeNow = date.getTime(),
			elapsedPlayTime = timeNow - startTime
		;
		// TESTING: GENERATING KEYFRAME ARR ONLY!
		//if (PLAYBACK_ADDKEYFRAME){
		//	addKeyFrame(elapsedPlayTime);
		//}

		// show timestamp
		showTimestamp(elapsedPlayTime);

		// adjust slider slot
		var pos = Math.floor(MAX_PLAYBACK_POS * elapsedPlayTime / totalTime);
		if (pos > MAX_PLAYBACK_POS) pos = MAX_PLAYBACK_POS;
		g_jslider_playback.setValue(pos);

		// set next playing
		clearInterval(timer_onPlaying);
		timer_onPlaying = setTimeout(onPlaying, PLAYING_INTERVAL);
	}

	//////////////////////////////////////////////

	function setPlaybackPos(bPlay){
		// find the play time from the slider (initially v=0)
		var
			pos = g_jslider_playback.getValue(),
			sliderPlayTime = totalTime * pos / MAX_PLAYBACK_POS
		;
		console.info('setPlaybackPos', pos);
		if (!pos){
			console.info('remove video');
			$('#div_cameras .div_camera').remove();
		}
		return self.setPlaybackTime(sliderPlayTime, bPlay);
	}

	///////////////////////////////////////////////

	this.setPlaybackTime = function(sliderPlayTime, bPlay){

		console.info('setPlaybackTime', sliderPlayTime);
		var
			date = new Date(),
			timeNow = date.getTime(),
			startTime = timeNow - sliderPlayTime
		;


		/////////////////////////////////////////////
		// VIDEO HANDLING
		/////////////////////////////////////////////
		$('video').each(function(){
			var video = this;
			if (sliderPlayTime > video.startplaytime && sliderPlayTime < video.endplaytime){

				var playtime = sliderPlayTime / 1000;

				//video.currentTime = video.startplaytime + playtime;
				//try {
					video.currentTime = playtime;
				//} catch (e){
				//	console.error(e);
				//}

				if (bPlay){
					init_video2(video);
					play_video(video);
				} else {
					pause_video(video);
				}

			} else {
				hide_video(video);
			}
		});

		/////////////////////////////////////////
		// BOARD HANDLING
		/////////////////////////////////////////
		var
			lastTimeNodeIndex = binary_search(timeNodeArr, sliderPlayTime),
			keyFrameIndex = binary_search(keyFrameArr, sliderPlayTime);
			kfTimeNodeIndex = 0
		;
		console.info('index='+lastTimeNodeIndex, "kfindex="+keyFrameIndex);

		if (lastTimeNodeIndex == 0){
			//resetBoard();
			///////////////////////////////////////////////////
			// CASE 1: FROM THE BEGINNING
			///////////////////////////////////////////////////
			for (var i = 0; i < timeNodeArr.length; i++){
				var myop = timeNodeArr[i];
				performTimeNode(i);
				if (myop.type == 'whb_preload'){
					break;
				}
			}
		} else {

			///////////////////////////////////////////////////
			// CASE 2: NOT THE BEGINNING
			///////////////////////////////////////////////////
			// PERFORM KEYFRAME
			if (keyFrameIndex > 0){

				// COPY THE KEYFRAME
				var keyFrame = keyFrameArr[keyFrameIndex];
				kfTimeNodeIndex = keyFrame.kfIndex;
				//console.info(pos, time2string(sliderPlayTime), 'keyFrameKeyIndex='+keyFrameKeyIndex, 'kfTimeNodeIndex='+kfTimeNodeIndex, 'lastTimeNodeIndex='+lastTimeNodeIndex);

				// BACK TRACK OBJ_ARR & CHAT_ARR
				var myop = JSON.parse(JSON.stringify(keyFrame));
				var i = keyFrameIndex, obj_index = -1, chat_index = -1;
				for (; i >= 0; i--){
					//if (myop.obj_arr && myop.chat_arr){
					if (myop.chat_arr){
						break;
					} else {
						var myop2 = keyFrameArr[i];
						//if (!myop.obj_arr && myop2.obj_arr && myop2.obj_arr.length){
						//	myop.obj_arr = json_clone(myop2.obj_arr);	// take away this
						//	obj_index = i;
						//}
						if (!myop.chat_arr && myop2.chat_arr && myop2.chat_arr.length){
							myop.chat_arr = json_clone(myop2.chat_arr);
							chat_index = i;	// what for?
						}
					}
				}
				//console.info('#key ' + keyFrameIndex + ' ', obj_index, chat_index);
				// perform the whb preload
				onRecvWhbPreload(myop);
			}
			// BACK TRACE kfTimeNodeIndex for the same time
			while (kfTimeNodeIndex > 0){
				if (timeNodeArr[kfTimeNodeIndex - 1].time == timeNodeArr[kfTimeNodeIndex].time){
					kfTimeNodeIndex--;
					//console.info('backtrace for the same time', kfTimeNodeIndex);
				} else {
					break;
				}
			}

			// PERFORM THE GAP BETWEEN KEYFRAME TO THE LAST TIME NODE (EXCLUDING THE MOVEMENT)
			for (var i = kfTimeNodeIndex; i <= lastTimeNodeIndex; i++){
				var timeNode = timeNodeArr[i],
						type = timeNode.type,
						bPerformTimeNode = 1
				;
				switch (type){

					case 'config':
						break;

					case 'msg':
						var myop = timeNode.data,
							type2 = myop.type
						;
						if (type2 == 'whb_zoom'){
							bPerformTimeNode = 0;
						}
						break;

					case 'key':
						var key = timeNode.data.key;
						if (key == 33 || key == 34 || key == 36 || key == 37 || key == 38 || key == 39 || key == 40){
							bPerformTimeNode = 0;
							//console.info('skipped key');
						}
						break;

				}
				if (bPerformTimeNode){

					// perform this particilar node
					performTimeNode(i, 'fillgap');

					// perform Nodes for the same time
					while (i < timeNodeArr.length - 1 && timeNodeArr[i].time == timeNodeArr[i+1].time){
						performTimeNode(++i, 'sametime');
					}
				}
			}

/*
			// PERFORM THE LAST MOVEMENT IN THE PERIOD
			for (var i = lastTimeNodeIndex; i >= kfTimeNodeIndex; i--){
				var timeNode = timeNodeArr[i],
						type = timeNode.type
				;
				switch (type){
					case 'config':
						bPerformTimeNode = 0;
						i = kfTimeNodeIndex - 1;
						break;
				}
			}
			for (var i = lastTimeNodeIndex; i >= kfTimeNodeIndex; i--){
				var timeNode = timeNodeArr[i],
						type = timeNode.type
				;
				switch (type){
					case 'msg':
						var myop = timeNode.data,
							type2 = myop.type
						;
						if (type2 == 'whb_zoom'){
							performTimeNode(i, 'lastzoom');
							i = kfTimeNodeIndex - 1;
						}
						break;
				}
			}
*/
		}

		/////////////////////////////////////////////////////////////////////////
		// PERFORM THE NEXT TIME NODE
		/////////////////////////////////////////////////////////////////////////

		// FIRST RESET TIMER
		clearInterval(timer_nextTimeNode);	// okay to clear with undefined timer

		// PREPARE NEXT TIME NODE IF EXIST
		if (bPlay && lastTimeNodeIndex + 1 < timeNodeArr.length){
			var
				nextIndex = lastTimeNodeIndex + 1,
				nextIndexedTime = timeNodeArr[nextIndex].time,
				period = nextIndexedTime - sliderPlayTime
			;
			timeNodeIndex = nextIndex;
			timer_nextTimeNode = setTimeout(getNextTimeNode, period);
		}

		return sliderPlayTime;
	}

	/////////////////////////////////////////////////////////////////
	// HANDLE PLAYBACK
	/////////////////////////////////////////////////////////////////
	var getNextTimeNode = function(){

		//console.info('getNextTimeNode', timeNodeIndex);

		performTimeNode(timeNodeIndex, 'nexttimenode');

		if (timeNodeIndex < timeNodeLength - 1){
			var thisTime = timeNodeArr[timeNodeIndex].time,
					nextTime = timeNodeArr[++timeNodeIndex].time,
					period = nextTime - thisTime
			;
			if (debug_playback)
			{
				console.info('***next=' + timeNodeIndex + ' aft ' + Math.floor(period/1000) + 's');
			}
			clearTimeout(timer_nextTimeNode);
			timer_nextTimeNode = setTimeout(getNextTimeNode, period);

		} else {

			console.info('playback finished');
			self.suspendPlay();
			g_jslider_playback.setValue(MAX_PLAYBACK_POS);

			showTimestamp(totalTime);

			if (PLAYBACK_ADDKEYFRAME){
				debugKeyFrameArr();
			}
		}
	}

	///////////////////////////////////////////////////////////////////////////////

	var performTimeNode = function(index, remark){

		var timeNode = timeNodeArr[index];
		var type = timeNode.type;
		var data = timeNode.data;
		var time = timeNode.time;
		data.startplaytime = time;

		if (debug_playback)
		{
			console.info('#' + index + ': '
				+ time2string(time) + ' '
				+ type,
				data);
		}
		switch (type){

			case 'config':
				loadConfig(data);
				break;

			case 'av_stream':
				var media = data.media;
				var recordingID = data.recordingID;
				if (!ENABLE_PLAYBACK_MP4){
					// OLD APPROACH: playback with Janus
					janusPlayObj[recordingID] = new JanusWrapper(
						function(janus){
							var data = janus._data;
							console.info('startPlayout', data.nick, data.media, data.recordingID);
							janus.startPlayout(janus._recordingID);
						},
						function(error){
							console.error('error in playback', error);
						},
						null,
						function(janus, stream){
							// onPlay (stream is ready)
							addVideoStream(janus, stream);
						}
						,recordingID
						,data
					);
				} else {
					// NEW APPROACH: playback MP4
					addVideoMp4(data);
				}
				break;

			case 'whb_preload':
				onRecvWhbPreload(data);
				break;

			case 'msg':
				onRecvMsg(data);
				break;

			case 'key':
				var key = data.key;
				if (key == 33 || key == 34 || key == 36 || key == 37 || key == 38 || key == 39 || key == 40){
					//console.info('skipped key: ' + key)
				} else {
					checkKeyboard(data.key, data.ctrl, data.shift, data.alt);
				}
				break;

			case 'chat':
				onRecvChat(data);
				break;

			case 'calc_layout':
				g_display_mode = data;
				setCookie('g_display_mode', g_display_mode);
				calcLayout('playback');
				break;

			case 'end_record':
				console.info('end_record');
				self.suspendPlay();
				break;
		}

	}


	///////////////////////////////////////////////////////////////

	function init_video2(video){
		init_video(video,
			function(){
				// check if all video is playing
				video.state = 1;
				if (check_all_video(1)){
					setBtnState(1);
				}
			},
			function(){
				// check if all video is paused
				video.state = 0;
				if (check_all_video(0)){
					setBtnState(0);
				}
			}
		);
		//show_video(video);
	}

	///////////////////////////////////////////////////////////////

	function check_all_video(state){
		var all_success = 1;
		$('video').each(function(){
			if (this.state != state){
				all_success = 0;
			}
		});
		return all_success;
	}

	///////////////////////////////////////////////////////////////

	function clearAllTimeout(){
		console.info('clearAllTimeout');

		// BOARD HANDLING
		if (timer_nextTimeNode){
			clearInterval(timer_nextTimeNode);
			timer_nextTimeNode = 0;
		}

		// ONPLAY HANDLING
		if (timer_onPlaying){
			clearInterval(timer_onPlaying);
			timer_onPlaying = 0;
		}

	}

	function debug(){
		console.info(timeNodeArr, keyFrameArr);
	}


	init();
}


///////////////////////////////////////////////////////

function onPlaybackStart(fileName){
	console.info('onPlaybackStart');
	showProgressAnimated('Playing...', 0, function(){
		goLoginPage();
	});

	g_playback_filename = fileName;
	goLogOut(LOGOUT_PLAYBK);
}

///////////////////////////////////////////////////////

function onPlaybackStart2(){
	console.info('onPlaybackStart2');
	//openProgress2('Loading...');
	//showProgressAnimated('Playing...', 0, function(){
		initMain(function(){
			closeProgressDialog(1);
			//closeProgress2();
			$('#div_main').show();
			openToolbarMenu('playback');
			hideToolbar();
			if (g_slide_myop){
				goToSlide(g_slide_curr);
			}
		});
	//});
}

/////////////////////////////////////////////

function onPlaybackEnd(){
	console.info('onPlaybackEnd');
	if (g_playbackAll){
		g_playbackAll.uninit();
		g_playbackAll = 0;
	}
	// login again
	// remove all cameras
	$('#div_cameras .div_camera').remove();
	resetBoard();
	checkLogin(function(){
		openToolbarMenu('play');
	});
}

/////////////////////////////////////////////

function resizePlaybackCamera(){

	if (!g_playback_w){
		return;
	}

	var
		jcam = $('#div_cameras'),
		cx = parseInt(jcam.attr('cx')),
		cy = parseInt(jcam.attr('cy')),
		cw = parseInt(jcam.attr('cw')),
		ch = parseInt(jcam.attr('ch')),

		sw = parseInt(jcam.attr('sw')),
		sh = parseInt(jcam.attr('sh')),
		r = g_nScreenW / g_playback_w
		//r = g_nScreenW / g_playback_w
	;
	//r *= 2.012;
	if (isNaN(cx) || isNaN(cy) || isNaN(cw) || isNaN(ch) || isNaN(g_playback_w) || isNaN(g_playback_h)){
		// skipped
		return;
	}
	var cx2 = Math.floor(cx * r),
		cy2 = Math.floor(cy * r),
		cw2 = Math.floor(cw * r),
		ch2 = Math.floor(ch * r)
	;
	//console.info(cx,cy,cw,ch,cx2,cy2,cw2,ch2);

	// resize camera and canvas
	var scale = 'scale('+r+','+r+')';
	//var scale = 'scale('+1+','+1+')';
	$('#div_cameras').each(function(){
		$(this).css({
			left: 	cx2,
			top:  	cy2,
			width: 	cw2,
			height: ch2,
		 	//'-ms-transform': scale,	 // IE 9
    		//'-webkit-transform': scale, // Safari
    		//'transform': scale,
		});
	});
	var totalcameras = $('.div_camera').length;

	var index = 0;
	$('.div_camera').each(function(){
		$(this)
			.css({
				width: cw2,
				height: ch2,
			})
		;
		jvideo = $(this).find('.video_camera');
		if (g_configobj.chroma){
			g_chromakey.enableChroma(jvideo[0]);
		}
		setCamBorders(jvideo, index++, totalcameras);
	});


}
