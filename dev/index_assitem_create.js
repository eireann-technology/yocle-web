////////////////////////////////////////////////////////////
// checkAddFirstItem
// - after:
// 		1. creation of assessment or
// 		2. deletion of assessment
////////////////////////////////////////////////////////////
function checkAddFirstItem(assessment){
	if (!assessment.items || !assessment.items.length){
		assessment.items = [{weight:100}];
	}
}

////////////////////////////////////////////////////////////
// createItem
// - from add button
////////////////////////////////////////////////////////////
function createItem(){
	console.debug('createItem');

	// close all the tinymce first
	close_tinymce_all(1);

	var
		assessment = getEditAssessment()
		,jtbl = $('#div_asst_edit .my_datatable[dt_type=items]')
	;
	if (!assessment.items){
		assessment.items = [];
	}
	// create the item in memory
	var new_item = {
		new_item: 1,
		weight: 0,
	}
	assessment.items.push(new_item);
	// draw the items
	refreshEditItems(assessment);
	// set equal sliders
	evenlyDistributeSliders(jtbl);
	// scroll to the element
	var jobj = $('.div_edit_item').last();
	scroll2Element(jobj);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// addAssessmentItem
// - only for the table, not the item contents
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var
	g_but_left2 = '<button class="but_left btn btn-sm"><i class="glyphicon glyphicon-chevron-left"></i></button>'
	,g_but_right2 = '<button class="but_right btn btn-sm"><i class="glyphicon glyphicon-chevron-right"></i></button>'
;
function addAssessmentItem(method, item){
	console.debug('addAssessmentItem');

	var
		jtbl = $('#div_asst_edit .my_datatable[dt_type=items]')
		,dt = jtbl.DataTable()
		,ass_id = dt.rows().count() + 1
		,weight = item ? item.weight : 0
	;
	var arr = [ass_id, 'Weight', g_percent_slider, weight + '%', g_but_left2, g_but_right2, g_but_trash_ass];
	dt.row.add(arr).draw();	// this would require redraw the whole table!

	// reorder
	reorderDT_item_id(dt, jtbl);

	// get the row
	var jtr = jtbl.find('>tbody>tr:nth-child(' + ass_id + ')');
	return jtr;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// refreshEditItems
// - draw both the general and the specific rows
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshEditItems(assessment){
	console.debug('refreshEditItems');
	if (!assessment){
		assessment = getEditAssessment();
	}
	var
		jdiv = $('#div_asst_edit'),
		jtbl = jdiv.find('.my_datatable[dt_type=items]'),
		dt = jtbl.DataTable(),
		method = assessment.method,
		items = assessment.items
	;

	// CLEAR ALL ROWS
	dt.clear().draw();

	var jtrs = [], weights = [];

	if (typeof(window['getEditItem_' + method]) != 'function'){
		$('.div_edit_asst_items').hide();

	} else {

		$('.div_edit_asst_items').show();

		// 1. ADD GENERAL ITEM ROW
		for (var i = 0; i < items.length; i++){
			var item = items[i];
			var jtr = jtrs[i] = addAssessmentItem(method, item);
			weights[i] = parseInt(jtr.find('td:nth-child(4)').text());
		}
		// post modification
		if (items.length == 1){
			weights[0] = 100;
		}

		// 2. ADD SPECIFIC ITEM CONTENTS
		for (var i = 0; i < items.length; i++){
			var item = items[i],
				item_id = i + 1
			;
			jtrs[i].after('<tr><td colspan="100">' + eval('getEditItem_' + method)(jtbl, dt, item_id, item) + '</td></tr>');
			// init_tinymce
			init_tinymce_editable('assitem_' + item_id, !item || !item.question ? '' : item.question, function(unique_name, value){
				//var item_id = parseInt(unique_name.split('_')[1]);
				//items[item_id-1].question = value;
			});
		}


		// 3. BASIC LINKED
		initBasicLinked(jtbl, weights);

		// 4. CALL EDITABLE FOR DIFFERENT DATA TYPES
		//console.debug('add xeditable4');
		jtbl.find('.editable[data-type!=limit]').editable();
		jtbl.find('.editable[data-type=limit]').each(function(){
			var jobj = $(this),
					min = jobj.attr('data-min'),
					max = jobj.attr('data-max')
			;
			jobj.editable({
				validate: function(value){
					var jdiv = $(this).next();
					var name = $(this).attr('data-name');
					if (value.min == '' && value.max == ''){
						// N/A, OKAY
					} else if (value.min != '' && isNaN(value.min)){
						console.info(jdiv.find('input[name=min]'));
						jdiv.find('input[name=min]').focus();
						return 'Integers only';
					} else if (value.max != '' && isNaN(value.max)){
						jdiv.find('input[name=max]').focus();
						return 'Integers only';
					} else {
						value.min = parseInt(value.min);
						value.max = parseInt(value.max);
						if (value.min != '' && value.max != '' && value.min > value.max){
							jdiv.find('input[name=min]').focus();
							return 'Minimum excels maximum';
						}
					}
				},
				value: {
					min: min,
					max: max,
				}
			});
		});

		// 5. call TINYMCE
		//init_tinymce('.mcq_question', '', function(container, value){
		//	console.log('onchange', container, value);
		//});

	}


	// 4. SPECIAL EVENTS
	switch (method){

		case 'mcq':
			// EDIT ANSWER
			jtbl.find('[data-name=mcq_answer]')
				.on('shown', function(e, editable) {
					console.debug('shown edit answer', $(this));
					var jtd = $(this).closest('.td_mcq_answer');
					jtd.attr('colspan', 3);
					jtd.next().hide().next().hide();
				})
				.on('hidden', function(e, editable) {
					console.debug('hidden edit answer', $(this));
					var jtd = $(this).closest('.td_mcq_answer');
					jtd.attr('colspan', 1);
					jtd.next().show().next().show();
				})
			;

			// RADIO
			jtbl.find('input[type=radio]').on('change click',
				function(){
					var selected = this.value;
					var jtbl = $(this).closest('table').parent();
					jtbl.find('input[type=radio]').each(function(){
						var jinput = $(this),
							value = jinput.attr('value'),
							jtd1 = jinput.parent().prev(),
							jtd2 = jinput.parent().next()
						;
						//jtd1.css('font-weight', value == selected ? 'bold' : 'normal');
						jtd2.css('visibility', value == selected ? 'visible' : 'hidden');
					});
				});
				break;
	}

	// 5. POST OPERATION
	jdiv.find('textarea').autoGrow();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE
///////////////////////////////////////////////////////////////////////////////////////////////////
function deleteItem(item_id){
	//////////////////////////////////////////////////////////////////////////////////
	// ASSESSMENT ITEMS
	//////////////////////////////////////////////////////////////////////////////////
	confirmDialog('Are you sure to delete this item?', function(){
		deleteItem2(item_id);
	});
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function deleteItem2(item_id){
	console.debug('deleteItem2', item_id);
	var
		jdiv = $('#div_asst_edit')
		,jtbl = jdiv.find('.my_datatable[dt_type=items]')
		,dt = jtbl.DataTable()
		,jtr = jtbl.find('>tbody>tr:nth-child('+(item_id*2-1)+')')
		,assessment = getEditAssessment()
	;
	// remove from datatable
	dt.row(jtr).remove();

	// re-order
	reorderDT(dt, jtbl);

	// remove from memory
	delete assessment.items[item_id - 1];
	assessment.items.splice(item_id - 1, 1);

	// check first item
	checkAddFirstItem(assessment);

	// re-draw again
	refreshEditItems(assessment);

	// re-distribute
	evenlyDistributeSliders(jtbl);
}
