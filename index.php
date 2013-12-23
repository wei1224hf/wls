<?php
include_once 'php/tools.php';
tools::$configfilename = "config.xml";
if(tools::getConfigItem("DB_NAME")==""){
	echo "<script>location.href='html/install.html';</script>";
	exit();
}
else{
	echo "<script>location.href='html/layout_desktop.html';</script>";
	exit();
}
?>