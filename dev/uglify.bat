@echo off
date /t
time /t


echo ***generating b.css***

call uglifycss index_login.css font-awesome.css jquery-ui1.css jquery-ui2.css index_yocle.css toggles.css star-rating-svg.css xeditable_work.css select2.css jquery-labelauty.css xeditable_activity.css xeditable_education.css xeditable_publication.css xeditable_award.css xeditable_language.css xeditable_interest.css xeditable_limit.css xeditable_mood.css xeditable_relationship.css typeahead.css typeahead_test5.css bootstrap-tokenfield.css tokenfield-typeahead.css bootstrap-multiselect.css buttons.dataTables.css jquery.dataTables-alan.css responsive.dataTables-alan.css arrow-box.css featherlight.css featherlight.gallery-alan.css a.uploader.css jquery.bxslider-alan.css bootstrap.css bootstrap-alan-only.css bootstrap-dialog.css bootstrap-editable-alan.css bootstrap-editable.css bootstrap-wysihtml5-0.0.3-alan.css wysiwyg-color.css bootstrap.icon-large.css alan_transdiv.css alan_gototop.css jquery.datetimepicker.css bootstrap-daterangepicker.css  > ./b.css

echo ***generating b.js***

call uglifyjs platform.js jquery-3.1.1.js datatables.js buttons.print.js jquery-ui-1.12.1.js bootstrap-alan.js bootstrap-dialog.js jquery.ba-resize.js jquery.autogrowtextarea.js autocomplete_combo.js toggles.js jquery.star-rating-svg.js autosize.js gauge.js jquery-labelauty.js jquery.easing.1.3.js typeahead.bundle.js bloodhound.js handlebars-v4.0.5.js bootstrap-tokenfield.js typeahead-alan.js jquery.linkedsliders-alan.js bootstrap-multiselect.js featherlight.js featherlight.gallery.js moment.js progressbar.js jquery.bxslider.js jquery.fitvids.js jquery.dotdotdot.js jquery.ui.touch-punch.js Chart.bundle-2.4.0.js Chart.bundle-2.4.0-alan.js dataTables.responsive.js bootstrap-editable-alan.js wysihtml5-0.3.0-alan.js bootstrap-wysihtml5-0.0.3-alan.js wysihtml5-0.0.3-alan.js select2.js xeditable_activity.js xeditable_work.js xeditable_education.js xeditable_publication.js xeditable_award.js xeditable_language.js xeditable_interest.js xeditable_limit.js xeditable_mood.js xeditable_relationship.js xeditable_birthday.js xeditable_password.js waitingfor.js socket.io.js typeaheadjs.js jquery.jscroll-alan.js jquery.wysihtml5_size_matters.js alan_transdiv.js alan_gototop.js tinymce-alan.js jquery.datetimepicker.full.js bootstrap-daterangepicker.js index_login.js birthdate.js svg.js database_templates.js lang.js index.js index_common.js svrop.js index_profile.js index_peers.js index_datatable.js index_topmenu.js index_panelists.js index_home.js index_userpage.js index_uact.js index_uass.js index_datetime.js a.uploader.js resumable-alan.js index_activity.js index_activity_create.js index_activity_list.js index_activity_view.js index_assessment_create.js index_assessment_edit.js index_assessment_view.js index_skills.js index_skills_chart.js index_skills_breakdown.js interface.js index_method.js index_method_ref.js index_method_mcq.js index_method_prt.js index_method_abs.js index_method_lcn.js index_method_sur.js index_method_pst.js index_method_blg.js index_gsgauge.js index_viewactasst_all.js index_viewactasst_assr.js index_viewactasst_coor.js index_viewactasst_part.js index_viewactimpr_all.js index_viewactimpr_assr2.js index_viewactimpr_coor2.js index_viewactimpr_part2.js index_skills_breakdown.js index_assessment_peer.js index_assitem_create.js index_messenger_list.js index_messenger_comm.js index_whatsup.js index_activity_edit.js index_resize.js index_news.js index_activity_tabs.js index_assessment_tabs.js index_rubrics_edit.js index_rubrics_view.js index_stars.js index_keyboard.js index_blog.js index_tinymce.js index_assrs.js -o ./b.js -b ascii_only=true,beautify=false



echo ***copy to production***
move /y .\b.js ..\
move /y .\b.css ..\

rem xcopy /y .\*.php ..\
rem xcopy /y .\*.png ..\
rem xcopy /y .\images\* ..\images

:END
echo ***done***
