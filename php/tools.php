<?php
/**
 * 服务端工具包函数库
 * 一些常用的功能性函数,很难判断具体是属于哪个业务模块,
 * 并且会被频繁的在各个业务模块中反复调用的函数,
 * 就都被放置在这里
 * 函数跟变量一律为 static 格式
 * 
 * @author wei1224hf@gmail.com
 * @version 201209
 * */
class tools{
    
	public static $conn = null;   
	public static $LANG = NULL;	 
	
	public static $systemType = NULL;
	public static $dzxConfig = NULL;
	public static $joomlaConfig = NULL;
	public static $configfilename = "config.xml.php";
    
    /**
     * 得到某一个文件夹内的所有文件,甚至其子文件夹内的所有文件
     * */
	public static function getAllFiles($filedir) {
		$allfiles = array(); //文件名数组
		$tempArr = array(); //临时文件名数组
		if (is_dir($filedir)) {//判断要遍历的是否是目录
			if ($dh = opendir($filedir)) {//打开目录并赋值一个目录句柄(directory handle)
				while (FALSE !== ($filestring = readdir($dh))) {//读取目录中的文件名
					if ($filestring != '.' && $filestring != '..' && $filestring != '.svn') {//如果不是.和..(每个目录下都默认有.和..)
						if (is_dir($filedir . $filestring)) {//该文件名是一个目录时
							$tempArr = tools::getAllFiles($filedir . $filestring . '/');//继续遍历该子目录
							$allfiles = array_merge($allfiles, $tempArr); //把临时文件名和临时文件名组合
						} else if (is_file($filedir . $filestring)) {
							$allfiles[] = $filedir . $filestring; //如果该文件名是一个文件不是目录,直接赋值给文件名数组
						}
					}
				}
			} else {//打开目录失败
				exit('Open the directory failed');
			}
			closedir($dh);//关闭目录句柄
			return $allfiles;//返回文件名数组
		} else {//目录不存在
			exit('The directory is not exist');
		}		
	}	

	/**
	 * 读取国际化语言包内容
	 * */
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

	/**
	 * 数据库链接
	 * */
	public static function getConn($another=FALSE){
		if($another==FALSE){
			if(self::$conn==null){
			    $host = tools::getConfigItem("DB_HOST");
			    $unm = tools::getConfigItem("DB_UNM");
			    $pwd = tools::getConfigItem("DB_PWD");
			    $dbname = tools::getConfigItem("DB_NAME");
				self::$conn = mysql_connect($host,$unm,$pwd);
				if(!self::$conn){
					exit("connenct wrong");
				}
				mysql_select_db($dbname,self::$conn);
				mysql_query("set time_zone='+8:00';");
				mysql_query("SET NAMES UTF8;");
			}			
			return self::$conn;
		}else{
			$host = tools::getConfigItem("DB_HOST");
			$unm = tools::getConfigItem("DB_UNM");
			$pwd = tools::getConfigItem("DB_PWD");
			$dbname = tools::getConfigItem("DB_NAME");
			$conn = mysql_connect($host,$unm,$pwd);
			if(!self::$conn)exit("connenct wrong");
			mysql_select_db($dbname,self::$conn);
			mysql_query("set time_zone='+8:00';");
			mysql_query("SET NAMES UTF8;");
			return $conn;
		}
	}
	
	public static function closeConn(){
	    mysql_close(self::$conn);
	    self::$conn = NULL;
	}
	
	/**
	 * 获取数据库表中新的一个主键编号
	 * 大多数业务表的 id 都不是自动递增的
	 * */
	public static function getTableId($tablename,$update=TRUE){

		$sql = tools::getSQL("basic_memory__id");
		$sql = str_replace("__code__", "'".$tablename."'", $sql);
		$res = mysql_query($sql,tools::getConn());
		$temp = mysql_fetch_assoc($res);
		$id = $temp['id'];
		
		if($update){
			$sql = tools::getSQL("basic_memory__id_add");
			$sql = str_replace("__code__", "'".$tablename."'", $sql);
			mysql_query($sql,tools::getConn());
		}
		
		return $id+1;
	}
	
	public static function updateTableId($tablename){
		$sql = tools::getSQL("basic_memory__id_update");
		$sql = str_replace("__code__", $tablename, $sql);

		mysql_query($sql,tools::getConn());
	}
	
	public static $xml = null;
	public static function getConfigItem($id){
		if(tools::$xml==null){
    		tools::$xml = new DOMDocument();
            tools::$xml->load('../'.tools::$configfilename); //读取xml文件
    
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
			tools::$xmlSQL->load('../sql.xml');
	
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
	
	public static function importIl8n2DB() {
	    
		$il8n = tools::readIl8n();      
		$conn = tools::getConn();
		$sql = "delete from basic_memory where type = '3';";
		mysql_query($sql,$conn);	
        
        $keys = array_keys($il8n);
		for($i=0;$i<count($keys);$i++){
		    $keys_ = array_keys($il8n[$keys[$i]]);
		    for($j=0;$j<count($keys_);$j++){
		        //echo $keys[$i].$keys_[$j].$il8n[$keys[$i]][$keys_[$j]];
		        $sql = "insert into basic_memory (code,extend4,extend5,type) values ('".$keys[$i]."','".$keys_[$j]."','".$il8n[$keys[$i]][$keys_[$j]]."','3');";
		        mysql_query($sql,$conn);
		    }
		}

	}
	
	public static function initMemory(){
		$conn = tools::getConn();
		$sql = "delete from basic_memory  ;";
		mysql_query($sql,$conn);
		$sql = "insert into basic_memory (code,type,extend4,extend5) (select code,'1' as type,value,reference from basic_parameter where reference like '%\\_%\\_\\_%' );";
		mysql_query($sql,$conn);

		tools::importIl8n2DB();
		
		$sqls = tools::getSQL("basic_memory__init");
		$sqls_arr = explode(";", $sqls);
		for($i=0;$i<count($sqls_arr);$i++){
		    $sql = $sqls_arr[$i];
		    mysql_query($sql,$conn);
		}		
	}	
	   
    /**
     * 判断字符串里的字符个数
     * 英文字母 汉字 都算一个
     * */
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
}

function json_decode2($json_string,$what=TRUE){
	if(ini_get("magic_quotes_gpc")=="1")  {  
		$json_string=stripslashes($json_string);  
	} 
	
	return json_decode($json_string,$what);  
}

date_default_timezone_set('Asia/Shanghai');
//header("Content-Type: text/html; charset=utf8");