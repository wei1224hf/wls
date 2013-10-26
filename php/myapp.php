<?php
/**
 * 系统后台的主文件
 * 任何前端对后台的访问,都要依赖这个文件跳转
 * 无法对后台其他的任何PHP文件直接访问
 * 因为其他的PHP文件都仅仅是一个CLASS定义,没有对内部FUNCTION的访问口
 *
 * TODO 数据过滤,过滤所有的HTML标签跟SQL标签
 * @author wei1224hf@gmail.com
 * @version 2010
 */

//要访问系统的后台,前端必须传一个 &class=classname&function=functionname 的URL过来
if(!isset($_GET['class']))die('class missed!');
if(!isset($_GET['function']))die('function missed!');
$class = htmlspecialchars($_REQUEST['class'],ENT_QUOTES);

//引入一个 static 的PHP类,里面定义了一些常用的小函数,这些函数与各个业务模块无关
include_once 'tools.php';

//引入基础业务类
include_once 'basic_group.php';
include_once 'basic_user.php';
include_once 'basic_parameter.php';

//考试模块业务
include_once 'exam_subject.php';
include_once 'exam_paper.php';
include_once 'exam_paper_log.php';
include_once 'exam_question_log_wrongs.php';
include_once 'exam_paper_multionline.php';
include_once 'exam_subject_2_user_log.php';

$data = array();
if($class=='basic_user')		$data = basic_user::callFunction();  
if($class=='basic_group')		$data = basic_group::callFunction();
if($class=='basic_parameter')	$data = basic_parameter::callFunction();

if($class=='exam_paper')		$data = exam_paper::callFunction();
if($class=='exam_subject')		$data = exam_subject::callFunction();
if($class=='exam_paper_log')	$data = exam_paper_log::callFunction();
if($class=='exam_subject_2_user_log')	$data = exam_subject_2_user_log::callFunction();
if($class=='exam_paper_multionline')	$data = exam_paper_multionline::callFunction();
if($class=='exam_question_log_wrongs')	$data = exam_question_log_wrongs::callFunction();
echo json_encode($data);

if(tools::$conn <> NULL)tools::closeConn();