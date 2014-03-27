<?php
class basic_parameter {
	
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
			$action = "120301";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "reference";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortname = $_REQUEST['sortorder'];
				}
	
				$t_return = basic_parameter::grid(
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
			$action = "120321";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_parameter::add(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="remove"){
			$action = "120223";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_parameter::remove(
						$_REQUEST['ids']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="data"){
			//$action = "120223";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_parameter::data(
						$_REQUEST['code']
						,$executor
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}		
		
		else if($function =="loadConfig"){
			$t_return = basic_parameter::loadConfig();
		}
		else if($function =="resetMemory"){
			$t_return = basic_parameter::resetMemory();
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
    
    	$sql_where = basic_parameter::search($search, $executor);
    	
    	$sql = tools::getSQL("basic_parameter__grid");
    	$sql = str_replace("__sortname__", $sortname, $sql);
    	$sql = str_replace("__sortorder__", $sortorder, $sql);
    	$sql = str_replace("__where__", $sql_where, $sql);
    	$sql = str_replace("__offset__", (($page-1)*$pagesize), $sql);
    	$sql = str_replace("__limit__", $pagesize, $sql);    	
    
    	$res = tools::query($sql,$conn);
    	$data = array();
    	while($temp = tools::fetch_assoc($res)){
    		$data[] = $temp;
    	}
    
    	$sql_total = "select count(*) as total FROM basic_parameter ".$sql_where;
    	$res = tools::query($sql_total,$conn);
    	$total = tools::fetch_assoc($res);
    
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
                $sql_where .= " and reference like '%".$search[$search_keys[$i]]."%' ";
            }
    	}
    	 
    	return $sql_where;
    }
        
	public static function remove($ids=NULL,$executor=NULL){
		$conn = tools::getConn();
		$ids = explode(",", $ids);
		for($i=0;$i<count($ids);$i++){
		    $sql = "delete from basic_parameter where id = '".$ids[$i]."' ;";
		    tools::query($sql,$conn);		    
		}
		
		return  array(
			'status'=>1
		    ,'msg'=>'OK'
		);
	}
	    
	public static function add($data=NULL,$executor=NULL){
		$conn = tools::getConn();
	    $t_data = json_decode2($data,true);
	    
		$sql = "insert into basic_parameter (";
		$sql_ = ") values (";
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
    		$sql .= $keys[$i].",";
		    $sql_ .= "'".$t_data[$keys[$i]]."',";
		}
		$sql = substr($sql, 0,strlen($sql)-1);
		$sql_ = substr($sql_, 0,strlen($sql_)-1).")";
		$sql = $sql.$sql_;			
		$res = tools::query($sql,$conn);
		if($res==false){
            return array(
                'status'=>"2"
                ,'msg'=>mysql_error($conn)
                ,'sql'=>$sql
            );
		}
		
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
        );
	}
    
    public static function resetMemory(){
	    $conn = tools::getConn();
	    $sql = "delete from basic_memory";
	    tools::query($sql,$conn);
	    tools::initMemory();
	    
	    return array(
	        'status'=>'1'
	        ,'msg'=>'ok'
	    );	    
    }
    
    public static function data($code,$executor){
    	$conn = tools::getConn();
    	$sql = "select code , value from basic_parameter where code like '".$code."__'  ";
        $res = tools::query($sql,$conn);
    	$data = array();
    	while($temp = tools::fetch_assoc($res)){
    		$data[] = $temp;
    	}
    	 
    	return array(
    		'status'=>'1'
    		,'msg'=>'ok'
    		,'data'=>$data
    	);
    }    
}