/*
 * jquery.editnibble.js
 * https://github.com/mstratman/jquery-editnibble
 *
 * Copyright (c) 2012 Mark A. Stratman
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
var __jquery_editnibble_last_id = 1;
function JqueryEditNibble(targets, options) {
    this.targets = targets;
    this.opt = options;
		
		var svg_edit = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 528.899 528.899" xml:space="preserve"><path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069L27.473,390.597L0.3,512.69z"/></svg>';
		//var img_edit = '<img src="pencil-edit-button_64.png"/>';
		
    var _init = function($this) {
        return $this.targets.each(function() {
          _make_editable($this, $(this));
        });
    };

    var _make_editable = function($this, $target) {
        if ($this.opt.preCreateEditors) {
          _create_editor($this, $target);
        }
        $target
					.click(function() {
						$( this )
							.find( "span" ).remove()
						;
						var $element = $(this);
						if (! $element.data('has-editor')) {
							_create_editor($this, $element);
						}
						// Is the editor already visible?
						if ($element.find('.' + $this.opt.editorWrapperClass + ':visible').size()) {
							return;
						}
						_show_editor($this, $element);
						if ($this.opt.selectOnEdit) {
							var $editor = $("." + $this.opt.editorWrapperClass, $element).find('.' + $this.opt.editorClass);
							$editor.select();
						}
					})
				.hover(
					function(){
						var content = $(this).find('.content-wrapper'),
								editor = $(this).find('.editor-wrapper')
						;
						if (!editor.is(':visible')){
							var size = content.height();
							if (size > 20) size = 20;
							var img = $(svg_edit).width(size-4).height(size-4);
							var span = $('<span/>').width(size).height(size).append(img);
							// change bkgd color
							$( this )
								.find('.content-wrapper')
								.css('backgroundColor', '#e0e0e0')
							;
							// remove the icon
							$( this )
								.find( "span" ).remove()
							;
							// add the icon
							$( this )
								.append(span)
						}
					},
					function() {
						$( this )
							.find('.content-wrapper')
							.css('backgroundColor', '')
						$( this )
							.find( "span" ).remove()
						;
					}				
				);
    };

    var _show_editor = function($this, $element) {
        if (! $this.opt.allowMultipleEditors) {
            _hide_all_editors($this);
        }

        var $contentWrapper = $("." + $this.opt.contentsWrapperClass, $element);
        var $editorWrapper = $("." + $this.opt.editorWrapperClass, $element);
        var $editor = $editorWrapper.find('.' + $this.opt.editorClass);

        var contents = $contentWrapper.html();
        $editor.val( $.trim(contents) );

        $contentWrapper.hide();
        $editorWrapper.show();

        $editor.focus();
    };

    var _hide_all_editors = function($this) {
        $("." + $this.opt.editorWrapperClass + ":visible").each(function() {
            _hide_editor($this, $(this).parent());
        });
    };
    var _hide_editor = function($this, $element) {
        var $editor = $("." + $this.opt.editorWrapperClass, $element).find('.' + $this.opt.editorClass);
        var contents = $editor.val();

        if (typeof $this.opt.onHide != "undefined") {
            contents = $this.opt.onHide(contents, $element);
        }
        
        $("." + $this.opt.contentsWrapperClass, $element).html(contents);

        $("." + $this.opt.editorWrapperClass, $element).hide();
        $("." + $this.opt.contentsWrapperClass, $element).show();
    };

    var _create_editor = function($this, $element) {
		
				//console.info($element.attr('shrink'));
		
        if (typeof $element.attr('id') == 'undefined') {
            $element.attr('id', 'editnibble_' + __jquery_editnibble_last_id);
            __jquery_editnibble_last_id++;
        }

        var wrap_with = 'div';
        var $editor;
        switch ($element.css('display')) {
					case "inline":
						$editor = $( document.createElement("input") ).attr("type", "text");
						wrap_with = 'span';
						break;
						
					//case "table-cell":
					default:
						$editor = $( document.createElement("textarea") ).css('resize', 'none');
						break;
        }
				

        // Wrap existing contents so we can more effectively show
        // and hide them.
        var contents = $element.html();
				$element.html(
					$(document.createElement(wrap_with))
					.addClass($this.opt.contentsWrapperClass)
					.append(contents)
				);
				if ($element.attr('shrink') == 1){
					$element.find('.'+$this.opt.contentsWrapperClass).css('width', 'calc(100% - 50px)')
				}
        $element.append(
					$(document.createElement(wrap_with))
					.addClass($this.opt.editorWrapperClass)
					.append(
						$editor
							.attr('name', $element.attr('id'))
							.addClass($this.opt.editorClass)
							.val(contents)
					)
					.hide()
        );

        if ($this.opt.finishEditingEvent) {
					// finish editing
					$editor.bind($this.opt.finishEditingEvent, function() {
							if ($this.opt.hideEditorOnFinish) {
									_hide_editor($this, $element);
							}
					});
        }

        $element.data('has-editor', true);
				//$element.find('textarea').autoGrow();
				//console.info('test');
				//console.info($element.outerHTML());
    };


    /* Public methods */

    JqueryEditNibble.prototype.hideAllEditors = function() {
        _hide_all_editors(this);
    };

    _init(this);
}

(function($) {
    $.fn.editnibble = function(method) {
        var args = arguments;
        var rv = undefined;
        var all = this.each(function() {
            var obj = $(this).data('editnibble');
            if (typeof method == 'object' || ! method || ! obj) {
							var options = $.extend({}, $.fn.editnibble.defaults, method || {});
							obj = new JqueryEditNibble($(this), options);
							$(this).data('editnibble', obj);
            } else {
							if (typeof JqueryEditNibble.prototype[method] == "function") {
								rv = JqueryEditNibble.prototype[method].apply(obj, Array.prototype.slice.call(args, 1));
								return rv;
							} else {
								$.error('Method ' +  method + ' does not exist in editnibble plugin');
							}
            }
        });
        if (rv == undefined) {
            return all;
        } else {
            return rv;
        }
    };

    $.fn.editnibble.defaults = {
        editorWrapperClass: 'editor-wrapper',
        editorClass: 'editor-form-element',
        contentsWrapperClass: 'content-wrapper',
        finishEditingEvent: 'blur', //e.g. blur, change, dblclick, click.
        selectOnEdit : false,
        hideEditorOnFinish: true,
        allowMultipleEditors: false,
        onHide: function(textVal, context) { return textVal }, // Return something else to change it.
        preCreateEditors: true   // Useful if you want the submitted form to contain
                                 // all the editable fields, even if they were never
                                 // edited by the user.
    };

})(jQuery);
