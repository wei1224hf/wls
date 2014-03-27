<?php
class exam_question_log_wrongs {
	
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
			$t_return = exam_question_log_wrongs::loadConfig($executor);
		}
		else if($function == "grid"){
			$action = "600201";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "exam_question_log_wrongs.time_created";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortorder = $_REQUEST['sortorder'];
				}
	
				$t_return = exam_question_log_wrongs::grid(
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
		else if($function =="remove"){
			$action = "600423";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_question_log_wrongs::remove(
						$_REQUEST['ids']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}	
		else if($function =="questions"){
			$action = "600491";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_question_log_wrongs::questions(
						$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="submit"){
			$action = "600491";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_question_log_wrongs::submit(
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
		$sql_where = " where 1=1 ";
		$session = basic_user::getSession($executor);
		$session = $session['data'];
		$search=json_decode2($search,true);
		$search_keys = array_keys($search);
		for($i=0;$i<count($search);$i++){
			if($search_keys[$i]=='title' && trim($search[$search_keys[$i]])!='' ){
				$sql_where .= " and exam_question.title like '%".$search[$search_keys[$i]]."%' ";
			}
		}
		if($session['user_type']=='20'){
			$sql_where .= " and exam_question_log_wrongs.creater_code = '".$executor."' ";
			$sql_where .= " and exam_question_log_wrongs.status <>'20' ";
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
		$sql_where = exam_question_log_wrongs::search($search, $executor);		 
		$sql = tools::getSQL("exam_question_log_wrongs__grid");
		$sql_total = "select count(*) as total FROM exam_question_log_wrongs
			Left Join exam_question ON exam_question_log_wrongs.question_id = exam_question.id ".$sql_where;
		
		$sql = str_replace("__WHERE__", $sql_where, $sql);
		$sql = str_replace("__ORDER__", $sortname." ".$sortorder , $sql);
		$sql = str_replace("__PAGESIZE__",$pagesize, $sql);
		$sql = str_replace("__OFFSET__", $pagesize*($page-1), $sql);
		 
		$res = mysql_query($sql,$conn);
		if($res==FALSE)die($sql." ".mysql_errno($conn));
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		 
		$res = mysql_query($sql_total,$conn);
		$total = mysql_fetch_assoc($res);
		 
		$returnData = array(
				'Rows'=>$data
				,'Total'=>$total['total']
				,'sql'=>str_replace("\t", " ",str_replace("\n", " ", $sql))
		);
		 
		return $returnData;
	}	
        
	public static function remove($ids=NULL,$executor=NULL){
		$conn = tools::getConn();
		$ids = explode(",", $ids);
		for($i=0;$i<count($ids);$i++){
		    $sql = "delete from exam_question_log_wrongs where id = '".$ids[$i]."' ;";
		    mysql_query($sql,$conn);	    
		}
		
		return  array(
			'status'=>1
		    ,'msg'=>'OK'
		);
	}
	
	public static function questions($executor) {	    
	    $conn = tools::getConn();
	    
	    $sql = tools::getSQL("exam_question_log_wrongs__questions");
	    $sql = str_replace("__creater_code__", "'".$executor."'", $sql);
	    //echo $sql;
	    $res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$data[] = $temp;
		}
		return $data;		
	}
}