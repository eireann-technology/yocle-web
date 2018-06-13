///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// a.uploader: my own uploader class
// 		by alantypoon 20161024
// Description:
//	A jQuery plugin to upload file with a progress dialog. Each instance contain its own object instances of resumable and progressbar
//	It may pause, resume, cancel and a progress with percentage is shown
//
// Public methods:
//  - called by jimg.uploader('loadGallery');
//
// References
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
		parentClass:				0,
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
	
	setEditable: function(bEditable){
		this.options.trash = bEditable ? 1 : 0;
	},
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// create
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_create: function() {
		var self1 = this,
				el = self1.element,	// a single element (a collection break down)
				opt = self1.options
		;
		el.addClass('uploader_init');
		if (opt.gallery){
			opt.gallery.addClass('uploader_gallery');
		} else {
			// for display lightbox only
			console.info('no gallery');
		}
		
		// CHECK IF IT IS INPUT[TYPE=FILE] or just a readable 
		if (el.prop("tagName") != 'INPUT' || el.attr('type').toUpperCase() != 'FILE'){
		
			// ERROR
			if (!self1.options.media_arr || !self1.options.media_arr.length){
				//console.error('no input button associated.');
			}
			self1.options.trash = 0;
			
		} else {
		
			// USE CUSTOMIZED BUTTON
			//console.log(el, opt);
			el.uniqueId().hide();
			var uid = el.attr('id');
			el.after('<label for="' + uid + '" class="uploader_label">' + el.attr('data-title') + '</label>');
			el.attr('uid', uid);
			
			// DEBUG
			console.log('uploader created', uid);//, this.vars.browser);
						
			////////////////////////////////////////////////
			// CREATE RESUMABLE
			////////////////////////////////////////////////
			var r = new Resumable({
				target: self1.options.target,
				query: self1.options.query,
				testChunks: 0,	// overwrite everytime
			});
			r.added = 0;
			r.uid = uid;
			//console.log('resumable', uid, r);
			try {
				r.assignBrowse(el[0]);
			} catch (e){
				console.error('resumablejs error');
				return;
			}
			self1.vars.r = r;
			
			// EVENTS
			self1.vars.r.on('fileAdded', function(file){

				var robj = this;	// resumable obj
				
				//////////////////////////////////////////////////////////
				// ONFILEADDED
				//////////////////////////////////////////////////////////
				// FIND THE LOCAL FILE
				var
					uid = robj.uid,
					file_id = file.uniqueIdentifier,
					file_name = file.fileName,
					file_cat = self1._mime2cat(file.file.type),
					blob_url = URL.createObjectURL(file.file)
				;
				//console.log('fileAdded uid=' + uid, file);
				//self1._dlog('fileAdded mimetype=' + file.file.type + ' file_cat=' + file_cat + ' file_id='+file_id);
				console.log('fileAdded uid=' + uid);
				
				////////////////////////////////////////////////////////////
				// ADD PREVIEW (=DESTINATION)
				////////////////////////////////////////////////////////////
				if (!file_cat || file_cat == ''){
				
					self1._dlog('unrecognizable mime type' + file.file.type);
					//console.error('unrecognizable mime type', file.file.type);
					// remove file_id
					self1.vars.r.removeFile(file);
					
				} else if (self1.options.gallery){
				
					//////////////////////////////////////////////////////////////////
					// SEPARATE UPLOAD AND MEDIA ELEMENT LOADING
					//////////////////////////////////////////////////////////////////
					var media_desc = '';
					file.jdiv = self1.createElement(self1.options.gallery, file_cat, file_id, 0, file_name, blob_url, 1, media_desc);	
					file.pbar = self1._addProgressBar2(file.jdiv);
					
					// 6. START UPLOAD
					//setTimeout(function(){
						robj.upload();
					//}, 0);
					
					// 7. AFTER UPLOADING IF THE MEDIA IS STILL NOT LOADED, CALL SERVER FOR CONVERSION AND UPDATE THE VIDEO TO BE THE CONVERTED VIDEO
				}
			});
			
			///////////////////////////////////////////////////////////////////////////////////////////////////////
			
			self1.vars.r.on('fileProgress', function(file){
				var robj = this;
				var progress = file.progress();
				console.log('fileProgress uid=' + uid, progress);
				//self1._dlog('_fileProgress: ' + progress);
				//debugger;
				if (file.pbar){
					file.pbar.set(progress);	// (0-1, 1=100%)
				} else {
					console.error('file.pbar not created yet');
				}
			});
			
			///////////////////////////////////////////////////////////////////////////////////////////////////////
			// right after a file is uploaded
			
			self1.vars.r.on('fileSuccess', function(file, message){
				var robj = this;
				var jdiv = file.jdiv,
					jsvg = jdiv.find('svg'),
					file_cat = self1._mime2cat(file.file.type);
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
				var file = self1.vars.r.getFromUniqueIdentifier(file_id);
				self1.vars.r.removeFile(file);
				jdiv.attr('file_id', 0);

				// reset opacity
				jdiv.find('.uploader_child:first-child').css('opacity', 1);

				// after addition: call onUpdate
				self1._callOnUpdate();

				console.log('fileSuccess uid=' + uid, 'media_id='+media_id);

				//self1._dlog('fileSuccess mimetype=' + file.file.type + ' file_cat=' + file_cat + ' file_id='+file_id + ' media_id='+media_id);

				// DELAY TO REMOVE PROGRESSBAR
				setTimeout(function(){	// add delay to show 100% pbar
				
					//self1._dlog('fileSuccess2');
					var jtop = jsvg.closest('.div_gallery_item');
					//jtop.find('.uploader_loading').remove();
					jtop.find('.uploader_trash, .uploader_play').show();
					
					// remove progressbar
					jsvg.remove();

					// ERROR?
					if (error){
						console.error('Error: ' +  error + '. The file ' + file_name + ' is removed');//, file, message);
						//self1._dlog('Error: ' +  error + '. The file ' + file_name + ' is removed');
						jdiv.remove();
						
					} else if (file_cat == 'video'){
					
						var jvideo = jdiv.find('video');
						if (jvideo.attr('loaded') != 1){
							// 7. (after fileAdded) IF THE MEDIA IS STILL NOT LOADED, CALL SERVER FOR CONVERSION AND UPDATE THE VIDEO TO BE THE CONVERTED VIDEO
							self1._dlog('CALL SERVER FOR A CONVERSION NOW');
						}
					}
					
				}, 500);
			});

			///////////////////////////////////////////////////////////////////////////////////////////////////////
			
			self1.vars.r.on('complete', function(){

				var robj = this;
				console.info('auploader complete', robj.uid);
				robj.cancel();	// restart
				robj.added = 0;
			
			});
			
			///////////////////////////////////////////////////////////////////////////////////////////////////////
			
			self1.vars.r.on('fileError', function(file, message){
				var robj = this;
				//console.error('fileError', uid, file);
				//self1._dlog('fileError: ' + message);
				//alert('fileError: ' + message);

				// remove demo
				file.jdiv.remove();

				// remove file
				self1.vars.r.removeFile(file);

				// show alert message
				alert(message);
			});
		
			self1.options.onLoad && self1.options.onLoad(uid);
		}
		
		///////////////////////////////////////////////////////////////////////////////////////////////////////
	
		if (self1.options.media_arr && self1.options.media_arr.length > 0){
			self1.loadGallery(self1.options.media_arr);
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
		var	self1 = this;	// a.uploader
		
		//self1._dlog('_addProgressBar: file=' + file);
		
		// add opacity to the image or video
		var jobj = jdiv.find(':first-child');
		jobj.css('opacity', .3);		
		
		// ADD PROGRESSBAR (EACH FILE HAS 1 PROGRESSBAR)
		file.pbar = new ProgressBar.Circle(jdiv[0], {
			//color: 'black',
			trailColor: self1.options.progressBarColor1,
			color: self1.options.progressBarColor2,
			strokeWidth: 5,
			trailWidth: 5,
			duration: 1500,
			text:{ value: ''},
			step: function(state, bar){
				if (self1.vars.p){
					if (state.color){
						self1.vars.p.path.setAttribute('stroke', state.color);			
						//bar.setText('');
					} else {
						self1.vars.p.path.setAttribute('stroke', self1.options.progressBarColor2);
						//bar.setText((bar.value() * 100).toFixed(0) + '%');
					}
				}
			}
		});

		// POSITION THE BAR
		var size = parseInt(self1.options.progressBarSize);
		var svg = jdiv.find('svg').width(size).height(size);
	
		//////////////////////////////////////////////////////////
		// UPLOAD TO THE SERVER
		//////////////////////////////////////////////////////////
		if (self1.options.target){
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
	},
	
	////////////////////////////////////////////////////////////////////////////////////////
	
	_callOnUpdate: function(){
		var self1 = this;
		if (self1.options.onUpdate){
			var media_arr = self1.getMediaArr();
			var media_id_arr = self1.getMediaIDArr();
			self1.options.onUpdate(media_arr, media_id_arr);
		}
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////
	
	getMediaArr: function(){
		var self1 = this;
		var media_arr = [];
		self1.options.gallery.find('>div').each(function(){
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
	//
	// public widget method
	// https://learn.jquery.com/jquery-ui/widget-factory/widget-method-invocation/
	//
	loadGallery: function(media_arr){//, jgallery){
		var self1 = this;
		var bEditable = self1.options.trash ? 1 : 0;
		
		//console.log('loadGallery', 'addtrash='+self1.options.trash, media_arr);
		
		// empty gallery
		if (self1.options.gallery){
			self1.options.gallery.empty();
		}
		
		// check media_arr
		if (media_arr){
			for (var i = 0; i < media_arr.length; i++){
				var
					media = media_arr[i],
					media_id = media.media_id,
					file_cat = media.file_cat,
					file_name = media.file_name,
					media_desc = media.media_desc ? media.media_desc : '' 
				;

				if (!file_name){
					console.error('loadGallery needs media_arr not media_id_arr');
					break;
				}
				var url = './' + self1.options.mediaFolder + '/' + media.file_name;
				
				var jdiv = self1.createElement(self1.options.gallery, file_cat, 0, media_id, file_name, url, bEditable, media_desc);
				
			}
			
		} else {
			//console.log('no any media');
		}
	},
	
	
	//////////////////////////////////////////////////////////////////////////
	
	createElement: function(jparent, file_cat, file_id, media_id, file_name, url, bEditable, media_desc){
		var self1 = this;		
		
		// 1. CREATE EMPTY DIV (UPLOADER_CHILD)
		var jdiv = self1._addChild(jparent, file_cat, 0, media_id, file_name, media_desc, bEditable);
		
		// 2. CREATE ELEMENT OF MEDIA (PREVIEW IF DONE)
		var jelement = self1._addMediaElement(jdiv.find('.uploader_child'), file_cat, url);
		
		// 3. ADD TRASH
		if (bEditable){
			var jtrash = self1._addTrash(jdiv);
		}
		// 4. ADD PLAY BUTTON FOR THE VIDEO
		var bAddPlay = file_cat == 'video';
		if (bAddPlay){
			var jplaybut = self1._addPlayBut(jdiv);
		}
		// 5. ADJUSTMENT
		if (!bEditable && bAddPlay){
			jdiv.find('.uploader_play').css('top', -120)
		}
		return jdiv;
	},
	
	//////////////////////////////////////////////////////////////////////////
	
	getMedia: function(data_type, ids, onComplete){
	
		//console.debug('getMedia', data_type, ids, onComplete);
		
		var self1 = this,
			input = {
				type: 				'get_media',
				data_type:		data_type,
				ids:					JSON.stringify(ids),
			}
		;
		//console.log('getMedia1', input);
		
		// RETRIEVE FROM DB
		call_svrop(
		
			// INPUT VARIABLES
			input,
			
			// ON SUCCESS
			function (obj){
				var media_arr = obj.media_arr;
				console.debug('getMedia', data_type, media_arr);
				self1.loadGallery(media_arr);
				onComplete && onComplete();
			},
			function (obj){
				console.error('failed', obj);
			}
		);	
	},
	
	getMedia2: function(media_id_arr, onComplete){
		// RETRIEVE FROM DB
		call_svrop(
			{
				type: 'get_media',
				media_id_arr: media_id_arr,
			},
			// ON SUCCESS
			function (obj){
				console.info('getMedia2 succeeded', input, obj);
				self1.loadGallery(obj.media_arr);
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
	_addChild: function(jparent, file_cat, file_id, media_id, file_name, media_desc, bEditable){
		
		var	self1 = this;
		if (!media_desc) media_desc = '';
		var jdiv = $(
			'<div class="div_gallery_item" file_cat="' + file_cat + '" file_id="' + file_id + '" media_id="' + media_id + '" file_name="' + file_name + '" >'
				+ '<table class="uploader_tbl"><tr>'
					+ '<td style="width:1px"><div class="uploader_child"></div></td>'
					+ '<td><div class="uploader_desc"' + (bEditable ? ' contenteditable="true"' : '') + '>' + media_desc + '</div></td>'
				+ '</tr></table>'
			+ '</div>'
		)
		.appendTo(jparent);
		
		return jdiv;
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	_addProgressBar2: function(jdiv){
		// ADD PROGRESSBAR (EACH FILE HAS 1 PROGRESSBAR)
		var	self1 = this,
			pbar = new ProgressBar.Circle(jdiv[0], {
				trailColor: self1.options.progressBarColor1,
				color: self1.options.progressBarColor2,
				strokeWidth: self1.options.progressBarSize,
				trailWidth: self1.options.progressBarSize,
				duration: 1500,
				text:{ value: ''},
				step: function(state, bar){
					if (self1.vars.p){
						if (state.color){
							self1.vars.p.path.setAttribute('stroke', state.color);			
						} else {
							self1.vars.p.path.setAttribute('stroke', self1.options.progressBarColor2);
						}
					}
				}
			});
		return pbar;
	},

	//////////////////////////////////////////////////////////////////////////////////////////////////////////

	_addTrash: function(jdiv){
		var self1 = this;
		jtrash = $('<div class="uploader_trash"></div>')
			.click(function(e){
				var jobj = $(this),
					jdiv = jobj.parent(),
					file_id = jdiv.attr('file_id'),
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
						var file = self1.vars.r.getFromUniqueIdentifier(file_id);
						if (file){
							self1.vars.r.removeFile(file);
						}
						// remove this image from the gallery
						//jobj.parent().remove();
						//console.log('files', self1.vars.r.files);
					}
					
					/////////////////////////////////////////////////////////////////////////////////
					// case 2. already uploaded, remove it from the server
					/////////////////////////////////////////////////////////////////////////////////
					// IN ORDER TO SHOW THE EFFECT OF DELETION, ADD TIME DELAY
					self1.options.onRemove && self1.options.onRemove(media_id);
					
					// after deletion: call onUpdate
					self1._callOnUpdate();
				}
				// stop propagate to open lightbox
				e.stopPropagation();
				
			}).appendTo(jdiv);	// .find('.td_uploader_child')
		return jtrash;
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////
	
	_addPlayBut: function(jdiv){
		return $('<div class="uploader_play"></div>').appendTo(jdiv);
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////
	
	_addMediaElement: function(jdiv, file_cat, url){
		var	self1 = this,
			jelement = 0
		;
		switch (file_cat){
		
			case 'video':
				jelement = $('<video class="uploader_video"/>').hide()	// in case the video has a cross thru it, hide it
					//.width(size).height(size)
					.css('backgroundColor', 'black')
					.on('loadedmetadata', function(e){
						var jelement = $(this).show();	// show back
						self1._onMediaLoaded(jelement);
					})
				;
				break;
				
			case 'image':
				jelement = $('<img class="uploader_image"/>').hide()	// for preload purpupose
					//.width(size).height(size)
					.load(function(){
						self1._onMediaLoaded($(this));
					})
				;
				break;
		}
		if (jelement){
			jelement
				.attr('src', url)
				.appendTo(jdiv)
			;
		}
		return jelement;
	},
	
	/////////////////////////////////////////////////////////////////////////////////////////////////

	_onMediaLoaded: function(jobj){
		var	self1 = this,
			jtop = jobj.closest('.div_gallery_item'),
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
			//console.info('onmedialoaded: '+w+'x'+h, jobj.attr('src'));
			
			// REMOVE THE BACKGROUND COLOR
			//jtop.find('.uploader_loading').remove();
			if (!jtop.find('svg').length){
				jtop.find('.uploader_trash, .uploader_play').show();
			}
			
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
			if (self1.options.gallery){
				self1.options.gallery.show();//css('display', 'block');
			}
			jdiv.show(); 
			
			///////////////////////////////////////////////////////////////////////
			// SET CLICK TO LIGHTBOX
			///////////////////////////////////////////////////////////////////////
			// the media tag
			self1._addClick(jobj);
			
			// play button
			var jplay = jtop.find('.uploader_play')
			self1._addClick(jplay);

		}
	},
	
	///////////////////////////////////////////////////////////////////////////////
	// ADD CLICK TO OPEN LIGHTBOX
	///////////////////////////////////////////////////////////////////////////////
	
	_addClick: function(jobj){
		var self1 = this;
		jobj.click(function(){
			// prevent effect in lightbox
			if (!jobj.closest('.featherlight').length){
				// OPEN LIGHT BOX
				self1._openLightBox(jobj);
			}
		});
	},
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	_openLightBox: function(jelement){
	
		var self1 = this;
		var jdiv = 0;

		if (jelement.hasClass('uploader_play')){
			
			jdiv = jelement.parent().find('.uploader_child');
			jelement = jdiv.find('video, img');
		
		} else if (jelement.prop('tagName') == 'DIV'){
			jdiv = jelement;
			jelement = jdiv.find('video, img');
		} else {
			jdiv = jelement.closest('div');
		}

		var file_cat = jdiv.attr('file_cat');
		if (!file_cat){
			var jtbl = jdiv.closest('.uploader_tbl'),
			file_cat = jtbl.parent().attr('file_cat');
		}

		var url = jelement.attr('src');
		
		//console.log('open video', url);
		self1._resetHighlight(1);
	
		// MARK FOR GALLEARY NAVIGATION
		$('.lightbox_selected').removeClass('lightbox_selected');
		
		var parentClass = self1.options.parentClass;
		if (!parentClass){
			self1.options.parentClass =
			parentClass = '.div_gallery_item';
		}
		var jparent = jelement.closest(parentClass);
		console.debug(jparent);
		jparent.addClass('lightbox_selected');
		
		// CREATE A NEW ELEMENT AND OPEN LIGHTBOX
		switch (file_cat){
		
			case 'video':

				var jvideo = $('<video controls/>')	// autoplay is not working here cos it will cause double playback (why?)
					.on('loadedmetadata', function(e){
						// OPEN LIGHTBOX (VIDEO)
						self1._openLightBox2(jvideo, this.videoWidth, this.videoHeight);
					}).attr('src', url);
				break;
				
			case 'image':
				var	jimage = $('<img class="uploader_image"/>')
					.load(function(e){
						// OPEN LIGHTBOX (IMAGE)
						self1._openLightBox2(jimage, this.width, this.height);
					}).attr('src', url);
				
				break;
		}
	},
	
	////////////////////////////////////////////////////////////////////////////////////////
	
	_openLightBox2: function(jelement, w, h){
		// LOADING
		if (jelement.attr('loaded_lightbox') != 1){
			jelement.attr('loaded_lightbox', 1);
			
			var	self1 = this,
				sw = parseInt(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth) * self1.vars.marginratio,
				sh = parseInt(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight) * self1.vars.marginratio,
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
						//console.log('beforeOpen');
						$('.featherlight-content').hide();	// avoid showing unloaded box
					},
					
					afterContent: function(){
						//console.log('afterContent');
						
						var
							feather = this;
							self2 = self1;
							
							//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
							
							jprev = $('<span title="previous" class="featherlight-previous"><span>&#9664;</span></span>')
								.click(function(){
									
									var jdiv = self1.options.gallery.find('.lightbox_selected').prev();
									if (!jdiv.length){
										var jparent = self1.options.gallery.find(self1.options.parentClass);
										if (jparent){
											jdiv = jparent.parent().find('.div_gallery_item:last-child');
										}
									}
									feather.close();
									if (!jdiv.length){
										console.error('prev item not found');
									} else if (jdiv.length > 1){
										console.error('prev too many: ' + jdiv.length);
									} else {
										self2._openLightBox(jdiv);
									}
							}),
							
							/////////////////////////////////////////////////////////////////////////////////////////////////
							
							jnext = $('<span title="next" class="featherlight-next"><span>&#9654</span></span>')
								.click(function(){
									
									var	jdiv = self1.options.gallery.find('.lightbox_selected').next();
									if (!jdiv.hasClass('.uploader_child')){
										jdiv = jdiv.find('.uploader_child');
									}									
									if (!jdiv.length){
										var jparent = self1.options.gallery.find(self1.options.parentClass);
										if (jparent){
											jdiv = jparent.parent().find('.div_gallery_item:first-child');
										}
									}
									feather.close();
									if (!jdiv.length){
										console.error('next item not found');
									} else if (jdiv.length > 1){
										console.error('next too many: ' + jdiv.length);
									} else {
										self2._openLightBox(jdiv);
									}
								})
						;					
						var jobj = this.$content;
						jobj.parent()
							.append(jprev)
							.append(jnext)
						;
						$('.featherlight-content').fadeIn(1000, function(){
							//jobj.find('video')[0].play();
							//console.info(jobj);
							if (jobj.prop('tagName') == 'VIDEO'){
								jobj[0].play();
							}
						});						
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
						self1._resetHighlight(0);
					},
			});
		}
	},

	/////////////////////////////////////////////////////////////////////////////////////////
	
	getMediaIDArr: function(){
		var self1 = this;
		var media_id_arr = [];
		self1.options.gallery.find('>div').each(function(){
			var media_id = parseInt($(this).attr('media_id'));
			//console.debug('getMediaIDArr media_id=', media_id);
			media_id_arr.push(media_id);
			//media_id_arr[media_id_arr.length] = media_id;
		});
		//console.debug('getMediaIDArr arr=', media_id_arr);
		return media_id_arr;
	},
	
	////////////////////////////////////////////////////////////////////////////
	// save media desc according to its media_id
	////////////////////////////////////////////////////////////////////////////
	getMediaDescHash: function(){
		// find media_desc
		var media_desc_hash = {};
		// loop thru the input
		this.options.gallery.find('.div_gallery_item').each(function(){
			var media_id = $(this).attr('media_id');
			var media_desc = $(this).find('.uploader_desc').html();
			media_desc_hash[media_id] = media_desc;
		});
		return media_desc_hash;
	},
	
	////////////////////////////////////////////////////////////////////////////
	
	saveMediaDesc: function(onComplete){
		console.debug('saveMediaDesc');
		var media_desc_hash = this.getMediaDescHash();
		call_svrop(
			{
				type: 'save_media_desc',
				media_desc_hash: media_desc_hash,
			}
			// ON SUCCESS
			,function (obj){
				console.info('saveMediaDesc succeeded');
				onComplete && onComplete();
			}
		);			
	},
});

///////////////////////////////////////////////////////////////////////
// EASY CALLER
// - onload is needed as the instance are created after the callback
///////////////////////////////////////////////////////////////////////

function initUploader(jbutton, jgallery, data_type, ids, onUpdate2, parentClass, bEditable){

	if (!bEditable) bEditable = 0;

	console.debug('initUploader', ids);

	// DEFINE COMMON INPUT
	var input = {
		type:					'ul_media',
		data_type:		data_type,
		ids:					JSON.stringify(ids),
	}
	if (!jbutton){
		jbutton = jgallery;
	}
	if (!parentClass){
		parentClass = 0;
	}
	// CREATE UPLOADER
	jbutton.uploader({
		
		trash: bEditable,

		gallery: jgallery,
		
		target: './svrop.php',
		
		// SAVE TO COLLECTION
		query: input,
		
		// LOAD MEDIA
		//media_arr: media_arr,
		
		onLoad: function(uid){
			console.info('onload', uid);
		},
		
		// ON UPDATE
		onUpdate: function(media_arr, media_id_arr){
			console.log('onUpdate', media_arr, media_id_arr);
			onUpdate2 && onUpdate2(media_arr, media_id_arr);
		},
		
		// ON REMOVE
		onRemove: function(media_id){
			var self1 = this;
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
				);
			}
		},
		parentClass: parentClass,
	});			

	///////////////////////////////////////////
	// LOAD THE GALLERY
	///////////////////////////////////////////
	jbutton.uploader('getMedia', data_type, ids);
	
	return jbutton;
}
