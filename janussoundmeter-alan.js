/*
https://webrtc.github.io/samples/src/content/getusermedia/volume/

 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';
try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

// Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.
function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  this.interval_flag = 0;

  var that = this;
  this.script.onaudioprocess = function(event) {
    var input = event.inputBuffer.getChannelData(0);
    var i;
    var sum = 0.0;
    var clipcount = 0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
      if (Math.abs(input[i]) > 0.99) {
        clipcount += 1;
      }
    }
    that.instant = Math.sqrt(sum / input.length);
    that.slow = 0.95 * that.slow + 0.05 * that.instant;
    that.clip = clipcount / input.length;
  };
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
  console.log('SoundMeter connecting');
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== 'undefined') {
      callback(null);
    }
  } catch (e) {
    console.error(e);
    if (typeof callback !== 'undefined') {
      callback(e);
    }
  }
};
SoundMeter.prototype.stop = function() {
  this.mic.disconnect();
  this.script.disconnect();
  if (this.interval_flag){
  	clearInterval(this.interval_flag);
  	this.interval_flag = 0;
  }
};

/////////////////////////////////////////////////////////////////////
// 
// navigator.mediaDevices.getUserMedia(constraints).
//  then(handleSuccess).catch(handleError);
//
/////////////////////////////////////////////////////////////////////
var soundMeter = 0;
function handleAudio(stream){
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  var obj = window.audioContext;
	//console.debug(obj);
	
	soundMeter = new SoundMeter(obj);
  soundMeter.connectToSource(stream, function(e){
    if (e) {
      alert(e);
      return;
    }
    soundMeter.interval_flag = setInterval(function() {
			var vol = soundMeter.instant.toFixed(2) * 5;	// 0=<x<=1
			//console.log(vol);
			var jpaths = $('#svg_audiometer path');
			for (var i = 0; i < jpaths.length; i++){
				if (vol > i){
					jpaths.eq(i).show();
				} else {
					jpaths.eq(i).hide();
				}
			}
    }, 200);
  });
}

///////////////////////////////////////////////////////

function stopSoundMeter(){
	console.log('stopSoundMeter');
	if (soundMeter){
		soundMeter.stop();
		$('#svg_audiometer path').hide();
	}
}