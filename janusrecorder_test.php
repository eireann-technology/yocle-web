<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Janus WebRTC Gateway: Recorder/Playout Demo</title>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/3.1.5/adapter.min.js" ></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js" ></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js" ></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.2/js/bootstrap.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.1.0/bootbox.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js"></script>
<script type="text/javascript" src="janus_2018.js" ></script>
<script type="text/javascript" src="janusrecorder-alan.js"></script>
<script type="text/javascript" src="janussoundmeter-alan.js"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/cerulean/bootstrap.min.css" type="text/css"/>

<style>
#videobox video{
	max-width: 100%;
}
</style>

</head>
<body>


					<table style="margin:10px">
						<tr>
							<td width="1">
								<button class="btn btn-danger" disabled autocomplete="off" id="record_audio" style="border-radius:8px"><img src="./images/recorder_audio_24.png"/></button>
							</td>
							
							<td width="1">
								&nbsp;
							</td>
							
							<td width="1">
								<button class="btn btn-danger" disabled autocomplete="off" id="record_video" style="border-radius:8px"><img src="./images/recorder_video_24.png"/></button>
							</td>
							
							<td>
								<svg id="svg_audiometer" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="282.611px" height="282.612px" viewBox="0 0 282.611 282.612" style="width: 32px; height: 25px; left: 10px; top: 0px;" xml:space="preserve">
									<path d="m 31.4,180.553 -15.699,0 C 7.033,180.553 0,187.583 0,196.254 l 0,31.402 c 0,8.668 7.033,15.701 15.701,15.701 l 15.699,0 c 8.668,0 15.701,-7.033 15.701,-15.701 l 0,-31.402 c 0,-8.671 -7.033,-15.701 -15.701,-15.701 z" fill="#80e080" style="display: none;"></path>
									<path d="m 109.905,133.45 -15.701,0 c -8.668,0 -15.701,7.035 -15.701,15.701 l 0,78.506 c 0,8.668 7.033,15.701 15.701,15.701 l 15.701,0 c 8.666,0 15.699,-7.033 15.699,-15.701 l 0,-78.506 c 0,-8.666 -7.033,-15.701 -15.699,-15.701 z" fill="#80e080" style="display: none;"></path>
									<path d="m 188.409,86.349 -15.701,0 c -8.664,0 -15.701,7.033 -15.701,15.701 l 0,125.607 c 0,8.668 7.037,15.701 15.701,15.701 l 15.701,0 c 8.664,0 15.701,-7.033 15.701,-15.701 l 0,-125.607 c 0,-8.668 -7.037,-15.701 -15.701,-15.701 z" fill="#80e080" style="display: none;"></path>
									<path d="m 266.91,39.253 -15.701,0 c -8.66,0 -15.697,7.027 -15.697,15.701 l 0,172.702 c 0,8.668 7.037,15.701 15.697,15.701 l 15.701,0 c 8.664,0 15.701,-7.033 15.701,-15.701 l 0,-172.701 c 0,-8.675 -7.037,-15.702 -15.701,-15.702 z" fill="#80e080" style="display: none;"></path>
								</svg>
							</td>
						</tr>
						
						<tr>
							<td colspan="9">
								<div id="video" style="display:none">
									<span id="videotitle">Remote Video</span>
									<button class="btn-xs btn-danger pull-right" autocomplete="off" id="stop">Stop</button>
									<div class="panel-body" id="videobox" style="max-width:100%"></div>
								</div>
							</td>
						</tr>
						
						<tr>
							<td colspan="9">
								<!--list-->
								<div class="btn-group btn-group-sm" style="width: 100%">
									<div class="btn-group btn-group-sm" style="width: 100%">
										<ul id="recslist" class="dropdown-menux" role="menu" stylexxx="max-height: 300px; overflow: auto;">
										</ul>
									</div>
								</div>
							</td>
						</tr>
					</table>

				





</body>
</html>
