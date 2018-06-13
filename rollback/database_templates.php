<?php

$template_user = [
	'user_id' => '',
	//'user_id_md5' => md5($user_id),
	'email' => '',
	'pwd' => '',
	'username' => '',
	'gender' => '',
	'birthday' => '',
	'confirmed_email'=> 0,
	'confirmed_time'=> '',
	'secret_token' => '',
	//'last_send_confirm' => '',
	'next_send_confirm' => '',
	'position' => '',
	'location' => '',
	'img_id' => 0,
	'network' => 0,
	'coordinated' => 0,
	'participated' => 0,
	'skills' => new stdClass(),
	'profile' => [
		'order' => ['objectives', 'activity', 'education', 'work', 'publication', 'language', 'award', 'interest', 'media'],
		'objectives' => '',
		'activity' => [],
		'education' => [],
		'work' => [],
		'publication' => [],
		'language' => [],
		'award' => [],
		'interest' => '',
		'media' => [],
	],
];

////////////////////////////////////////////////////////////////////////
/*
$template_user_activity = [
	'act_id' => 0,
  'act_type' => '',
  'title' => '',
	//'position' => '',
	'start' => '',
  'end' => '',
	'sharing' => 2,
	'published' => 0,
	'sharing' => 0,
	//'impression' => [
	//	'skills' => new stdClass(),
	//],
	//'assessments' => [],
];
*/
////////////////////////////////////////////////////////////////////////

$template_panelists = [
	'coordinator' => 1,
	'self' => 0,
	'peers' => 0,
	'others' => 0
];


////////////////////////////////////////////////////////////////////////

$template_act_skill = [
	'act_part_scores' => new stdClass(),
	'act_assr_scores' => new stdClass(),
	'act_assr_completeds' => new stdClass(),
];

////////////////////////////////////////////////////////////////////////

$template_uact_skill = [
	'usr_part_score' => 0,
	'assessors' => new stdClass(),
];

////////////////////////////////////////////////////////////////////////

$template_uact_ass_item = [
	'ass_item_id' => 0,
	'part_item_marks' => '-',
	'answer' => '',
	'assessors' => new stdClass(),
];

////////////////////////////////////////////////////////////////////////

$template_usr_final_skills = [
	'show'=> 1,
	'usr_final_score'=> 0,
];
$template_usr_asst_skills = [
	'usr_part_score' => 0,
	'assessors' => new stdClass(),
];

?>