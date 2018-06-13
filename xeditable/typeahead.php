<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Vitaliy Potapov">
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta http-equiv="pragma" content="no-cache" />

        <title>X-editable Demo</title>

        <!--<script src="./jquery-1.9.1.min.js"></script>-->
				<script src="./jquery-2.2.4-alan.js"></script>
        <script src="./jquery.mockjax.js"></script>
         
        <!-- bootstrap 3 -->
        <link href="./bootstrap.css" rel="stylesheet">
        <script src="./bootstrap.js"></script>
      
        
        <!-- x-editable (bootstrap 3) -->
        <link href="./bootstrap-editable.css" rel="stylesheet">
        <script src="./bootstrap-editable.js"></script>


       
        <!-- typeaheadjs -->
        <link href="./typeahead.js-bootstrap.css" rel="stylesheet">
        <script src="./typeahead.js"></script>         
        <script src="./typeaheadjs.js"></script>         
        

        
        <link href="./demo-bs3.css" rel="stylesheet">
        
        <style type="text/css">       
            #comments:hover {
                background-color: #FFFFC0;
                cursor: text; 
            }
        </style>
        
        <script>
        var f = 'bootstrap3';
        </script>

        
        <!-- address input -->
        <link href="./address.css" rel="stylesheet">
        <script src="./address.js"></script> 
        
        <script>
            var c = window.location.href.match(/c=inline/i) ? 'inline' : 'popup';
						var c = 'inline';
            $.fn.editable.defaults.mode = c === 'inline' ? 'inline' : 'popup';

            $(function(){
                $('#f').val(f);
                $('#c').val(c);
                
                $('#frm').submit(function(){
                    var f = $('#f').val();
                    if(f === 'jqueryui') {
                        $(this).attr('action', 'demo-jqueryui.html');
                    } else if(f === 'plain') {
                        $(this).attr('action', 'demo-plain.html');
                    } else if(f === 'bootstrap2') {
                        $(this).attr('action', 'demo.html');
                    } else {
                        $(this).attr('action', 'demo-bs3.html');                        
                    }
                });
            });
        </script>        
                
        <style type="text/css">
            body {
                padding-top: 50px;
                padding-bottom: 30px;
            }
            
            table.table > tbody > tr > td {
                height: 30px;
                vertical-align: middle;
            }
        </style>         

    </head>

    <body> 

        <div style="width: 80%; margin: auto;"> 
            <h1>X-editable Demo</h1>
            <hr>

            <h2>Settings</h2>
             <form method="get" id="frm" class="form-inline" action="demo.html">
                
                <label>
                    <span>Form style:</span>
                    <select id="f" class="form-control">
                        <option value="bootstrap3">Bootstrap 3</option>
                        <option value="bootstrap2">Bootstrap 2</option>
                        <option value="jqueryui">jQuery UI</option>
                        <option value="plain">Plain</option>
                    </select>
                </label>

                <label style="margin-left: 30px">Mode:
                    <select name="c" id="c" class="form-control">
                        <option value="popup">Popup</option>
                        <option value="inline">Inline</option>
                    </select>
                </label>

                <button type="submit" class="btn btn-primary" style="margin-left: 30px">refresh</button>
            </form>

            <hr>

            <h2>Example</h2>   
            <div style="float: right; margin-bottom: 10px">
            <label style="display: inline-block; margin-right: 50px"><input type="checkbox" id="autoopen" style="vertical-align: baseline">&nbsp;auto-open next field</label>
            <button id="enable" class="btn btn-default">enable / disable</button>
            </div>
            <p>Click to edit</p>
            <table id="user" class="table table-bordered table-striped" style="clear: both">
                <tbody> 
                    
                    <tr>         
                        <td>Twitter typeahead.js</td>
                        <td><a href="#" id="xeditable_mood" data-type="typeaheadjs" data-pk="1" data-placement="right" data-title="Start typing State.."></a></td>
                    </tr>                       
                                         
                </tbody>
            </table>
 <!--          
            <div style="float: left; width: 50%">
                <h3>Console <small>(all ajax requests here are emulated)</small></h3> 
                <div><textarea id="console" class="form-control" rows="8" style="width: 70%" autocomplete="off"></textarea></div>
            </div>
-->
        </div>

        <!--<script src="./demo-mock.js"></script> -->
        <!--<script src="./typeahead_demo.js"></script>-->         


<script>
$('#xeditable_mood').editable({
		value: '',
		typeahead: {
				name: 'mood',
				local: ['Cheerful', 'Happy', 'Sad']
		}
});
</script>	 
    </body>
</html>