var slider_width = 80;

//////////////////////////////////////////////////////////////////////////////////////////////

function initDT_users(selector){
	var jobj = typeof(selector) == 'object' ? selector : $(selector);
	//var jtbl = jobj.find('.my_datatable[dt_type=users]:not(dataTable)');
	//if (!jtbl.length){
	//	console.error('initDT_users', selector);
		//debugger;
	//} else {
		//console.info('initDT_users', jtbl.length);
	//}
	var jtbl = jobj.find('.my_datatable[dt_type=users]'), dt = 0;
	jtbl.hide();
	if (!jtbl.hasClass('dataTable')){
		dt = jtbl.DataTable({
			//responsive: true,
			//ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			autoWidth: false,
			columnDefs: [
			]
	    });
	} else {
		dt = jtbl.DataTable();
	}
	return dt;
}

/////////////////////////////////////////////////////////////////////////

function initDT_skills(selector){
/*
	var jobj = typeof(selector) == 'object' ? selector : $(selector);
	var jtbl = jobj.find('.my_datatable[dt_type=skills]:not(.dataTable)');

	//selector += ' .my_datatable[dt_type=skills]:not(.dataTable)';	// avoid doing it twice
	//var jtbl = $(selector);

	if (!jtbl.length){
		console.error('initDT_skills', selector);
		//debugger;
	} else {
		//console.info('initDT_skills', selector, jtbl.length);
	}
	var dt = jtbl
		.hide()
		.DataTable({
			//ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				// skill
				{	targets: [ 0 ],	},
				// trash
				{	targets: [ 1 ],	orderable: false,},
			],
		});
*/
	var jobj = typeof(selector) == 'object' ? selector : $(selector),
		jtbl = jobj.find('.my_datatable[dt_type=skills]');
	if (!jtbl.hasClass('dataTable')){
		dt = jtbl.DataTable({
			//ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				// skill
				{	targets: [ 0 ],	},
				// trash
				{	targets: [ 1 ],	orderable: false,},
			],
		})
	} else {
		dt = jtbl.DataTable();
	}
	jtbl.hide();
		
	return dt;
}

///////////////////////////////////////////////////////////////

function initDT_assessments(selector){

	var jobj = typeof(selector) == 'object' ? selector : $(selector);
	var jtbl = jobj.find('.my_datatable:not(.dataTable)');
	
	//selector += ':not(.dataTable)';	// avoid doing it twice
	//jtbl = $(selector);
	console.info('initDT_assessments', jtbl.length);
	var dt = jtbl
		.hide()
		//.show()
		.DataTable({
			ordering: false,
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			autoWidth: false,
			columnDefs: [
				{ targets: 1, visible: false},
				{ targets: 0, width: 1,},
				{ targets: 2, width: 100,},
				{ targets: 3, width: slider_width},
				{ targets: [4,5,6], width: 0},
			],		
		});
	;
	return dt;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// tbl_activity_list
function initDT_searchactivity(selector){
	// for all datatable??
	var
		jtbl = $(selector),
		dt = 0
	;
	if (!jtbl.hasClass('datatable')){
		dt = jtbl
			.DataTable({
				"order": [[ 1, "asc" ]],
				dom: '',	// '<"top"i>rt<"bottom"flp><"clear">',	'<"top"f>', https://datatables.net/reference/option/dom
				language:{
					emptyTable: '',
					zeroRecords: '',
				},
				autoWidth: false,
				columnDefs: [
					// user_id
					{
						targets: [ 0 ],
						visible: false,
						searchable: false,
					},
					{
						targets: [1],
						type: 'string',
					},
					{
						targets: [ 4,5,],
						visible: true,
						searchable: false,
						orderable : false,
						//width: '10px',
					},
				],
			})
	} else {
		dt = jtbl.DataTable();
	}
	return dt;
}