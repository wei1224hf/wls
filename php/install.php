<?php 
include_once "tools.php";
include_once 'basic_group.php';
include_once 'basic_user.php';

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
		$file = "../file/upload";
		if(!is_writable($file)){
			$t_return["msg"] .= "<br/>"."Folder ".$file." is not writable, change it's mode to 777";
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
		$unm = $_REQUEST['username'];
		$pwd = $_REQUEST['password_'];
		$port = $_REQUEST['port'];
		$db = $_REQUEST['name'];
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
			$MODE = "independent";
		}		
		
		if($type=="mysql"){
			if($port!="")$host = $host.":".$port;
		}
		else if($type=="mssql"){
			if($port!="")$host = $host.",".$port;
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
			else if(strpos($line,'DB_USERNAME') !== false){
				$line = "<item ID=\"DB_USERNAME\">".$unm."</item>";
			}
			else if(strpos($line,'DB_PASSWORD') !== false){
				$line = "<item ID=\"DB_PASSWORD\">".$pwd."</item>";
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
		
		if(tools::getConn()==FALSE){
			$t_return["status"] = 2;
			$t_return["msg"] = "db wrong".tools::$conn;
		}
		if($t_return['msg']==""){
			$t_return["status"] = 1;
			$t_return["msg"] = "ok";
		}		

		return $t_return;
	}
	
	public static function step3(){
		
		$t_return = array("status"=>"2","msg"=>"");
		$path_xls = "../sql/".tools::getConfigItem("DB_TYPE")."_".tools::getConfigItem("IL8N").".xls";
		$PHPReader = PHPExcel_IOFactory::createReader('Excel5');
		$PHPReader->setReadDataOnly(true);
		$phpexcel = $PHPReader->load($path_xls);
		$conn = tools::getConn();
		$sqls = array();
		$sqls2 = "";
		for($i0=0;$i0<$phpexcel->getSheetCount();$i0++){			
			$currentSheet = $phpexcel->getSheet($i0);
			$sheetname = $currentSheet->getTitle();
			//echo $sheetname;exit();
			if(tools::$dbtype=="mssql" && $sheetname=="SL323")continue;
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
			$sql = $sqls[$i];
			if(tools::$dbtype=="mssql"){
				if (strpos($sql, "create table") !== false){
					$sql = str_replace("numeric", "numeric,AAAAAA,", $sql);
					$parts = explode(",", $sql);
					
					$parts2 = array();
					$spot = 0;
					for($i2=0;$i2<count($parts);$i2++){						
						if($parts[$i2]=="AAAAAA"){
							$parts2[$i2-1] = $parts[$i2-1] ;
							$parts2[$i2] = $parts[$i2] ;
							$parts2[$i2+1] = $parts[$i2+1] ;
							$i2++;							
							continue;
						}
						else{
							if (
								!(
								(strpos($parts[$i2], "unique") !== false)||
								(strpos($parts[$i2], "primary") !== false)||
								(strpos($parts[$i2], "default") !== false)||
								(strpos($parts[$i2], "not null") !== false)
								)
							){
								if($i2== (count($parts)-1) ){
									$parts2[$i2] = substr($parts[$i2], 0,strlen($parts[$i2])-1);
									$parts2[$i2] .= " null )";
								}
								else{
									$parts2[$i2] = $parts[$i2]." null ";
								}
							}
							else{
								$parts2[$i2] = $parts[$i2];
							}
						}
					}
					//print_r($parts);print_r($parts2);exit();
					$sql = join(",", $parts2);
					$sql = str_replace(",AAAAAA,", "", $sql);
					
					$sqls[$i] = $sql;
				}
			}
			else if(tools::$dbtype=="mysql"){
				if (strpos($sql, "create table") !== false){
					if ( (strpos($sql, "basic_user_session") !== false) || (strpos($sql, "basic_memory") !== false) ){
						$sql .= " ENGINE=MEMORY ";
					}					
					$sql .= " DEFAULT CHARSET=utf8 ";	
					$sqls[$i] = $sql;
				}
			}
			$res = tools::query(strtolower($sqls[$i]),$conn);
			if($res==FALSE){
				return array(
					'status'=>'2'
					,'msg'=>'SQL ERROR '.$sqls[$i]
				);
			}
			//exit($sqls[$i]);
		}
		$t_return = array("status"=>"1","msg"=>count($sqls)." sql to execute ");
		return $t_return;
	}
	
	public static function step4(){
		
		$t_return = array("status"=>"2","msg"=>"");
		$path_xls = "../sql/data_".tools::getConfigItem("IL8N").".xls";
		$PHPReader = PHPExcel_IOFactory::createReader('Excel5');
		$PHPReader->setReadDataOnly(true);
		$phpexcel = $PHPReader->load($path_xls);
		$conn = tools::getConn();
		
		tools::query("delete from basic_user;",$conn);
		tools::query("delete from basic_group_2_user;",$conn);
		tools::query("delete from basic_group_2_permission;",$conn);
		tools::query("delete from basic_permission;",$conn);
		tools::query("delete from basic_parameter;",$conn);
		tools::query("delete from basic_group;",$conn);		
		tools::query("delete from exam_subject;",$conn);
		tools::query("delete from exam_subject_2_group;",$conn);
		
		$sqls = array();
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_user");
		$row = $currentSheet->getHighestRow();
		for($i=2;$i<=$row;$i++){
			$pwd = md5($currentSheet->getCell('B'.$i)->getValue());
			if( tools::getConfigItem("MODE")=="DZX" ){
				$pwd = md5("dzx");
			}
			$sql_insert = "insert into basic_user(id,username,password,group_code,type,status,money,credits,govern_zone) values (
					'".$i."'
					,'".trim($currentSheet->getCell('A'.$i)->getValue())."'
					,'".$pwd."'
					,'".$currentSheet->getCell('C'.$i)->getValue()."'
					,'".$currentSheet->getCell('D'.$i)->getValue()."'
					,'".$currentSheet->getCell('E'.$i)->getValue()."'
					,'".$currentSheet->getCell('F'.$i)->getValue()."'
					,'".$currentSheet->getCell('G'.$i)->getValue()."'	
					,'".$currentSheet->getCell('H'.$i)->getValue()."'									
			);";
			$sqls[] = $sql_insert."\n";
			
			$sql_insert = "insert into basic_group_2_user(user_code,group_code) values ('".trim($currentSheet->getCell('A'.$i)->getValue())."','".$currentSheet->getCell('C'.$i)->getValue()."');";
			$sqls[] = $sql_insert."\n";
			//$res = tools::query($sql_insert,$conn);
		}		
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_group");		
		$row = $currentSheet->getHighestRow();
		for($i=2;$i<=$row;$i++){
			$type = $currentSheet->getCell('C'.$i)->getValue();
			if($type!='99'){
				$sql_insert = "insert into basic_group(id,name,code,type,status) values ('".$i."','".trim($currentSheet->getCell('A'.$i)->getValue())."','".$currentSheet->getCell('B'.$i)->getValue()."','".$currentSheet->getCell('C'.$i)->getValue()."','".$currentSheet->getCell('D'.$i)->getValue()."');";
			}else{
				$sql_insert = "insert into basic_node(name,code,tablename) values ('".trim($currentSheet->getCell('A'.$i)->getValue())."','".$currentSheet->getCell('B'.$i)->getValue()."','basic_group');";
			}
			$sqls[] = $sql_insert."\n";
			//$res = tools::query($sql_insert,$conn);
		}
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_permission");
		$row = $currentSheet->getHighestRow();
		
		for($i=2;$i<=$row;$i++){
			$sql_insert = "insert into basic_permission(name,code,type,icon,path) values ('".trim($currentSheet->getCell('A'.$i)->getValue())."','".$currentSheet->getCell('C'.$i)->getValue()."','".$currentSheet->getCell('B'.$i)->getValue()."','".$currentSheet->getCell('D'.$i)->getCalculatedValue()."','".$currentSheet->getCell('E'.$i)->getValue()."');";
			//echo $sql_insert;
			$sqls[] = $sql_insert."\n";
			//$res = tools::query($sql_insert,$conn);
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
					//tools::query($cellvalue,$conn);
				}
			}
		}

		$currentSheet = $phpexcel->getSheetByName("data_exam_subject");
		$row = $currentSheet->getHighestRow();
		for($i=2;$i<=$row;$i++){
			$sql_insert = "insert into exam_subject(code,name,directions,type) values (
					 '".trim($currentSheet->getCell('B'.$i)->getValue())."'
					,'".$currentSheet->getCell('A'.$i)->getValue()."'
					,'".$currentSheet->getCell('D'.$i)->getValue()."'
					,'".$currentSheet->getCell('C'.$i)->getValue()."'
			);";
			$sqls[] = $sql_insert."\n";
			//$res = tools::query($sql_insert,$conn);
		}
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_group_2_subject");
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
					$subject = $currentSheet->getCellByColumnAndRow(1,$rowindex)->getValue();
					$group = $currentSheet->getCellByColumnAndRow($columnindex-1,2)->getValue();
					$cellvalue = "insert into exam_subject_2_group (subject_code,group_code) values('".$subject	."','".$group."');";
					$sqls[] = $cellvalue."\n";
					//tools::query($cellvalue,$conn);
				}
			}
		}
		
		$currentSheet = $phpexcel->getSheetByName("data_basic_parameter");
		$row = $currentSheet->getHighestRow();
		for($i=2;$i<=$row;$i++){
			$code_read = trim($currentSheet->getCell('B'.$i)->getValue());
			if($code_read==null || $code_read=="")continue;
			$code_read = str_replace("'", "", $code_read);
			$sql_insert = "insert into basic_parameter(id,value,code,reference,extend1) values (
					'".($i+50000)."'
					,'".trim($currentSheet->getCell('A'.$i)->getValue())."'
					,'".$code_read."'
					,'".trim($currentSheet->getCell('C'.$i)->getValue())."'
					,'".trim($currentSheet->getCell('D'.$i)->getValue())."'
					);";
			$sqls[] = $sql_insert."\n";
		}	
		
		$s = implode(" ", $sqls);
		file_put_contents("../sql/data.sql", $s);
		$t_return = array("status"=>"1","msg"=>count($sqls)." sql to execute ","sqls"=>$sqls);
		exit(json_encode($t_return));
		return $t_return;
	}	
	
	public static function step4_2(){

		$t_return = array("status"=>"2","msg"=>"");
		$sqls = json_decode2($_REQUEST['sqls'],TRUE);
		if(count($sqls)==0){
			return array(
				'status'=>'2'
				,'msg'=>'wrong request:'.$_REQUEST['sqls']
			);
		}
		$conn = tools::getConn();
		tools::transaction($conn);
		if(tools::$dbtype=="mssql"){
			$str = implode(";",$sqls);
			tools::query($str,$conn);
		}else{
			for($i=0;$i<count($sqls);$i++){
				$sqls[$i] = strtolower($sqls[$i]);
				$res = tools::query($sqls[$i],$conn);
			}
		}
		tools::commit($conn);
		$t_return = array("status"=>"1","msg"=>count($sqls)." sql executed ");
		
		if(count($sqls)<1000){
			tools::initMemory();
			include_once 'basic_user.php';
			basic_user::login("admin",md5(md5("admin").date("H")),"0","system");
		}
		
		return $t_return;
	}	
	
}

$functionName = $_REQUEST['function'];
$data = null;
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
else if($functionName=="step4_2"){
	$data = install::step4_2();
}

echo json_encode($data);
if(tools::$conn!=null)tools::closeConn();
