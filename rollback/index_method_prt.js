//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EDIT METHOD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var
	g_prt_lvl_arr = ['Excellent',	'Proficient',	'Average', 'Poor', 'Unacceptable']
	
	,g_prt_rubric = '<div data-name="prt_rubric" data-mode="inline" data-type="text" data-title="Enter the name of the item" data-emptytext="(+Item)" data-showbuttons="bottom" data-placement="right" data-url="" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0"></div>'
	
	,g_prt_desc = '<div data-name="prt_desc" data-mode="inline" data-type="text" data-title="Enter the description" data-emptytext="(+Desc.)" data-showbuttons="bottom" data-placement="right" data-url="" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0"></div>'
;

function getEditItem_prt(jtbl, dt, item_id, item){
	
	var level = parseInt($('#div_assessment_edit .select_likert').val());
	var itemname = '', descs = [];
	if (item){
		itemname = item.item ? item.item : '';
		descs = item.descs ? item.descs : [];
	}	
	var s = 
				'<div class="div_edit_item">'
				+ '<table width="100%">'
					+ '<tr>'
						+ '<td><b>Item:</b></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<div class="editable_parent">'
								+ '<div data-name="prt_rubric" data-mode="inline" data-type="textarea" data-title="Enter the name of the item" data-emptytext="(+Item)" data-showbuttons="bottom" data-placement="right" data-url="" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0" data-value="' + itemname + '"></div>'
							+ '</div>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td><div style="border-bottom:1px solid #e0e0e0;"></div></td>'
					+ '</tr>'

	;
	for (var i = 0; i < g_prt_lvl_arr.length; i++){
		if (i + 1 <= level){
			var lvlname = g_prt_lvl_arr[i],
				desc = descs[i] ? descs[i] : '';
			s += '<tr>'
						+ '<td>'
							+ '<b>' + lvlname + ':</b>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<div class="editable_parent">'
								+ '<div data-name="prt_desc" data-mode="inline" data-type="textarea" data-title="Enter the description" data-emptytext="(+Desc.)" data-showbuttons="bottom" data-placement="right" data-url="" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0" data-value="' + desc + '"></div>'
							+ '</div>'
						+ '</td>'
					+ '</tr>'
			;
		}
	}
	s += '</table>'
			+'</div>'
	;
	return s;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VIEW METHOD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_prt(jtr){
	var jdiv = jtr.closest('div');
	var likert = parseInt(jdiv.find('.select_likert').val());
	var	item = jtr.find('.editable[data-name=prt_rubric]').editable('getValue', true),	// eq begins with 0
		descs = []
	;
	for (var i = 0; i < likert; i++){
		var jobj = jtr.find('.editable[data-name=prt_desc]').eq(i);// skip num and item
		if (jobj.length){
			descs[i] = jobj.editable('getValue', true);
		}
	}
	return {
		item: item,
		descs: descs,
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VIEW METHOD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var prt_arr = [
	['Excellent', 'Average', 'Unacceptable'],
	['Excellent', 'Proficient', 'Average', 'Unacceptable'],
	['Excellent', 'Proficient', 'Average', 'Poor', 'Unacceptable'],
];

function viewActAsst_prt(opts, jparent, assessment, uass, role){
	console.info('viewActAsst_prt(', uass);
	var likert = parseInt(assessment.likert),
		likert2 = likert - 3;
	;
	
	var color_hover = '#AED6F1',
		color_selected = '#3498DB'
	;

	// ADD TABLE
	var s = '<table class="tbl_asspage_prt" border="1">';
				
	// ADD head
	s += '<thead><tr><td>Items</td>';
	for (var i = 0 ; i < likert; i++){
		s += '<td>'+prt_arr[likert2][i]+'</td>';
	}
	s += '</tr></thead><tbody>';
	
	// ADD ITEMS
	for (var i = 0 ; i < assessment.items.length; i++){
		var item = assessment.items[i];
		s += '<tr><td>'+item.item+'</td>';

		var selected = -1;
		if (opts.bEditMarking && uass.items[i] && uass.items[i].assessors){
			
			// edit marking
			if (opts.bEditMarking){
				var my_assessment = uass.items[i].assessors[g_user_id];
				if (my_assessment){
					var selected2 = my_assessment.selected;
					if (!isNaN(selected2) && selected2 != -1){
						selected = parseInt(selected2) - 1;
					}
				}				
			}
		}
		var ncols = likert + 1, percent = parseInt(100 / ncols);
		for (var j = 0; j < item.descs.length  && j < likert; j++){
			var desc = item.descs[j];

			if (opts.bViewMarking && !opts.bEditMarking){
				var count = 0;
				
				// view markings for all assessors 
				var my_item = uass.items[i];
				if (my_item){
					var assessors = my_item.assessors;
					for (var k in assessors){
						var assessor = assessors[k];
						if (assessor.selected == j){
							count++;
						}
					}
				}
				if (count > 0){
					s += '<td style="background:' + color_selected + '" data-selected="1" style="width:' + percent + '%">'
							+ desc + ' (x' + count + ')'
							+ '</td>';
				} else {
					s += '<td style="width:' + percent + '%">'+desc+'</td>';
				}										
			} else if (selected == j){
				s += '<td style="background:'+color_selected+'" data-selected="1" style="width:' + percent + '%">'+desc+'</td>';
			} else {
				s += '<td style="width:' + percent + '%">'+desc+'</td>';
			}
		}
		s += '</tr>';
	}
	s += '</tbody></table>';
	//return s;
	jparent.empty().append(s);
	
	if (opts.bEditMarking){
		jparent.find('tbody td:not(:first-child)')
			.each(function(){
				$(this).css({
					cursor: 'pointer',
				});
			})
			.hover(function(){
				if ($(this).attr('data-selected') != '1'){
					$(this).css({
						background: color_hover,
					});
				}
			})
			.mouseout(function(){
				if ($(this).attr('data-selected') != '1'){
					$(this).css({
						background: '',
					});
				}
			})
			.click(function(){
				if ($(this).attr('data-selected') != '1'){
					$(this).parent().find('td')
						.attr('data-selected', '')
						.css('background', '')
					;
					$(this)
						.attr('data-selected', '1')
						.css('background', color_selected)
					;
				} else {
					$(this)
						.attr('data-selected', '')
						.css('background', '')
					;
				}
			})
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function onChangeLikertScale(obj){
	refreshEditItems();
}
