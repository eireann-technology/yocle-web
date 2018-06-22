@echo off
date /t
time /t

echo ***generating b.css***

call uglifycss index_login.css font-awesome.css jquery-ui1.css jquery-ui2.css jquery.datetimepicker.css index_yocle.css toggles.css star-rating-svg.css xeditable_work.css select2.css jquery-labelauty.css xeditable_activity.css xeditable_education.css xeditable_publication.css xeditable_award.css xeditable_language.css xeditable_interest.css xeditable_limit.css xeditable_mood.css xeditable_relationship.css dhtmlxscheduler_flat.css typeahead.css typeahead_test5.css bootstrap-tokenfield.css tokenfield-typeahead.css bootstrap-multiselect.css buttons.dataTables.css jquery.dataTables-alan.css responsive.dataTables-alan.css arrow-box.css featherlight.css featherlight.gallery-alan.css a.uploader.css jquery.bxslider-alan.css dhtmlxscheduler-responsive.css bootstrap.css bootstrap-alan-only.css bootstrap-dialog.css bootstrap-editable-alan.css bootstrap-editable.css bootstrap-wysihtml5-0.0.3.css wysiwyg-color.css bootstrap.icon-large.css  > ./b.css

echo ***generating b.js***

call uglifyjs platform.js jquery-3.1.1.js dataTables.js buttons.print.js jquery-ui-1.12.1.js bootstrap-alan.js bootstrap-dialog.js jquery.ba-resize.js jquery.datetimepicker.full.js jquery.autogrowtextarea.js autocomplete_combo.js toggles.js jquery.star-rating-svg.js autosize.js gauge.js jquery-labelauty.js jquery.easing.1.3.js dhtmlxscheduler-alan.js dhtmlxscheduler_year_view.js typeahead.bundle.js bloodhound.js handlebars-v4.0.5.js bootstrap-tokenfield.js typeahead-alan.js jquery.linkedsliders-alan.js bootstrap-multiselect.js featherlight.js featherlight.gallery.js moment.js progressbar.js jquery.bxslider.js jquery.fitvids.js jquery.dotdotdot.js jquery.ui.touch-punch.js Chart.bundle-2.4.0.js Chart.bundle-2.4.0-alan.js dataTables.responsive.js dhtmlxscheduler-responsive.js bootstrap-editable-alan.js wysihtml5-0.3.0-alan.js bootstrap-wysihtml5-0.0.3-alan.js wysihtml5-0.0.3-alan.js select2.js xeditable_activity.js xeditable_work.js xeditable_education.js xeditable_publication.js xeditable_award.js xeditable_language.js xeditable_interest.js xeditable_limit.js xeditable_mood.js xeditable_relationship.js waitingfor.js socket.io.js typeaheadjs.js jquery.jscroll.js index_login.js birthdate.js svg.js database_templates.js lang.js index.js index_common.js svrop.js index_profile.js index_peers.js index_schedule.js index_datatable.js index_topmenu.js index_panelists.js index_home.js index_userpage.js index_uact.js index_uass.js index_datetime.js a.uploader.js resumable-alan.js index_activity.js index_activity_create.js index_activity_edit.js index_activity_list.js index_activity_view.js index_assessment_create.js index_assessment_edit.js index_assessment_view.js index_skills.js index_skills_chart.js index_skills_breakdown.js interface.js index_method.js index_method_ref.js index_method_mcq.js index_method_prt.js index_method_abs.js index_method_lcn.js index_method_sur.js index_method_pst.js index_gsgauge.js index_viewactasst_all.js index_viewactasst_assr.js index_viewactasst_coor.js index_viewactasst_part.js index_viewactimpr_all.js index_viewactimpr_assr.js index_viewactimpr_coor.js index_viewactimpr_part.js index_skills_breakdown.js index_assessment_peer.js index_assitem_create.js index_messenger_list.js index_messenger_comm.js index_whatsup.js  -o ./b.js -b ascii_only=true,beautify=false

echo ***copy to production***
xcopy /y .\b.js ..\
xcopy /y .\b.css ..\

:END
echo ***done***
