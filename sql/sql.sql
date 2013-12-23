create table basic_parameter (
  code varchar(200) not null
 ,value varchar(200) 
 ,reference varchar(200) not null
 ,extend1 int 
 ,extend2 int 
 ,extend3 int 
 ,extend4 varchar(200) 
 ,extend5 varchar(200) 
 ,extend6 varchar(200) 
 );
 alter table basic_parameter add constraint pk__b_p primary key ( code,reference );
 
 create table basic_user (
  username varchar(40) not null unique
 ,password varchar(200) not null
 ,money int default '0'
 ,credits int default '0'
 ,group_code varchar(200) not null
 ,group_all varchar(200) 
 ,id_person int 
 ,lastlogintime datetime 
 ,lastlogouttime datetime 
 ,count_actions int 
 ,count_actions_period int 
 ,count_login int 
 ,id int primary key
 ,creater_id int 
 ,updater_id int 
 ,creater_group_code varchar(200) 
 ,time_created datetime 
 ,time_lastupdated datetime 
 ,count_updated int 
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','basic_user__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','关闭','basic_user__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('10','系统','basic_user__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','业务','basic_user__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','接口','basic_user__type','30');
 
 create table basic_user_session (
  user_id int unique
 ,user_code varchar(200) unique
 ,group_code varchar(40) 
 ,user_type varchar(200) 
 ,permissions varchar(3000) 
 ,groups varchar(200) 
 ,ip varchar(200) 
 ,client varchar(200) 
 ,gis_lat varchar(200) 
 ,gis_lot varchar(200) 
 ,lastaction varchar(200) 
 ,lastactiontime datetime 
 ,count_actions int 
 ,count_login int 
 ,session char(32) 
 ,status int 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','WEB在线','basic_user_session__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','Android在线','basic_user_session__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('99','退出','basic_user_session__status','99');
 
 create table basic_memory (
  code varchar(200) 
 ,type int 
 ,extend1 int 
 ,extend2 int 
 ,extend3 int 
 ,extend4 varchar(200) 
 ,extend5 varchar(200) 
 ,extend6 varchar(200) 
 );
 
 create table basic_group (
  name varchar(200) 
 ,code varchar(40) unique
 ,id int primary key
 ,count_users int 
 ,type varchar(200) 
 ,status int 
 ,remark text 
 ,chief_id int 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','系统','basic_group__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('30','单位','basic_group__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('40','部门','basic_group__type','40');
 insert into basic_parameter (code,value,reference,extend4) values ('50','职位','basic_group__type','50');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','basic_group__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','关闭','basic_group__status','20');
 
 create table basic_group_2_user (
  user_code varchar(40) not null
 ,group_code varchar(40) not null
 );
 alter table basic_group_2_user add constraint pk__b_g_2_u primary key ( user_code,group_code );
 
 create table basic_permission (
  name varchar(200) 
 ,type int 
 ,code varchar(40) unique
 ,icon varchar(200)  
 ,path varchar(200)  
 ,remark varchar(200)  
 ,status int default '0'
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','节点','basic_permission__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','页面','basic_permission__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','按钮','basic_permission__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('40','逻辑','basic_permission__type','40');
 
 create table basic_group_2_permission (
  permission_code varchar(40) not null
 ,group_code varchar(40) not null
 ,cost int default '0'
 ,credits int default '0'
 );
 alter table basic_group_2_permission add constraint pk__b_g_2_p primary key ( permission_code,group_code );
 
 create table basic_node (
  code varchar(200)  
 ,name varchar(200)  
 ,tablename varchar(200)  
 );
 create table exam_subject (
  code varchar(200) not null unique
 ,name varchar(500) not null
 ,directions text 
 ,weight int 
 ,id int primary key
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','节点','exam_subject__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','科目','exam_subject__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','知识点','exam_subject__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','exam_subject__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','关闭','exam_subject__status','20');
 
 
 create table exam_subject_2_group (
  subject_code varchar(40) not null
 ,group_code varchar(40) not null
 );
 alter table exam_subject_2_group add constraint pk__e_s_2_g primary key ( subject_code,group_code );
 
 create table exam_subject_2_user_log (
  subject_code varchar(200) not null
 ,count_positive int not null default '0'
 ,count_negative int not null default '0'
 ,proportion int not null default '0'
 ,paper_id int not null
 ,paper_log_id int not null
 ,id int primary key
 ,creater_code varchar(200) not null
 ,updater_code varchar(200) not null
 ,creater_group_code varchar(200) not null
 ,time_created timestamp 
 ,time_lastupdated timestamp 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷','exam_subject_2_user_log__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷','exam_subject_2_user_log__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷模式','exam_subject_2_user_log__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷未批改','exam_subject_2_user_log__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('40','考卷已批改','exam_subject_2_user_log__status','40');
 
 create table exam_paper (
  subject_code varchar(200) not null
 ,title varchar(500) not null default 'Paper Title'
 ,cost int not null default '0'
 ,count_used int not null default '0'
 ,cent_all numeric(10,2) not null default '0'
 ,cent numeric(6,2) not null default '0'
 ,cent_subjective numeric(6,2) not null default '0'
 ,cent_objective numeric(6,2) not null default '0'
 ,count_question int not null default '0'
 ,count_subjective int not null default '0'
 ,count_objective int not null default '0'
 ,cent_top numeric(6,2) not null default '0'
 ,directions text 
 ,id int primary key
 ,creater_code varchar(200) not null
 ,updater_code varchar(200) not null
 ,creater_group_code varchar(200) not null
 ,time_created timestamp 
 ,time_lastupdated timestamp 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习册','exam_paper__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','多人考卷','exam_paper__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','统考','exam_paper__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','exam_paper__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','组卷','exam_paper__status','20');
 
 create table exam_paper_log (
  mycent numeric(6,2) not null default '0'
 ,mycent_subjective numeric(6,2) not null default '0'
 ,mycent_objective numeric(6,2) not null default '0'
 ,count_right int not null default '0'
 ,count_wrong int not null default '0'
 ,count_giveup int not null default '0'
 ,proportion int not null default '0'
 ,paper_id int 
 ,rank int 
 ,id int primary key
 ,creater_code varchar(200) not null
 ,updater_code varchar(200) not null
 ,creater_group_code varchar(200) not null
 ,time_created timestamp 
 ,time_lastupdated timestamp 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
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
 
 create table exam_question (
  id_parent int 
 ,subject_code varchar(200) not null
 ,cent numeric(4,2) not null default '0'
 ,title text 
 ,option_length int 
 ,option_1 varchar(400) 
 ,option_2 varchar(400)
 ,option_3 varchar(400)
 ,option_4 varchar(400)
 ,option_5 varchar(400)
 ,option_6 varchar(400)
 ,option_7 varchar(400)
 ,answer varchar(200)
 ,description varchar(500)
 ,knowledge varchar(500)
 ,difficulty int
 ,path_listen varchar(200)
 ,path_img varchar(200)
 ,layout int
 ,paper_id int not null
 ,id int primary key
 ,creater_code varchar(200) not null
 ,updater_code varchar(200) not null
 ,creater_group_code varchar(200) not null
 ,time_created timestamp
 ,time_lastupdated timestamp
 ,count_updated int default '0'
 ,type int not null
 ,type2 int not null
 ,status int not null
 ,remark varchar(200)
 );
 
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
 
 create table exam_question_log (
  paper_log_id int 
 ,question_id int 
 ,myanswer varchar(500) 
 ,mycent numeric(4,2) 
 ,path_img varchar(200) 
 ,id int primary key
 );
 
 create table exam_question_log_wrongs (
  id int primary key
 ,question_id int not null
 ,paper_log_id int not null
 ,creater_code varchar(40) 
 ,time_created timestamp 
 ,type int not null
 ,status int not null
 );
 alter table exam_question_log_wrongs add constraint u__e_q_l_w unique ( question_id,creater_code );
 
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷','exam_question_log_wrongs__type','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷','exam_question_log_wrongs__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('10','练习卷模式','exam_question_log_wrongs__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','考卷未批改','exam_question_log_wrongs__status','20');
 insert into basic_parameter (code,value,reference,extend4) values ('40','考卷已批改','exam_question_log_wrongs__status','40');
 
 create table exam_paper_multionline (
  time_start timestamp not null
 ,time_stop timestamp not null
 ,passline int not null
 ,paper_id int not null
 ,count_total int not null
 ,count_giveup int 
 ,count_passed int 
 ,count_failed int 
 ,proportion int 
 ,id int primary key
 ,creater_code varchar(200) not null
 ,updater_code varchar(200) not null
 ,creater_group_code varchar(200) not null
 ,time_created timestamp 
 ,time_lastupdated timestamp 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 insert into basic_parameter (code,value,reference,extend4) values ('20','多人考卷','exam_paper_multionline__type','20');
 insert into basic_parameter (code,value,reference,extend4) values ('30','统考','exam_paper_multionline__type','30');
 insert into basic_parameter (code,value,reference,extend4) values ('10','正常','exam_paper_multionline__status','10');
 insert into basic_parameter (code,value,reference,extend4) values ('20','结束','exam_paper_multionline__status','20');
