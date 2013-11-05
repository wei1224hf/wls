<?php 
include_once "tools.php";
include_once 'basic_group.php';
include_once 'basic_user.php';

include_once 'exam_paper.php';
include_once 'exam_paper_log.php';
include_once 'exam_paper_multionline.php';

class simulate{
	
	public static function exam_paper($total,$a_times,$delete=FALSE){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		$total_ = 0;
		
		$sql = "select * from basic_user where type = '30'";
		$res = mysql_query($sql,$conn);
		$a_teachers = array();
		while($temp = mysql_fetch_assoc($res)){
			$a_teachers[] = array(
				 'username'=>$temp['username']
				,'group_code'=>$temp['group_code']
			);
		}	
		
		if($delete){		
			$sql = "delete from exam_paper";
			mysql_query($sql,$conn);
			$sql = "delete from exam_question";
			mysql_query($sql,$conn);
			tools::initMemory();
		}
		
		$exam_paper__id = tools::getTableId("exam_paper",false);
		$exam_question__id = tools::getTableId("exam_question",false);
		mysql_query("START TRANSACTION;",$conn);
		//echo $exam_paper__id." ".$exam_question__id;
		
		$year = substr($a_times[0], 0,4);
		$sql_where_subject = " where type = '20' and  code like '8432-0".$_REQUEST['grade']."__' ";

		$sql = "select * from exam_subject ".$sql_where_subject;
		$res = mysql_query($sql,$conn);

		$a_subject = array();
		while($temp = mysql_fetch_assoc($res)){
			$a_subject[] = array(
					'code'=>$temp['code']
					,'id'=>$temp['id']
					,'name'=>$temp['name']
			);
		}		
		
		for($i2=0;$i2<count($a_subject);$i2++){
			$sql_knowledge = "select * from exam_subject where type = '30' and code like '".$a_subject[$i2]['code']."-____'";
			//echo $sql_knowledge;
			$res_knowledge = mysql_query($sql_knowledge,$conn);
			$a_knowledge = array();
			while($temp = mysql_fetch_assoc($res_knowledge)){
				$a_knowledge[] = $temp['code'];
			}
			//echo json_encode($a_knowledge);
			for($i=0;$i<count($a_times);$i++){
				$exam_paper__id++;
				$teacher = $a_teachers[rand(0,(count($a_teachers)-1))];
				$data__exam_paper = array(
						'subject_code'=>$a_subject[$i2]['code']
						,'title'=>"模拟试卷".$a_times[$i]."--".$a_subject[$i2]['code']
						,'cost'=>rand(0, 10)
						,'cent'=>100
						,'cent_subjective'=>100
						,'cent_objective'=>0
						,'count_question'=>50
						,'count_subjective'=>50
						,'count_objective'=>0	
						,'directions'=>"试卷说明,说明内容可能很长"
						,'id'=>$exam_paper__id
						,'creater_code'=>$teacher['username']
						,'creater_group_code'=>$teacher['group_code']
						,'type'=>10
						,'status'=>10
						,'remark'=>"exam_paper__data4test"
						,'time_created'=>$a_times[$i]
				);
				$keys = array_keys($data__exam_paper);
				$keys = implode(",",$keys);
				$values = array_values($data__exam_paper);
				$values = implode("','",$values);
				$sql = "insert into exam_paper (".$keys.") values ('".$values."')";
				mysql_query($sql,$conn);
				$total_++;
				
				$question_count = (rand()>0.5)?20:50;
				$question_cent = 100/$question_count;
				for($i3=0;$i3<$question_count;$i3++){
					$exam_question__id++;
					$knowledge = "";
					$question_title = "题目标题";
					$question_title_length = rand(5, 40);
					for($i4=0;$i4<$question_title_length;$i4++){
						$question_title.="很长";
					}
					$question_option = "选项";
					$question_option_length = rand(3,6);
					for($i5=0;$i5<$question_option_length;$i5++){
						$question_option.= "很长";
					}
					$question_description = "解题思路";
					$question_description_length = rand(5,40);
					for($i6=0;$i6<$question_description_length;$i6++){
						$question_description.= "很长";
					}
					$question_knowledge = "";
					$question_knowledge_start = rand(0,count($a_knowledge)-3);
					//echo json_encode($a_knowledge).$a_times[$i].$a_subject[$i2]['code']."<br/>";
					for($i7=0;$i7<3;$i7++){
						$question_knowledge.= $a_knowledge[$question_knowledge_start+$i7].",";
					}
					$question_knowledge = substr($question_knowledge, 0,strlen($question_knowledge)-1);
					$question_path_img = (rand(0,100)>50)?"0":"../file/test/a".rand(1,10).".jpg";
					$data__exam_question = array(
						'subject_code'=>$a_subject[$i2]['code']
						,'cent'=>$question_cent
						,'title'=>$question_title
						,'option_length'=>4
						,'option_1'=>$question_option."A"
						,'option_2'=>$question_option."B"
						,'option_3'=>$question_option."C"
						,'option_4'=>$question_option."D"
						,'answer'=>'A'
						,'description'=>$question_description
						,'knowledge'=>$question_knowledge
						,'difficulty'=>rand(0, 4)
						,'path_img'=>$question_path_img
						,'layout'=>2
						,'paper_id'=>$exam_paper__id
						,'id'=>$exam_question__id
						,'creater_code'=>$teacher['username']
						,'creater_group_code'=>$teacher['group_code']
						,'type'=>rand(1,3)
						,'status'=>1
						,'remark'=>'exam_paper__data4test'
					);
					
					$keys = array_keys($data__exam_question);
					$keys = implode(",",$keys);
					$values = array_values($data__exam_question);
					$values = implode("','",$values);
					$sql = "insert into exam_question (".$keys.") values ('".$values."')";
					mysql_query($sql,$conn);
					$total_++;					
			
				}
				
			}			
		}
		
		mysql_query("COMMIT;",$conn);
		
		tools::updateTableId("exam_paper");
		tools::updateTableId("exam_question");
		$t_return['msg']="Table exam_paper and exam_question added row in total ".$total_.". Now the id in exam_paper is ".$exam_paper__id." and id in exam_question is ".$exam_question__id.". Date from ".$a_times[0]." to ".end($a_times);
		
		return $t_return;
	}
	
	public static function basic_group($total){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
	
		$sql = "delete from basic_group where type = '40'";
		mysql_query($sql,$conn);
		$sql = "select code from basic_group where type = '30' and code like '%-%-__' limit 1";
		$res = mysql_query($sql,$conn);
		$temp = mysql_fetch_assoc($res);
		$code = $temp['code'];
	
		$total_ = 0;
		//mysql_query("START TRANSACTION;",$conn);
		//一个高中,三个年级 2013届,2014届,2015届
		//每个年纪 4 到6个班级
		$basic_group__id = tools::getTableId("basic_group",false);
		for($i=11;$i<=13;$i++){
			$code_ = $code."-".$i;
			$basic_group__id++;
			$sql = "insert into basic_group(id,name,code,type,status) values ('".$basic_group__id."','年级".$i."','".$code_."','30','10')";
			mysql_query($sql,$conn);
			$total_++;
			if($total_>=$total)return $t_return;
				
			$r = rand(3, 5);
			for($i2=1;$i2<=$r;$i2++){
				$code__ = $code_."-0".$i2;
				$basic_group__id++;
				$sql = "insert into basic_group(id,name,code,type,status) values ('".$basic_group__id."','班级".$i.$i2."','".$code__."','40','10')";
				mysql_query($sql,$conn);
				$total_++;
				if($total_>=$total)return $t_return;
			}
		}
		$basic_group__id++;
		$sql = "insert into basic_group(id,name,code,type,status) values ('".$basic_group__id."','教师','".$code."-X1"."','40','10')";
		mysql_query($sql,$conn);
		$sql = "delete from basic_group_2_permission where group_code like '%-%-%-%-%'";
		mysql_query($sql,$conn);
		$sql = tools::getSQL("basic_group__simulate_permission");
		mysql_query($sql,$conn);
		tools::updateTableId("basic_group");
		$t_return['msg']="Table basic_group added row in total : ".$total_;
		return $t_return;
	}
	
	public static function exam_subject($total){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		$total_ = 0;
	
		$sql = "delete from exam_subject";
		mysql_query($sql,$conn);
		$sql = "delete from exam_subject_2_group";
		mysql_query($sql,$conn);
	
		//mysql_query("START TRANSACTION;",$conn);
		//节点 科目 知识点
		//节点要参考 国名经济编码 8432 表示高中教育
		$exam_subject__id = tools::getTableId("exam_subject",false);
		$exam_subject__id++;
		$sql = "insert into exam_subject(id,name,code,type,status) values ('".$exam_subject__id."','教育','84','10','10')";
		mysql_query($sql,$conn);
		$total_++;
		$exam_subject__id++;
		$sql = "insert into exam_subject(id,name,code,type,status) values ('".$exam_subject__id."','高中教育','8432','10','10')";
		mysql_query($sql,$conn);
		$total_++;
	
		$subjectname = array("语文","数学","外语","物理","化学","生物","历史","地理","政治");
		for($i=1;$i<=3;$i++){
			$exam_subject__id++;
			$sql = "insert into exam_subject(id,name,code,type,status) values ('".$exam_subject__id."','年级".$i."','8432-0".$i."','10','10')";
			mysql_query($sql,$conn);
			$total_++;
			for($i2=1;$i2<=count($subjectname);$i2++){
				$exam_subject__id++;
				$sql = "insert into exam_subject(id,name,code,type,status) values ('".$exam_subject__id."','".$subjectname[$i2-1].$i."','8432-0".$i."0".$i2."','20','10')";
				mysql_query($sql,$conn);
				if($i2==1||$i2==2||$i2==3){
					$sql = "insert into exam_subject_2_group(group_code,subject_code)
						select code as group_code,'8432-0".$i."0".$i2."' as subject_code from basic_group where code like '330281-8432-04-".(14-$i)."-__'";
				}
				else if($i2==4||$i2==5||$i2==6){
					$sql = "insert into exam_subject_2_group(group_code,subject_code)
						select code as group_code,'8432-0".$i."0".$i2."' as subject_code from basic_group where code like '330281-8432-04-".(14-$i)."-__' and code not like '%1' and code not like '%2'";
				}
				else if($i2==7||$i2==8||$i2==9){
					$sql = "insert into exam_subject_2_group(group_code,subject_code)
						select code as group_code,'8432-0".$i."0".$i2."' as subject_code from basic_group where code like '330281-8432-04-".(14-$i)."-__' and (code like '%1' or code  like '%2')";
				}
				mysql_query($sql,$conn);
				$total_++;
	
				$r = rand(3, 5);
				$w = 100/$r ;
				for($i3=1;$i3<=$r;$i3++){
					$exam_subject__id++;
					$sql = "insert into exam_subject(id,name,code,type,status,weight) values ('".$exam_subject__id."','知识点".$i.$i2.$i3."','8432-0".$i."0".$i2."-".(($i3>=10)?$i3:"0".$i3)."','30','10','".$w."')";
					mysql_query($sql,$conn);
						
					$r2 = rand(3, 5);
					$w2 = 100/$r2 ;
					for($i4=1;$i4<=$r2;$i4++){
						$exam_subject__id++;
						$sql = "insert into exam_subject(id,name,code,type,status,weight) values ('".$exam_subject__id."','知识点".$i.$i2.$i3.$i4."','8432-0".$i."0".$i2."-".(($i3>=10)?$i3:"0".$i3).(($i4>=10)?$i4:"0".$i4)."','30','10','".$w2."')";
						mysql_query($sql,$conn);
						$total_++;
						/*
						if($total_>=$total){
							mysql_query("COMMIT;",$conn);
							$t_return['msg']="Total ".$total_;
							return $t_return;
						}
						*/
					}
				}
			}
		}
		//mysql_query("COMMIT;",$conn);
		tools::updateTableId("exam_subject");
		
		$t_return['msg']="Table exam_subject added row in total : ".$total_;
		return $t_return;
	}
	
	public static function basic_user($total){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		$conn2 = tools::getConn(true);
	
		$sql = "delete from basic_user where type in ('20','30')";
		$sql = "delete from basic_group_2_user where user_code not in ('admin','guest')";
		mysql_query($sql,$conn);
		$sql = "select code from basic_group where type = '40' ";
		//mysql_query("START TRANSACTION;",$conn2);
		$res = mysql_query($sql,$conn);
		$total_ = 0;
		while($temp = mysql_fetch_assoc($res)){
			$r = rand(10, 20);
			for($i=0;$i<$r;$i++){
				$code = $temp['code']."--".$i;
				$sql = "insert into basic_user(username,password,group_code,id,type,status,money) values ('".$code."',md5('".$code."'),'". $temp['code']."','".(1000+$total_)."','20','10','1000');";
				mysql_query($sql,$conn);
				$sql = "insert into basic_group_2_user(user_code,group_code) values ('".$code."','". $temp['code']."');";
				mysql_query($sql,$conn);
				$total_++;
				/*
					if($total_>=$total){
				mysql_query("COMMIT;",$conn2);
				return $t_return;
				}
				*/
			}
		}
		$code = $temp['code'];
		//mysql_query("COMMIT;",$conn2);
		tools::updateTableId("basic_user");
		$sql = "update basic_user set type = '30' where group_code like '%X%'";
		mysql_query($sql,$conn2);
		$t_return['msg']="Table basic_user added row in total : ".$total_;
		return $t_return;
	}	
	
	public static function get_students(){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		$sql = "select username from basic_user where type = '20' limit 50";//TODO
		$res = mysql_query($sql,$conn);
		$data = array();
		while($temp=mysql_fetch_assoc($res)){
			$data[] = $temp['username'];
		}
		$t_return['data']=$data;
		return $t_return;
	}
	
	public static function exam_paper_log($total,$a_time,$student,$delete=FALSE){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		$conn2 = tools::getConn(true);
		$total_ = 0;
		$firstTime = "2013-02-01";
	
		if($delete){
			$sql = "delete from exam_paper_log";
			mysql_query($sql,$conn);
			$sql = "delete from exam_subject_2_user_log";
			mysql_query($sql,$conn);
			tools::initMemory();
		}
	
		$exam_subject_2_user_log__id = tools::getTableId("exam_subject_2_user_log",false);
		$exam_paper_log__id = tools::getTableId("exam_paper_log",false);
	
		$sql_papers = "select id,subject_code,title,creater_code,count_question,time_created,cent from exam_paper where time_created > '".$a_time[0]."' and time_created < '".$a_time[1]."' and subject_code in (select subject_code from exam_subject_2_group where group_code = '".substr($student, 0 , 20)."' )";

		$res = mysql_query($sql_papers,$conn2);
		if($res==FALSE)echo $sql_papers;
		//mysql_query("START TRANSACTION;",$conn);
		while($temp=mysql_fetch_assoc($res)){
			$exam_paper_log__id ++;
			$timeDiff=strtotime($temp['time_created'])-strtotime($firstTime);
				
			$rate = ($timeDiff/11318400);
			if($rate>=1)$rate = rand(90,100)/100;
			if($rate<=0.8)$rate+=rand(10,20)/100;
	
			$data__exam_paper_log = array(
				'id'=>$exam_paper_log__id
				,'mycent'=>intval($temp['cent'])*$rate
				,'mycent_objective'=>intval($temp['cent'])*$rate
				,'count_right'=>$rate*$temp['count_question']
				,'count_wrong'=>(1-$rate)*$temp['count_question']
				,'proportion'=>$rate*100
				,'paper_id'=>$temp['id']
				,'creater_code'=>$student
				,'creater_group_code'=>substr($student, 0,20)
				,'type'=>'10'
				,'status'=>'10'
				,'time_created'=>$temp['time_created']
			);
			$keys = array_keys($data__exam_paper_log);
			$keys = implode(",",$keys);
			$values = array_values($data__exam_paper_log);
			$values = implode("','",$values);
			$sql = "insert into exam_paper_log (".$keys.") values ('".$values."')";
			mysql_query($sql,$conn);
			$total_++;
				
			$sql_knowledge = "select code from exam_subject where code like '".$temp['subject_code']."-____'";
			$res2 = mysql_query($sql_knowledge,$conn2);
			while ($temp2=mysql_fetch_assoc($res2)){
				$exam_subject_2_user_log__id++;
				$data__exam_subject_2_user_log = array(
						'subject_code'=>$temp2['code']
						,'proportion'=>$rate*100
						,'paper_id'=>$temp['id']
						,'paper_log_id'=>$exam_paper_log__id
						,'id'=>$exam_subject_2_user_log__id
						,'creater_code'=>$student
						,'creater_group_code'=>substr($student, 0,20)
						,'type'=>'10'
						,'status'=>'10'
						,'time_created'=>$temp['time_created']
				);
	
				$keys = array_keys($data__exam_subject_2_user_log);
				$keys = implode(",",$keys);
				$values = array_values($data__exam_subject_2_user_log);
				$values = implode("','",$values);
				$sql = "insert into exam_subject_2_user_log (".$keys.") values ('".$values."')";
	
				mysql_query($sql,$conn);
				$total_++;
				/*
				if($total_>=$total){
					mysql_query("ROLLBACK;",$conn);
					return array(
							'status'=>'2'
							,'msg'=>'Too much sqls, more than '.$total
					);
				}
				*/
			}
		}
		//mysql_query("COMMIT;",$conn);
	
		tools::updateTableId("exam_paper_log");
		tools::updateTableId("exam_subject_2_user_log");
		$t_return['msg']="Table exam_subject_2_user_log and exam_paper_log added row in total ".$total_.". Now the id in exam_subject_2_user_log is ".$exam_subject_2_user_log__id." and id in exam_paper_log is ".$exam_paper_log__id.". Date from ".$a_time[0]." to ".end($a_time)." student ".$student;
		return $t_return;
	}	
	

	public static function exam_paper_multionline($total,$a_times,$subject,$students,$delete=FALSE){
		$t_return = array("status"=>"1","msg"=>"");
		$conn = tools::getConn();
		$conn2 = tools::getConn(TRUE);
		$total_ = 0;
	
		if($delete){
			$sql = "delete from exam_paper_multionline";
			mysql_query($sql,$conn);
			$sql = "delete from exam_paper where type = '20'";
			mysql_query($sql,$conn);
			$sql = "delete from exam_question where remark = 'exam_paper_multionline'";
			mysql_query($sql,$conn);
			$sql = "delete from exam_paper_log where remark = 'exam_paper_multionline'";
			mysql_query($sql,$conn);
			tools::initMemory();
		}
	
		$sql_knowledge = "select * from exam_subject where type = '30' and code like '".$subject."-____'";
		//echo $sql_knowledge;
		$res_knowledge = mysql_query($sql_knowledge,$conn2);
		$a_knowledge = array();
		while($temp = mysql_fetch_assoc($res_knowledge)){
			$a_knowledge[] = $temp['code'];
		}
	
		$exam_paper__id = tools::getTableId("exam_paper",false);
		$exam_question__id = tools::getTableId("exam_question",false);
		$exam_paper_multionline__id = tools::getTableId("exam_paper_multionline",false);
		$exam_paper_log__id = tools::getTableId("exam_paper_log",false);
		$exam_question_log__id = tools::getTableId("exam_question_log",false);
		mysql_query("START TRANSACTION;",$conn);
	
		for($i=0;$i<count($a_times);$i++){
			$time = $a_times[$i];
			$exam_paper__id++;
			$exam_paper_multionline__id++;
				
			$data__exam_paper = array(
					'id'=>$exam_paper__id
					,'cost'=>'10'
					,'subject_code'=>$subject
					,'title'=>'多人考卷'.$a_times[$i]
					,'cent'=>'100'
					,'cent_subjective'=>'100'
					,'cent_objective'=>'0'
					,'count_question'=>'50'
					,'count_subjective'=>'0'
					,'count_objective'=>'50'
					,'directions'=>'这是一张多人考卷,来自模拟数据'
	
					,'creater_code'=>'330281-8432-04-X1--'.rand(1,9)
					,'creater_group_code'=>'330281-8432-04-X1'
					,'type'=>'20'
					,'status'=>'10'
					,'remark'=>'exam_paper_multionline'
					,'time_created'=>$a_times[$i]
			);
			$keys = array_keys($data__exam_paper);
			$keys = implode(",",$keys);
			$values = array_values($data__exam_paper);
			$values = implode("','",$values);
			$sql = "insert into exam_paper (".$keys.") values ('".$values."')";
			mysql_query($sql,$conn);
			$total_++;
				
			$exam_question__id2 = $exam_question__id;
			for($i3=0;$i3<50;$i3++){
				$exam_question__id++;
				$knowledge = "";
				$question_title = "题目标题";
				$question_title_length = rand(5, 40);
				for($i4=0;$i4<$question_title_length;$i4++){
					$question_title.="很长";
				}
				$question_option = "选项";
				$question_option_length = rand(3,6);
				for($i5=0;$i5<$question_option_length;$i5++){
					$question_option.= "很长";
				}
				$question_description = "解题思路";
				$question_description_length = rand(5,40);
				for($i6=0;$i6<$question_description_length;$i6++){
					$question_description.= "很长";
				}
				$question_knowledge = "";
				$question_knowledge_start = rand(0,count($a_knowledge)-3);
				//echo json_encode($a_knowledge).$a_times[$i].$a_subject[$i2]['code']."<br/>";
				for($i7=0;$i7<3;$i7++){
					$question_knowledge.= $a_knowledge[$question_knowledge_start+$i7].",";
				}
				$question_knowledge = substr($question_knowledge, 0,strlen($question_knowledge)-1);
				$question_path_img = (rand(0,100)>50)?"0":"../file/test/a".rand(1,10).".jpg";
	
				$data__exam_question = array(
						'subject_code'=>$subject
						,'cent'=>'2'
						,'title'=>$question_title
						,'option_length'=>4
						,'option_1'=>$question_option."A"
						,'option_2'=>$question_option."B"
						,'option_3'=>$question_option."C"
						,'option_4'=>$question_option."D"
						,'answer'=>'A'
						,'description'=>$question_description
						,'knowledge'=>$question_knowledge
						,'difficulty'=>rand(0, 4)
						,'path_img'=>$question_path_img
						,'layout'=>'2'
						,'paper_id'=>$exam_paper__id
						,'id'=>$exam_question__id
						,'creater_code'=>'330281-8432-04-X1--'.rand(1,9)
						,'creater_group_code'=>'330281-8432-04-X1'
						,'type'=>rand(1,3)
						,'status'=>'1'
						,'remark'=>'exam_paper_multionline'
				);
				$keys = array_keys($data__exam_question);
				$keys = implode(",",$keys);
				$values = array_values($data__exam_question);
				$values = implode("','",$values);
				$sql = "insert into exam_question (".$keys.") values ('".$values."')";
				mysql_query($sql,$conn);
				$total_++;
			}
				
			$time_stop = "";
			$time_start = "";
			$r = rand(1,100);
			if($r>90){
				//未开始
				$time_stop = '2015-01-01';
				$time_start = '2014-01-01';
			}
			else if($r>60){
				//开始,正常
				$time_stop = '2014-01-01';
				$time_start = $a_times[$i];
			}
			else{
				//已结束
				$time_start = $a_times[$i];
				$time_stop = date('Y-m-d',strtotime($time_start)+86400);
			}
				
			$data__exam_paper_multionline = array(
					'time_start'=>$time_start
					,'time_stop'=>$time_stop
					,'passline'=>'60'
					,'paper_id'=>$exam_paper__id
					,'count_total'=>count($students)
					,'count_giveup'=>'0'
					,'count_passed'=>''
					,'count_failed'=>'0'
					,'proportion'=>''
		
					,'id'=>$exam_paper_multionline__id
					,'creater_code'=>'330281-8432-04-X1--'.rand(1,9)
					,'creater_group_code'=>'330281-8432-04-X1'
					,'type'=>'20'
					,'status'=>'10'
					,'remark'=>'exam_paper_multionline'
					,'time_created'=>$a_times[$i]
			);
			$keys = array_keys($data__exam_paper_multionline);
			$keys = implode(",",$keys);
			$values = array_values($data__exam_paper_multionline);
			$values = implode("','",$values);
			$sql = "insert into exam_paper_multionline (".$keys.") values ('".$values."')";
			mysql_query($sql,$conn);
			$total_++;
				
			for($i2=0;$i2<count($students);$i2++){
				$status =  rand(1,100)>50?'20':'30';
				$student = $students[$i2];
				$rate = rand(20,99);
				$exam_paper_log__id++;
				$count_right = $rate/2;
				$count_wrong = (100-$rate)/2;
				$proportion = $rate;
				$mycent = $rate;
				$mycent_subjective = $rate;
				if($status=='30'){
					$count_right = 0;
					$count_wrong = 0;
					$proportion = 0;
					$mycent = 0;
					$mycent_subjective = 0;
				}
				$data__exam_paper_log = array(
						'mycent'=>$mycent
						,'mycent_subjective'=>$mycent_subjective
						,'mycent_objective'=>'0'
						,'count_right'=>$count_right
						,'count_wrong'=>$count_wrong
						,'count_giveup'=>'0'
						,'proportion'=>$rate
						,'paper_id'=>$exam_paper__id
						,'id'=>$exam_paper_log__id
						,'creater_code'=>$student
						,'creater_group_code'=>substr($student, 0,20)
						,'type'=>'20'
						,'status'=>$status
						,'remark'=>'exam_paper_multionline'
						,'time_created'=>$a_times[$i]
						,'time_lastupdated'=>$a_times[$i]
				);
	
				$keys = array_keys($data__exam_paper_log);
				$keys = implode(",",$keys);
				$values = array_values($data__exam_paper_log);
				$values = implode("','",$values);
				$sql = "insert into exam_paper_log (".$keys.") values ('".$values."')";
				mysql_query($sql,$conn);
				$total_++;
	
				if($status=='30')continue;
				for($i3=0;$i3<50;$i3++){
					$exam_question__id2 ++;
					$exam_question_log__id++;
					$myanswer = 'A';
					$mycent = '2';
					if(rand(20,99)>$rate){
						$myanswer = 'B';
						$mycent = '0';
					}
					$data__exam_question_log = array(
							'paper_log_id'=>$exam_paper_log__id
							,'question_id'=>$exam_question__id2
							,'myanswer'=>$myanswer
							,'mycent'=>$mycent
							,'id'=>$exam_question_log__id
					);
					$keys = array_keys($data__exam_question_log);
					$keys = implode(",",$keys);
					$values = array_values($data__exam_question_log);
					$values = implode("','",$values);
					$sql = "insert into exam_question_log (".$keys.") values ('".$values."')";
					mysql_query($sql,$conn);
					$total_++;
				}
			}
	
		}
		mysql_query("COMMIT;",$conn);
		tools::updateTableId("exam_paper");
		tools::updateTableId("exam_paper_multionline");
		tools::updateTableId("exam_question");
		tools::updateTableId("exam_paper_log");
		tools::updateTableId("exam_question_log");
		$t_return['msg']="SQL in total ".$total_.", exam_paper id: ".$exam_paper__id.", exam_paper_multionline id: ".$exam_paper_multionline__id.", exam_question id: ".$exam_question__id.", exam_paper_log id: ".$exam_paper_log__id.", exam_question_log id: ".$exam_question_log__id;
	
		return $t_return;
	}
	
	public static function exam_paper_multionline__get_ids(){
		$t_return = array();
		$conn = tools::getConn();
		$sql = "select paper_id from exam_paper_multionline where time_stop < now()";
		$res = mysql_query($sql,$conn);
		while ($temp=mysql_fetch_assoc($res)){
			$arr[] = $temp['paper_id'];
		}
		$t_return['data'] = $arr;
		return $t_return;;
	}
	
	public static function get_subjects(){
		$t_return = array();
		$conn = tools::getConn();
		$sql = "select code from exam_subject where type = '20' limit 12";
		$res = mysql_query($sql,$conn);
		while ($temp=mysql_fetch_assoc($res)){
			$arr[] = $temp['code'];
		}
		$t_return['data'] = $arr;
		return $t_return;;
	}
}

$functionName = $_REQUEST['function'];
$data = array();

if($functionName=="basic_group"){
	$data = simulate::basic_group(2000);
}
else if($functionName=="basic_user"){
	$data = simulate::basic_user(2000);
}
else if($functionName=="exam_subject"){
	$data = simulate::exam_subject(2000);
}
else if($functionName=="exam_paper"){
	$a = json_decode2($_REQUEST['dates'], true);
	$delete = false;
	if(isset($_REQUEST['delete']))$delete = true;
	$data = simulate::exam_paper(20000,$a,$delete);
}
else if($functionName=="get_students"){
	$data = simulate::get_students();
}
else if($functionName=="exam_paper_log"){
	$a = json_decode2($_REQUEST['dates'], true);
	$delete = false;
	if(isset($_REQUEST['delete']))$delete = true;
	$data = simulate::exam_paper_log(20000,array($a[0],end($a)),$_REQUEST['student'],$delete);
}
else if($functionName=="get_subjects"){
	$data = simulate::get_subjects();
}

else if($functionName=="exam_paper_multionline"){
	$delete = false;
	if(isset($_REQUEST['delete']))$delete = true;
	$dates = json_decode2($_REQUEST['dates'], true);
	$students = json_decode2($_REQUEST['students'], true);
	$subjects = json_decode2($_REQUEST['subjects'], true);
	$data = simulate::exam_paper_multionline(20000
			,$dates
			,$subjects[0]
			,$students
			,$delete);
}
else if($functionName=="exam_paper_multionline__close"){
	$ids = json_decode2($_REQUEST['ids'],true);
	for($i=0;$i<count($ids);$i++){
		exam_paper_multionline::close($ids[$i]);
	}
	$data = array(
			'msg'=>'ok'
			,'status'=>'1'
	);
}
else if($functionName=="exam_paper_multionline__close_ids"){
	$data = simulate::exam_paper_multionline__get_ids();
}


echo json_encode($data);
if(tools::$conn!=null)mysql_close(tools::$conn);