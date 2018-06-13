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
		gallery: null,
		maxThumbNailSize: 150,
		progressBarSize: 80,
		progressBarColor1: 'YellowGreen',
		progressBarColor2: 'ForestGreen',
		mediaFolder: 'media',
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
		p: 0,	// progressbar
		marginratio: .8,
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// create
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_create: function() {
		var el = this.element,	// a single element (a collection break down)
				opt = this.options
		;
		console.debug('create', this.vars.browser);
		
		// CHECK IF IT IS INPUT[TYPE=FILE]
		if (el.prop("tagName") != 'INPUT' || el.attr('type').toUpperCase() != 'FILE'){
		
			// ERROR
			console.error('<input type="file"...> not found');
			
		} else {
		
			// USE CUSTOMIZED BUTTON
			//console.log(el, opt);
			el.uniqueId().hide();
			var uid = el.attr('id');
			el.after('<label for="' + uid + '" class="uploader_label">' + el.attr('data-title') + '</label>');
						
			////////////////////////////////////////////////
			// CREATE RESUMABLE
			////////////////////////////////////////////////
			var self = this;
			self.vars.r = new Resumable({
				target: self.options.target,
				query: self.options.query,
				testChunks: 0,	// overwrite everytime
			});
			self.vars.r.added = 0;
			self.vars.r.uid = uid;
			console.debug('resumable', uid);
			
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
					file_cat = self._mime2cat(file.file.type);
					blob_url = URL.createObjectURL(file.file)
				;
				console.log('fileAdded', 'file_id='+file_id);
				//alert('fileAdded: ' + file_name + ' mime=' + file.file.type + ' cat=' + file_cat + ' blob=' + blob_url);
				
				////////////////////////////////////////////////////////////
				// ADD PREVIEW (=DESTINATION)
				////////////////////////////////////////////////////////////
				if (file_cat == ''){
				
					console.error('unrecognizable mime type', file.file.type);
					
				} else if (self.options.gallery){
				
					switch (file_cat){
						case 'image': self._previewImage(blob_url, file_id, 0, self._addProgressBar, robj, file); break;
						case 'video': self._previewVideo(blob_url, file_id, 0, self._addProgressBar, robj, file); break;
					}
				}
			});
			
			///////////////////////////////////////////////////////////////////////////////////////////////////////
			// right after a file is uploaded
			self.vars.r.on('fileSuccess', function(file, message){
				var jdiv = file.jdiv,
					jsvg = jdiv.find('svg'),
					media_id = file.media.media_id,
					file_id = file.uniqueIdentifier,
					file_size = file.size
				;
				console.log('fileSuccess', 'file_id='+file_id, 'media_id='+media_id);
				
				// remove file_id
				var file = self.vars.r.getFromUniqueIdentifier(file_id);
				self.vars.r.removeFile(file);
				jdiv.attr('file_id', 0);
				
				// remove progressbar
				jsvg.remove();
				
				// add media_id
				jdiv
					.attr('media_id', media_id)
					.find(':first-child').css('opacity', 1);
			});
			
			///////////////////////////////////////////////////////////////////////////////////////////////////////
			
			self.vars.r.on('fileProgress', function(file){
				var progress = file.progress();
				//console.log('fileProgress', uid, file.uniqueIdentifier, progress);
				file.pbar.set(progress);	// (0-1, 1=100%)
			});
			self.vars.r.on('fileError', function(file, message){
				console.error('fileError', uid, file);
			});
			self.vars.r.on('complete', function(){
				console.log('complete');
				this.cancel();	// restart
			});
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
		console.debug('_destroy');
		// remove resumable
		if (this.vars.r){
			delete this.vars.r;
			this.vars.r = 0;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// private methods
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// http://voice.firefallpro.com/2012/03/html5-audio-video-mime-types.html
	// http://help.encoding.com/knowledge-base/article/correct-mime-types-for-serving-video-files/
	_mime2cat: function(mime){
		var mimetype = mime.split('/')[1].toLowerCase(), cat = '';
		// get extension from mime type e.g. "application/pdf"
		switch (mimetype){
			case 'bmp':	case 'gif':	case 'png':	case 'jpg':	case 'jpeg':
				cat = 'image';
				break;
			case 'mp4':	case 'x-mpegURL': case 'MP2T':	case '3gpp': case 'quicktime': case 'x-msvideo': case 'x-ms-wmv': case 'ogg':
				cat = 'video';
				break;
			case 'aac':	case 'm4a':	case 'mpeg':	case 'wav':
				cat = 'audio';
				break;
		}
		return cat;
	},
	
	///////////////////////////////////////////////////////////////////////////
	
	_getThumbNailSize: function(w, h){
		var
			max = parseInt(this.options.maxThumbNailSize),
			ratio = w / h
		;
		if (w > h){
			w = max;
			h = w / ratio;
		} else {
			h = max;
			w = h * ratio;
		}
		return {
			w: max,	h: max,
		}
	},
	
	////////////////////////////////////////////////////////////
	// previewImage
	////////////////////////////////////////////////////////////
	_previewImage: function(url, file_id, media_id, onLoad, robj, file){
		//console.debug('_previewImage', url, media_id);
		var self = this,
			jobj = $('<img class="uploader_image"/>')
				.hide(),
			jtrash = $('<div class="uploader_trash"></div>'),
			jdiv = $('<div/>')
				.attr('file_id', file_id)
				.attr('media_id', media_id)
				.append(jobj)
				.append(jtrash)
		;
		if (file){
			jobj
				.attr('file_id', file.uniqueIdentifier)
				.attr('title', file.fileName)
			file.jdiv = jdiv; // REMEMBER THE DIV 
		}
		self.options.gallery.append(jdiv);
		jobj.load(function(){
			var w = parseInt($(this).prop('width')),
					h = parseInt($(this).prop('height'));
			self.options.gallery.show();
			var tn = self._getThumbNailSize(w, h);
			//console.debug('image', w+'x'+h, tn.w+'x'+tn.h);
			jobj
				.width(tn.w).height(tn.h)
				.show()
				// CLICK IMG TO OPEN LIGHTBOX
				.click(function(){
					//console.debug('open image', url);
					var self2 = self;
					self2._resetHighlight(1);
					$('<img/>').load(function(){
						var jimg = $(this);
						if (jimg.attr('loaded') != 1){
							jimg.attr('loaded', 1);
							var w = parseInt($(this).prop('width')),
									h = parseInt($(this).prop('height')),
									sw = parseInt(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth) * self2.vars.marginratio,
									sh = parseInt(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight) * self2.vars.marginratio
							;
							var ratio = w / h;
							if (w > sw){
								w = sw;
								h = w / ratio;
							}
							if (h > sh){
								h = sh;
								w = h * ratio;
							}
							jimg.width(w).height(h);
							$.featherlight(jimg, {
									closeOnClick: 'background',
									afterOpen: function(){
										//console.debug('afterOpen');
									},
									afterClose: function(){
										//console.debug('afterClose');
										self2._resetHighlight(0);
									},
							});
						}
					}).attr('src', url);
				});
			self._setHover(jobj);
			onLoad && onLoad.call(self, robj, file, jdiv, tn.w, tn.h);
		})
		.attr('src', url);
	},
	
	////////////////////////////////////////////////////////////
	// previewVideo
	////////////////////////////////////////////////////////////
	_previewVideo: function(url, file_id, media_id, onLoad, robj, file){
		//console.debug('_previewVideo', url, media_id);
		var self = this,
			jobj = $('<video class="uploader_video" autoplayx controlsx/>')
							.css('backgroundColor', 'black')
							.hide(),
			jplay = $('<div class="uploader_play"></div>');
			jtrash = $('<div class="uploader_trash"></div>'),
			jdiv = $('<div/>')
				.attr('file_id', file_id)
				.attr('media_id', media_id)
				.append(jobj)
				.append(jplay)
				.append(jtrash)
		;
		if (file){
			jobj
				.attr('file_id', file.uniqueIdentifier)
				.attr('title', file.fileName)
			file.jdiv = jdiv; // REMEMBER THE DIV 
		}
		// CLICK TO SHOW LIGHTBOX AND PLAYBACK VIDEO
		jdiv.click(function(){
			//console.debug('open video', url);
			self._resetHighlight(1);
			//if (this.paused){this.play(); jbut.fadeOut();}else{	this.pause();	jbut.fadeIn();}
			var self2 = self;
			var jvideo = $('<video controls autoplay/>')
				.on('loadedmetadata', function(e){
					var
						video = this,
						jvideo = $(video)
					;
					if (jvideo.attr('loaded') != 1){
						jvideo.attr('loaded', 1);
						var w = parseInt(video.videoWidth),
							h = parseInt(video.videoHeight)
							sw = parseInt(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth) * self2.vars.marginratio,
							sh = parseInt(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight) * self2.vars.marginratio
						;
						var ratio = w / h;
						if (w > sw){
							w = sw;
							h = w / ratio;
						}
						if (h > sh){
							h = sh;
							w = h * ratio;
						}
						jvideo.width(w).height(h);
						$.featherlight(jvideo, {
								closeOnClick: 'background',
								afterOpen: function(){
									//console.debug('afterOpen');
								},
								afterClose: function(){
									//console.debug('afterClose');
									video.pause();
									jvideo.remove();
									self2._resetHighlight(0);
								},
						});
					}
				}).attr('src', url);
		});

		// APPEND TO GALLERY
		self.options.gallery.append(jdiv);
		
		// CHECK LOADING
		jobj.on('loadedmetadata', function (e) {
			var w = parseInt(this.videoWidth),
					h = parseInt(this.videoHeight);
			self.options.gallery.show();
			var tn = self._getThumbNailSize(w, h);
			//console.debug('video', w+'x'+h, tn.w+'x'+tn.h);
			jobj.width(tn.w).height(tn.h).show();
			jdiv.find('.uploader_play').show();
			self._setHover(jobj);
			onLoad && onLoad.call(self, robj, file, jdiv, tn.w, tn.h);
		}).attr('src', url);
		
		//alert(jobj.wrapAll('<div/>').parent().html());
		
	},
	
	////////////////////////////////////////////////////////////
	// addProgressBar
	_addProgressBar: function(robj, file, jdiv, w, h){
		console.debug('_addProgressBar', robj.uid, file.uniqueIdentifier);
		////////////////////////////////////////////////////////////
		// ADD PROGRESS
		// https://kimmobrunfeldt.github.io/progressbar.js/
		////////////////////////////////////////////////////////////
		var	self = this;	// a.uploader
		
		// add opacity
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
	
		// WAIT FOR THE DRAWING
		setTimeout(function(){
			//////////////////////////////////////////////////////////
			// UPLOAD TO THE SERVER
			//////////////////////////////////////////////////////////
			if (self.options.target){
				//var	selected = robj.files.length;
				//++robj.added;
				//console.debug('check uploading..', robj.added + '/' + selected);
				//if (robj.added == selected)
				//{
					//robj.upload();
				//}
			}
		}, 100);
	},

	//////////////////////////////////////////////////////////////////////////////
	
	_setHover: function(jobj){
		var self = this;
		var color_default = '#e0e0e0', color_highlight = '#228b22';	// foresetgreen
		// ENTER TO FADE IN BORDER
		var jtrash = jobj.parent().find('.uploader_trash');
		jobj
			.hover(function(e){
				if ($(this).attr('hovering') != 1){
					//console.debug('hovering');
					// OBJECT
					$(this)
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
				if ($(this).attr('hovering') == 1){
					//console.debug('reset hovering');
					$(this)
						.attr('hovering', 0)
						.animate({
							borderTopColor: color_default,
							borderBottomColor: color_default,
							borderLeftColor: color_default,
							borderRightColor: color_default,
						}, 500);
				}
			})
			
		///////////////////////////////////////////////////////////////////////////////////
		// when the trash is clicked
		///////////////////////////////////////////////////////////////////////////////////
		jtrash.click(function(e){
		
			var jobj = $(this),
				jdiv = jobj.parent(),
				file_id = jdiv.attr('file_id')
				media_id = jdiv.attr('media_id')
			;
			console.debug('ondelete', jdiv);
			if (confirm('delete? file_id=' + file_id + ' media_id=' + media_id)){
			
				/////////////////////////////////////////////////////////////////////////////////
				// case 1. if it is still uploading, remove it by resumable
				/////////////////////////////////////////////////////////////////////////////////
				if (file_id != 0){
				
					// cancel resumable
					var file = self.vars.r.getFromUniqueIdentifier(file_id);
					self.vars.r.removeFile(file);
					// remove this image from the gallery
					jobj.parent().remove();
				}
				
				/////////////////////////////////////////////////////////////////////////////////
				// case 2. already uploaded, remove it from the server
				/////////////////////////////////////////////////////////////////////////////////
				if (media_id != 0){
					// call server to delete this image
					call_svrop(
						{
							type:				'remove_media',
							media_id:		media_id,
							user_id:		1,
							media_path:	'profile.media',
						},
						function (obj){
							console.debug('succeeded', obj);
							// remove this image from the gallery
							jobj.parent().remove();
						},
						function (obj){
							console.error('failed', obj);
						}
					)
				}
			}
			// stop propagate to open lightbox
			e.stopPropagation();
		});
	},
	
	/////////////////////////////////////////////////////////////////////////////////
	
	_resetHighlight: function(hovering){
		//console.debug('_resetHighlight', hovering);
		//$('.uploader_gallery .uploader_trash').hide();
		//console.debug($('img.uploader_image, video.uploader_video').length);
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
	//	console.debug($('img.uploader_image').parent().html())
	},
	//
	// public widget method
	// https://learn.jquery.com/jquery-ui/widget-factory/widget-method-invocation/
	//
	loadGallery: function(media_arr){
		//console.debug('loadGallery', media_arr);
		var self = this;
		for (var i = 0; i < media_arr.length; i++){
			var
				media = media_arr[i],
				media_id = media.media_id
			;
			//console.debug(media.file_cat, media.file_name);
			switch (media.file_cat){
				case 'image':
					self._previewImage('./' + self.options.mediaFolder + '/' + media.file_name, 0, media_id);//, self._addProgressBar);
					break;
				case 'video':
					self._previewVideo('./' + self.options.mediaFolder + '/' + media.file_name, 0, media_id);//, self._addProgressBar);
					break;
			}
		}
	}
});
