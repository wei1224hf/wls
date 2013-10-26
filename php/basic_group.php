<?php
class basic_group {
	
	public static function callFunction(){
		$function = $_REQUEST['function'];
		$executor = $_REQUEST['executor'];
		$session = $_REQUEST['session'];
	
		$t_return = array(
				"status"=>"2"
				,"msg"=>"access denied"
				,"executor"=>$executor
				,"session"=>$session
		);
	
		if($function == "grid"){
			$action = "120101";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "code";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortorder = $_REQUEST['sortorder'];
				}
	
				$t_return = basic_group::grid(
					 $_REQUEST['search']
					,$_REQUEST['pagesize']
					,$_REQUEST['page']
					,$executor
					,$sortname
					,$sortorder
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="add"){
			$action = "120121";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::add(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="modify"){
			$action = "120121";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::modify(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="remove"){
			$action = "120123";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::remove(
						$_REQUEST['codes']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="view"){
			$action = "120102";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::view(
						$_REQUEST['code']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="loadConfig"){
			$t_return = basic_group::loadConfig();
		}
		else if($function =="permission_get"){
			$action = "120140";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::permission_get(
						$_REQUEST['code']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="permission_set"){
			$action = "120140";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::permission_set(
						 $_REQUEST['code']
						,$_REQUEST['codes']
						,$_REQUEST['cost_']
						,$_REQUEST['credits_']
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		return $t_return;
	}
    
    public static function grid(
    		$search
    		,$pagesize
    		,$page
    		,$executor
    		,$sortname
    		,$sortorder){
    
    	//数据库连接口,在一次服务端访问中,数据库必定只连接一次,而且不会断开
    	$conn = tools::getConn();
    
    	$sql_where = basic_group::search($search, $executor);
    	$sql_order = " order by basic_group.".$sortname." ".$sortorder." ";
    
    	$sql = tools::getSQL("basic_group__grid");
    	$sql .= $sql_where." ".$sql_order." limit ".(($page-1)*$pagesize).", ".$pagesize;
    
    	$res = mysql_query($sql,$conn);
    	$data = array();
    	while($temp = mysql_fetch_assoc($res)){
    		$data[] = $temp;
    	}
    
    	$sql_total = "select count(*) as total FROM basic_group ".$sql_where;
    	$res = mysql_query($sql_total,$conn);
    	$total = mysql_fetch_assoc($res);
    
    	$returnData = array(
    			'Rows'=>$data,
    			'Total'=>$total['total']
    	);
    
    	return $returnData;
    }
    
    private static function search($search,$executor){
    	$sql_where = " where 1=1 ";
    	 
    	$search=json_decode2($search,true);
    	$search_keys = array_keys($search);
    	for($i=0;$i<count($search);$i++){
			if($search_keys[$i]=='name' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and name like '%".$search[$search_keys[$i]]."%' ";
            }
    	}
    	 
    	return $sql_where;
    }
        
	public static function remove($codes=NULL,$executor=NULL){
		$conn = tools::getConn();
		$codes = explode(",", $codes);
		for($i=0;$i<count($codes);$i++){
		    $sql = "delete from basic_group where code = '".$codes[$i]."' ;";
		    mysql_query($sql,$conn);
		    
		    $sql = "delete from basic_user where group_code = '".$codes[$i]."' ;";
		    mysql_query($sql,$conn);		

		    $sql = "delete from basic_group_2_user where group_code = '".$codes[$i]."' ;";
		    mysql_query($sql,$conn);			 

		    $sql = "delete from basic_group_2_permission where group_code = '".$codes[$i]."' ;";
		    mysql_query($sql,$conn);			    
		}
		
		return  array(
			'status'=>1
		    ,'msg'=>'OK'
		);
	}
	
	public static function modify($data=NULL,$executor=NULL){
	    $conn = tools::getConn();
	    
	    $t_data = json_decode2($data,true);
	    $code = $t_data['code'];
	    unset($t_data['code']);
		$str_keys = ",name,type,status,remark,";		
		$sql = "";

		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
		    if(!strpos($str_keys, $keys[$i])){		        
		        return array(
		            'status'=>'2'
		            ,'msg'=>'data wrong'.$keys[$i]
		        );
		    }

		    $t_data[$keys[$i]] = "'".$t_data[$keys[$i]]."'";
		}
		
		$sql = "update basic_group set ";
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
		    $sql .= $keys[$i]." = ".$t_data[$keys[$i]].",";
		}
		$sql = substr($sql, 0,strlen($sql)-1);
		$sql .= " where code = '".$code."' ";
		
		mysql_query($sql,$conn);		
		
		return array(
            'status'=>'1'
            ,'msg'=>'ok'
        );
	}			
	
    public static function loadConfig() {
        $conn = tools::getConn();
        $config = array();
        
        $sql = "select code,value from basic_parameter where reference = 'basic_group__type' and code not in ('1','9')  order by code";
        $res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['basic_group__type'] = $data;
		
		$sql = "select code,value from basic_parameter where reference = 'basic_group__status' order by code";
        $res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['basic_group__status'] = $data;

	    return $config;		
	}  
    
	public static function add($data=NULL,$executor=NULL){
	    $t_data = json_decode2($data,true);
	    
	    //编码长度必须为偶数
	    if(strlen($t_data['code'])%2!=0){
            return array(
                'status'=>"2"
                ,'msg'=>"The code's length must be an even"
            );
	    }
		$conn = tools::getConn();
	    
		//编码必须没有使用过
	    $sql = "select * from basic_group where code = '".$t_data['code']."'";
	    $res = mysql_query($sql,$conn);
	    $temp = mysql_fetch_assoc($res);
	    if($temp!=false){
            return array(
                'status'=>"2"
                ,'msg'=>"Code already used"
            );
	    }
	    
	    $t_data['status'] = '10';		
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
		    $t_data[$keys[$i]] = "'".$t_data[$keys[$i]]."'";
		}
		
		//数据库插入用户组
		$sql = "insert into basic_group (";
		$sql_ = ") values (";
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
    		$sql .= $keys[$i].",";
		    $sql_ .= $t_data[$keys[$i]].",";
		}
		$sql = substr($sql, 0,strlen($sql)-1);
		$sql_ = substr($sql_, 0,strlen($sql_)-1).")";
		$sql = $sql.$sql_;		
		mysql_query($sql,$conn);
		
		//分配基础权限
		$sql = "insert into basic_group_2_permission (permission_code,group_code) values ('11',".$t_data['code'].");";
		mysql_query($sql,$conn);
		$sql = "insert into basic_group_2_permission (permission_code,group_code) values ('1199',".$t_data['code'].");";
		mysql_query($sql,$conn);	
		
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
        );
	}
    
    public static function view($code){
        $conn = tools::getConn();    
        
        $sql = "select * from basic_group where code = '".$code."'";
        $res = mysql_query($sql, $conn );
        $data= mysql_fetch_assoc($res);
        
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
            ,'data'=>$data
        );
    }  
    
    public static function permission_set($group_code=NULL,$permission_codes=NULL,$cost_=NULL,$credits_=NULL){ 	    
		$conn = tools::getConn();

		$sql = "delete from basic_group_2_permission where group_code = '".$group_code."' ";
		mysql_query($sql,$conn);

		$codes = explode(",", $permission_codes) ;

		$cost = explode(",", $cost_) ;
		$credits = explode(",", $credits_) ;
		for($i=0;$i<count($codes);$i++){
			$sql = "insert into basic_group_2_permission (group_code,permission_code,cost,credits) values ( '".$group_code."','".$codes[$i]."','".$cost[$i]."','".$credits[$i]."' ); ";
			mysql_query($sql,$conn);
		}	
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
        );
		return t_return;
	}	
	
	public static function permission_get($code=NULL){
		$conn = tools::getConn();
		
		$sql = tools::getSQL("basic_group__permission_get");
		$sql = str_replace("__group_code__", "'".$code."'", $sql);

        $res = mysql_query($sql,$conn);
        $data = array();
        while($temp = mysql_fetch_assoc($res)){
            if ($temp['cost']!=NULL) {
                $temp['ischecked'] = 1;
            }
            $data[] = $temp;
        }
		$data = tools::list2Tree($data);

		return array(
			"permissions"=>$data
			,"status"=>"1"				
		);
	}
	
	public static function data4test($total){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		
		$sql = "delete from basic_group where type = '40'";
		mysql_query($sql,$conn);
		$sql = "select code from basic_group where type = '30' and code like '%-%-__' limit 1";
		$res = mysql_query($sql,$conn);
		$temp = mysql_fetch_assoc($res);
		$code = $temp['code'];
		
		$total_ = 0;
		mysql_query("START TRANSACTION;",$conn);
		//一个高中,三个年级 2013届,2014届,2015届
		//每个年纪 4 到6个班级
		for($i=11;$i<=13;$i++){
			$code_ = $code."-".$i;
			$sql = "insert into basic_group(name,code,type,status) values ('年级".$i."','".$code_."','30','10')";
			mysql_query($sql,$conn);
			$total_++;
			if($total_>=$total)return $t_return;
			
			$r = rand(3, 5);
			for($i2=1;$i2<=$r;$i2++){
				$code__ = $code_."-0".$i2;
				$sql = "insert into basic_group(name,code,type,status) values ('班级".$i.$i2."','".$code__."','40','10')"; 
				mysql_query($sql,$conn);
				$total_++;
				if($total_>=$total)return $t_return;
			}
		}
		$sql = "insert into basic_group(name,code,type,status) values ('教师','".$code."-X1"."','40','10')";
		mysql_query($sql,$conn);
		mysql_query("COMMIT;",$conn);
		$sql = "delete from basic_group_2_permission where group_code like '%-%-%-%-%'";
		mysql_query($sql,$conn);
		$sql = "
insert into basic_group_2_permission (permission_code,group_code)
SELECT
basic_permission.`code` as permission_code
,basic_group.`code` as group_code
FROM
basic_permission ,
basic_group 
WHERE 
((basic_permission.`code` >= '60'  AND basic_permission.`code` not like '%1_' and basic_permission.`code` not like '%2_' and basic_permission.`code` not like '6005%' ) or  basic_permission.code like '11%' )
AND basic_group.`code` like '%-%-%-%-%' 				
				";
		mysql_query($sql,$conn);
		
		$t_return['msg']="Table basic_group added row in total : ".$total_;
		return $t_return;
	}
}
