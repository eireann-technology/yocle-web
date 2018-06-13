

var g_panelist_arr = ['coordinator', 'self', 'peers', 'others'];

//////////////////////////////////////////////////
// templates
//////////////////////////////////////////////////

var template_panelists = {
	coordinator: 1,
	self: 0,
	peers: 0,
	others: 0,
};
/*
{
		act_id: 					act_id,
		img_id: 					img_id,
		act_type: 				act_type,
		start: 						start,
		end: 							end,
		title:						title,
		desc:							desc,
		published:				0,
		//status:						'new',
		coordinator:			g_user_id,
		participants: 		participants,
		impression:{
											enabled: enabled1,
											skills: skills,
											panelists: panelists,
		},
		assessment:{
											enabled: enabled2,
											assessments:  assessments,
		},
		media: media_id_arr,
	}
*/

/////////////////////////////////////////////////////////////////////////

var template_activity = {
		act_id: 					0,
		img_id: 					0,
		act_type: 				'',
		start: 						'',
		end: 							'',
		title:						'',
		desc:							'',
		published:				0,
		coordinator_id:		0,
		participants: 		[],
		impression:{
											enabled: 1,
											skills: [],	// empty won't save
											panelists: [],	// empty won't save
		},
		assessment:{
											enabled: 1,
											assessments:  [],
		},
		media: [],	
};

////////////////////////////////////////////////////////////////////////

var template_assessment = {
	ass_id: '',
	method: '',
	title: '',
	weight: 0,
	start: '',
	end: '',
	skills: {},
	panelists: JSON.parse(JSON.stringify(template_panelists)),
	items: [],	// for the first empty item
	assr_asst_completed: {},
	part_asst_marks: {},
	assr_asst_marks: {},
	
};

////////////////////////////////////////////////////////////////////////

var template_user_activity = {
	act_id: 0,
  act_type: '',
  title: '',
	position: '',
	start: '',
  end: '',
	published: 0,
	sharing: 2,
  impression: {
		panelists: JSON.parse(JSON.stringify(template_panelists)),
		skills: {},
	},
	assessments: [],
	uact_coordinator: 0,
	uact_assessor: 0,	
	uact_participant: 0,	
	
};

////////////////////////////////////////////////////////////////////////

var template_assessor = {
	user_id : 0,
	img_id : 0,
	username : "",
	marks : 0,
	comments : "",
	marked : ""
};

////////////////////////////////////////////////////////////////////////

var template_act_impression_skills = {
	act_part_scores: {},
	act_assr_scores: {},
	act_assr_completeds: {},
};

////////////////////////////////////////////////////////////////////////

var template_act_assessment_skills = {
	act_asst_scores: {},
};

////////////////////////////////////////////////////////////////////////


var g_static = {
	institutes: [
		{id:'City University of Hong Kong (CityU), Hong Kong', text:'City University of Hong Kong (CityU), Hong Kong'},
		{id:'Hong Kong Baptist University (HKBU), Hong Kong', text:'Hong Kong Baptist University (HKBU), Hong Kong'},
		{id:'Lingnan University (LU), Hong Kong', text:'Lingnan University (LU), Hong Kong'},
		{id:'The Chinese University of Hong Kong (CUHK), Hong Kong', text:'The Chinese University of Hong Kong (CUHK), Hong Kong'},
		{id:'The Education University of Hong Kong (EdUHK), Hong Kong', text:'The Education University of Hong Kong (EdUHK), Hong Kong'},
		{id:'The Hong Kong Polytechnic University (PolyU), Hong Kong', text:'The Hong Kong Polytechnic University (PolyU), Hong Kong'},
		{id:'The Hong Kong University of Science and Technology (HKUST), Hong Kong', text:'The Hong Kong University of Science and Technology (HKUST), Hong Kong'},
		{id:'The University of Hong Kong (HKU), Hong Kong', text:'The University of Hong Kong (HKU), Hong Kong'},
	],
};

//
// curriculum
// http://www.aal.hku.hk/admissions/local/admissions-information?page=en/faculty/faculty-social-sciences
//
