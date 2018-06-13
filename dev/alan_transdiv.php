<script src="jquery-3.1.1.js"></script>

<div class="div_transdiv_root">
	<div id="div_trans1" class="div_transdiv">
		<div>
			<div>
				<button onclick="transdiv($('#div_trans1'), 1)">Page 2</button>
			</div>
			<div>
				<button onclick="transdiv($('#div_trans1'), 2)">Page 3</button>
			</div>
			<div>
				<button onclick="transdiv($('#div_trans1'), 0)">Page 1</button>
			</div>
		</div>
	</div>
</div>

<div class="div_transdiv_root">
	<div id="div_trans2" class="div_transdiv">
		<div>
			<div>
				<button onclick="transdiv($('#div_trans2'), 1)">Page 2</button>
			</div>
			<div>
				<button onclick="transdiv($('#div_trans2'), 2)">Page 3</button>
			</div>
			<div>
				<button onclick="transdiv($('#div_trans2'), 0)">Page 1</button>
			</div>
		</div>
	</div>
</div>

<link href="alan_transdiv.css" rel="stylesheet">
<style>
body{
    margin:0px;
}
.div_transdiv > div > div:nth-child(1) {
    left:0px;
    background-color: red;
    height: 100px;
}
.div_transdiv > div >  div:nth-child(2) {
    background-color: green;
    height: 200px;
}
.div_transdiv > div >  div:nth-child(3) {
    background-color: blue;
    height: 300px;
}
</style>
<script src="alan_transdiv.js"></script>
<script>

////////////////////////////////////////////////////

var g_nScreenW = 0, g_nScreenH = 0;

function checkOnResize(){
    var
        w = eval(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth),
        h = eval(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight)
    ;
    if (w != g_nScreenW || h != g_nScreenH){
        g_nScreenW = w;
        g_nScreenH = h;
        transdiv_resize();
    }
}

checkOnResize();
setInterval(checkOnResize, 1000);

</script>
