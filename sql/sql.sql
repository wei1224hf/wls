drop table if exists basic_parameter; create table basic_parameter (
  code varchar(200)  comment '编码' 
 ,value varchar(200)  comment '值' 
 ,reference varchar(200)  comment '参考说明' 
 ,id int  primary key auto_increment comment '主键' 
 ,extend1 int  comment '整数扩展1' 
 ,extend2 int  comment '整数扩展2' 
 ,extend3 int  comment '整数扩展3' 
 ,extend4 varchar(200)  comment '字符扩展4' 
 ,extend5 varchar(200)  comment '字符扩展5' 
 ,extend6 varchar(200)  comment '字符扩展6' 
 ) comment '参数' ENGINE=InnoDB CHARSET=utf8 ;
 
 drop table if exists basic_user; create table basic_user (
  username varchar(200) not null unique comment '用户名' 
 ,password varchar(200) not null comment '密码' 
 ,money int default '0' comment '金币' 
 ,credits int default '0' comment '积分' 
 ,group_code varchar(20) not null comment '用户组编码' 
 ,group_all varchar(200)  comment '所有用户组' 
 ,id_person int  comment '人员信息编号' 
 ,lastlogintime datetime  comment '最后登录时间' 
 ,lastlogouttime datetime  comment '最后退出时间' 
 ,count_actions int  comment '操作次数' 
 ,count_actions_period int  comment '近期操作次数' 
 ,count_login int  comment '登录次数' 
 ,id int primary key comment '编号' 
 ,creater_code varchar(20)  comment '创建者' 
 ,creater_group_code varchar(20)  comment '创建者组' 
 ,time_created timestamp  comment '创建时间' 
 ,time_lastupdated datetime  comment '最后修改时间' 
 ,count_updated int  comment '修改次数' 
 ,type int not null comment '类型' 
 ,status int not null comment '状态' 
 ,remark varchar(200)  comment '备注' 
 ) comment '用户' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'basic_user__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','basic_user__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','关闭','basic_user__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('10','系统','basic_user__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','学生','basic_user__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','教师','basic_user__type','30');
 
 drop table if exists basic_user_session; create table basic_user_session (
  user_id int unique comment '用户编号' 
 ,user_code varchar(200) unique comment '用户名' 
 ,group_code varchar(200)  comment '用户组编号' 
 ,user_type varchar(20)  comment '用户类型' 
 ,permissions varchar(3000)  comment '权限' 
 ,groups varchar(200)  comment '用户组编号' 
 ,ip varchar(16)  comment 'IPV4' 
 ,client varchar(200)  comment '前端类型' 
 ,gis_lat double(10,3)  comment '经度' 
 ,gis_lot double(10,3)  comment '纬度' 
 ,lastaction varchar(20)  comment '最后执行' 
 ,lastactiontime datetime  comment '最后执行时间' 
 ,count_actions int  comment '执行次数' 
 ,count_login int  comment '登录次数' 
 ,session char(32)  comment 'SESSION值' 
 ,status int  comment '状态' 
 ) comment '用户SESSION表' ENGINE=MEMORY CHARSET=utf8 ;
 delete from basic_parameter where reference like 'basic_user_session__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','WEB在线','basic_user_session__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','Android在线','basic_user_session__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('99','退出','basic_user_session__status','99');
 
 drop table if exists basic_memory; create table basic_memory (
  code varchar(200)  comment '编码' 
 ,type int  comment '类型' 
 ,extend1 int  comment '整数扩展' 
 ,extend2 int  comment '整数扩展' 
 ,extend3 int  comment '整数扩展' 
 ,extend4 varchar(200)  comment '字符串扩展' 
 ,extend5 varchar(200)  comment '字符串扩展' 
 ,extend6 varchar(200)  comment '字符串扩展' 
 ) comment '内存表' ENGINE=MEMORY  CHARSET=utf8 ;
 
 drop table if exists basic_group; create table basic_group (
  name varchar(200)  comment '名称' 
 ,code varchar(200) unique comment '编码' 
 ,count_users int  comment '用户数量' 
 ,id int primary key auto_increment comment '编号' 
 ,type varchar(20)  comment '类型' 
 ,status int  comment '状态' 
 ,remark text  comment '备注' 
 ,chief varchar(200)  comment '领导人姓名' 
 ,chief_code varchar(200)  comment '领导人' 
 ,chief_cellphone varchar(200)  comment '领导人联系方式' 
 ,phone varchar(20)  comment '电话号码' 
 ) comment '用户组' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'basic_group__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','系统','basic_group__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','节点','basic_group__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','单位','basic_group__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('40','部门','basic_group__type','40');
 insert into basic_parameter (code,value,reference,extend4) values ('50','职位','basic_group__type','50');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','basic_group__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','关闭','basic_group__status','20');
 
 drop table if exists basic_group_2_user; create table basic_group_2_user (
  user_code varchar(40)  comment '用户名'
 ,group_code varchar(40)  comment '用户组编码'
 ,UNIQUE KEY basic_g2u_u ( user_code,group_code ) 
 ,id int auto_increment primary key   comment '主键'
 ) comment '用户组-用户' ENGINE=InnoDB CHARSET=utf8 ;
 
 drop table if exists basic_permission; create table basic_permission (
  name varchar(20)  comment '名称'
 ,type int  comment '类型'
 ,code varchar(20) unique comment '编码'
 ,icon varchar(200)   comment '图标'
 ,path varchar(200)   comment '路径'
 ,id int primary key auto_increment comment '主键'
 ,remark varchar(200)   comment '备注'
 ) comment '权限' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'basic_permission__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','节点','basic_permission__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','页面','basic_permission__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','按钮','basic_permission__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('40','逻辑','basic_permission__type','40');
 
 drop table if exists basic_group_2_permission; create table basic_group_2_permission (
  permission_code varchar(20)  comment '权限编码'
 ,group_code varchar(200)  comment '用户组编码'
 ,cost int default '0' comment '消耗金币'
 ,credits int default '0' comment '得到积分'
 ,UNIQUE KEY basic_g2p_u ( permission_code,group_code ) 
 ,id int auto_increment primary key   comment '主键'
 ) comment '用户组-权限' ENGINE=InnoDB CHARSET=utf8 ;
 drop table if exists exam_subject; create table exam_subject (
  code varchar(200) not null unique comment '编号'
 ,name varchar(500) not null comment '名称'
 ,directions text  comment '说明'
 ,weight int  comment '权重'
 ,id int primary key auto_increment comment '编号'
 ,type int not null comment '类型'
 ,status int not null comment '状态'
 ,remark varchar(200)  comment '备注'
 ) comment '科目' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_subject__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','节点','exam_subject__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','科目','exam_subject__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','知识点','exam_subject__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','exam_subject__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','关闭','exam_subject__status','20');
 
 
 drop table if exists exam_subject_2_group; create table exam_subject_2_group (
  subject_code varchar(40) not null comment '编号'
 ,group_code varchar(40) not null comment '名称'
 ,UNIQUE KEY basic_g2u_u ( subject_code,group_code )  
 ,id int primary key auto_increment comment '编号'
 ) comment '科目跟用户组' ENGINE=InnoDB CHARSET=utf8 ;
 
 drop table if exists exam_subject_2_user_log; create table exam_subject_2_user_log (
  subject_code varchar(200) not null comment '科目'
 ,count_positive int not null default '0' comment '做对数'
 ,count_negative int not null default '0' comment '做错数'
 ,proportion int not null default '0' comment '比例'
 ,paper_id int not null comment '试卷编号'
 ,paper_log_id int not null comment '做题记录编号'
 ,id int primary key comment '编号'
 ,creater_code varchar(200) not null comment '创建者'
 ,updater_code varchar(200) not null comment '当前修改者'
 ,creater_group_code varchar(200) not null comment '创建者组'
 ,time_created timestamp default CURRENT_TIMESTAMP comment '创建时间'
 ,time_lastupdated datetime default '1900-01-01' comment '最后修改时间'
 ,count_updated int default '0' comment '修改次数'
 ,type int not null comment '类型'
 ,status int not null comment '状态'
 ,remark varchar(200)  comment '备注'
 ) comment '学生做题科目统计' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_subject_2_user_log__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷','exam_subject_2_user_log__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷','exam_subject_2_user_log__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷模式','exam_subject_2_user_log__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷未批改','exam_subject_2_user_log__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('40','考卷已批改','exam_subject_2_user_log__status','40');
 
 drop table if exists exam_paper; create table exam_paper (
  subject_code varchar(200) not null comment '科目'
 ,title varchar(500) not null default 'Paper Title' comment '标题'
 ,cost int not null default '0' comment '花费'
 ,count_used int not null default '0' comment '被使用次数'
 ,cent_all DECIMAL(10,2) not null default '0' comment '历次被使用的得分累计'
 ,cent DECIMAL(6,2) not null default '0' comment '总分'
 ,cent_subjective DECIMAL(6,2) not null default '0' comment '主观题总分'
 ,cent_objective DECIMAL(6,2) not null default '0' comment '客观题总分'
 ,count_question int not null default '0' comment '题目总数'
 ,count_subjective int not null default '0' comment '主观题数量'
 ,count_objective int not null default '0' comment '客观题数量'
 ,cent_top DECIMAL(6,2) not null default '0' comment '最高分'
 ,directions text  comment '说明'
 ,id int primary key comment '编号'
 ,creater_code varchar(200) not null comment '创建者'
 ,updater_code varchar(200) not null comment '当前修改者'
 ,creater_group_code varchar(200) not null comment '创建者组'
 ,time_created timestamp default CURRENT_TIMESTAMP comment '创建时间'
 ,time_lastupdated datetime default '1900-01-01' comment '最后修改时间'
 ,count_updated int default '0' comment '修改次数'
 ,type int not null comment '类型'
 ,status int not null comment '状态'
 ,remark varchar(200)  comment '备注'
 ) comment '试卷' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_paper__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习册','exam_paper__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','多人考卷','exam_paper__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','统考','exam_paper__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','exam_paper__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','组卷','exam_paper__status','20');
 
 drop table if exists exam_paper_log; create table exam_paper_log (
  mycent DECIMAL(6,2) not null default '0' comment '我的得分'
 ,mycent_subjective DECIMAL(6,2) not null default '0' comment '主观题得分'
 ,mycent_objective DECIMAL(6,2) not null default '0' comment '客观题得分'
 ,count_right int not null default '0' comment '做对题数'
 ,count_wrong int not null default '0' comment '做错题数'
 ,count_giveup int not null default '0' comment '放弃题数'
 ,proportion int not null default '0' comment '做对比例'
 ,paper_id int  comment '试卷编号'
 ,rank int  comment '排名'
 ,id int primary key comment '编号'
 ,creater_code varchar(200) not null comment '创建者'
 ,updater_code varchar(200) not null comment '当前修改者'
 ,creater_group_code varchar(200) not null comment '创建者组'
 ,time_created timestamp default CURRENT_TIMESTAMP comment '创建时间'
 ,time_lastupdated datetime default '1900-01-01' comment '最后修改时间'
 ,count_updated int default '0' comment '修改次数'
 ,type int not null comment '类型'
 ,status int not null comment '状态'
 ,remark varchar(200)  comment '备注'
 ) comment '做题记录' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_paper_log__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习册','exam_paper_log__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','多人考卷','exam_paper_log__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','统考','exam_paper_log__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷模式','exam_paper_log__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷待批改','exam_paper_log__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','考卷未做','exam_paper_log__status','30');
 insert into basic_parameter (code,value,reference,extend4) values ('40','考卷已批改','exam_paper_log__status','40');
 insert into basic_parameter (code,value,reference,extend4) values ('90','旷考','exam_paper_log__status','90');
 insert into basic_parameter (code,value,reference,extend4) values ('91','及格','exam_paper_log__status','91');
 insert into basic_parameter (code,value,reference,extend4) values ('92','不及格','exam_paper_log__status','92');
 insert into basic_parameter (code,value,reference,extend4) values ('99','作废','exam_paper_log__status','99');
 
 drop table if exists exam_question; create table exam_question (
  id_parent int  comment '上级编号'
 ,subject_code varchar(200) not null comment '科目'
 ,cent DECIMAL(4,2) not null default '0' comment '分数'
 ,title text  comment '标题'
 ,option_length int  comment '选项数'
 ,option_1 varchar(400)  comment '选项1'
 ,option_2 varchar(400)  comment '选项2'
 ,option_3 varchar(400)  comment '选项3'
 ,option_4 varchar(400)  comment '选项4'
 ,option_5 varchar(400)  comment '选项5'
 ,option_6 varchar(400)  comment '选项6'
 ,option_7 varchar(400)  comment '选项7'
 ,answer varchar(200)  comment '答案'
 ,description varchar(500)  comment '解题说明'
 ,knowledge varchar(500)  comment '知识点'
 ,difficulty int  comment '难度'
 ,path_listen varchar(200)  comment '听力文件'
 ,path_img varchar(200)  comment '图片'
 ,layout int  comment '布局'
 ,paper_id int not null comment '试卷编号'
 ,id int primary key comment '编号'
 ,creater_code varchar(200) not null comment '创建者'
 ,updater_code varchar(200) not null comment '当前修改者'
 ,creater_group_code varchar(200) not null comment '创建者组'
 ,time_created timestamp default CURRENT_TIMESTAMP comment '创建时间'
 ,time_lastupdated datetime default '1900-01-01' comment '最后修改时间'
 ,count_updated int default '0' comment '修改次数'
 ,type int not null comment '类型'
 ,type2 int not null comment '其他类型'
 ,status int not null comment '状态'
 ,remark varchar(200)  comment '备注'
 ) comment '题目' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_question__%';
 insert into basic_parameter (code,value,reference,extend4) values ('1','单选','exam_question__type','1');
 insert into basic_parameter (code,value,reference,extend4) values ('2','多选','exam_question__type','2');
 insert into basic_parameter (code,value,reference,extend4) values ('3','判断','exam_question__type','3');
 insert into basic_parameter (code,value,reference,extend4) values ('4','填空','exam_question__type','4');
 insert into basic_parameter (code,value,reference,extend4) values ('5','组合','exam_question__type','5');
 insert into basic_parameter (code,value,reference,extend4) values ('6','简答','exam_question__type','6');
 insert into basic_parameter (code,value,reference,extend4) values ('7','题纲','exam_question__type','7');
 insert into basic_parameter (code,value,reference,extend4) values ('1','水平','exam_question__layout','1');
 insert into basic_parameter (code,value,reference,extend4) values ('2','垂直','exam_question__layout','2');
 insert into basic_parameter (code,value,reference,extend4) values ('1','可用','exam_question__status','1');
 insert into basic_parameter (code,value,reference,extend4) values ('2','不可用','exam_question__status','2');
 insert into basic_parameter (code,value,reference,extend4) values ('1','完型填空','exam_question__type2','1');
 insert into basic_parameter (code,value,reference,extend4) values ('2','阅读理解','exam_question__type2','2');
 insert into basic_parameter (code,value,reference,extend4) values ('3','短文阅读','exam_question__type2','3');
 
 drop table if exists exam_question_log; create table exam_question_log (
  paper_log_id int  comment '试卷日志'
 ,question_id int  comment '题目编号'
 ,myanswer varchar(500)  comment '答题'
 ,mycent DECIMAL(4,2)  comment '得分'
 ,path_img varchar(200)  comment '上传的图片'
 ,id int primary key comment '编号'
 ) comment '答题记录' ENGINE=InnoDB CHARSET=utf8 ;
 
 drop table if exists exam_question_log_wrongs; create table exam_question_log_wrongs (
  id int primary key comment '编号'
 ,question_id int not null comment '题目编号'
 ,paper_log_id int not null comment '做卷日志'
 ,creater_code varchar(200)  comment '用户名'
 ,time_created timestamp default CURRENT_TIMESTAMP comment '创建时间'
 ,type int not null comment '类型'
 ,status int not null comment '状态'
 ,UNIQUE KEY wrongs_key (question_id,creater_code)  
 ) comment '错题本' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_question_log_wrongs__%';
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷','exam_question_log_wrongs__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷','exam_question_log_wrongs__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷模式','exam_question_log_wrongs__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷未批改','exam_question_log_wrongs__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('40','考卷已批改','exam_question_log_wrongs__status','40');
 
 drop table if exists exam_paper_multionline; create table exam_paper_multionline (
  time_start datetime not null comment '开始时间'
 ,time_stop datetime not null comment '结束时间'
 ,passline int not null comment '及格线'
 ,paper_id int not null comment '试卷编号'
 ,count_total int not null comment '总人数'
 ,count_giveup int  comment '旷考人数'
 ,count_passed int  comment '及格数'
 ,count_failed int  comment '不及格数'
 ,proportion int  comment '通过率'
 ,id int primary key comment '编号'
 ,creater_code varchar(200) not null comment '创建者'
 ,updater_code varchar(200) not null comment '当前修改者'
 ,creater_group_code varchar(200) not null comment '创建者组'
 ,time_created timestamp default CURRENT_TIMESTAMP comment '创建时间'
 ,time_lastupdated datetime default '1900-01-01' comment '最后修改时间'
 ,count_updated int default '0' comment '修改次数'
 ,type int not null comment '类型'
 ,status int not null comment '状态'
 ,remark varchar(200)  comment '备注'
 ) comment '多人考试' ENGINE=InnoDB CHARSET=utf8 ;
 delete from basic_parameter where reference like 'exam_paper_multionline__%';
 insert into basic_parameter (code,value,reference,extend4) values ('20','多人考卷','exam_paper_multionline__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','统考','exam_paper_multionline__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','exam_paper_multionline__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','结束','exam_paper_multionline__status','20');
