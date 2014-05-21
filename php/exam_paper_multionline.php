<?php
class exam_paper_multionline {
        
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
			$action = "600201";
			if(basic_user::checkPermission($executor, $action, $session)){
				$sortname = "exam_paper_multionline.time_start";
				$sortorder = "asc";
				if(isset($_REQUEST['sortname'])){
					$sortname = $_REQUEST['sortname'];
				}
				if(isset($_REQUEST['sortorder'])){
					$sortorder = $_REQUEST['sortorder'];
				}
	
				$t_return = exam_paper_multionline::grid(
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
		else if($function =="modify"){
			$action = "600222";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_multionline::modify(
						$_REQUEST['data']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="remove"){
			$action = "600223";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_multionline::remove(
						$_REQUEST['ids']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="view"){
			$action = "600102";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_multionline::view(
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
				$t_return = exam_paper_multionline::questions(
						$_REQUEST['paper_id']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="submit"){
			$action = "600291";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_multionline::submit(
						 $_REQUEST['paper_id']
						,$_REQUEST['json']
						,$executor
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="close"){
			$action = "600290";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_multionline::close(
						$_REQUEST['pid']
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="order"){
			$action = "60020240";
			if(basic_user::checkPermission($executor, $action, $session)){
				$t_return = exam_paper_multionline::order(
						$_REQUEST['id']
				);
			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="upload"){
			$action = "600211";
			if(basic_user::checkPermission($executor, $action, $session)){
				$file = "../file/upload/paper/".rand(10000, 99999)."_".$_FILES["file"]["name"];
				move_uploaded_file($_FILES["file"]["tmp_name"],$file);
				$t_return = exam_paper_multionline::upload($file,$executor);

			}else{
				$t_return['action'] = $action;
			}
		}
		else if($function =="download"){
			$action = "600212";
			if(basic_user::checkPermission($executor, $action, $session)){
				$id = $_REQUEST['id'];
				$t_return = exam_paper_multionline::download($id);
			}else{
				$t_return['action'] = $action;
			}
		}		

		
		return $t_return;
	}

	private static function search($search,$executor){
		$sql_where = "  ";
	
		$search=json_decode2($search,true);
		$search_keys = array_keys($search);
		for($i=0;$i<count($search);$i++){
            if($search_keys[$i]=='title' && trim($search[$search_keys[$i]])!='' ){
                $sql_where .= " and exam_paper.title like '%".$search[$search_keys[$i]]."%' ";
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
    	
    	$sql_where = exam_paper_multionline::search($search, $executor);
    	$session = basic_user::getSession($executor);
    	$session = $session['data'];
    	
    	
    	$sql = tools::getSQL("exam_paper_multionline__grid");    	
    	if($session['user_type']=='20'){
    		$sql = tools::getSQL("exam_paper_multionline__grid_student");
    		$sql_where .= " and exam_paper_log.creater_code = '".$executor."' ";
    		$sql_total = "select count(*) as total FROM
			exam_paper_log,exam_paper_multionline,exam_paper
			where exam_paper_log.paper_id = exam_paper_multionline.paper_id
			and exam_paper_log.paper_id = exam_paper.id ".$sql_where;
    	}
    	else if($session['user_type']=='30'){
    		$sql_where .= " and exam_paper.creater_code = '".$executor."' ";
    		$sql_total = "select count(*) as total FROM
			exam_paper_multionline,exam_paper where exam_paper_multionline.paper_id = exam_paper.id ".$sql_where;
    	}
    	else{
    		$sql_total = "select count(*) as total FROM
			exam_paper_multionlin,exam_paper where exam_paper_multionline.paper_id = exam_paper.id ".$sql_where;
    	} 	
    	$sql = str_replace("__WHERE__", $sql_where, $sql);
    	$sql = str_replace("__ORDER__", $sortname." ".$sortorder , $sql);
    	$sql = str_replace("__PAGESIZE__",$pagesize, $sql);
    	$sql = str_replace("__OFFSET__", $pagesize*($page-1), $sql);

    	$res = mysql_query($sql,$conn);
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
			$res_arr = array();
			
		    $sql = "delete from exam_paper_multionline where paper_id = '".$ids[$i]."' ;";
		    $res_arr[] = mysql_query($sql,$conn);		    
		    $sql = "delete from exam_paper where id = '".$ids[$i]."' ;";
		    $res_arr[] = mysql_query($sql,$conn);
		    $sql = "delete from exam_paper_log where paper_id = '".$ids[$i]."' ;";
		    $res_arr[] = mysql_query($sql,$conn);		    
		    $sql = "delete from exam_question where paper_id = '".$ids[$i]."' ;";
		    $res_arr[] = mysql_query($sql,$conn);	

		    if($res_arr[0]==FALSE ||$res_arr[1]==FALSE ||$res_arr[2]==FALSE ||$res_arr[3]==FALSE ){
		    	return  array(
		    			'status'=>2
		    			,'msg'=>'OK'
		    	);
		    }
		}
		
		return  array(
			'status'=>1
		    ,'msg'=>'OK'
		);
	} 
	
	public static function questions($paper_id=NULL,$executor=NULL){
		/*
	    if (!basic_user::checkPermission("4190")){
	        return array(
	             'msg'=>'access denied'
	            ,'status'=>'2'
	        );
	    }	    
	    */
	    if($paper_id==NULL) $paper_id = $_REQUEST['paper_id'];
	    if($executor==NULL) $executor = $_REQUEST['executor'];
        $conn = tools::getConn();
	    
	    $data = exam_paper_multionline::view($paper_id);
	    $cost = $data['data']['cost'];

        $sql = " update basic_user set money = money - ".$cost." , credits = credits + 3 where username = '".$executor."' and money >= ".$cost."  ;";
        mysql_query($sql,$conn);
        $count = mysql_affected_rows($conn);
        if($count==0){
            return array(
                'status'=>'2'
                ,'msg'=>'no money'
            );
        }
        
        $sql = tools::getConfigItem("exam_paper_multionline__questions");            
        $sql = str_replace("__paper_id__", $paper_id, $sql);
        
        $res = mysql_query($sql,$conn);
        if($res==false){
        	return array(
        			 'sql'=>$sql
        			,'status'=>2
        	);
        }
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
	
	public static function view($paper_id=NULL){

	    $conn = tools::getConn();
        $sql = tools::getSQL("exam_paper_multionline__view");            
        $sql = str_replace("__paper_id__", $paper_id, $sql);
       
        $res = mysql_query($sql,$conn);
        if($res==FALSE)die($sql);
        $data = mysql_fetch_assoc($res);

        return array(
            'data'=>$data
            ,'msg'=>'ok'
            ,'status'=>'1'
            ,'sql'=>$sql
        ); 
	}
	
	public static function submit($paper_id=NULL,$json=NULL,$executor=NULL){	
	    $conn = tools::getConn();
	    $t_return = array();
	    
	    $data_m = exam_paper_multionline::view($paper_id);
        $data_m = $data_m['data'];
	    if($data_m['time_stop']<date('Y-m-d H:i:s') || $data_m['time_start']>date('Y-m-d H:i:s')){
            return array(
                 'msg'=>tools::readIl8n('exam_paper_multionline','timeWrong')
                ,'status'=>'2'
            ); 
	    }
	    $sql = "select status,id from exam_paper_log where paper_id = '".$paper_id."' and creater_code = '".$executor."';";
        $res = mysql_query($sql,$conn);
        $data = mysql_fetch_assoc($res);
        $logid = $data['id'];
        if($data['status']!='30'){
    	    $msg = tools::readIl8n('exam_paper_multionline','doneAlready');
    	    $msg = str_replace("__time_submitted__", $data['time_created'], $msg);
            return array(
                 'msg'=>$msg
                ,'status'=>'2'
            ); 
        }
        
		$t_return = exam_paper::checkMyAnswers(json_decode2($json,true), $paper_id);
		//TODO
		//exam_paper::calculateKnowledge($t_return['answers'],$logid,$paper_id,$executor,'20');
		exam_paper::addWrongs($t_return['answers'],$logid,$executor,'20');    
	    exam_paper::addQuestionLog($t_return['answers'],$logid,$executor);
	    
	    $data__exam_paper_log = array(
	    	 'mycent'=>$t_return['result']['mycent']
	    	,'mycent_objective'=>$t_return['result']['mycent_objective']
    		,'count_right'=>$t_return['result']['right']
    		,'count_wrong'=>$t_return['result']['wrong']
    		,'count_giveup'=>$t_return['result']['giveup']
	    	,'proportion'=> '0'//TODO
	    	,'time_lastupdated'=>date('Y-m-d H:i:s')
	    	,'status'=>'20'
	    );
	    $keys = array_keys($data__exam_paper_log);
	    $values = array_values($data__exam_paper_log);
	    $sql = "update exam_paper_log set ";
	    for($i=0;$i<count($keys);$i++){
	    	$sql .= " ".$keys[$i]." = '".$values[$i]."' ,";
	    }
	    $sql = substr($sql, 0,strlen($sql)-1);
	    $sql .= " where id = ".$logid;
	    tools::$sqls[] = $sql;
	    
	    $sqls = tools::$sqls;
	    if(tools::$dbtype=="mssql"){
	    	array_unshift($sqls , 'begin transaction');
	    	$sqls[] = "commit transaction";
	    	$str = implode(";",$sqls);
	    	tools::query($str,$conn);
	    }
	    else{
	    	tools::transaction($conn);
	    	for($i=0;$i<count($sqls);$i++){
	    		tools::query($sqls[$i], $conn);
	    	}
	    	tools::commit($conn);
	    }
	    
	    tools::updateTableId("exam_question_log_wrongs");
	    tools::updateTableId("exam_question_log");
	    
	    $msg = tools::readIl8n('exam_paper_multionline','submitted');
	    $msg = str_replace("__time_stop__", $data_m['time_stop'], $msg);
	    return array(
	        'status'=>'1'
	        ,'msg'=>$msg
	    );	   
	}
	
	public static function close($exam_paper__id){
		$conn = tools::getConn();
		$conn2 = tools::getConn(true);
		$t_return = array();
		mysql_query("START TRANSACTION;",$conn);
		$sql = "select passline from exam_paper_multionline where paper_id = ".$exam_paper__id;
		$res = mysql_query($sql,$conn2);
		$d = mysql_fetch_assoc($res);
		$passline = $d['passline'];
		$sql = "select * from exam_paper_log where paper_id = '".$exam_paper__id."' order by mycent desc ";
		$res = mysql_query($sql,$conn2);
		$rank = 0;
		$rank2 = 0;
		$mycent = 0;
		$count_passed = 0;
		$count_giveup = 0;
		$count_failed = 0;
		while ($temp=mysql_fetch_assoc($res)){
			$rank2 ++;
			$rank3 = $rank2;
			if($mycent==$temp['mycent']){
				$rank3 = $rank;
			}else{
				$rank = $rank2;
			}
			$mycent = $temp['mycent'];

			$status = "40";
			if($mycent==0){
				$status = '90';
				$count_giveup++;
			}
			else if($mycent>=$passline){
				$status = '91';
				$count_passed++;
			}
			else{
				$status = '92';
				$count_failed ++;
			}
			$sql = "update exam_paper_log set rank = '".$rank3."', status = '".$status."' where id = ".$temp['id'];
			mysql_query($sql,$conn);
			$sql = "update exam_question_log_wrongs set status = '40',  where paper_log_id = ".$temp['id'];
			mysql_query($sql,$conn);
			$sql = "update exam_subject_2_user_log set status = '40',  where paper_log_id = ".$temp['id'];
			mysql_query($sql,$conn);			
		}
		
		$sql = "update exam_paper_multionline set 
				status = '20'
				,count_giveup='".$count_giveup."'
				,count_passed='".$count_passed."'
				,count_failed='".$count_failed."'
				,proportion='".($count_passed/$rank2)."'
				 where paper_id =".$exam_paper__id;
		mysql_query($sql,$conn);
		mysql_query("COMMIT;",$conn);
		$t_return['status']=1;
		$t_return['msg']=$sql;
		return $t_return;
	}
	
	public static function modify($data=NULL,$executor=NULL){
	    if (!basic_user::checkPermission("4123")){
	        return array(
	             'msg'=>'access denied'
	            ,'status'=>'2'
	        );
	    }		    
	    if($data==NULL)$data = $_REQUEST['data'];
	    if($executor==NULL)$executor = $_REQUEST['executor'];
	    
	    $conn = tools::getConn();
	    
	    $t_data = json_decode2($data,true);
	    $paper_id = $t_data['paper_id'];
	    unset($t_data['paper_id']);
		$str_keys = ",time_start,time_stop,passline,students,";		
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
		
		$sql = "update exam_paper_multionline set ";
		$keys = array_keys($t_data);
		for($i=0;$i<count($keys);$i++){
		    $sql .= $keys[$i]." = ".$t_data[$keys[$i]].",";
		}
		$sql = substr($sql, 0,strlen($sql)-1);
		$sql .= " where paper_id = '".$paper_id."' ";		

		if(mysql_query($sql,$conn)){		
    		return array(
                'status'=>'1'
                ,'msg'=>'ok'
            );
		}else{
		    return array(
                'status'=>'2'
                ,'msg'=>'sql wrong'
                ,'sql'=>$sql
            );
		}
	}	
	
	public static function upload($file,$executor){
		
		$conn = tools::getConn();
		$conn_read = tools::getConn(TRUE);
		$session = basic_user::getSession($executor);
		$session = $session['data'];
		$il8n = tools::readIl8n();
			    
        if(exam_paper::$phpexcel==NULL){
        	include_once '../libs/phpexcel/Classes/PHPExcel.php';
        	include_once '../libs/phpexcel/Classes/PHPExcel/IOFactory.php';
        	include_once '../libs/phpexcel/Classes/PHPExcel/Writer/Excel5.php';
        	$PHPReader = PHPExcel_IOFactory::createReader('Excel5');
        	$PHPReader->setReadDataOnly(true);
        	$phpexcel = $PHPReader->load($file);
        	exam_paper::$phpexcel = $phpexcel;
        }  
        $phpexcel = exam_paper::$phpexcel;
	    
	    $sheetname = "exam_paper_multionline";
	    $currentSheet = $phpexcel->getSheetByName($sheetname);
	    if($currentSheet==null){
	    	return array(
	    			'msg'=>tools::$LANG['basic_normal']['missingSheet']." ".$sheetname
	    			,'status'=>'2'
	    	);
	    }
	    
	    $reg = "/\d{4}-\d{1,2}-\d{1,2}/";
	    $time_start = trim($currentSheet->getCell('A2')->getValue());
	    if(preg_match($reg,$time_start)){
	    	$arr = explode("-", $time_start);
			/*
	    	if(!checkdate($arr[1],$arr[2],$arr[0])){
	    		return array(
	    				'msg'=>tools::$LANG['basic_normal']['cellError'].": A2 "
	    				,'status'=>'2'
	    		);
	    	}
			*/
	    }
	    else{
	    		return array(
	    				'msg'=>tools::$LANG['basic_normal']['cellError'].": A2 "
	    				,'status'=>'2'
	    		);
	    }
	    
	    $time_stop =trim( $currentSheet->getCell('B2')->getValue());
	    if(preg_match($reg,$time_stop)){
	    	$arr = explode("-", $time_stop);
			/*
	    	if(!checkdate($arr[1],$arr[2],$arr[0])){
	    		return array(
	    				'msg'=>tools::$LANG['basic_normal']['cellError'].": B2 "
	    				,'status'=>'2'
	    		);
	    	}
			*/
	    }else{
	    	return array(
	    			'msg'=>tools::$LANG['basic_normal']['cellError'].": B2 "
	    			,'status'=>'2'
	    	);
	    }
	    if($time_stop<$time_start){
	    	return array(
	    			'msg'=>tools::$LANG['basic_normal']['cellError'].": B2 "
	    			,'status'=>'2'
	    	);
	    }
	    
	    $passline = trim($currentSheet->getCell('C2')->getValue());
	    if(!is_numeric($passline)){
	    	return array(
	    			'msg'=>tools::$LANG['basic_normal']['cellError'].": C2 "
	    			,'status'=>'2'
	    	);
	    }
	    
	    $students = trim($currentSheet->getCell('D2')->getValue());
	    $arr_students = explode(",", $students);
	    
	    for($i=0;$i<count($arr_students);$i++){
	    	$student = $arr_students[$i];
	    	$sql_check = "select id from basic_user where username = '".$student."' ;";

	    	$res = mysql_query($sql_check,$conn_read);
	    	
	    	if($res==FALSE){	    		
	    		return array(
	    				'msg'=>tools::$LANG['basic_normal']['cellError'].": D2 ".$student
	    				,'status'=>'2'
	    		);
	    	}	    	
	    	
	    	$temp = tools::fetch_assoc($res);
	    	
	    	if($temp==FALSE){

	    		return array(
	    				'msg'=>$il8n['basic_normal']['cellError'].": D2 ".$student
	    				,'status'=>'2'
	    		);

	    	}
	    }
		tools::updateTableId("exam_paper_log");
		tools::updateTableId("exam_paper_multionline");
	    $exam_paper_log__id = tools::getTableId("exam_paper_log");
		$exam_paper_log__id++;
	    $exam_paper_multionline__id = tools::getTableId("exam_paper_multionline");
		$exam_paper_multionline__id ++;
	   
	    $data = exam_paper::upload($file,$executor);
	    if(!isset($data['status']) || $data['status']!='1'){
	    	return $data;
	    }
	    if($data['data']['cent']<$passline){
	    	return array(
	    			'msg'=>tools::$LANG['basic_normal']['cellError'].": C2 "
	    			,'status'=>'2'
	    	);
	    }
	    //mysql_query("START TRANSACTION;",$conn);
        $data2 = array(
             'id'=>$exam_paper_multionline__id
            ,'time_start'=>$time_start
            ,'time_stop'=>$time_stop
            ,'passline'=>$passline
            ,'paper_id'=>$data['paper_id']
            ,'count_total'=>count( $arr_students )		
        	,'type'=>20
        	,'status'=>10
        	,'creater_code'=>$executor
			,'updater_code'=>$executor
        	,'creater_group_code'=>$session['group_code']
        );
        
        $sql = "update exam_paper set type = '20' where id =".$data['paper_id'];
        mysql_query($sql,$conn);
        
        $keys = array_keys($data2);
        $keys = implode(",",$keys);
        $values = array_values($data2);
        $values = implode("','",$values);    
        $sql = "insert into exam_paper_multionline (".$keys.") values ('".$values."')";
        mysql_query($sql,$conn);
        
        for($i=0;$i<count($arr_students);$i++){
        	$exam_paper_log__id ++;
        	$student = $arr_students[$i];
        	$sql = "select group_code from basic_user where username = '".$student."' ";
        	$res = mysql_query($sql,$conn_read);
        	$temp = mysql_fetch_assoc($res);
        	$group_code = $temp['group_code'];
        	
        	$data__exam_paper_log = array(
        			 'mycent'=>0
        			,'mycent_subjective'=>0
        			,'mycent_objective'=>'0'
        			,'count_right'=>0
        			,'count_wrong'=>0
        			,'count_giveup'=>'0'
        			,'proportion'=>0
        			,'paper_id'=>$data['paper_id']
        			,'id'=>$exam_paper_log__id
					,'creater_code'=>$student
					,'updater_code'=>$student
        			,'creater_group_code'=>$group_code
        			,'type'=>'20'
        			,'status'=>'30'
        			,'remark'=>'exam_paper_multionline'
        			,'time_created'=>date("Y-m-d")
        	);
        	
        	$keys = array_keys($data__exam_paper_log);
        	$keys = implode(",",$keys);
        	$values = array_values($data__exam_paper_log);
        	$values = implode("','",$values);
        	$sql = "insert into exam_paper_log (".$keys.") values ('".$values."')";
        	$res = mysql_query($sql,$conn);
        }
        //mysql_query("COMMIT;",$conn);
        tools::updateTableId("exam_paper_log");
        tools::updateTableId("exam_paper_multionline");
        
		return array(
		     'status'=>'1'
		    ,'msg'=>"ok"
		    ,'paper_id'=>$data['paper_id']
		    ,'paper_multionline_id'=>$data2['id']
		);        
	}
	
	public static function download($id=NULL){
		$conn_read = tools::getConn();
	    $data = exam_paper::download($id);
	    $phpexcel = exam_paper::$phpexcel;
	    
	    $data2 = exam_paper_multionline::view($id);
	    $data2 = $data2['data'];
		$phpexcel->createSheet();
		$phpexcel->setActiveSheetIndex($phpexcel->getSheetCount()-1);
		$phpexcel->getActiveSheet()->setTitle('exam_paper_multionline');	
		
		$phpexcel->getActiveSheet()->setCellValue('A1', tools::$LANG['exam_paper_multionline']['time_start']);
		$phpexcel->getActiveSheet()->setCellValue('B1', tools::$LANG['exam_paper_multionline']['time_stop']);
		$phpexcel->getActiveSheet()->setCellValue('C1', tools::$LANG['exam_paper_multionline']['passline']);
		$phpexcel->getActiveSheet()->setCellValue('D1', tools::$LANG['exam_paper_multionline']['students']);		
		$sql = "select creater_code from exam_paper_log where paper_id = ".$data2['id'];
		$res = mysql_query($sql,$conn_read);
		$arr = array();
		while($temp=mysql_fetch_assoc($res)){
			$arr[] = $temp['creater_code'];
		}
		$phpexcel->getActiveSheet()->setCellValue('A2', $data2['time_start']);
		$phpexcel->getActiveSheet()->setCellValue('B2', $data2['time_stop']);
		$phpexcel->getActiveSheet()->setCellValue('C2', $data2['passline']);
		$phpexcel->getActiveSheet()->setCellValue('D2', implode(",", $arr) );
		
		$objWriter = new PHPExcel_Writer_Excel5($phpexcel);
		$file =  "../file/download/".date('YmdHis').".xls";
		$objWriter->save($file);

		return array(
		    'status'=>'1'
		    ,'file'=>$file
		);		
	}
	
	public static function order($id){
	    $conn = tools::getConn();
	    $sql = tools::getSQL("exam_paper_multionline__order");
        $sql = str_replace("__paper_id__", $id, $sql);
        
        $data = array();
        $res = mysql_query($sql,$conn);        
        while($temp = mysql_fetch_assoc($res)){
            $data[] = $temp;
        }
        
		return array(
		    'status'=>'1'
		    ,'Rows'=>$data
			,'sql'=>str_replace("\n", " ", $sql)
		);
	}
	
}