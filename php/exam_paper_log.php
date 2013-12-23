<?php
class exam_paper_log {
        
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
		
		if(trim($function) ==""){
			//
		}		
		else if($function =="loadConfig"){
			$t_return = exam_paper_log::loadConfig($executor);
		}	
		else if($function == "grid"){
			$action = "600101";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "id";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortorder = $_REQUEST['sortorder'];
				}
	
				$t_return = exam_paper_log::grid(
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
			$action = "120221";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_log::add(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="modify"){
			$action = "120221";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_log::modify(
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
				$t_return = exam_paper_log::remove(
						$_REQUEST['usernames']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="view"){
			$action = "600102";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_log::view(
						$_REQUEST['id']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		
		else if($function =="questions"){
			$action = "600190";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_log::questions(
						$_REQUEST['paper_id']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="submit"){
			$action = "600190";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_log::submit(
						 $_REQUEST['paper_id']
						,$_REQUEST['json']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}

		return $t_return;
	}
	
	public static function loadConfig($executor) {
		$conn = tools::getConn();
		$config = array();
	
		$sql = "select code,value from basic_parameter where reference = 'exam_paper__type' and code not in ('1','9')  order by code";
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['type'] = $data;
	
		$session = basic_user::getSession($executor);
		$session = $session['data'];
		if($session['user_type']=='10'||$session['user_type']=='30'){
			$sql = "select code,extend4 as value from basic_memory where type = '4' and extend5 = 'exam_subject__code' order by code";
		}
		if($session['user_type']=='20'){
			$sql = "select code,name as value from exam_subject where code in (select subject_code from exam_subject_2_group where group_code = '".$session['group_code']."'); ";
		}
	
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$len = strlen($temp['code']);
			for($i=1;$i<$len/2;$i++){
				$temp['value'] = "--".$temp['value'];
			}
			$data[] = $temp;
		}
		$config['exam_subject__code'] = $data;
	
		$sql = "select code,value from basic_parameter where reference = 'exam_paper_log__type' order by code";
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['exam_paper_log__type'] = $data;
	
		$sql = "select code,value from basic_parameter where reference = 'exam_paper_log__status' and code not in ('1','9')  order by code";
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		$config['exam_paper_log__status'] = $data;
	
		return $config;
	}

	private static function search($search,$executor){
		$sql_where = " where exam_paper_log.status <> '30' ";
	
		$search=json_decode2($search,true);
		$search_keys = array_keys($search);
		for($i=0;$i<count($search);$i++){
            if($search_keys[$i]=='title' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and exam_paper.title like '%".$search[$search_keys[$i]]."%' ";
            }
            if($search_keys[$i]=='subject_code' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and exam_paper.subject_code = '".$search[$search_keys[$i]]."' ";
            }    
            if($search_keys[$i]=='type' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and exam_paper_log.type = '".$search[$search_keys[$i]]."' ";
            }    
            if($search_keys[$i]=='status' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and exam_paper_log.status = '".$search[$search_keys[$i]]."' ";
            } 
		}
		$session = basic_user::getSession($executor);
		$session = $session['data'];
		if($session['user_type']=='20'){
			$sql_where .= " and exam_paper_log.creater_code = '".$executor."' ";
			$sql_where .= " and (exam_paper_log.status like '9_' or exam_paper_log.status='10' ) ";
		}
		if($session['user_type']=='30'){
			$sql_where .= " and exam_paper.creater_code = '".$executor."'";
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
    	
    	$sql_where = exam_paper_log::search($search, $executor);
    	
    	$sql = tools::getSQL("exam_paper_log__grid");
    	$sql = str_replace("__sortname__", $sortname, $sql);
    	$sql = str_replace("__sortorder__", $sortorder, $sql);
    	$sql = str_replace("__where__", $sql_where, $sql);
    	$sql = str_replace("__offset__", (($page-1)*$pagesize), $sql);
    	$sql = str_replace("__limit__", $pagesize, $sql);  
    	
    	$res = mysql_query($sql,$conn);
    	$data = array();
    	while($temp = mysql_fetch_assoc($res)){
    		$data[] = $temp;
    	}
    	
    	$sql_total = "select count(*) as total FROM exam_paper_log LEFT JOIN exam_paper ON exam_paper_log.paper_id = exam_paper.id ".$sql_where;
    	$res = mysql_query($sql_total,$conn);
    	$total = mysql_fetch_assoc($res);
    	
    	$returnData = array(
    			'Rows'=>$data
    			,'Total'=>$total['total']
    			,'sql'=>str_replace("\t", " ",str_replace("\n", " ", $sql))
    	);
    	
    	return $returnData;
    }
	
	public static function questions($id=NULL,$executor=NULL){
	    if (!basic_user::checkPermission("4290")){
	        return array(
	             'msg'=>'access denied'
	            ,'status'=>'2'
	        );
	    }		    
	    if($id==NULL) $id = $_REQUEST['id'];
	    if($executor==NULL) $executor = $_REQUEST['executor'];
        $conn = tools::getConn();

        $sql = tools::getConfigItem("exam_paper_log__questions");            
        $sql = str_replace("__id__", $id, $sql);
        
        $res = mysql_query($sql,$conn);
        $data = array();
        while($temp = mysql_fetch_assoc($res)){
            $data[] = $temp;
        }

        return array(
             'data'=>$data
            ,'msg'=>'ok'
            ,'status'=>'1'
        ); 
	}	
	
	public static function submit($paper_id=NULL,$data=NULL,$executor=NULL){
	    if (!basic_user::checkPermission("4290")){
	        return array(
	             'msg'=>'access denied'
	            ,'status'=>'2'
	        );
	    }		    
	    if($data==NULL) $data = $_REQUEST['data'];
	    if($executor==NULL) $executor = $_REQUEST['executor'];
	    $conn = tools::getConn();

	    $mycent = 0;
	    $arr = json_decode2($data,true);
	    for($i=0;$i<count($arr);$i++){
	        $mycent += $arr[$i]['mycent'];
	        $sql = "update exam_question_log set mycent = ".$arr[$i]['mycent']." where question_id = ".$arr[$i]['question_id']." and paper_log_id = ".$_REQUEST['paper_log_id']." ";
	        mysql_query($sql,$conn);
	        if(mysql_affected_rows()=='-1'){
        	    return array(
        	        'status'=>'2'
        	        ,'sql'=>$sql
        	    );
	        }
	    }
	    
	    $sql2 = "update exam_paper_log set mycent_subjective = ".$mycent.",mycent = mycent_objective + ".$mycent.",status = '10'  where status = '20' and id = ".$_REQUEST['paper_log_id'];
	    mysql_query($sql2,$conn);
	    $count = mysql_affected_rows($conn);
	    
	    return array(
	        'status'=>'1'
	        ,'mycent'=>$mycent
	        ,'sql'=>$sql
	        ,'sql2'=>$sql2
	    );
	}	
	

}