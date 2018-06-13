///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// a.uploader: my own uploader class
// 		by alantypoon 20161024
// Description:
//	A jQuery plugin to upload file with a progress dialog. Each instance contain its own object instances of resumable and progressbar
//	It may pause, resume, cancel and a progress with percentage is shown
//  References
//  - http://learn.jquery.com/plugins/stateful-plugins-with-widget-factory/
//  - http://stackoverflow.com/questions/1117086/how-to-create-a-jquery-plugin-with-methods
//	- http://resumablejs.com/
//	- https://kimmobrunfeldt.github.io/progressbar.js/
//  - https://blueimp.github.io/jQuery-File-Upload/ (not needed)
//	- http://stackoverflow.com/questions/7687984/jquery-widget-factory-can-i-declare-global-variables-at-create-or-outside-the
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.widget( "a.uploader", {
	options: {
		target: null,
		query: [],
		gallery: null,
		maxThumbNailSize: 	150,
		progressBarSize: 		80,
		progressBarColor1: 	'AliceBlue',
		progressBarColor2: 	'ForestGreen',
		progressBarSize:		14,
		mediaFolder: 				'media',
		media_arr: 						[],
		trash: 							1,
		onUpdate:						0,
		debugLvl:						1,	// 0=off, 1=console.log, 2=console.log, 2=alert
		onLoad:							0,
	},
	vars: {
		//browser: {
		//	isOpera: !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,											// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		//	isFirefox: typeof InstallTrigger !== 'undefined',   																			// Firefox 1.0+
		//	isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,	// At least Safari 3+: "[object HTMLElementConstructor]"
		//	isChrome: !!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0),              																			// Chrome 1+
		//	isIE: /*@cc_on!@*/false || !!document.documentMode,
		//	isEdge: !(/*@cc_on!@*/false || !!document.documentMode) && !!window.StyleMedia,	 																									// Edge 20+
		//},
		added: 0,
		jdiv: 0,
		r: 0,	// resumable
		marginratio: .8,
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// create
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_create: function() {
		var el = this.element,	// a single element (a collection break down)
				opt = this.options,
				self = this
		;
		el.addClass('uploader_init');
		opt.gallery.addClass('uploader_gallery');

		// CHECK IF IT IS INPUT[TYPE=FILE]
		if (el.prop("tagName") != 'INPUT' || el.attr('type').toUpperCase() != 'FILE'){

			// ERROR
			if (!self.options.media_arr || !self.options.media_arr.length){
				//console.error('no input button associated.');
			}
			self.options.trash = 0;

		} else {

			// USE CUSTOMIZED BUTTON
			//console.log(el, opt);
			el.uniqueId().hide();
			var uid = el.attr('id');
			el.after('<label for="' + uid + '" class="uploader_label">' + el.attr('data-title') + '</label>');

			// DEBUG
			console.log('uploader created', uid);//, this.vars.browser);

			////////////////////////////////////////////////
			// CREATE RESUMABLE
			////////////////////////////////////////////////
			self.vars.r = new Resumable({
				target: self.options.target,
				query: self.options.query,
				testChunks: 0,	// overwrite everytime
			});
			self.vars.r.added = 0;
			self.vars.r.uid = uid;
			el.attr('uid', uid)

			console.log('resumable', uid);

			self.vars.r.assignBrowse(el[0]);

			// EVENTS
			self.vars.r.on('fileAdded', function(file){

				var robj = this;	// resumable obj

				//////////////////////////////////////////////////////////
				// ONFILEADDED
				//////////////////////////////////////////////////////////
				// FIND THE LOCAL FILE
				var
					uid = robj.uid,
					file_id = file.uniqueIdentifier,
					file_name = file.fileName,
					file_cat = self._mime2cat(file.file.type),
					blob_url = URL.createObjectURL(file.file)
				;
				//console.log('fileAdded uid=' + uid, file);
				//self._dlog('fileAdded mimetype=' + file.file.type + ' file_cat=' + file_cat + ' file_id='+file_id);
				console.log('fileAdded uid=' + uid);

				////////////////////////////////////////////////////////////
				// ADD PREVIEW (=DESTINATION)
				////////////////////////////////////////////////////////////
				if (!file_cat || file_cat == ''){

					self._dlog('unrecognizable mime type' + file.file.type);
					//console.error('unrecognizable mime type', file.file.type);
					// remove file_id
					self.vars.r.removeFile(file);

				} else if (self.options.gallery){

					//////////////////////////////////////////////////////////////////
					// SEPARATE UPLOAD AND MEDIA ELEMENT LOADING
					//////////////////////////////////////////////////////////////////

					// 1. CREATE EMPTY DIV (UPLOADER_CHILD)
					var jdiv
								= file.jdiv
								= self._addChild(self.options.gallery, file_cat, file_id, 0, file_name)
					;

					// 2. ADD PLAY BUTTON FOR THE VIDEO
					var jplaybut = file_cat == 'video' ? self._addPlayBut(jdiv) : 0;

					// 3. ADD PROGRESS BAR INSIDE DIV
					file.pbar = self._addProgressBar2(jdiv);

					// 4. CREATE ELEMENT OF MEDIA (PREVIEW IF DONE)
					var jelement = self._addMediaElement(jdiv, file_cat, blob_url);

					// 5. ADD TRASH
					var jtrash = self._addTrash(jdiv);

					// 64. START UPLOAD
					//setTimeout(function(){
						robj.upload();
					//}, 0);

					// 7. AFTER UPLOADING IF THE MEDIA IS STILL NOT LOADED, CALL SERVER FOR CONVERSION AND UPDATE THE VIDEO TO BE THE CONVERTED VIDEO
				}
			});

			///////////////////////////////////////////////////////////////////////////////////////////////////////

			self.vars.r.on('fileProgress', function(file){
				var robj = this;
				var progress = file.progress();
				console.log('fileProgress uid=' + uid, progress);
				//self._dlog('_fileProgress: ' + progress);
				//debugger;
				if (file.pbar){
					file.pbar.set(progress);	// (0-1, 1=100%)
				} else {
					console.error('file.pbar not created yet');
				}
			});

			///////////////////////////////////////////////////////////////////////////////////////////////////////
			// right after a file is uploaded

			self.vars.r.on('fileSuccess', function(file, message){
				var robj = this;
				var jdiv = file.jdiv,
					jsvg = jdiv.find('svg'),
					file_cat = self._mime2cat(file.file.type);
					error = file.error ? file.error : 0,
					media_id = file.media ? file.media.media_id : 0,
					file_name = file.media ? file.media.file_name : '',
					file_id = file.uniqueIdentifier,
					file_size = file.size
				;
				// conplete the pbar
				file.pbar.set(1);	// (0-1, 1=100%)

				// add media_id
				jdiv
					.attr('media_id', media_id)
					.attr('file_name', file_name)
				;
				// remove file_id
				var file = self.vars.r.getFromUniqueIdentifier(file_id);
				self.vars.r.removeFile(file);
				jdiv.attr('file_id', 0);

				// reset opacity
				jdiv.find(':first-child').css('opacity', 1);

				// after addition: call onUpdate
				self._callOnUpdate();

				console.log('fileSuccess uid=' + uid, 'media_id='+media_id);

				//self._dlog('fileSuccess mimetype=' + file.file.type + ' file_cat=' + file_cat + ' file_id='+file_id + ' media_id='+media_id);

				// DELAY TO REMOVE PROGRESSBAR
				setTimeout(function(){	// add delay to show 100% pbar

					//self._dlog('fileSuccess2');

					// remove progressbar
					jsvg.remove();

					// ERROR?
					if (error){
						console.error('Error: ' +  error + '. The file ' + file_name + ' is removed');//, file, message);
						//self._dlog('Error: ' +  error + '. The file ' + file_name + ' is removed');
						jdiv.remove();

					} else if (file_cat == 'video'){

						var jvideo = jdiv.find('video');
						if (jvideo.attr('loaded') != 1){
							// 7. (after fileAdded) IF THE MEDIA IS STILL NOT LOADED, CALL SERVER FOR CONVERSION AND UPDATE THE VIDEO TO BE THE CONVERTED VIDEO
							self._dlog('CALL SERVER FOR A CONVERSION NOW');
						}
					}

				}, 1000);
			});

			///////////////////////////////////////////////////////////////////////////////////////////////////////

			self.vars.r.on('complete', function(){

				var robj = this;
				//self._dlog('complete');
				console.debug('complete', robj.uid)
				robj.cancel();	// restart
				robj.added = 0;
			});

			///////////////////////////////////////////////////////////////////////////////////////////////////////

			self.vars.r.on('fileError', function(file, message){
				var robj = this;
				//console.error('fileError', uid, file);
				//self._dlog('fileError: ' + message);
				//alert('fileError: ' + message);

				// remove demo
				file.jdiv.remove();

				// remove file
				self.vars.r.removeFile(file);

				// show alert message
				alert(message);
			});

			self.options.onLoad && self.options.onLoad(uid);
		}

		///////////////////////////////////////////////////////////////////////////////////////////////////////

		if (self.options.media_arr && self.options.media_arr.length > 0){
			self.loadGallery(self.options.media_arr);
		}
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_setOption: function( key, value ) {
		this.options[ key ] = value;
		this._update();
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	_update: function() {
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_destroy: function(){
		console.log('_destroy');
		// remove resumable
		if (this.vars.r){
			delete this.vars.r;
			this.vars.r = 0;
		}
		//this.multiselect.remove();
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// private methods
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// http://voice.firefallpro.com/2012/03/html5-audio-video-mime-types.html
	// http://help.encoding.com/knowledge-base/article/correct-mime-types-for-serving-video-files/
	_mime2cat: function(mime){
		var cat = '';
		if (mime){
			var arr = mime.split('/');
			if (arr.length == 2){
				var mimetype = arr[1].toLowerCase();
				// get extension from mime type e.g. "application/pdf"
				switch (mimetype){

					case 'gif':	case 'png':	case 'jpg':	case 'jpeg': case 'bmp': case 'x-ms-bmp':
						cat = 'image';
						break;

					case 'mp4':	case 'x-mpegURL': case 'MP2T':	case '3gpp': case 'quicktime': case 'x-msvideo': case 'x-ms-wmv': case 'ogg':
						cat = 'video';
						break;
					//case 'aac':	case 'm4a':	case 'mpeg':	case 'wav':
					//	cat = 'audio';
					//	break;
				}
			}
		}
		return cat;
	},

	////////////////////////////////////////////////////////////
	// addProgressBar
	////////////////////////////////////////////////////////////
	_addProgressBar: function(robj, file, jdiv, w, h){
		//console.log('_addProgressBar', robj.uid, file.uniqueIdentifier);
		////////////////////////////////////////////////////////////
		// ADD PROGRESS
		// https://kimmobrunfeldt.github.io/progressbar.js/
		////////////////////////////////////////////////////////////
		var	self = this;	// a.uploader

		//self._dlog('_addProgressBar: file=' + file);

		// add opacity to the image or video
		var jobj = jdiv.find(':first-child');
		jobj.css('opacity', .3);

		// ADD PROGRESSBAR (EACH FILE HAS 1 PROGRESSBAR)
		file.pbar = new ProgressBar.Circle(jdiv[0], {
			//color: 'black',
			trailColor: self.options.progressBarColor1,
			color: self.options.progressBarColor2,
			strokeWidth: 5,
			trailWidth: 5,
			duration: 1500,
			text:{ value: ''},
			step: function(state, bar){
				if (self.vars.p){
					if (state.color){
						self.vars.p.path.setAttribute('stroke', state.color);
						//bar.setText('');
					} else {
						self.vars.p.path.setAttribute('stroke', self.options.progressBarColor2);
						//bar.setText((bar.value() * 100).toFixed(0) + '%');
					}
				}
			}
		});

		// POSITION THE BAR
		var size = parseInt(self.options.progressBarSize);
		var svg = jdiv.find('svg').width(size).height(size);

		//////////////////////////////////////////////////////////
		// UPLOAD TO THE SERVER
		//////////////////////////////////////////////////////////
		if (self.options.target){
			// upload after all pbar are created
			var	selected = robj.files.length;
			++robj.added;
			console.log('check uploading..', robj.added + '/' + selected);
			if (robj.added == selected)
			{
				robj.upload();
			}
		}
	},

	/////////////////////////////////////////////////////////////////////////////////

	_resetHighlight: function(hovering){
		//console.log('_resetHighlight', hovering);
		//$('.uploader_gallery .uploader_trash').hide();
		//console.log($('img.uploader_image, video.uploader_video').length);
		var color_default = '#e0e0e0';
		$('img.uploader_image, video.uploader_video')
			.css({
				//borderColor: color_default,
				borderTopColor: color_default,
				borderBottomColor: color_default,
				borderLeftColor: color_default,
				borderRightColor: color_default,
			})
			.attr('hovering', hovering)
		;
	//	console.log($('img.uploader_image').parent().html())
	},

	////////////////////////////////////////////////////////////////////////////////////////

	_setTrash: function(jdiv){
		var self = this;
		jtrash = $('<div class="uploader_trash"></div>')
			.click(function(e){
				var jobj = $(this),
					jdiv = jobj.parent(),
					file_id = jdiv.attr('file_id')
					media_id = jdiv.attr('media_id')
				;
				console.log('ondelete', jdiv);
				//if (confirm('delete? file_id=' + file_id + ' media_id=' + media_id)){
				if (confirm('Delete this?')){
					///////////////////////////////////////////////////////////////
					// step 1: remove from DOM (first else locked file)
					///////////////////////////////////////////////////////////////
					var jdiv = jobj.parent();
					console.log('remove div', jdiv);
					jdiv.remove();

					/////////////////////////////////////////////////////////////////////////////////
					// step 2: if it is still uploading, remove it by resumable
					/////////////////////////////////////////////////////////////////////////////////
					if (file_id != 0){

						// cancel resumable
						console.log('remove reumable file_id='+file_id);
						var file = self.vars.r.getFromUniqueIdentifier(file_id);
						if (file){
							self.vars.r.removeFile(file);
						}
						// remove this image from the gallery
						//jobj.parent().remove();
						//console.log('files', self.vars.r.files);
					}
					/////////////////////////////////////////////////////////////////////////////////
					// step 4: remove it from uploader arr
					/////////////////////////////////////////////////////////////////////////////////
					for (var i = 0 ; i < self.options.media_arr; i++){
						var media = self.options.media_arr[i];
						if (media.media_id == media_id){
							media_arr.splice(i, 1);
							break;
						}
					}

					/////////////////////////////////////////////////////////////////////////////////
					// step 5: already uploaded, remove it from the server
					/////////////////////////////////////////////////////////////////////////////////
					// IN ORDER TO SHOW THE EFFECT OF DELETION, ADD TIME DELAY
					self.options.onRemove && self.options.onRemove(media_id);

					// after deletion: call onUpdate
					self._callOnUpdate();
				}
				// stop propagate to open lightbox
				e.stopPropagation();

			}).appendTo(jdiv);
	},

	/////////////////////////////////////////////////////////////////////////////////////////

	_callOnUpdate: function(){
		var self = this;
		if (self.options.onUpdate){
			var media_arr = self.getMediaArr();
			var media_id_arr = self.getMediaIDArr();
			self.options.onUpdate(media_arr, media_id_arr);
		}
	},

	/////////////////////////////////////////////////////////////////////////////////////////

	getMediaArr: function(){
		var self = this;
		var media_arr = [];
		self.options.gallery.find('>div').each(function(){
			var jdiv = $(this),
				jobj = jdiv.find(':first-child'),
				tagName = jobj.prop('tagName'),
				file_name = jdiv.attr('file_name'),
				file_cat = ''
			;
			switch (tagName){
				case 'IMG': 	file_cat = 'image'; break;
				case 'VIDEO':	file_cat = 'video'; break;
			}
			var media = {
				media_id: parseInt(jdiv.attr('media_id')),
				file_name: file_name,
				file_cat: file_cat,
			}
			//console.log(media);
			media_arr.push(media);
		});
		return media_arr;
	},

	/////////////////////////////////////////////////////////////////////////////////////////

	getMediaIDArr: function(){
		var self = this;
		var media_id_arr = [];
		self.options.gallery.find('>div').each(function(){
			media_id_arr.push(parseInt($(this).attr('media_id')));
		});
		return media_id_arr;
	},

	/////////////////////////////////////////////////////////////////////////////////////////
	//
	// public widget method
	// https://learn.jquery.com/jquery-ui/widget-factory/widget-method-invocation/
	//
	loadGallery: function(media_arr){//, jgallery){
		//console.log('loadGallery', media_arr);
		var self = this;
		var bAddTrash = self.options.trash ? 1 : 0;

		// reset the gallery
		//if (jgallery) self.options.gallery = jgallery;

		// empty gallery
		self.options.gallery.empty();

		// check media_arr
		if (media_arr){
			for (var i = 0; i < media_arr.length; i++){
				var
					media = media_arr[i],
					media_id = media.media_id,
					file_cat = media.file_cat,
					file_name = media.file_name;

				if (!file_name){
					console.error('loadGallery needs media_arr not media_id_arr');
					break;
				}
				var url = './' + self.options.mediaFolder + '/' + media.file_name

				//console.log(media.file_cat, media.file_name);
				// 1. CREATE EMPTY DIV (UPLOADER_CHILD)
				var jdiv = self._addChild(self.options.gallery, file_cat, 0, media_id, file_name);

				// 2. ADD PLAY BUTTON FOR THE VIDEO
				var jplaybut = file_cat == 'video' ? self._addPlayBut(jdiv) : 0;

				// 3. CREATE ELEMENT OF MEDIA (PREVIEW IF DONE)
				var jelement = self._addMediaElement(jdiv, file_cat, url);

				// 4. ADD TRASH
				if (bAddTrash){
					var jtrash = self._addTrash(jdiv);
				}
			}

		} else {
			//console.log('no any media');
		}
	},

	//////////////////////////////////////////////////////////////////////////

	getMedia: function(data_type, ids, onComplete){

		var
			self = this,
			input = {
				data_type:		data_type,
				ids:					JSON.stringify(ids),
			}
		;
		//console.log('getMedia', input);

		// RETRIEVE FROM DB
		call_svrop(

			// INPUT VARIABLES
			$.extend({type: 'get_media'}, input)

			// ON SUCCESS
			,function (obj){
				console.debug('getMedia succeeded', input, obj);
				self.loadGallery(obj.media_arr);
				onComplete && onComplete();
			},
			function (obj){
				console.error('failed', obj);
			}
		);
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////

	_dlog: function(s){
		switch (this.options.debugLvl)
		{
			case 1: console.log(s); break;
			case 2: console.log(s); break;
			case 3:	alert(s);	break;
		}
	},

	////////////////////////////////////////////////////////////
	// FOR NEW ALGORITHM 20161028
	////////////////////////////////////////////////////////////
	_addChild: function(jparent, file_cat, file_id, media_id, file_name){
		var
			self = this
			//size = parseInt(self.options.maxThumbNailSize)
		;
		var jdiv = $('<div/>')
					//.width(size)
					//.height(size)
					.addClass('uploader_child')
					.attr('file_cat', file_cat)
					.attr('file_id', file_id)
					.attr('media_id', media_id)
					.attr('file_name', file_name)
					.appendTo(jparent)
		//if (file_cat == 'video')
		{
			jdiv.addClass('uploader_loading')
				//css('background', 'black')
				//.css('margin', '9px');
		}
		return jdiv;
	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	_addProgressBar2: function(jdiv){
		// ADD PROGRESSBAR (EACH FILE HAS 1 PROGRESSBAR)
		var
			self = this,
			pbar = new ProgressBar.Circle(jdiv[0], {
				trailColor: self.options.progressBarColor1,
				color: self.options.progressBarColor2,
				strokeWidth: self.options.progressBarSize,
				trailWidth: self.options.progressBarSize,
				duration: 1500,
				text:{ value: ''},
				step: function(state, bar){
					if (self.vars.p){
						if (state.color){
							self.vars.p.path.setAttribute('stroke', state.color);
						} else {
							self.vars.p.path.setAttribute('stroke', self.options.progressBarColor2);
						}
					}
				}
			});
		return pbar;
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////

	_addTrash: function(jdiv){
		var self = this;
		jtrash = $('<div class="uploader_trash"></div>')
			.click(function(e){
				var jobj = $(this),
					jdiv = jobj.parent(),
					file_id = jdiv.attr('file_id')
					media_id = jdiv.attr('media_id')
				;
				console.log('ondelete', jdiv);
				//if (confirm('delete? file_id=' + file_id + ' media_id=' + media_id)){
				if (confirm('Delete this?')){
					///////////////////////////////////////////////////////////////
					// step 1: remove this image from the gallery
					// do this first else locked file
					///////////////////////////////////////////////////////////////
					var jdiv = jobj.parent();
					console.log('remove div', jdiv);
					//jdiv.hide();
					jdiv.remove();

					/////////////////////////////////////////////////////////////////////////////////
					// case 1. if it is still uploading, remove it by resumable
					/////////////////////////////////////////////////////////////////////////////////
					if (file_id != 0){

						// cancel resumable
						console.log('remove reumable file_id='+file_id);
						var file = self.vars.r.getFromUniqueIdentifier(file_id);
						if (file){
							self.vars.r.removeFile(file);
						}
						// remove this image from the gallery
						//jobj.parent().remove();
						//console.log('files', self.vars.r.files);
					}

					/////////////////////////////////////////////////////////////////////////////////
					// case 2. already uploaded, remove it from the server
					/////////////////////////////////////////////////////////////////////////////////
					// IN ORDER TO SHOW THE EFFECT OF DELETION, ADD TIME DELAY
					self.options.onRemove && self.options.onRemove(media_id);

					// after deletion: call onUpdate
					self._callOnUpdate();
				}
				// stop propagate to open lightbox
				e.stopPropagation();

			}).appendTo(jdiv);
		return jtrash;
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////

	_addPlayBut: function(jdiv){
		return $('<div class="uploader_play"></div>').appendTo(jdiv);
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////

	_addMediaElement: function(jdiv, file_cat, url){
		var
			self = this,
			//size = parseInt(this.options.maxThumbNailSize)
			jelement = 0
		;
		switch (file_cat){

			case 'video':
				jelement = $('<video class="uploader_video"/>').hide()	// in case the video has a cross thru it, hide it
					//.width(size)
					//.height(size)
					.css('backgroundColor', 'black')
					.on('loadedmetadata', function(e){
						var jelement = $(this).show();	// show back
						self._onMediaLoaded(jelement);
					})
				;
				break;

			case 'image':
				jelement = $('<img class="uploader_image"/>').hide()	// for preload purpupose
					//.width(size)
					//.height(size)
					.load(function(){
						self._onMediaLoaded($(this));
					})
				;
				break;
		}
		if (jelement){
			jelement
				.attr('src', url)
			//$('<a class="fgallery" href="' + url + '"/>')
				//.append(jelement)
				.appendTo(jdiv)
			;
		}
		return jelement;
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////

	_onMediaLoaded: function(jobj){
		var
			self = this,
			jdiv = jobj.closest('div'),
			file_cat = jdiv.attr('file_cat'),
			loaded = jobj.attr('loaded') == 1,
			size = parseInt(this.options.maxThumbNailSize)
		;
		if (!loaded){

			// RETRIEVE THE WIDTH AND HEIGHT
			var w = 0, h = 0;
			switch (file_cat){

				case 'video':
					w = jobj[0].videoWidth;
					h = jobj[0].videoHeight;
					break;

				case 'image':
					w = jobj[0].width;
					h = jobj[0].height;
					break;
			}
			self._dlog('onmedialoaded: '+w+'x'+h);

			// REMOVE THE BACKGROUND COLOR
			//jdiv.css('background', 'none')
				//.css('margin', '0px');
			jdiv.removeClass('uploader_loading');

			// SET AS LOADED (PREVENT A CONVERSION)
			jobj.attr('w', w).attr('h', h).attr('loaded', 1).width(size).height(size).show();

			// SET HOVERING
			var color_default = '#e0e0e0', color_highlight = '#228b22';	// foresetgreen
			jobj
				.hover(function(e){
					var jobj = $(this);
					// prevent effect in lightbox
					if (jobj.closest('.featherlight').length){
						return;
					}
					if (jobj.attr('hovering') != 1){
						jobj
							.attr('hovering', 1)
							.animate({
								borderTopColor: color_highlight,
								borderBottomColor: color_highlight,
								borderLeftColor: color_highlight,
								borderRightColor: color_highlight,
							}, 1000);
					}
				})
				// LEAVE TO FADE OUT BORDER
				.mouseleave(function(e){

					var jobj = $(this);
					// prevent effect in lightbox
					if (jobj.closest('.featherlight').length){
						return;
					}

					if (jobj.attr('hovering') == 1){
						jobj
							.attr('hovering', 0)
							.animate({
								borderTopColor: color_default,
								borderBottomColor: color_default,
								borderLeftColor: color_default,
								borderRightColor: color_default,
							}, 500);
					}
				})
			;

			// SHOW THIS
			self.options.gallery.show();//css('display', 'block');
			jdiv.show();
			//self._dlog('onmedialoaded: ' + w +'x' + h);
			///////////////////////////////////////////////////////////////////////
			// SET CLICK TO LIGHTBOX
			///////////////////////////////////////////////////////////////////////
			self._addClick(jobj);

		}
	},

	///////////////////////////////////////////////////////////////////////////////
	// ADD CLICK TO OPEN LIGHTBOX
	///////////////////////////////////////////////////////////////////////////////

	_addClick: function(jobj){
		var self = this;
		jobj.click(function(){

			// prevent effect in lightbox
			if (!jobj.closest('.featherlight').length){
				// OPEN LIGHT BOX
				self._openLightBox(jobj);
			}
		});
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	_openLightBox: function(jelement){

		var self = this;
		var jdiv = 0;

		if (jelement.prop('tagName') == 'DIV'){
			jdiv = jelement;
			jelement = jdiv.find('video, img');
		} else {
			jdiv = jelement.closest('div');
		}

		var file_cat = jdiv.attr('file_cat'),
			url = jelement.attr('src')
		;

		//console.log('open video', url);
		self._resetHighlight(1);

		// MARK FOR GALLEARY NAVIGATION
		$('.lightbox_selected').removeClass('lightbox_selected');
		jelement.parent().addClass('lightbox_selected');


		// CREATE A NEW ELEMENT AND OPEN LIGHTBOX
		switch (file_cat){

			case 'video':

				var jvideo = $('<video controls autoplay/>')
					.on('loadedmetadata', function(e){
						// OPEN LIGHTBOX (VIDEO)
						self._openLightBox2(jvideo, this.videoWidth, this.videoHeight);
					}).attr('src', url);
				break;

			case 'image':
				var	jimage = $('<img class="uploader_image"/>')
					.load(function(e){
						// OPEN LIGHTBOX (IMAGE)
						self._openLightBox2(jimage, this.width, this.height);
					}).attr('src', url);

				break;
		}
	},

	////////////////////////////////////////////////////////////////////////////////////////

	_openLightBox2: function(jelement, w, h){
		// LOADING
		if (jelement.attr('loaded_lightbox') != 1){
			jelement.attr('loaded_lightbox', 1);

			var
				self = this,
				sw = parseInt(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth) * self.vars.marginratio,
				sh = parseInt(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight) * self.vars.marginratio,
				//w = parseInt(jelement.attr('w')),
				//h = parseInt(jelement.attr('h')),
				w = parseInt(w),
				h = parseInt(h),
				ratio = w / h
			;
			// SET NEW WIDTH AND RATIO
			if (w > sw){
				w = sw;
				h = w / ratio;
			}
			if (h > sh){
				h = sh;
				w = h * ratio;
			}
			jelement.width(w).height(h);

			$.featherlight(jelement, {

					closeOnClick: 'background',

					beforeOpen: function(){
						console.log('beforeOpen');
						$('.featherlight-content').hide();	// avoid showing unloaded box
					},

					afterContent: function(){
						console.log('afterContent');

						var
							feather = this;
							self2 = self;
							jprev = $('<span title="previous" class="featherlight-previous"><span>&#9664;</span></span>')
								.click(function(){
									console.log('pressed prev');
									var jdiv = $('.lightbox_selected').prev();
									if (!jdiv.length){
										jdiv = self.options.gallery.find('.uploader_child:last-child')
									}
									feather.close();
									self2._openLightBox(jdiv);
								}),
							jnext = $('<span title="next" class="featherlight-next"><span>&#9654</span></span>')
								.click(function(){
									console.log('pressed next');
									var	jdiv = $('.lightbox_selected').next();
									if (!jdiv.length){
										jdiv = self.options.gallery.find('.uploader_child:first-child')
									}
									feather.close();
									self2._openLightBox(jdiv);
								})
						;
						var jobj = this.$content;
						jobj.parent()
							.append(jprev)
							.append(jnext)
						;
						$('.featherlight-content').fadeIn(1000);
					},
					afterOpen: function(){
						//console.log('afterOpen');
					},
					beforeClose: function(){
						//console.log('afterClose');
						$('.featherlight-content').fadeOut(1000);
						if (jelement.prop('tagName') == 'VIDEO'){
							jelement[0].pause();
						}
						jelement.remove();
						self._resetHighlight(0);
					},
			});
		}
	},
});

///////////////////////////////////////////////////////////////////////
// EASY CALLER
// - onload is needed as the instance are created after the callback
///////////////////////////////////////////////////////////////////////

function initUploader(jbutton, jgallery, data_type, ids, onUpdate){//, onLoad){

	// DEFINE COMMON INPUT
	var input = {
		data_type:		data_type,
		ids:					JSON.stringify(ids),
	}

	// CREATE UPLOADER
	jbutton.uploader({

		gallery: jgallery,
		target: './svrop.php',

		// SAVE TO COLLECTION
		query: 	$.extend({type: 'ul_media'}, input),

		// LOAD MEDIA
		//media_arr: media_arr,

		onLoad: function(uid){
			console.debug('onload', uid);
		},

		// ON UPDATE
		onUpdate: function(media_arr, media_id_arr){
			console.log('onUpdate', media_arr, media_id_arr);
			onUpdate && onUpdate(media_arr, media_id_arr);
		},

		// ON REMOVE
		onRemove: function(media_id){
			var self = this;
			if (media_id != 0){

				console.log('remove from server media_id=' + media_id);

				// call server to delete this image
				call_svrop(
					$.extend({type: 'remove_media', media_id: media_id}, input)
					// ON REMOVE SUCCESS
					,function (obj){
						console.log('remove succeeded', obj);
					}
					// ON REMOVE FAILED
					,function (obj){
						console.error('failed', obj);
					}
				)
			}
		}
	});

	///////////////////////////////////////////
	// LOAD THE GALLERY
	///////////////////////////////////////////
	//jbutton.uploader('getMedia', data_type, ids);
}
