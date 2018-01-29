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
			//$action = "120101";
			//if(basic_user::checkPermission($executor, $action, $session)){
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
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
		else if($function =="add"){
			//$action = "120121";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::add(
						$_REQUEST['data']
						,$executor
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
		else if($function =="modify"){
			//$action = "120121";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::modify(
						$_REQUEST['data']
						,$executor
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
		else if($function =="remove"){
			//$action = "120123";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::remove(
						$_REQUEST['codes']
						,$executor
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
		else if($function =="view"){
			//$action = "120102";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::view(
						$_REQUEST['code']
						,$executor
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
		else if($function =="permission_get"){
			//$action = "120140";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::permission_get(
						$_REQUEST['code']
						,$executor
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
		else if($function =="permission_set"){
			//$action = "120140";
			//if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = basic_group::permission_set(
						 $_REQUEST['code']
						,$_REQUEST['codes']
						,$_REQUEST['cost_']
						,$_REQUEST['credits_']
				);
			//}else{
			//	$t_return['action'] = $action;
			//}
		}
				
		return $t_return;
	}
	
	public static $columns = array();
    
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
    
    	$sql_total = "select count(*) as total FROM basic_group ".$sql_where;
    	$res = tools::query($sql_total,$conn);
    	$total = tools::fetch_assoc($res);
    
    	$returnData = array(
    			 'Rows'=>$data
    			,'Total'=>$total['total']
    			,'sql'=>str_replace("\t", "", str_replace("\r", "", str_replace("\n", "", $sql)))
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
            if($search_keys[$i]=='type' && trim($search[$search_keys[$i]])!='' ){
            	$sql_where .= " and type = '".$search[$search_keys[$i]]."' ";
            }
    		if($search_keys[$i]=='code' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and code like '%".$search[$search_keys[$i]]."%' ";
            }        
    	}
    	 
    	return $sql_where;
    }
        
	public static function remove($codes=NULL,$executor=NULL){
		$conn = tools::getConn();
		$codes = explode(",", $codes);
		for($i=0;$i<count($codes);$i++){
		    $sql = "delete from basic_group where code = '".$codes[$i]."' ;";
		    $res = tools::query($sql,$conn);
		    
		    $sql = "delete from basic_user where group_code = '".$codes[$i]."' ;";
		    $res2 = tools::query($sql,$conn);		

		    $sql = "delete from basic_group_2_user where group_code = '".$codes[$i]."' ;";
		    $res3 = tools::query($sql,$conn);			 

		    $sql = "delete from basic_group_2_permission where group_code = '".$codes[$i]."' ;";
		    $res4 = tools::query($sql,$conn);	

		    if($res==FALSE||$res2==FALSE||$res3==FALSE||$res4==FALSE){
		    	return  array(
		    			'status'=>2
		    			,'msg'=>'error'
		    	);
		    }
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
		
		tools::query($sql,$conn);		
		
		return array(
            'status'=>'1'
            ,'msg'=>'ok'
        );
	}			
	
    public static function loadConfig() {
        $conn = tools::getConn();
        $config = array();
        
        $sql = "select code,value from basic_parameter where reference = 'basic_group__type' and code not in ('1','9')  order by code";
        $res = tools::query($sql,$conn);
		$data = array();
		while($temp = tools::fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['basic_group__type'] = $data;
		
		$sql = "select code,value from basic_parameter where reference = 'basic_group__status' order by code";
        $res = tools::query($sql,$conn);
		$data = array();
		while($temp = tools::fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['basic_group__status'] = $data;

	    return $config;		
	}  
    
	public static function add($data=NULL,$executor=NULL){
	    $t_data = json_decode2($data,true);
	    if(!isset($t_data['status'])){
	    	$t_data['status'] = '10';
	    }
	    else if($t_data['status']==NULL||$t_data['status']==''){
	    	$t_data['status'] = '10';
	    }
	    
		$conn = tools::getConn();
	    
		$sql = "";
		if($t_data['type']=='99'){
			$t_data = array(
				'code' => $t_data['code']
				,'name' => $t_data['name']
				,'tablename' => 'exam_subject'
			);
			
			$sql = "insert into basic_node (";
		}
		else{
			$sql = "insert into basic_group (";
			$id = tools::getTableId("basic_group");
			$id ++;
			$t_data["id"] = $id;
		}
		
		$keys = array_keys($t_data);
		$sql_ = ") values (";
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
    		$sql .= $keys[$i].",";
		    $sql_ .= "'".$t_data[$keys[$i]]."',";
		}
		$sql = substr($sql, 0,strlen($sql)-1);
		$sql_ = substr($sql_, 0,strlen($sql_)-1).")";
		$sql = $sql.$sql_;		
	
		tools::query($sql,$conn);
		
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
        );		
	}
    
    public static function view($code){
        $conn = tools::getConn();    
        
        $sql = "select * from basic_group where code = '".$code."'";
        $res = tools::query($sql, $conn );
        $data= tools::fetch_assoc($res);
        
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
            ,'data'=>$data
        	,'sql'=>$sql
        );
    }  
    
    public static function permission_set($group_code=NULL,$permission_codes=NULL,$cost_=NULL,$credits_=NULL){ 	    
		$conn = tools::getConn();

		$sql = "delete from basic_group_2_permission where group_code = '".$group_code."' ";
		$res = tools::query($sql,$conn);
		if($res==FALSE){
			return array(
					'status'=>2
					,'msg'=>$sql
			);
		}

		$codes = explode(",", $permission_codes) ;

		$cost = explode(",", $cost_) ;
		$credits = explode(",", $credits_) ;
		for($i=0;$i<count($codes);$i++){
			$sql = "insert into basic_group_2_permission (group_code,permission_code,cost,credits) values ( '".$group_code."','".$codes[$i]."','".$cost[$i]."','".$credits[$i]."' ); ";
			$res = tools::query($sql,$conn);
			if($res==FALSE){
				return array(
						'status'=>2
						,'msg'=>$sql
				);
			}
		}	
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
        );
	}	
	
	public static function permission_get($code=NULL){
		$conn = tools::getConn();
		
		$sql = tools::getSQL("basic_group__permission_get");
		$sql = str_replace("__group_code__", "'".$code."'", $sql);
        $res = tools::query($sql,$conn);
        if($res==FALSE){
        	return array(
        			'status'=>2
        			,'msg'=>$sql
        	);
        }
        $data = array();
        while($temp = tools::fetch_assoc($res)){
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
}
