<?php
/* add your db connector in bootstrap.php */
//require 'bootstrap.php';

/*
$('#categories').select2({
        placeholder: 'Search for a category',
        ajax: {
            url: "/ajax/select2_sample.php",
            dataType: 'json',
            quietMillis: 100,
            data: function (term, page) {
                return {
                    term: term, //search term
                    page_limit: 10 // page size
                };
            },
            results: function (data, page) {
                return { results: data.results };
            }

        },
        initSelection: function(element, callback) {
            return $.getJSON("/ajax/select2_sample.php?id=" + (element.val()), null, function(data) {

                    return callback(data);

            });
        }

    });
 */

 
 
 /*
$row = array();
$return_arr = array();
$row_array = array();

if((isset($_GET['term']) && strlen($_GET['term']) > 0) || (isset($_GET['id']) && is_numeric($_GET['id'])))
{

    if(isset($_GET['term']))
    {
        $getVar = $db->real_escape_string($_GET['term']);
        $whereClause =  " label LIKE '%" . $getVar ."%' ";
    }
    elseif(isset($_GET['id']))
    {
        $whereClause =  " categoryId = $getVar ";
    }
    // limit with page_limit get

    $limit = intval($_GET['page_limit']);

    $sql = "SELECT id, text FROM mytable WHERE $whereClause ORDER BY text LIMIT $limit";

    // @var $result MySQLi_result
    $result = $db->query($sql);

        if($result->num_rows > 0)
        {

            while($row = $result->fetch_array())
            {
                $row_array['id'] = $row['id'];
                $row_array['text'] = utf8_encode($row['text']);
                array_push($return_arr,$row_array);
            }

        }
}
else
{
    $row_array['id'] = 0;
    $row_array['text'] = utf8_encode('Start Typing....');
    array_push($return_arr,$row_array);

}

$ret = array();
// this is the return for a single result needed by select2 for initSelection
if(isset($_GET['id']))
{
    $ret = $row_array;
}
// this is the return for a multiple results needed by select2
// Your results in select2 options needs to be data.result

else
{
    $ret['results'] = $return_arr;
}
echo json_encode($ret);

$db->close();
*/
?>
[
    {"ime":"BioPlex TM"},
    {"ime":"Aegis sym agrilla"},
    {"ime":"Aegis sym irriga"},
    {"ime":"Aegis sym microgranulo"},
    {"ime":"Aegis sym pastiglia"},
    {"ime":"Agroblen 15816+3MgO"},
    {"ime":"Agroblen 18816+3MgO"},
    {"ime":"Agrobor 15 HU"},
    {"ime":"Agrocal (Ca + Mg)"},
    {"ime":"Agrocal (Ca)"},
    {"ime":"Agrogold"},
    {"ime":"Agroleaf Power 12525+ME"},
    {"ime":"Agroleaf Power 151031+ME"},
    {"ime":"Agroleaf Power 202020+ME"},
    {"ime":"Agroleaf Power 311111+ME"},
    {"ime":"Agroleaf Power Ca"},
    {"ime":"Agrolution 14714+14 CaO+ME"},
    {"ime":"Agrovapno dolomitno"},
    {"ime":"Agrovit HSF"},
    {"ime":"Agrovit P"},
    {"ime":"Agrozin 32 T"},
    {"ime":"Albatros Hydro"},
    {"ime":"Albatros Sprint"},
    {"ime":"Albatros Standard"},
    {"ime":"Albatros Universal"},
    {"ime":"Algaren"},
    {"ime":"AlgoVital ? Plus"},
    {"ime":"Amalgerol PREMIUM"},
    {"ime":"Amcolon \/ Novalon"},
    {"ime":"Amcopaste"},
    {"ime":"Aminosprint N8"},
    {"ime":"AminoVital"},
    {"ime":"Ammonium nitrate 33.5%"},
    {"ime":"Ammonium nitrate with calcium sulfate"},
    {"ime":"Ammonium sulfate"}
]