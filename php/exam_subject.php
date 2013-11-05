<?php
class exam_subject {

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
			$action = "600501";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "code";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortorder = $_REQUEST['sortorder'];
				}
	
				$t_return = exam_subject::grid(
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
			$action = "600521";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_subject::add(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="modify"){
			$action = "600521";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_subject::modify(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="remove"){
			$action = "600523";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_subject::remove(
						$_REQUEST['codes']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="view"){
			$action = "600502";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_subject::view(
						$_REQUEST['id']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="group_get"){
			$action = "600591";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_subject::group_get(
						$_REQUEST['code']
				);
			}else{
				$t_return['action'] = $action;
			}
		}	
		else if($function =="group_set"){
			$action = "600591";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_subject::group_set(
						 $_REQUEST['codes']
						,$_REQUEST['code']
				);
			}else{
				$t_return['action'] = $action;
			}
		}	
	
		else if($function =="loadConfig"){
			$t_return = exam_subject::loadConfig();
		}
	
		return $t_return;
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
			if($search_keys[$i]=='status' && trim($search[$search_keys[$i]])!='' ){
				$sql_where .= " and status = '".$search[$search_keys[$i]]."' ";
			}
		}	
	
		return $sql_where;
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
		 
		$sql_where = exam_subject::search($search, $executor);
		$sql_order = " order by exam_subject.".$sortname." ".$sortorder." ";
		 
		$sql = tools::getSQL("exam_subject__grid");
		$sql .= $sql_where." ".$sql_order." limit ".(($page-1)*$pagesize).", ".$pagesize;
		 
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		 
		$sql_total = "select count(*) as total FROM exam_subject ".$sql_where;
		$res = mysql_query($sql_total,$conn);
		$total = mysql_fetch_assoc($res);
		 
		$returnData = array(
				'Rows'=>$data
				,'Total'=>$total['total']
				//,'sql'=>$sql
		);
		 
		return $returnData;
	}
        
	public static function remove($codes=NULL,$executor=NULL){
		$conn = tools::getConn();
		$codes = explode(",", $codes);
		for($i=0;$i<count($codes);$i++){
		    $sql = "delete from exam_subject where code = '".$codes[$i]."' ;";
		    mysql_query($sql,$conn);
		}
		
		return  array(
			'status'=>1
		    ,'msg'=>'OK'
		);
	}

	
    public static function loadConfig() {
        $conn = tools::getConn();
        $config = array();
        
        $sql = "select code,value from basic_parameter where reference = 'exam_subject__type' order by code";
        $res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['type'] = $data;
		

	    return $config;		
	}  
    
	public static function add($data=NULL,$executor=NULL){
		$conn = tools::getConn();			
		$t_data = json_decode2($data,true);
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
		    $t_data[$keys[$i]] = "'".$t_data[$keys[$i]]."'";
		}
		
		$sql = "insert into exam_subject (";
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
		
        return array(
            'status'=>"1"
            ,'msg'=>'ok'
        );
	}
    
    public static function group_set($codes=NULL,$code=NULL){
		$conn = tools::getConn();
		$sql = "delete from exam_subject_2_group where subject_code = '".$code."' ";
		mysql_query($sql,$conn);
		$codes = explode(",", $codes) ;
		for($i=0;$i<count($codes);$i++){
			$sql = "insert into exam_subject_2_group (group_code,subject_code) values ( '".$codes[$i]."','".$code."' ); ";
			mysql_query($sql,$conn);
		}	
		$t_return =  array(
			 'status'=>"1"
			,'msg'=>'ok'
		);
		return $t_return;
	}	
	
	public static function group_get($code=NULL){
		$conn = tools::getConn();
		
		$sql = tools::getSQL("exam_subject__group_get");
		$sql = str_replace("__code__", "'".$code."'", $sql);

        $res = mysql_query($sql,$conn);
        $data = array();
        while($temp = mysql_fetch_assoc($res)){
            if ($temp['subject_code']!=NULL) {
                $temp['ischecked'] = 1;
            }
            $temp['code_'] = $temp['code'];
            $temp['code'] = str_replace("-", "", $temp['code']);
            $data[] = $temp;
        }

		$data = tools::list2Tree($data);
		
		return $data;
	}
	


}