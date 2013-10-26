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
		else if($function =="loadConfig"){
			$t_return = exam_subject_2_user_log::loadConfig($executor);
		}
		else if($function == "grid"){
			$action = "600601";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "id";
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
	
		return $t_return;
	}
    
	public static function loadConfig($executor) {
		$conn = tools::getConn();
		$config = array();
	
		$session = basic_user::getSession($executor);
		$session = $session['data'];
		if($session['user_type']=='10'||$session['user_type']=='30'){
			$sql = "select code,name as value from exam_subject where code like '____-____' or code like '____-____-__' order by code";
		}
		if($session['user_type']=='20'){
			$sql = "select code,name as value from exam_subject where code in (select subject_code from exam_subject_2_group where group_code = '".$session['group_code']."'); ";
		}
	
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp = mysql_fetch_assoc($res)){
			$len = strlen(str_replace("-", "", $temp['code']));
			for($i=1;$i<$len/2;$i++){
				$temp['value'] = "-".$temp['value'];
			}
			$data[] = $temp;
		}
		$config['subject'] = $data;
	
		return $config;
	}

	private static function search($search,$executor){
		$sql_where = " where 1=1 ";
	
		$search=json_decode2($search,true);
		$search_keys = array_keys($search);
		$subject = "LEFT(subject_code,9)";
		$time = "LEFT(time_created,10)";
		$time_start= date("Y-m-01");
		$time_stop = date("Y-m-29");
		for($i=0;$i<count($search);$i++){
            if($search_keys[$i]=='subject_code' && trim($search[$search_keys[$i]])!='' ){
            	$len = strlen( trim($search[$search_keys[$i]]) );
            	if($len==9)$subject="LEFT(subject_code,12)";
            	if($len==12)$subject="subject_code";
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
    		$data[] = $temp;
    	}    	
    	$returnData = array(
    			'Rows'=>$data
    			,'Total'=>"0"
    			,'sql'=>str_replace("\t", " ",str_replace("\n", " ", $sql))
    	);
    	
    	return $returnData;
    }  

    public static function statistics_time($time_start=NULL,$time_stop=NULL,$gap=NULL,$subject=NULL,$user_code=NULL){
	    if (!basic_user::checkPermission("44")){
	        return array(
	             'msg'=>'access denied'
	            ,'status'=>'2'
	        );
	    }	
        if($time_start==NULL)$time_start = $_REQUEST['time_start'];
        if($time_stop==NULL)$time_stop = $_REQUEST['time_stop'];
        if($gap==NULL)$gap = $_REQUEST['gap'];
        if($subject==NULL)$subject = $_REQUEST['subject'];
        if($user_code==NULL)$user_code = $_REQUEST['executor'];

        $conn = tools::getConn();
        $sql = tools::getConfigItem("exam_subject_2_user_log__statistics_time");
        $sql = str_replace("__bigger__", ">", $sql);
        $sql = str_replace("__smaller__", "<", $sql);
        $sql = str_replace("__creater_code__", "'".$user_code."'", $sql);
        $sql = str_replace("__subject_code__", "'".$subject."'", $sql);
        $sql = str_replace("__time_start__", "'".$time_start."'", $sql);
        $sql = str_replace("__time_stop__", "'".$time_stop."'", $sql);
        
        if($gap=='day'){
            $sql = str_replace("__gap__", "10", $sql);
        }
        if($gap=='month'){
            $sql = str_replace("__gap__", "7", $sql);
        }
        
        $res = mysql_query($sql,$conn);
        $data = array();
        while($temp = mysql_fetch_assoc($res)){
            $data[] = $temp;
        }
        
        return array(
             'status'=>'1'
            ,'data'=>$data
            ,'sql'=>$sql
        );
    }
    
    public static function statistics_subject($time=NULL,$subject=NULL,$user_code=NULL,$gap=NULL){
        if($time==NULL)$time = $_REQUEST['time'];
        if($subject==NULL)$subject = $_REQUEST['subject'];
        if($user_code==NULL)$user_code = $_REQUEST['executor'];
        if($gap==NULL)$gap = $_REQUEST['gap'];
        $conn = tools::getConn();
        
        $sql = tools::getConfigItem("exam_subject_2_user_log__statistics_subject");
        $sql = str_replace("__subject_code__", "'".$subject."__'", $sql);
        $sql = str_replace("__date__", "'".$time."'", $sql);
        $sql = str_replace("__creater_code__", "'".$user_code."'", $sql); 

        if($gap=='day'){
            $sql = str_replace("__gap__", "10", $sql);
        }
        if($gap=='month'){
            $sql = str_replace("__gap__", "7", $sql);
        }        
        
        $res = mysql_query($sql,$conn);
        $data = array();
        while($temp = mysql_fetch_assoc($res)){
            $data[] = $temp;
        }
        
        return array(
             'status'=>'1'
            ,'data'=>$data
            ,'sql'=>$sql
        );
    }    
}