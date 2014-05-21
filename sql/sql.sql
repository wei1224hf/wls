create table basic_parameter (
 code varchar(20) not null
 ,value varchar(200)
 ,reference varchar(60) not null
 ,extend1 int
 ,extend2 int
 ,extend3 int
 ,extend4 varchar(200)
 ,extend5 varchar(200)
 ,extend6 varchar(200)
 ,id int primary key
 );
 alter table basic_parameter add constraint pk__b_p unique ( code,reference );
 
 create table basic_user (
 username varchar(200) not null unique
 ,nickname varchar(200)
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
 ,govern_zone varchar(200)
 );
 
 
 create table basic_user_session (
 user_id int unique
 ,user_code varchar(200) unique
 ,group_code varchar(200)
 ,zone varchar(200)
 ,user_type varchar(200)
 ,permissions varchar(6000)
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
 ,upcode varchar(200)
 ,code varchar(200) unique
 ,id int primary key
 ,count_users int
 ,type varchar(20)
 ,status int
 ,remark text
 ,chief_id int
 );
 
 
 create table basic_group_2_user (
 user_code varchar(40) not null
 ,group_code varchar(40) not null
 );
 alter table basic_group_2_user add constraint pk__b_g_2_u primary key ( user_code,group_code );
 
 create table basic_permission (
 name varchar(20)
 ,type int
 ,code varchar(20) unique
 ,icon varchar(200)
 ,path varchar(200)
 ,remark varchar(200)
 ,status int default '0'
 );
 
 
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
 ,type int not null
 );
 
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
 ,time_created datetime 
 ,time_lastupdated datetime 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 
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
 ,time_created datetime 
 ,time_lastupdated datetime 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 
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
 ,time_created datetime 
 ,time_lastupdated datetime 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
 
 
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
 ,time_created datetime 
 ,time_lastupdated datetime 
 ,count_updated int default '0'
 ,type int default '10'
 ,type2 int 
 ,status int default '10'
 ,remark varchar(200) 
 );
 
 
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
 ,time_created datetime 
 ,type int not null
 ,status int not null
 );
 alter table exam_question_log_wrongs add constraint u__e_q_l_w unique ( question_id,creater_code );
 
 
 create table exam_paper_multionline (
  time_start datetime not null
 ,time_stop datetime not null
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
 ,time_created datetime 
 ,time_lastupdated datetime 
 ,count_updated int default '0'
 ,type int not null
 ,status int not null
 ,remark varchar(200) 
 );
