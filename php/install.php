<?php 
include_once "tools.php";
include_once 'basic_group.php';
include_once 'basic_user.php';

include_once 'exam_paper.php';
include_once 'exam_paper_log.php';
include_once 'exam_paper_multionline.php';

include_once 'simulate.php';

include_once '../libs/phpexcel/Classes/PHPExcel.php';
include_once '../libs/phpexcel/Classes/PHPExcel/IOFactory.php';
include_once '../libs/phpexcel/Classes/PHPExcel/Writer/Excel5.php';

class install{
	
	public static function step1(){
		$t_return = array("status"=>"2","msg"=>"");
		
		$version=phpversion();
		$version_ = explode(".", $version);
		if($version_[0]<5 || $version_[1]<2){
			$t_return["msg"] .= "<br/>"." Php version unsupported. System need php 5.2 or heiger , while the environment's ".$version;
		}

		/*
		if(!function_exists('json_encode')){
			$t_return["msg"] .= "<br/>"." Php function json_encode unsupported. ";
		}
		*/
		
		/*
		if(function_exists('get_magic_quotes_gpc')){
			if(get_magic_quotes_gpc()==1){
				$t_return["msg"] .= "<br/>"." Turn off the magic please. Locate your php's php.ini , find the 'magic_quotes_gpc = On' and off it ;";
			}
		}
		*/
		
		$file = "../".tools::$configfilename;
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>". "File ".$file." is not writable, change it's mode to 777";
		}
		$file = "../sql/sql.sql";
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>". "File ".$file." is not writable, change it's mode to 777";
		}
		$file = "../sql/data.sql";
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>". "File ".$file." is not writable, change it's mode to 777";
		}
		$file = "../file/upload/paper";
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>"."Folder ".$file." is not writable, change it's mode to 777";
		}
		
		$file = "../file/upload/photo";
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>". "Folder ".$file." is not writable, change it's mode to 777";
		}
		
		$file = "../file/upload/mp3";
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>". "Folder ".$file." is not writable, change it's mode to 777";
		}
		
		if($t_return['msg']==""){
			$t_return = array(
					"status"=>"1"
					,"msg"=>"OK");
		}
		
		return $t_return;
	}	

	public static function step2(){

		$t_return = array("status"=>"2","msg"=>"");
		
		$host = $_REQUEST['host'];
		$unm = $_REQUEST['unm'];
		$pwd = $_REQUEST['pwd'];
		$port = $_REQUEST['port'];
		$db = $_REQUEST['db'];
		$MODE = $_REQUEST['mode'];
		$il8n = $_REQUEST['il8n'];
		$type = $_REQUEST['type'];
		
		if($MODE=='DZX'){
			include_once '../../config/config_global.php';
		
			$db = $_config['db'][1]['dbname'];
			$unm = $_config['db'][1]['dbuser'] ;
			$pwd = $_config['db'][1]['dbpw'];
			$host = $_config['db'][1]['dbhost'];
			$port = "";
			unset($_config);
		}
		if($MODE=='JOOMLA'){
			include_once '../../configuration.php';
			$obj = new JConfig();
		
			$db = $obj->db;
			$unm = $obj->user;
			$pwd = $obj->password;
			$host = $obj->host;
			$port = "";
			unset($obj);
		}
		if($MODE=='DEDE'){
			include_once '../../data/common.inc.php';
		
			$db = $cfg_dbname;
			$unm = $cfg_dbuser;
			$pwd = $cfg_dbpwd;
			$host = $cfg_dbhost;
			$port = "";
		}
		if($MODE=='BAIDU'){
			$unm = getenv('HTTP_BAE_ENV_AK');
			$pwd = getenv('HTTP_BAE_ENV_SK');
			$host = getenv('HTTP_BAE_ENV_ADDR_SQL_IP');
			$port = getenv('HTTP_BAE_ENV_ADDR_SQL_PORT');
			$MODE = "WLS";
		}		

		if($port!="")$host = $host.":".$port;
		$conn = mysql_connect($host,$unm,$pwd);
		if($conn!=FALSE){
			$db_ = mysql_select_db($db,$conn);
			if(!$db_){
				$t_return["msg"] =  " Database name wrong";
				$t_return["status"] = 2;
				return $t_return;
			}
		}else{
			$t_return["msg"] =  " Can not connect the database";
			$t_return["status"] = 23;
			return $t_return;
		}

		if($t_return['msg']==""){
			$t_return = array(
					"status"=>"1"
					,"msg"=>"OK");
		}
		
		$file = "../".tools::$configfilename;
		$fp = fopen($file, 'r');
		$arr = array();
		$num = 1;
		while(!feof($fp)){
			$line = trim(fgets($fp));
			
			if(strpos($line,'APPPATH') !== false){
				$line = "<item ID=\"APPPATH\">".$_SERVER['DOCUMENT_ROOT']."</item>";
			}
			else if(strpos($line,'DB_NAME') !== false){
				$line = "<item ID=\"DB_NAME\">".$db."</item>";
			}
			else if(strpos($line,'DB_UNM') !== false){
				$line = "<item ID=\"DB_UNM\">".$unm."</item>";
			}
			else if(strpos($line,'DB_PWD') !== false){
				$line = "<item ID=\"DB_PWD\">".$pwd."</item>";
			}
			else if(strpos($line,'DB_HOST') !== false){
				$line = "<item ID=\"DB_HOST\">".$host."</item>";
			}
			else if(strpos($line,'MODE') !== false){
				$line = "<item ID=\"MODE\">".$MODE."</item>";
			}
			else if(strpos($line,'IL8N') !== false){
				$line = "<item ID=\"IL8N\">".$il8n."</item>";
			}	
			else if(strpos($line,'DB_TYPE') !== false){
				$line = "<item ID=\"DB_TYPE\">".$type."</item>";
			}					
			 
			$arr[] = $line;
			$num++;
		}
		fclose($fp);
		$s = implode("\r\n", $arr);
		file_put_contents($file, $s);

		return $t_return;
	}
	
	public static function step3(){
		$t_return = array("status"=>"2","msg"=>"");
		$path_xls = "../sql/sql.xls";
		$PHPReader = PHPExcel_IOFactory::createReader('Excel5');
		$PHPReader->setReadDataOnly(true);
		$phpexcel = $PHPReader->load($path_xls);
		
		$sqls = array();
		$sqls2 = "";
		for($i0=0;$i0<$phpexcel->getSheetCount();$i0++){
			$currentSheet = $phpexcel->getSheet($i0);
			$row = $currentSheet->getHighestRow();
			for($i=1;$i<=$row;$i++){
				$cellvalue =  $currentSheet->getCell('E'.$i)->getValue();
				$cellvalue = trim($cellvalue);
				if($cellvalue!=NULL && $cellvalue[0]=='='){
					$cellvalue = $currentSheet->getCell('E'.$i)->getCalculatedValue();
				}
				$sqls[] = $cellvalue."\n";
				$sqls2 .= $cellvalue;
			}
		}
		
		$s = implode(" ", $sqls);
		file_put_contents("../sql/sql.sql", $s);
		$t_return = array("status"=>"1","msg"=>(count(explode(";", $sqls2))-1)." sql in total. Please waite for a while.","sql"=>explode(";", $sqls2));
		return $t_return;
	}
	
	public static function step3_2(){
		$t_return = array("status"=>"2","msg"=>"");
		$sqls = json_decode2($_REQUEST['sqls'],TRUE);
		if(count($sqls)==0){
			return array(
				'status'=>'2'
				,'msg'=>'wrong request:'.$_REQUEST['sqls']
			);
		}
		$conn = tools::getConn();
		for($i=0;$i<count($sqls);$i++){
			$res = mysql_query($sqls[$i],$conn);
			if($res==FALSE){
				return array(
					'status'=>'2'
					,'msg'=>'SQL ERROR '.$sqls[$i]
				);
			}
		}
		$t_return = array("status"=>"1","msg"=>count($sqls)." sql executed ");
		return $t_return;
	}
	
	public static function step4(){
		$t_return = array("status"=>"2","msg"=>"");
		$path_xls = "../sql/data.xls";
		$PHPReader = PHPExcel_IOFactory::createReader('Excel5');
		$PHPReader->setReadDataOnly(true);
		$phpexcel = $PHPReader->load($path_xls);
		$conn = tools::getConn();
		
		mysql_query("delete from basic_user;");
		mysql_query("insert into basic_user(username,password,group_code,group_all,id,type,status,money,credits) values ('admin',md5('admin'),'10','10',1,'10','10','10000','10000');");
		mysql_query("insert into basic_user(username,password,group_code,group_all,id,type,status) values ('guest',md5('guest'),'99','99',2,'10','10');");
		mysql_query("delete from basic_group_2_user;");
		mysql_query("insert into basic_group_2_user(user_code,group_code) values ('admin','10');");
		mysql_query("insert into basic_group_2_user(user_code,group_code) values ('guest','99');");
		mysql_query("delete from basic_group_2_permission;");
		mysql_query("delete from basic_permission;");
		mysql_query("delete from basic_group;");
		
		//mysql_query("START TRANSACTION;",$conn);
		$sqls = array();
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_group");		
		$row = $currentSheet->getHighestRow();
		for($i=2;$i<=$row;$i++){
			$sql_insert = "insert into basic_group(id,name,code,type,status) values ('".$i."','".trim($currentSheet->getCell('A'.$i)->getValue())."','".$currentSheet->getCell('B'.$i)->getValue()."','".$currentSheet->getCell('C'.$i)->getValue()."','".$currentSheet->getCell('D'.$i)->getValue()."');";
			$sqls[] = $sql_insert."\n";
			$res = mysql_query($sql_insert,$conn);
			if($res==FALSE){
				$t_return['msg'] = $sql_insert;
				return $t_return;
			}
		}
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_permission");
		$row = $currentSheet->getHighestRow();
		for($i=2;$i<=$row;$i++){
			$sql_insert = "insert into basic_permission(name,code,type,icon,path) values ('".trim($currentSheet->getCell('A'.$i)->getValue())."','".$currentSheet->getCell('C'.$i)->getValue()."','".$currentSheet->getCell('B'.$i)->getValue()."','".$currentSheet->getCell('D'.$i)->getCalculatedValue()."','".$currentSheet->getCell('E'.$i)->getValue()."');";
			$sqls[] = $sql_insert."\n";
			$res = mysql_query($sql_insert,$conn);
			if($res==FALSE){
				$t_return['msg'] = $sql_insert;
				return $t_return;
			}
		}
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_group_2_permission");
		$rowindex = 0;
		foreach ($currentSheet->getRowIterator() as $row) {
			$rowindex ++;
			if($rowindex<=2)continue;
			$cellIterator = $row->getCellIterator();
			$cellIterator->setIterateOnlyExistingCells( false);
			$columnindex = 0;
			foreach ($cellIterator as $cell) {
				$columnindex++;
				if($columnindex<=2)continue;
				if ((!is_null($cell)) && ($cell->getValue()=="1") ) {
					$permission = $currentSheet->getCellByColumnAndRow(1,$rowindex)->getValue();
					$group = $currentSheet->getCellByColumnAndRow($columnindex-1,2)->getValue();
					$cellvalue = "insert into basic_group_2_permission (permission_code,group_code) values('".$permission."','".$group."');";
					$sqls[] = $cellvalue."\n";
					mysql_query($cellvalue,$conn);
				}
			}
		}
		tools::initMemory();
		//mysql_query("COMMIT;",$conn);
		$s = implode(" ", $sqls);
		file_put_contents("../sql/data.sql", $s);
		$t_return = array("status"=>"1","msg"=>count($sqls)." sql executed ","sqls"=>$sqls);
		return $t_return;
	}	
}

$functionName = $_REQUEST['function'];
$data = array();
if($functionName=="step1"){
	$data = install::step1();
}
else if($functionName=="step2"){
	$data = install::step2();
}
else if($functionName=="step3"){
	$data = install::step3();
}	
else if($functionName=="step3_2"){
	$data = install::step3_2();
}
else if($functionName=="step4"){
	$data = install::step4();
}
else if($functionName=="data4test__basic_group"){
	$data = simulate::basic_group(2000);
}
else if($functionName=="data4test__basic_user"){
	$data = simulate::basic_user(2000);
}
else if($functionName=="data4test__exam_subject"){
	$data = simulate::exam_subject(2000);
}
else if($functionName=="data4test__exam_paper"){
	$a = json_decode2($_REQUEST['dates'], true);
	$delete = false;
	if(isset($_REQUEST['delete']))$delete = true;
	$data = simulate::exam_paper(20000,$a,$delete);
}
else if($functionName=="simulate__get_students"){
	$data = exam_paper_log::simulate__get_students();
}
else if($functionName=="simulate__get_subjects"){
	$data = exam_paper_multionline::simulate__get_subjects();
}
else if($functionName=="simulate__exam_paper_log"){
	$a = json_decode2($_REQUEST['dates'], true);
	$delete = false;
	if(isset($_REQUEST['delete']))$delete = true;	
	$data = exam_paper_log::simulate(20000,array($a[0],end($a)),$_REQUEST['student'],$delete);
}
else if($functionName=="simulate__exam_paper_multionline"){
	$delete = false;
	if(isset($_REQUEST['delete']))$delete = true;
	$dates = json_decode2($_REQUEST['dates'], true);
	$students = json_decode2($_REQUEST['students'], true);
	$subjects = json_decode2($_REQUEST['subjects'], true);
	$data = exam_paper_multionline::simulate__exam_paper_multionline(20000
			,$dates
			,$subjects[0]
			,$students
			,$delete);
}
else if($functionName=="exam_paper_multionline__close"){
	$ids = json_decode2($_REQUEST['ids'],true);
	for($i=0;$i<count($ids);$i++){
		exam_paper_multionline::close($ids[$i]);
	}
	$data = array(
		'msg'=>'ok'
		,'status'=>'1'
	);
}
else if($functionName=="exam_paper_multionline__close_ids"){
	$data = exam_paper_multionline::simulate__get_ids();
}
else if($functionName=="phpinfo"){
	phpinfo();
}
else if($functionName=="php_test"){
	echo date('Y-m-d',strtotime("2011-01-01")+86400);
	print_r(explode("a","bbb"));
}
else if($functionName=="toolsTest"){
	$list = array(
		array(
			'code'=>'10'
		),		array(
			'code'=>'20'
		),		array(
			'code'=>'2010'
		),		array(
			'code'=>'2011'
		),		array(
			'code'=>'2012'
		),array(
			'code'=>'201201'
		),array(
			'code'=>'201202'
		),array(
			'code'=>'201203'
		),array(
			'code'=>'30'
		),
			
	);
	$data = tools::list2Tree($list);
}
else if($functionName=='paperImport'){
	$data = exam_paper::upload("../file/upload/photo/highschool/example_choice.xls", "admin");
}
else if($functionName=='multionlineImport'){
	$data = exam_paper_multionline::upload("../file/upload/photo/highschool/exam_paper_multionline_high_chinese.xls", "admin");
}


echo json_encode($data);
if(tools::$conn!=null)mysql_close(tools::$conn);
