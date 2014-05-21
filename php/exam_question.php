<?php
class exam_question {
	
	public static $columns = array(
		'id_parent',
		'subject_code',
		'cent',
		'title',
		'option_length',
		'option_1',
		'option_2',
		'option_3',
		'option_4',
		'option_5',
		'option_6',
		'option_7',
		'answer',
		'description',
		'knowledge',
		'difficulty',
		'path_listen',
		'path_img',
		'layout',
		'paper_id',
		'id',
		'creater_code',
		'updater_code',
		'creater_group_code',
		'time_created',
		'time_lastupdated',
		'count_updated',
		'type',
		'type2',
		'status',
		'remark'			
	);
    
	public static function add($data,$executor,$return_sql=FALSE){
		$t_return = array();
		if(!is_array($data)){
			$item = json_decode2($data,true);
		}
		else{
			$item = $data;
		}
		$conn = tools::getConn();
		$session = basic_user::getSession($executor);
		$session = $session['data'];
	
		if(!isset($item['id'])){
			tools::updateTableId("exam_question");
			$id_exam_question = tools::getTableId("exam_question",true);
			$item["id"] = $id_exam_question;
		}
		else{
			$id_exam_question = $item['id'];
		}
	
		if(!isset($item["type"]))$item["type"] = 1;
		$arr_merge = array(
				 'creater_code'=>$session["user_code"]
				,'updater_code'=>$session["user_code"]
				,'creater_group_code'=>$session["group_code"]
				,'time_created'=>date("Y-m-d H:i:s")
				,'time_lastupdated'=>date("Y-m-d H:i:s")
				,'remark'=>"add"
		);
		if(isset($item['remark']))unset($arr_merge['remark']);
		$item2 = array_merge($item,$arr_merge);
		$item = $item2;
	
		$sql = "insert into exam_question (";
		$sql_ = ") values (";
		$keys = array_keys($item);
		for($i=0;$i<count($keys);$i++){
			if( !in_array($keys[$i],exam_question::$columns) )continue;
			$sql .= $keys[$i].",";
			$sql_ .= "'".$item[$keys[$i]]."',";
		}
		$sql = substr($sql, 0,strlen($sql)-1);
		$sql_ = substr($sql_, 0,strlen($sql_)-1).")";
		$sql = $sql.$sql_;
		if($return_sql)return $sql;
		$res = tools::query($sql,$conn);
		if(!$res){
			$t_return["status"] = 2;
			$t_return["sql"] = $sql;
		}
		else{
			$t_return["status"] = 1;
			$t_return["msg"] = $id_exam_question;
		}
	
		return $t_return;
	}
}