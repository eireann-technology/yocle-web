var LG_ENG = 0,
		LG_THA = 1,
		g_curr_lang = LG_ENG
;
g_lang_map = {
	'#tabs > ul > li:nth-child(1) > a':{
		0: 'Home',
		1: 'บ้าน',
	},
	'#tabs > ul > li:nth-child(2) > a':{
		0: 'Profile',
		1: 'ข้อมูลส่วนตัว',
	},
	'#tabs > ul > li:nth-child(3) > a, .text_ntwk':{
		0: 'Network',
		1: 'เครือข่าย',
	},
	'#tabs > ul > li:nth-child(4) > a':{
		0: 'Activity',
		1: 'กิจกรรม',
	},
	'#tabs > ul > li:nth-child(5) > a':{
		0: 'Post a Project',
		1: 'ขโพสต์โครงการ',
	},
	'#tabs > ul > li:nth-child(6) > a':{
		0: 'GS League Table',
		1: 'GS ตารางลีก',
	},
	'.text_whohasviewed':{
		0: 'Who has viewed your profile?',
		1: 'ใครดูโปรไฟล์ของคุณ',
	},
	'.text_suggestedtontwk':{
		0: 'Suggested to network',
		1: 'ขอแนะนำให้ไปยังเครือข่าย',
	},
	'.text_todolist':{
		0: 'To do list',
		1: 'รายการสิ่งที่ต้องทำ',
	},
	'.text_noticeboard':{
		0: 'Notice board',
		1: 'ขกระดานป้ายติดประกาศ',
	},
	'.text_msg, .msg_button':{
		0: 'Message',
		1: 'ข่าวสาร',
	},
	'.invite_button':{
		0: 'Invite',
		1: 'เชิญ',
	},
	'.text_skillstbl':{
		0: 'Skills Table',
		1: 'ตารางทักษะ',
	},
	'.text_gsstatus':{
		0: 'GS Status',
		1: 'GS สถานะ',
	},
	'.text_personal':{
		0: 'Personal Statement and Objectives',
		1: 'ถ้อยแถลงส่วนตัวและวัตถุประสงค์',
	},
	'.text_extracur':{
		0: 'Extra-curricular Activities / Projects',
		1: 'นอกหลักสูตรกิจกรรม / โครงการ',
	},
	'.text_workexp':{
		0: 'Work Experience',
		1: 'ประสบการณ์การทำงาน',
	},
	'.text_edu':{
		0: 'Education',
		1: 'การศึกษา',
	},
	'.text_interests':{
		0: 'Interests',
		1: 'ความสนใจ',
	},
	'.text_langskills':{
		0: 'Language Skills',
		1: 'ทักษะทางด้านภาษา',
	},
	'.text_awards':{
		0: 'Awards',
		1: 'รางวัล',
	},
	'.text_publications':{
		0: 'Publications',
		1: 'สิ่งพิมพ์',
	},
	'.text_skilldevtbl':{
		0: 'Skills Developed Table',
		1: 'ตารางการพัฒนาทักษะ',
	},
	'.text_invitemyntwk':{
		0: 'Invite people to my network',
		1: 'ขอเชิญชวนผู้คนให้เครือข่ายของฉัน',
	},
	'.text_mycurrntwk':{
		0: 'My current network',
		1: 'เครือข่ายในปัจจุบันของฉัน',
	},
	'.text_skilldevtbl':{
		0: 'Skills Developed Table',
		1: 'ตารางการพัฒนาทักษะ',
	},
	'.text_syncwith':{
		0:'Sync with',
		1:'ซิงค์กับ',
	},
	'.text_advanced':{
		0:'Advanced',
		1:'การค้นหาขั้นสูง',
	},
	'.text_createactivity':{
		0:'Create activity',
		1:'สร้างกิจกรรม',
	},
	'.text_searchactivity':{
		0:'Search activity',
		1:'กิจกรรมการค้นหา',
	},
	'.text_togglealltask':{
		0:'Toggle all tasks',
		1:'สลับงานทั้งหมด',
	},
	
	'.text_type, #thead_search_activity > tr > td:nth-child(1)':{
		0:'Type',
		1:'ชนิด',
	},
	'.text_title, #thead_search_activity > tr > td:nth-child(2)':{
		0:'Title',
		1:'หัวข้อ',
	},
	'.text_role, #thead_search_activity > tr > td:nth-child(3)':{
		0:'Role',
		1:'บทบาท',
	},
	'.text_start, #thead_search_activity > tr > td:nth-child(4)':{
		0:'Start',
		1:'เริ่มต้น',
	},
	'.text_end, #thead_search_activity > tr > td:nth-child(5)':{
		0:'End',
		1:'ปลาย',
	},
	'.text_status, #thead_search_activity > tr > td:nth-child(6)':{
		0:'Status',
		1:'สถานะ',
	},
	'.text_bronze':{
		0:'Bronze',
		1:'บรอนซ์',
	},
	'.text_ruby':{
		0:'Ruby',
		1:'ทับทิม',
	},
	'.text_mygenericskills':{
		0:'My Generic Skills',
		1:'ทักษะทั่วไปของฉัน',
	},
	'.text_myoclx':{
		0:'My OCL-X',
		1:'OCL-X ของฉัน',
	},
	'.text_myyolox':{
		0:'MY YOLO-X',
		1:'YOLO-X ของฉัน',
	},
	'.text_groups':{
		0:'Groups',
		1:'กลุ่ม',
	},
	'.text_workingexp':{
		0:'Working Experience',
		1:'ประสบการณ์การทำงาน',
	},
	'.text_genericskills':{
		0:'Generic Skills',
		1:'ทักษะทั่วไป',
	},
	'.text_name':{
		0:'Name',
		1:'ชื่อ',
	},
	'.text_desc':{
		0:'Description',
		1:'ลักษณะ',
	},
	'.text_period':{
		0:'Period',
		1:'ระยะเวลา',
	},
	'.text_participants':{
		0:'Participants',
		1:'ผู้เข้าร่วม',
	},
	'.text_expfrom':{
		0:'Experience from',
		1:'จากประสบการณ์',
	},
	'.text_nameofexp':{
		0:'Name of experience',
		1:'ชื่อของประสบการณ์',
	},
	'.text_weight':{
		0:'Weight %',
		1:'น้ำหนัก%',
	},
	'.text_oclx_full':{
		0:'Out-of-Class Experience',
		1:'ออกมาจากประสบการณ์ชั้น',
	},
	'.text_yolox_full':{
		0:'You-Only-Live-Once Experience',
		1:'คุณอยู่เพียงเมื่อประสบการณ์',
	},
	'.text_starttime':{
		0:'Start time',
		1:'เวลาเริ่มต้น',
	},
	'.text_endtime':{
		0:'End time',
		1:'เวลาสิ้นสุด',
	},
	'#td_footer a:nth-child(1)':{
		0:'About',
		1:'เกี่ยวกับ',
	},
	'#td_footer a:nth-child(2)':{
		0:'Help',
		1:'',
	},
	'#td_footer a:nth-child(3)':{
		0:'Feedback',
		1:'ช่วยด้วย',
	},
	'#td_footer a:nth-child(4)':{
		0:'Privacy',
		1:'ความเป็นส่วนตัว',
	},	
	'#td_footer a:nth-child(5)':{
		0:'Terms',
		1:'ข้อตกลงและเงื่อนไข',
	},
	'.text_privopt':{
		0:'Privacy options',
		1:'ตัวเลือกความเป็นส่วนตัว',
	},
	'.text_language':{
		0:'Language',
		1:'ภาษา',
	},
	'.text_spoken':{
		0:'Spoken',
		1:'พูด',
	},
	'.text_written':{
		0:'Written',
		1:'เขียน',
	},
	'#inp_search':{
		0:'Search people or activities',
		1:'ค้นหาบุคคลหรือกิจกรรม',
	},
	'#inp_searchmyact':{
		0:'Find in my activities',
		1:'ค้นหาในกิจกรรมของฉัน',
	},
	'#inp_findpeople':{
		0:'Find people',
		1:'หาคน',
	},
	'#inp_filtermyntwk':{
		0:'Filter in my network',
		1:'กรองในเครือข่ายของฉัน',
		1:'กรองในเครือข่ายของฉัน',
	},
	'#inp_findpartcipants':{
		0:'Find participants',
		1:'ค้นหาผู้เข้าร่วม',
	},
	'.delete_button':{
		0:'Delete',
		1:'ลบ',
	},
	'.text_comments':{
		0:'Comments',
		1:'ความคิดเห็น',
	},
	'.text_method':{
		0:'Method',
		1:'วิธี',
	},
	'.text_assessment':{
		0:'Assessment',
		1:'การประเมินผล',
	},
	'.text_assessors':{
		0:'Assessors',
		1:'ประเมิน',
	},
	'.text_enable':{
		0:'Enable',
		1:'ทำให้สามารถ',
	},
	'.text_disable':{
		0:'Disable',
		1:'ปิดการใช้งาน',
	},
	'#inp_findparticipants':{
		0:'Find participants',
		1:'ค้นหาผู้เข้าร่วม',
	},
	'#inp_findassessors':{
		0:'Find assessors',
		1:'ค้นหาผู้ประเมิน',
	},
	'#inp_title':{
		0:'Title of assignment',
		1:'ชื่อเรื่องที่ได้รับมอบหมาย',
	},
	'.text_assessedbyself':{
		0:'Assessed by self',
		1:'การประเมินโดยตนเอง',
	},
	'.text_assessedbycoordinator':{
		0:'Assessed by coordinator',
		1:'การประเมินโดยผู้ประสานงาน',
	},
	'.text_assessedbypeers':{
		0:'Assessed by peers',
		1:'การประเมินจากเพื่อนร่วมงาน',
	},
	'.text_min':{
		0:'Min.',
		1:'ขั้นต่ำ',
	},
	'.text_details':{
		0:'Details',
		1:'รายละเอียด',
	},
	'.text_add':{
		0:'Add',
		1:'เพิ่ม',
	},
	'.text_import':{
		0:'Import',
		1:'นำเข้า',
	},
	'.text_preview':{
		0:'Preview',
		1:'ดูตัวอย่าง',
	},
	'.text_save':{
		0:'Save',
		1:'ประหยัด',
	},
	'.text_cancel':{
		0:'Cancel',
		1:'ยกเลิก',
	},
	'.text_enable_assess':{
		0:'Assessment is enabled for this activity',
		1:'การประเมินผลการเปิดใช้งานสำหรับกิจกรรมนี้',
	},
	'.text_disable_assess':{
		0:'Assessment is disabled for this activity',
		1:'การประเมินความถูกปิดใช้งานสำหรับกิจกรรมนี้',
	},
	'.text_public':{
		0:'Public',
		1:'สาธารณะ',
	},
	'.text_onlyntwk':{
		0:'Only shown to network',
		1:'แสดงเฉพาะกับเครือข่าย',
	},
	'.text_private':{
		0:'Private',
		1:'ส่วนตัว',
	},
	
	'dialog_eva':{
		0:'Evaluation',
		1:'การประเมินผล',
	},
	'dialog_gs':{
		0:'Generic Skills',
		1:'ทักษะทั่วไป',
	},
	'dialog_asm':{
		0:'Assessment',
		1:'การประเมินผล',
	},
	'dialog_ntc':{
		0:'Notice',
		1:'แจ้งให้ทราบ',
	},
	'dialog_msg':{
		0:'Message',
		1:'ข่าวสาร',
	},
	'dialog_people':{
		0:'People',
		1:'คน',
	},
	'dialog_gsstatus':{
		0:'GS Status',
		1: 'GS สถานะ',
	},
	'.open_assessment_button':{
		0:'Open assessment',
		1:'เปิดการประเมิน',
	}
};
