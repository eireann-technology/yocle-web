<noscript>Your browser does not support JavaScript!</noscript>
<script>
	function load_script(path, s){
		if (path.indexOf('trumbowyg.js') < 0 && s) path += '?d=' + s;
		s = '<script src="' + path + '" type="text/javascript"><\/script>';
		document.writeln(s);
	}
	function load_css(path, s){
		if (s) path += '?d=' + s;
		s = '<link href="' + path + '"  type="text/css" rel="stylesheet"\/>';
		document.writeln(s);
	}
	function getDateString(){
		var d = new Date();
		return d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
	}
	function mobileAndTabletcheck(){
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}
	var g_bProduction = window.location.href.indexOf('yolofolio.cetl.hku.hk' ) >= 0;
	var g_bIsMobile = mobileAndTabletcheck();			
	var s = getDateString();
	if (!g_bProduction && !g_bIsMobile)
	{
		s = '';	// testing only
	}		
	// Development loader
	// load jqueryui BEFORE bootstrap
	var cssfiles = ''
										+ 'jquery-ui1.css jquery-ui2.css '
										+ 'bootstrap-alan.css bootstrap-editable-alan.css '
										+ 'uniform.aristo.css font-awesome-4.6.3/css/font-awesome.css '
										+ 'index.css bootstrap-multiselect.css '
										
			,commonjsfiles = ''
										+ 'jquery-2.2.4-alan.js '
										+ 'jquery-ui-1.11.4.js '
										+ 'bootstrap-alan.js bootstrap-editable-alan.js '
										+ 'jquery.uniform.min.js '
										+ 'bootstrap-multiselect.js typeahead-alan.js '
										
			,myjsfiles = ''
										+ 'index_datetime.js '
										+ 'index_common.js faker.js '
	;
	
	[cssfiles, commonjsfiles, myjsfiles].forEach(function(files){
		if (files){
			files.split(' ').forEach(function(file){
				if (file.indexOf('.css') > 0){
					load_css('./'+file, s);
				} else if (file.indexOf('.js') > 0){
					load_script('./'+file, s);
				}
			})
		}
	});
	
	/////////////////////////////////////////////////////////////////////////////////////////////

var num_of_participants = 100;
var max_peer_assessors = 5;
var pos_arr = ['Bachelor of Social Sciences (BSocSc)', 'Bachelor of Journalism', 'Bachelor of Social Sciences (Government and Laws) (BSocSc[Govt&Laws])', 'Bachelor of Social Sciences (Government and Laws) (BSocSc[Govt&Laws]) and Bachelor of Laws (LLB)', 'Bachelor of Social Work (BSW)', 'Bachelor of Science (BSc)', 'Bachelor of Science in Actuarial Science (BSc[ActuarSc])', 'Bachelor of Engineering (BEng)', 'Bachelor of Engineering in Engineering Science (BEng[EngSc])', 'Bachelor of Arts and Bachelor of Education in Language Education (BA&BEd[LangEd])'];

var  g_curr_impression_assessors = g_curr_participants = [{"user_id":1,"img_id":1,"username":"Alan Poon","email":"alantypoon@gmail.com","position":"Computer Officer","location":"The University of Hong Kong, HONG KONG"},{"user_id":2,"img_id":2,"username":"Cecilia Chan","email":"cecilia.chan@cetl.hku.hk","position":"Head of Professional Development","location":"Centre for the Enhancement of Teaching and Learning (CETL), The University of Hong Kong"},{"user_id":3,"img_id":3,"username":"Lillian Luk","email":"lillianluk@cetl.hku.hk","position":"Research Assistant","location":"The University of Hong Kong"},{"user_id":7,"img_id":8,"username":"Emma Liu","email":"emkyliu@gmail.com","position":"Research Assistant II","location":"Centre of the Enhancement for Teaching and Learning (CETL), University of Hong Kong, Hong Kong"},{"user_id":8,"img_id":5,"username":"Lavina Luk","email":"ytluk89@hku.hk","position":"Research Assistant","location":"Centre for the Enhancement of Teaching and Learning, The University of Hong Kong"},{"user_id":9,"img_id":7,"username":"Sehrish Iqbal","email":"sehrish@hku.hk","position":"Research Assistant","location":"The University of Hong Kong, Pok Fu Lam"},{"user_id":11,"img_id":6,"username":"CHOY, Yu Hang (Vincent)","email":"vincentvegetable@gmail.com","position":"Research Assistant II (Full-time)","location":"Centre for the Enhancement of Teaching and Learning, The University of Hong Kong, Pok Fu Lam"},{"user_id":12,"img_id":16,"username":"Jonathan Yeung","email":"jncy@hku.hk","position":"Project Leader","location":"Centre for the Enhancement of Teaching and Learning, University of Hong Kong, Hong Kong"},{"user_id":13,"img_id":13,"username":"Lilia Leung","email":"ccleung@gmail.com","position":"Research Assistant ","location":"CETL, University of Hong Kong "},{"user_id":14,"img_id":11,"username":"Nellie Wong","email":"nelliewong1219@gmail.com","position":"Research Assistant II","location":"HKU"},{"user_id":15,"img_id":12,"username":"Davislo","email":"davislo@hku.hk","position":"Project Assistant","location":"Centre for the Enhancement of Teaching and Learning, The University of Hong Kong, Hong Kong"},{"user_id":16,"img_id":14,"username":"Kevin Lau","email":"kvlau88@gmail.com","position":"Research Assistant","location":"Centre for the Enhancement of Teaching and Learning (CETL), The University of Hong Kong, Pokfulam, Hong Kong"},{"user_id":17,"img_id":17,"username":"Katherine Lee","email":"leekath@hku.hk","position":"Research Assistant","location":"The Centre for the Enhancement of Teaching and Learning, The University of Hong Kong"},{"user_id":18,"img_id":18,"username":"Michelle","email":"wt1227@hku.hk","position":"Doctor of Philosophy (Ph.D.), Education (Teaching and Learning), Year 1","location":"The University of Hong Kong"}];

window.onload = function(){
	var
		peers = 3,
		bEditable = 1
	;
	setPeerAssessment(
		$('.div_peer_assessment'),
		peers,
		g_curr_participants,
		bEditable
	);
}
</script>
<style>
#span_peers, #span_total{
	font-weight:bold;
}
</style>

<?php include "index_assessment_edit.php"?>

<div class="div_peer_assessment"></div>