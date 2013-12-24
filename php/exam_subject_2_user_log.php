<?php
class exam_subject_2_user_log {
	
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
		else if($function == "grid"){
			$action = "600601";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "time_created";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortorder = $_REQUEST['sortorder'];
				}
	
				$t_return = exam_subject_2_user_log::grid(
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
		else if($function == "getMySub"){
			$t_return = exam_subject_2_user_log::getMySub(
				 $_REQUEST['username']
				,$_REQUEST['time']
				,$_REQUEST['subject']
				,$_REQUEST['time_dimension']
			);
		}
	
		return $t_return;
	}

	private static function search($search,$executor){
		$sql_where = " where 1=1 ";
	
		$search=json_decode2($search,true);
		$search_keys = array_keys($search);
		$subject = "LEFT(subject_code,7)";
		$time = "LEFT(time_created,10)";
		$time_start= date("Y-m-01");
		$time_stop = date("Y-m-29");
		for($i=0;$i<count($search);$i++){
            if($search_keys[$i]=='subject_code' && trim($search[$search_keys[$i]])!='' ){
            	$len = strlen( trim($search[$search_keys[$i]]) );
            	if($len==9)$subject="LEFT(subject_code,9)";
                $sql_where .= " and subject_code like '".$search[$search_keys[$i]]."%' ";
            }    
            if($search_keys[$i]=='time_dimension' && trim($search[$search_keys[$i]])!='' ){
            	$value = trim($search[$search_keys[$i]]);
            	if($value=='day'){
            		$time = "LEFT(time_created,10)";
            	}
            	else if($value=='month'){
            		$time = "LEFT(time_created,7)";
            	}
            }    
            if($search_keys[$i]=='time_created__start' && trim($search[$search_keys[$i]])!='' ){
            	$time_start = $search[$search_keys[$i]];
            } 
            if($search_keys[$i]=='time_created__stop' && trim($search[$search_keys[$i]])!='' ){
            	$time_stop = $search[$search_keys[$i]];
            }            
		}
		$sql_where .= " and time_created >= '".$time_start."' ";
		$sql_where .= " and time_created <= '".$time_stop."' ";
		$session = basic_user::getSession($executor);
		$session = $session['data'];
		if($session['user_type']=='20'){
			$sql_where .= " and exam_subject_2_user_log.creater_code = '".$executor."' and exam_subject_2_user_log.status <> '20' limit 0,200000 ";
		}
		else if($session['user_type']=='30'){
			//$sql_where .= " and exam_paper.creater_code = '".$executor."'";
			$sql_where .= " limit 0,20000 ";
			//TODO
		}
		else{
			$sql_where .= " limit 0,20000 ";
		}		
	
		return array(
			 'sql_where'=>$sql_where
			,'sql_time'=>$time
			,'sql_subject'=>$subject
		);
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
    	
    	$search__ = exam_subject_2_user_log::search($search, $executor);
    	$sql_where = $search__['sql_where'];
    	$sql_time = $search__['sql_time'];
    	$sql_subject = $search__['sql_subject'];
    	
    	$sql = tools::getSQL("exam_subject_2_user_log__grid");
    	$sql = str_replace("__WHERE__", $sql_where, $sql);
    	$sql = str_replace("__G1-TIME__", $sql_time, $sql);
    	$sql = str_replace("__G2-SUBJECT__", $sql_subject, $sql);
    	    	
    	$res = mysql_query($sql,$conn);
    	$data = array();
    	while($temp = mysql_fetch_assoc($res)){
    		if($temp['subject_name']==NULL){
    			$temp['subject_name'] = "all";
    		}
    		$data[] = $temp;
    	}    	
    	$returnData = array(
    			'Rows'=>$data
    			,'Total'=>"0"
    			,'sql'=>str_replace("\t", " ",str_replace("\n", " ", $sql))
    	);
    	
    	return $returnData;
    }  
    
    public static function getMySub($username,$time,$subject,$time_dimension){
    	$conn = tools::getConn();
    	$subject_like = "";
    	$subject_group= "";
    	if(strlen($subject)==7){
    		$subject_like = $subject."__%";
    		$subject_group = "left(subject_code,9)";
    	}
    	else if(strlen($subject)==9){
    		$subject_like = $subject."-__%";
    		$subject_group = "left(subject_code,12)";
    	}
    	else if(strlen($subject)==12){
    		$subject_like = $subject."__%";
    		$subject_group = "left(subject_code,14)";
    	}    	
    	
    	$time_group = "LEFT(time_created,10)";
    	$time_stop = $time." 23:56:56";
    	if($time_dimension=="month"){
    		$time_group = "LEFT(time_created,7)";
    		$time_stop = explode("-", $time_stop);
    		$time_stop = $time_stop[0]."-".$time_stop[1]."-28";
    	}
    	
    	$sql = tools::getSQL("exam_subject_2_user_log__grid");
    	$sql_where = " where exam_subject_2_user_log.creater_code = '".$username."' 
    			and time_created >='".$time."' 
    			and time_created <='".$time_stop."' 
    			and subject_code like '".$subject_like."' ";
    					
    	$sql = str_replace("__WHERE__", $sql_where, $sql);
    	$sql = str_replace("__G1-TIME__", $time_group, $sql);
    	$sql = str_replace("__G2-SUBJECT__", $subject_group, $sql);    					
    	//echo $sql;
    	$res = mysql_query($sql,$conn);
    	$data = array();
    	while($temp = mysql_fetch_assoc($res)){
    		$data[] = $temp;
    	}
    	$returnData = array(
    			'Rows'=>$data
    	);
    	 
    	return $returnData;
    }
}