 <?php
 
 // https://stackoverflow.com/questions/42179650/how-to-customize-and-use-wysihtml5-image-upload-plugin
 
//connecting to database

require_once ('db_connect.php');
$obj = new database();

?>

<!doctype html>
<html>
<head>
    <title>Admin Panel</title>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="bootstrap3-editable/js/bootstrap-editable.js"></script>
    <script src="bootstrap3-editable/js/bootstrap-editable.min.js"></script>
    <script src="wysihtml5/wysihtml5.js"></script>
    <script src="wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.min.js"></script>
    <script src="wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.js"></script>
    <script src="wysihtml5/bootstrap-wysihtml5-0.0.2/wysihtml5-0.3.0.js"></script>
    <script src="wysihtml5/bootstrap-wysihtml5-0.0.2/wysihtml5-0.3.0.min.js"></script>
    <script src="wysihtml5/masterBranch/bootstrap-wysihtml5.js"></script>

    <link rel="stylesheet" href="wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.css" />
    <link rel="stylesheet" href="wysihtml5/bootstrap-wysihtml5-0.0.2/wysiwyg-color.css" />
    <link rel="stylesheet" href="wysihtml5/masterBranch/bootstrap-wysihtml5.css" />
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="bootstrap3-editable/css/bootstrap-editable.css" />
    //image upload needed css reference => (bootstrap-combined.min.css)
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap-combined.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/bootstrap.rtl.min.css" />

</head>
<body>
<!--header--><!--header--><!--header--><!--header--><!--header--><!--header--><!--header--><!--header--><!--header-->
<nav  id="nav" class="navbar navbar" data-spy="affix" data-offset-top="60">
    <ul   class="nav navbar-nav navbar-right">

        <?php
        //****************************************************************************************************************
        //***** I have a navigation menu here *****
        //****************************************************************************************************************

        $query="select * from tblmenu ORDER BY id DESC";
        $arr_res=$obj->select($query);

        foreach ($arr_res as $res){

            $id=$res['id'];
            $title=$res['title'];
            $href=$res['href'];

//****************************************************************************************************************
        //***** I use x-editable-bs3 to edit my menu elements on click  *****
//****************************************************************************************************************

            echo ' <li><a class="element_menu"   data-url="post_menu.php"  href="'.$href.'" data-type="text" data-pk="'.$id.'"  data-title="نام مورد نظر را وارد کنید :" data-placement="left"> '.$title.' </a></li>';

        }//fooreach

        ?>
        <li  class="active"><a href="index2.php">home</a></li>
    </ul>
</nav>

<!--header--><!--header--><!--header--><!--header--><!--header--><!--header--><!--header--><!--header--><!--header-->

<?php

$query="select * from tblsection";
$res_arr=$obj->select($query);

foreach ($res_arr as $res){

    $id=$res['id'];
    $heading=$res['heading'];
    $text=$res['text'];

//***********************************************************************************************************
    /* ***** Here I use x-editable-bs3 wysihtml5 to edit my <section> tag on click, everything works fine but the
    image upload and link insert parts don't work!  ***** */
//***********************************************************************************************************

    echo '<h2 style="display:inline-block" class="element_heading" data-url="post_heading.php"  data-type="text"
     data-pk="'.$id.'"   data-title="تیتر مورد نظر را وارد کنید :" data-placement="left">'.$heading.'</h2>
          <section class="element_section" data-type="wysihtml5" data-pk="'.$id.'" data-placement="bottom">

            <span>'.$text.'</span>
          </section><hr/>';

}//foreach

?>
</body>
</html>

//***********************************************************************************************************
//here is the js code of x-editable
//***********************************************************************************************************
<script>
    $(document).ready(function() {

        $('.element_menu').editable('option', 'validate', function(v) {
            if(!v) return 'باید مقدار دهی شود!';
        });

        $('.element_menu').editable();

        $('.element_heading').editable();

        $('.element_section').editable({
            url: 'post_section.php',
            title: 'متن مورد نظر را وارد کنید :'
        });

    });//document ready
</script>

//image upload needed js references

<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js"> </script>
<script src="wysihtml5/wysihtml5_img_upload/custom_image_and_upload_wysihtml5.js"></script>
<script src="wysihtml5/wysihtml5_img_upload/jqueryupload.js"></script>