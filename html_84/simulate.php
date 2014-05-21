<?php 
include_once "../php/tools.php";
include_once '../php/basic_group.php';
include_once '../php/basic_user.php';

include_once '../php/exam_paper.php';
include_once '../php/exam_paper_log.php';
include_once '../php/exam_paper_multionline.php';

class simulate{
	
	public static $json = array();
	
	public static function exam_paper__start(){
		$conn = tools::getConn();
		tools::initMemory();
		
		$sql = "delete from exam_paper where remark = 'exam_paper__simulate'";
		tools::query($sql,$conn);
		$sql = "delete from exam_question  where remark = 'exam_paper__simulate'";
		tools::query($sql,$conn);
		basic_user::login("默认教师",md5(md5("111111").date("H")),"0","system");
		
		$sql = "select * from exam_subject ";
		$res = tools::query($sql, $conn);
		$data = array();
		while($row = tools::fetch_assoc($res)){
			$data[] = $row;
		}
		
		return $data;
	}
	
	public static function exam_paper(){
		$conn = tools::getConn();
		$data = array();
		tools::updateTableId("exam_paper");
		$id_exam_paper = tools::getTableId("exam_paper");
		tools::updateTableId("exam_question");
		$id_exam_question = tools::getTableId("exam_question");
		$sqls = array();
		include_once '../php/exam_paper.php';
		include_once '../php/exam_question.php';
		$executor = "默认教师";
		$sql = "select * from basic_user where username = '".$executor."'";
		$res = tools::query($sql, $conn);
		$row = tools::fetch_assoc($res);
		$session = basic_user::_login($executor,md5($row['password'].date("G")),"0","0","0","0");
		//print_r($session);exit();
		
		//一个科目10张卷子,一张卷子50题
		for ($i = 0; $i < 10; $i++) {	
			$id_exam_paper ++;
			$exam_paper = array(
				'subject_code'=>self::$json['code']
				,'title'=>self::$json['name']."-模拟".rand(1000,9999)
				,'cost'=>rand(0,3)
				,'cent_all'=>0
				,'cent'=>100
				,'cent_subjective'=>40
				,'cent_objective'=>60
				,'count_question'=>50
				,'count_subjective'=>20
				,'count_objective'=>30
				,'cent_top'=>0
				,'directions'=>''	
				,'id'=>$id_exam_paper
				,'type'=>'10'	
				,'remark'=>'exam_paper__simulate'
				,'status'=>'10'
			);
			
			$sqls[] = exam_paper::add($exam_paper, $executor, TRUE);
			
			//5道填空题
			for($i1=0;$i1<5;$i1++){
				$id_exam_question ++;
				
				$exam_question = array(
					'subject_code'=>self::$json['code']
					,'cent'=>0
					,'title'=>'这是一道填空题,请在空格中输入[__1__]跟[__2__]'
					,'type'=>7
					,'paper_id'=>$id_exam_paper
					,'id'=>$id_exam_question
					,'remark'=>'exam_paper__simulate'
				);
				$data = $exam_question;
				$sqls[] = exam_question::add($data, $executor, TRUE);
				$id_parent = $id_exam_question;
				
				for($i2=0;$i2<2;$i2++){
					$id_exam_question ++;					
					$exam_question = array(
							'subject_code'=>self::$json['code']
							,'cent'=>2
							,'title'=>($i2+1)
							,'type'=>4
							,'paper_id'=>$id_exam_paper
							,'id_parent'=>$id_parent
							,'description'=>'解题思路及答案说明'
							,'id'=>$id_exam_question
							,'remark'=>'exam_paper__simulate'
					);
					$data = $exam_question;
					$sqls[] = exam_question::add($data, $executor, TRUE);
				}
			}			
			
			//20题单选题
			for($i1=0;$i1<20;$i1++){
				$id_exam_question ++;
				
				$exam_question = array(
						'subject_code'=>self::$json['code']
						,'cent'=>2
						,'title'=>'这是一题单选题'.rand(10000,99999).rand(10000,99999).rand(10000,99999)
						,'option_length'=>4
						,'option_1'=>'选项A'.rand(10000,99999).rand(10000,99999)
						,'option_2'=>'选项B'.rand(10000,99999).rand(10000,99999)
						,'option_3'=>'选项C'.rand(10000,99999).rand(10000,99999)
						,'option_4'=>'选项D'.rand(10000,99999).rand(10000,99999)
						,'answer'=>chr(rand(65,68))
						,'description'=>'解题说明'.rand(10000,99999).rand(10000,99999)
						,'layout'=>1
						,'paper_id'=>$id_exam_paper
						,'type'=>1
						,'id'=>$id_exam_question
						,'remark'=>'exam_paper__simulate'
				);
				$data = $exam_question;
				$sqls[] = exam_question::add($data, $executor, TRUE);
			}
			
			//20题单选题
			for($i1=0;$i1<10;$i1++){
				$id_exam_question ++;
			
				$answer = array();
				for($i2=0;$i2<4;$i2++){
					if(rand(1,100)>50)$answer[] = chr(65+$i2);
				}
				if(count($answer)==0)$answer[] = 'A';
				$exam_question = array(
						'subject_code'=>self::$json['code']
						,'cent'=>2
						,'title'=>'这是一题多选题'.rand(10000,99999).rand(10000,99999).rand(10000,99999)
						,'option_length'=>4
						,'option_1'=>'选项A'.rand(10000,99999).rand(10000,99999)
						,'option_2'=>'选项B'.rand(10000,99999).rand(10000,99999)
						,'option_3'=>'选项C'.rand(10000,99999).rand(10000,99999)
						,'option_4'=>'选项D'.rand(10000,99999).rand(10000,99999)
						,'answer'=> join("", $answer)
						,'description'=>'解题说明'.rand(10000,99999).rand(10000,99999)
						,'layout'=>1
						,'paper_id'=>$id_exam_paper
						,'type'=>2
						,'id'=>$id_exam_question
						,'remark'=>'exam_paper__simulate'
				);
				$data = $exam_question;
				$sqls[] = exam_question::add($data, $executor, TRUE);
			}
			
			//10题判断题
			for($i1=0;$i1<10;$i1++){
				$id_exam_question ++;
					
				$exam_question = array(
						'subject_code'=>self::$json['code']
						,'cent'=>2
						,'title'=>'这是一道判断题'.rand(10000,99999).rand(10000,99999).rand(10000,99999)
						,'answer'=> chr( rand(65,66) )
						,'description'=>'解题说明'.rand(10000,99999).rand(10000,99999)
						,'paper_id'=>$id_exam_paper
						,'type'=>3
						,'id'=>$id_exam_question
						,'remark'=>'exam_paper__simulate'
				);
				$data = $exam_question;
				$sqls[] = exam_question::add($data, $executor, TRUE);
			}
			
			//5道简答题
			for($i1=0;$i1<5;$i1++){
				$id_exam_question ++;
					
				$exam_question = array(
						'subject_code'=>self::$json['code']
						,'cent'=>0
						,'title'=>'对这个简答题的很长很长的描述'.rand(10000,99999).rand(10000,99999).rand(10000,99999)
						,'paper_id'=>$id_exam_paper
						,'type'=>7
						,'id'=>$id_exam_question
						,'remark'=>'exam_paper__simulate'
				);
				$data = $exam_question;
				$sqls[] = exam_question::add($data, $executor, TRUE);
				$id_parent = $id_exam_question;
				
				$id_exam_question ++;
				$exam_question = array(
						'subject_code'=>self::$json['code']
						,'cent'=>2
						,'paper_id'=>$id_exam_paper
						,'type'=>6
						,'id_parent'=>$id_parent
						,'id'=>$id_exam_question
						,'description'=>'解题说明'.rand(10000,99999).rand(10000,99999)
						,'remark'=>'exam_paper__simulate'
				);
				$data = $exam_question;
				$sqls[] = exam_question::add($data, $executor, TRUE);
			}
		}
		
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
		
		return array(
			 'status'=>1
			,'count'=>count($sqls)
		);
		
	}
}

if(isset($_REQUEST['json'])) simulate::$json = json_decode2($_REQUEST['json'],TRUE);

$functionName = $_REQUEST['function'];
$data = array();

if($functionName=="exam_paper__start"){
	$data = simulate::exam_paper__start();
}
else if($functionName=="exam_paper"){
	$data = simulate::exam_paper();
}

echo json_encode($data);
if(tools::$conn!=null)mysql_close(tools::$conn);