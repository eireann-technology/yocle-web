
<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td>
			<b>OCL-X Assessor</b>
		</td>
	</tr>
	<tr>
		<td>
		
			<!--DATATABLE-->
			<table class="datatable" style="width:100%">

				<thead>
					<td>
						Title
					</td>
					<td>
						Start date
					</td>
					<td>
						Due date
					</td>
					<td>
						SP <span class="svg_container" svg="stamp" svgsize="16" valign="middle" style="vertical-align:middle"></span>
					</td>
					<td align="center">
						Progress
					</td>
					<td>
						Status
					</td>
					<td>
						&nbsp;
					</td>
				</thead>
				
				<tbody>
				
					<tr>
						<td>
							Experience Taiwan and South Korea
						</td>
						<td>
							8 Jul 2012
						</td>
						<td>
							8 Aug 2012
						</td>
						<td>
							Stamped
						</td>
						<td align="center">
							10/30
						</td>
						<td>
							Invited
						</td>
						<td>
							<button class="details_button" onclick="togglePage('#div_oclx_assessor1')">Assess</button>
						</td>
					</tr>
				
					<tr>
						<td>
							Post-earthquake Visit to Sichuan
						</td>
						<td>
							8 Aug 2008
						</td>
						<td>
							8 Sep 2012
						</td>
						<td>
							Stamped
						</td>
						<td align="center">
							45/45
						</td>
						<td>
							Invited
						</td>
						<td>
							<button class="details_button" onclick="togglePage('#div_oclx_assessor2')">Assess</button>
						</td>
					</tr>
					
					<tr>
						<td>
							Team Lead in Science Society
						</td>
						<td>
							15 May 2016
						</td>
						<td>
							15 Jun 2016
						</td>
						<td>
							Stamped
						</td>
						<td align="center">
							38/38
						</td>
						<td>
							Invited
						</td>
						<td>
							<button class="details_button" onclick="togglePage('#div_oclx_assessor3')">Assess</button>
						</td>
					</tr>
					
				</tbody>
				
			</table>
		</td>
	</tr>
</table>

<!--OCLX 1-->
<div id="div_oclx_assessor1" class="display_page">
	<?php $title='Experience Taiwan and South Korea'; $date='8 Jul 2012'; include "./assess.php"?>
</div>

<!--OCLX 2-->
<div id="div_oclx_assessor2" class="display_page">
	<?php $title='Post-earthquake Visit to Sichuan'; $date='8 Aug 2008'; include "./assess.php"?>
</div>

<!--OCLX 3-->
<div id="div_oclx_assessor3" class="display_page">
	<?php $title='Team Lead in Science Society'; $date='15 May 2016'; include "./assess.php"?>
</div>

