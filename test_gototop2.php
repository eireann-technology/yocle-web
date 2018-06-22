

<pre>
https://dotblogs.com.tw/f2e/2016/02/26/172615
設計就是多采多姿很多天馬行空的創造力 ， 前端讓你坐雲霄飛車飛往未知世界有時候他的理性會跟感性的設計大打一架 ( 設計 VS. 前端 )
2016-02-26
簡單製作 Go To Top
404 0 JavaScript 檢舉文章
現在很流行 go to top 的功能，在以前我都是套別人的套件，都覺得好多東西叫串!!麻煩死了

這個是比較簡單的程式，一般來說我大部分都拿來搭配，navbar永遠在最上面的程式一起用

html 如下：


CSS大部分都是造客戶想要什麼樣式做設定

CSS 如下：

.gototop{
  width:50px;
  height:50px;
  line-height:50px;
  font-family:verdana;
  text-align:center;
  background:#F63E3E;
  color:#fff;
  position:fixed;
  bottom:20px;
  right:30px;
  border-radius:50%;
  text-decoration:none;
  cursor: pointer;
  /*先隱藏*/
  display:none;
}
JavaScript 如下：

$(function(){
  
  $(window).scroll(function(){
    //var $(window).scrollTop(); 為 scroll
    var scroll = $(window).scrollTop();
    
    if( scroll >= 70){
      // 當卷軸超過70px,.gototop就淡入，如果小於就淡出
      $(".gototop").fadeIn();
      
    }else{
      
      $(".gototop").fadeOut();
      
    }
  });
  // 當我按下.gototop時，添加動畫讓卷軸跑道最上面
  $('.gototop').click(function(){
    $('html,body').animate({
      scrollTop:$('html').offset().top
    })
    
    return false;
  });

})
因為go to top 有點無聊，所以範例加上上一篇文章的JS

演示：

點選看效果
</pre>

<link href="alan_gototop.css"  type="text/css" rel="stylesheet"/>
<script src="jquery-3.1.1.js"></script>
<script src="alan_gototop.js"></script>

