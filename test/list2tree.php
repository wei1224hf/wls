<?php 
include_once '../php/tools.php';
$arr = array(
	 array('code'=>'11')
	,array('code'=>'1101')
);
$arr2 = array(
	 array('code'=>'11')
	,array('code'=>'12')
	,array('code'=>'13')
);
print_r(tools::list2tree($arr));
?>