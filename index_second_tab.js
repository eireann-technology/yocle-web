// for second level tabs

function selectSecondTab(jtbl, tab_index, placeholder){
	// placeholder
	jtbl.find('.inp_second_filter').attr('placeholder', placeholder ? placeholder : '');
	
	// select tab
	jtbl.find('.div_second_tab').removeClass('selected', 50);
	jtbl.find('.div_second_tab').eq(tab_index - 1).addClass('selected', 100);
}

