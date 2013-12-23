<?php

class tools{
    
	public static $LANG = NULL;	 	
	public static $systemType = NULL;
	public static $configfilename = "../config.xml";
	public static $serverpath = "";
    
	public static function getAllFiles($filedir) {
		$allfiles = array(); 
		$tempArr = array();
		if (is_dir($filedir)) {
			if ($dh = opendir($filedir)) {
				while (FALSE !== ($filestring = readdir($dh))) {
					if ($filestring != '.' && $filestring != '..' && $filestring != '.svn') {
						if (is_dir($filedir . $filestring)) {
							$tempArr = tools::getAllFiles($filedir . $filestring . '/');
							$allfiles = array_merge($allfiles, $tempArr); 
						} else if (is_file($filedir . $filestring)) {
							$allfiles[] = $filedir . $filestring; 
						}
					}
				}
			} else {
				exit('Open the directory failed');
			}
			closedir($dh);
			return $allfiles;
		} else {
			exit('The directory is not exist');
		}		
	}	

	public static function readIl8n($class=NULL,$item=NULL){
        if(self::$LANG==NULL){
            $il8n = tools::getConfigItem("IL8N");
    		$languageFiels = tools::getAllFiles('../language/'.$il8n.'/');
    		$arr = array();
    		for($i=0;$i<count($languageFiels);$i++){
    			//echo substr($languageFiels[$i], strlen($languageFiels[$i])-4 ,4);
    			if(substr($languageFiels[$i], strlen($languageFiels[$i])-4 ,4)=='.ini'){
    				$path = str_replace('../language/'.$il8n.'/', '', $languageFiels[$i]);
    				$path = str_replace('.ini', '', $path);
    				$folderLevel = explode("__",$path);
    				$lang = parse_ini_file($languageFiels[$i],true);
    				$arr = array_merge($arr,$lang);  
    			}
    		}
    		
    		self::$LANG = $arr;
        }
        if($class==NULL)return self::$LANG;
		return self::$LANG[$class][$item];
	}	

	public static $conn = null;   
	public static function getConn($another=FALSE){
		$conn = null;
		if($another==FALSE){
			if(self::$conn==null){
			    $conn = self::getConn(TRUE);
				self::$conn = $conn;
			}			
			return self::$conn;
		}else{
			$host = tools::getConfigItem("DB_HOST");
			$unm = tools::getConfigItem("DB_USERNAME");
			$pwd = tools::getConfigItem("DB_PASSWORD");
			$dbname = tools::getConfigItem("DB_NAME");
			$dbtype = tools::getConfigItem("DB_TYPE");
			self::$dbtype = $dbtype;
			self::$dbcharset = tools::getConfigItem("DB_CHARSET");
			if($dbtype=="mysql"){				
				$conn = mysql_connect($host,$unm,$pwd,$another);
				if(!$conn)return null;
				mysql_select_db($dbname,$conn);

				mysql_query("set time_zone='+8:00';");
				mysql_query("SET NAMES UTF8;");
				self::$conn = $conn;
			}
			else if($dbtype=="mssql"){
				//$conn = sqlsrv_connect( $host, array("UID"=>$unm,"PWD"=>$pwd, "Database"=>$dbname));
				$conn = mssql_connect($host,$unm,$pwd,TRUE);
				if(!$conn)return null;
				mssql_select_db($dbname,$conn);	
				self::$conn = $conn;
			}			
			return $conn;
		}
	}
	
	public static function closeConn($conn=NULL){
		$theconn = NULL;
		if($conn != NULL){
			$theconn = $conn;
		}
		else{
			$theconn = self::$conn;
		}
		
		if($theconn==NULL)return;
		$dbtype = tools::getConfigItem("DB_TYPE");
		if($dbtype=="mysql"){
			mysql_close($theconn);
		}
		else if($dbtype=="mssql"){
// 			sqlsrv_close(self::$conn);
			mssql_close($theconn);
		}
	}
	
	public static $dbtype = FALSE;
	public static $dbcharset = NULL;
	public static function query($sql,$conn){
		$res = FALSE;
		
		if(self::$dbcharset!="UTF-8"){
			$sql = iconv('UTF-8',self::$dbcharset,$sql);
		}

		if(self::$dbtype=="mysql"){
			try {
				$res = mysql_query($sql,$conn);
				if(!$res)exit($sql." ".self::$dbcharset." ".self::$dbtype." ".mysql_error($conn));
			}
			catch (Exception $e) {
				echo "exc ";
				exit($sql);
			}
		}
		else if(self::$dbtype=="mssql"){		
			//$res = sqlsrv_query($conn,$sql);
			try {
				$res = mssql_query($sql,$conn);
			}
			catch (Exception $e) {
				echo iconv(self::$dbcharset,'UTF-8',$e);
			}
			if(!$res)exit($sql);
		}			
		return $res;
	}
	
	public static function transaction($conn){
		if(self::$dbtype=="mysql"){
			mysql_query('START TRANSACTION;',$conn);
		}
		if(self::$dbtype=="mssql"){
// 			if ( sqlsrv_begin_transaction( $conn ) === false ) {
// 			     die( print_r( sqlsrv_errors(), true ));
// 			}
			mssql_query('begin transaction',$conn);
		}
	}
	
	public static function commit($conn){
		if(self::$dbtype=="mysql"){
			mysql_query('COMMIT;',$conn);
		}
		if(self::$dbtype=="mssql"){
			//sqlsrv_commit( $conn );
			mssql_query('COMMIT TRAN',$conn);
		}
	}	
	
	public static function fetch_assoc($res){
		$data = FALSE;
		if(tools::$dbtype=="mysql"){
			$data = mysql_fetch_assoc($res);
		}
		if(tools::$dbtype=="mssql"){
			//$data = sqlsrv_fetch_array($res,SQLSRV_FETCH_ASSOC);
			$data = mssql_fetch_assoc($res);
		}
		if($data!=FALSE){
			if(tools::$dbcharset!="UTF-8"){
				$data = tools::changeCharsetInTree($data);
			}
		}
		
		return $data;
	}
	
	public static function getTableId($tablename,$update=FALSE){
		$i_return = 0;
		$sql = tools::getSQL("basic_memory__id");
		$sql = str_replace("__code__",$tablename, $sql);
		$res = tools::query($sql,tools::getConn());
		if(!$res){
			$i_return = 1;
		}
		$temp = tools::fetch_assoc($res);
		$i_return = $temp['id'] + 1;
		
		if($update){
			$sql = "update basic_memory set extend1 = ".$i_return." where type = 2 and code = '".$tablename."';";
			tools::query($sql,tools::getConn());
		}
		
		return $i_return;
	}
	
	public static function updateTableId($tablename){
		$sql = tools::getSQL("basic_memory__id_update");
		$sql = str_replace("__code__", $tablename, $sql);

		tools::query($sql,tools::getConn());
	}
	
	public static $xml = null;
	public static function getConfigItem($id){
		if(tools::$xml==null){
    		tools::$xml = new DOMDocument();
            tools::$xml->load(tools::$configfilename); //读取xml文件
    
    		$sqls = tools::$xml->getElementsByTagName('ITEM');
            for($i=0; $i<$sqls->length;$i++){                
                $item = $sqls->item($i);
                $item->setIdAttribute('ID', true);
            }
		}
		
		return tools::$xml->getElementById($id)->nodeValue;
	}
	
	public static $xmlSQL = null;
	public static function getSQL($id){
		if(tools::$xmlSQL==null){
			tools::$xmlSQL = new DOMDocument();
			libxml_clear_errors();
			libxml_use_internal_errors(FALSE);
			tools::$xmlSQL->load("../".self::$dbtype.".xml");
	
			$sqls = tools::$xmlSQL->getElementsByTagName('ITEM');
			for($i=0; $i<$sqls->length;$i++){
				$item = $sqls->item($i);
				$item->setIdAttribute('ID', true);
			}
		}	
		return tools::$xmlSQL->getElementById($id)->nodeValue;
	}
	
	public static function list2Tree($list){
        $data = array();
        
        for($i=0;$i<count($list);$i++){
            $temp = $list[$i];
            $len = strlen($temp['code']);
           	if($len==2){
           		$data[] = $temp;
           		continue;
           	}
           	
            $aa = array();
            $aa[] = $data;         
            for($i2=2;$i2<$len;$i2+=2){            	
            	$a = end($aa);
            	$p = count($a)-1;
            	$item = $a[$p];
            	if(!isset($item['children']))$item['children'] = array();
            	$aa[] = $item['children'];
            }
            $aa[count($aa)-1][] = $temp;
            for($i3=count($aa)-1;$i3>0;$i3--){
            	$aa[$i3-1][count($aa[$i3-1])-1]['children'] = $aa[$i3];
            }
            $data = $aa[0];
        }        
        return $data;	
	}
	
	//TODO 
	public static function localzone2Tree($list){
		$data = array();
	
		for($i=0;$i<count($list);$i++){
			$temp = $list[$i];
			$len = strlen($temp['code']);
			if($len==2){
				$data[] = $temp;
				continue;
			}
			
			$arr = explode("-", $temp['code']);
			
			$aa = array();
			$aa[] = $data;
			for($i2=2;$i2<$len;$i2+=2){
				$a = end($aa);
				$p = count($a)-1;
				$item = $a[$p];
				if(!isset($item['children']))$item['children'] = array();
				$aa[] = $item['children'];
			}
			$aa[count($aa)-1][] = $temp;
			for($i3=count($aa)-1;$i3>0;$i3--){
				$aa[$i3-1][count($aa[$i3-1])-1]['children'] = $aa[$i3];
			}
			$data = $aa[0];
		}
		return $data;
	}	
	
	public static function importIl8n2DB() {	    
		$il8n = tools::readIl8n();      
		$conn = tools::getConn();
		$sql = "delete from basic_memory where type = '3';";
		tools::query($sql,$conn);	
        
        $keys = array_keys($il8n);
        tools::transaction($conn);
		for($i=0;$i<count($keys);$i++){
		    $keys_ = array_keys($il8n[$keys[$i]]);
		    for($j=0;$j<count($keys_);$j++){
		        //echo $keys[$i].$keys_[$j].$il8n[$keys[$i]][$keys_[$j]];
		        $sql = "insert into basic_memory (code,extend4,extend5,type) values ('".$keys[$i]."','".$keys_[$j]."','".$il8n[$keys[$i]][$keys_[$j]]."','3');";
		        tools::query($sql,$conn);
		    }
		}
		tools::commit($conn);
	}
	
	public static function initMemory(){
		$conn = tools::getConn();
		$conn_read = tools::getConn(TRUE);
		$sql = "delete from basic_memory  ;";
		tools::query($sql,$conn);
		tools::importIl8n2DB();
		
		$sqls = tools::getSQL("basic_memory__init");
		$sqls_arr = explode(";", $sqls);
		tools::transaction($conn);
		for($i=0;$i<count($sqls_arr);$i++){
		    $sql = $sqls_arr[$i];
		    tools::query($sql,$conn);
		}		
		tools::commit($conn);
		
		$il8n = tools::readIl8n();
		$json = json_encode($il8n);
		file_put_contents("../language/il8n.js", "var il8n=".$json.";");
		
		$sql = tools::getSQL("basic_parameter__json");
		$res = tools::query($sql,$conn_read);
		$data = array();
		$reference = "";
		$data2 = array();
		tools::transaction($conn);
		while($temp = tools::fetch_assoc($res)){
			$sql_insert = "insert into basic_memory(code,type,extend4,extend5) values ('".$temp['code']."',1,'".$temp['value']."','".$temp['reference']."')";
			tools::query($sql_insert,$conn);
			if($temp['reference']!=$reference){
				if($reference!=""){
					$data[$reference]=$data2;
					$data2 = array();
				}
				$reference = $temp['reference'];
			}
			unset($temp["reference"]);
			$data2[] = $temp;
		}
		tools::commit($conn);
		$data[$reference]=$data2;
		$json = json_encode($data);
		file_put_contents("../js/basic_parameter_data.js", "var basic_parameter_data=".$json.";");		
	}	
	   
    public static function cutString($sourcestr,$cutlength)
    {
       $returnstr='';
       $i=0;
       $n=0;
       $str_length=strlen($sourcestr);//字符串的字节数
       while (($n<$cutlength) and ($i<=$str_length))
        {
          $temp_str=substr($sourcestr,$i,1);
          $ascnum=Ord($temp_str);//得到字符串中第$i位字符的ascii码
          if ($ascnum>=224)    //如果ASCII位高与224，
          {
             $returnstr=$returnstr.substr($sourcestr,$i,3); //根据UTF-8编码规范，将3个连续的字符计为单个字符         
             $i=$i+3;            //实际Byte计为3
             $n++;            //字串长度计1
          }
           elseif ($ascnum>=192) //如果ASCII位高与192，
          {
             $returnstr=$returnstr.substr($sourcestr,$i,2); //根据UTF-8编码规范，将2个连续的字符计为单个字符
             $i=$i+2;            //实际Byte计为2
             $n++;            //字串长度计1
          }
           elseif ($ascnum>=65 && $ascnum<=90) //如果是大写字母，
          {
             $returnstr=$returnstr.substr($sourcestr,$i,1);
             $i=$i+1;            //实际的Byte数仍计1个
             $n++;            //但考虑整体美观，大写字母计成一个高位字符
          }
           else                //其他情况下，包括小写字母和半角标点符号，
          {
             $returnstr=$returnstr.substr($sourcestr,$i,1);
             $i=$i+1;            //实际的Byte数计1个
             $n=$n+0.5;        //小写字母和半角标点等与半个高位字符宽...
          }
        }
              if ($str_length>$cutlength){
              $returnstr = $returnstr . "...";//超过长度时在尾处加上省略号
          }
         return $returnstr;
    }     
    
    //判断时间格式是否正确
    public static function checkDateFormat($date,$format="Y-m-d")
    {
      if($format=='Y-m-d'){
          //match the format of the date
          if (preg_match ("/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/", $date, $parts))
          {
            //check weather the date is valid of not
        	if(checkdate($parts[2],$parts[3],$parts[1]))
        	  return true;
        	else
        	 return false;
          }
          else
            return false;
      }else if($format=="Y-m-d H:i:s"){
         
         $strArr = explode(" ",$date);
         
         if(empty($strArr) || count($strArr)!=2 ){
          return false;
         }
         
         if(!tools::checkDateFormat($strArr[0],'Y-m-d'))return false;
         return (bool)preg_match("/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/",$strArr[1]); 
      }
    }  

    public static function changeCharsetInTree($item){
   		$keys = array_keys($item);
   		for($i=0;$i<count($item);$i++){
   			if(is_array($item[$keys[$i]])){
   				$item[$keys[$i]] = self::changeCharsetInTree($item[$keys[$i]]);
   			}else{
   				$item[$keys[$i]] = iconv(self::$dbcharset,'UTF-8',$item[$keys[$i]]);
   			}   			
   		}
   		return $item;
    }
}

function json_decode2($json_string,$what=TRUE){
	if(ini_get("magic_quotes_gpc")=="1")  {  
		$json_string=stripslashes($json_string);  
	} 

	return json_decode($json_string,$what);
}

date_default_timezone_set('Asia/Shanghai');
//header("Content-Type: text/html; charset=utf8");