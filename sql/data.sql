insert into basic_user(id,username,password,group_code,type,status,money,credits) values (
					'2'
					,'admin'
					,'21232f297a57a5a743894a0e4a801fc3'
					,'10'
					,'10'
					,'10'
					,'10000'
					,'10000'									
			);
 insert into basic_group_2_user(user_code,group_code) values ('admin','10')
 insert into basic_user(id,username,password,group_code,type,status,money,credits) values (
					'3'
					,'guest'
					,'084e0343a0486ff05530df6c705c8bb4'
					,'99'
					,'10'
					,'10'
					,'10000'
					,'10000'									
			);
 insert into basic_group_2_user(user_code,group_code) values ('guest','99')
 insert into basic_user(id,username,password,group_code,type,status,money,credits) values (
					'4'
					,'student1'
					,'96e79218965eb72c92a549dd5a330112'
					,'50'
					,'20'
					,'10'
					,'10000'
					,'10000'									
			);
 insert into basic_group_2_user(user_code,group_code) values ('student1','50')
 insert into basic_user(id,username,password,group_code,type,status,money,credits) values (
					'5'
					,'student2'
					,'96e79218965eb72c92a549dd5a330112'
					,'50'
					,'20'
					,'10'
					,'10000'
					,'10000'									
			);
 insert into basic_group_2_user(user_code,group_code) values ('student2','50')
 insert into basic_user(id,username,password,group_code,type,status,money,credits) values (
					'6'
					,'teacher1'
					,'96e79218965eb72c92a549dd5a330112'
					,'51'
					,'30'
					,'10'
					,'10000'
					,'10000'									
			);
 insert into basic_group_2_user(user_code,group_code) values ('teacher1','51')
 insert into basic_user(id,username,password,group_code,type,status,money,credits) values (
					'7'
					,'teacher2'
					,'96e79218965eb72c92a549dd5a330112'
					,'51'
					,'30'
					,'10'
					,'10000'
					,'10000'									
			);
 insert into basic_group_2_user(user_code,group_code) values ('teacher2','51')
 insert into basic_group(id,name,code,type,status) values ('2','管理员','10','10','10');
 insert into basic_group(id,name,code,type,status) values ('3','注册待审批','98','10','10');
 insert into basic_group(id,name,code,type,status) values ('4','访客','99','10','10');
 insert into basic_group(id,name,code,type,status) values ('5','组管理员','X1','50','10');
 insert into basic_group(id,name,code,type,status) values ('6','默认学生组','50','30','10');
 insert into basic_group(id,name,code,type,status) values ('7','默认教师组','51','30','10');
 insert into basic_permission(name,code,type,icon,path) values ('登陆','10','20','../file/icon48x48/10.png','basic_user__login.html');
 insert into basic_permission(name,code,type,icon,path) values ('注册','13','20','../file/icon48x48/13.png','basic_user__register.html');
 insert into basic_permission(name,code,type,icon,path) values ('用户中心','11','20','../file/icon48x48/11.png','basic_user__center.html');
 insert into basic_permission(name,code,type,icon,path) values ('修改','1123','30','../file/icon16x16/23.png','');
 insert into basic_permission(name,code,type,icon,path) values ('退出','1199','30','../file/icon16x16/99.png','');
 insert into basic_permission(name,code,type,icon,path) values ('管理中心','12','10','../file/icon48x48/12.png','');
 insert into basic_permission(name,code,type,icon,path) values ('用户组','1201','20','../file/icon48x48/1201.png','basic_group__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','120101','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('添加','120121','30','../file/icon16x16/21.png','');
 insert into basic_permission(name,code,type,icon,path) values ('修改','120122','30','../file/icon16x16/22.png','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','120123','30','../file/icon16x16/23.png','');
 insert into basic_permission(name,code,type,icon,path) values ('权限','120140','30','../file/icon16x16/40.png','');
 insert into basic_permission(name,code,type,icon,path) values ('用户列表','1202','20','../file/icon48x48/1202.png','basic_user__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','120201','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('详细','120202','30','../file/icon16x16/02.png','');
 insert into basic_permission(name,code,type,icon,path) values ('权限','12020203','30','../file/icon16x16/03.png','');
 insert into basic_permission(name,code,type,icon,path) values ('导入','120211','30','../file/icon16x16/11.png','');
 insert into basic_permission(name,code,type,icon,path) values ('导出','120212','30','../file/icon16x16/12.png','');
 insert into basic_permission(name,code,type,icon,path) values ('添加','120221','30','../file/icon16x16/21.png','');
 insert into basic_permission(name,code,type,icon,path) values ('修改','120222','30','../file/icon16x16/22.png','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','120223','30','../file/icon16x16/23.png','');
 insert into basic_permission(name,code,type,icon,path) values ('职能','120241','30','../file/icon16x16/41.png','');
 insert into basic_permission(name,code,type,icon,path) values ('参数','1203','20','../file/icon48x48/1203.png','basic_parameter__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','120301','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('添加','120321','30','../file/icon16x16/21.png','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','120323','30','../file/icon16x16/23.png','');
 insert into basic_permission(name,code,type,icon,path) values ('重置内存','120342','30','../file/icon16x16/42.png','');
 insert into basic_permission(name,code,type,icon,path) values ('考试学习','60','10','../file/icon48x48/60.png','');
 insert into basic_permission(name,code,type,icon,path) values ('练习册','6001','20','../file/icon48x48/6001.png','exam_paper__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','600101','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('组内范围','60010101','40','../file/icon48x48/60010101.png','');
 insert into basic_permission(name,code,type,icon,path) values ('所有范围','60010102','40','../file/icon48x48/60010102.png','');
 insert into basic_permission(name,code,type,icon,path) values ('本人范围','60010103','40','../file/icon48x48/60010103.png','');
 insert into basic_permission(name,code,type,icon,path) values ('组条件','60010104','40','../file/icon48x48/60010104.png','');
 insert into basic_permission(name,code,type,icon,path) values ('作者条件','60010105','40','../file/icon48x48/60010105.png','');
 insert into basic_permission(name,code,type,icon,path) values ('创作日期条件','60010106','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('类型条件','60010107','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('状态条件','60010108','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('编码条件','60010109','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('名称条件','60010110','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('费用条件','60010150','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('使用次数条件','60010151','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('科目条件','60010152','40','','');
 insert into basic_permission(name,code,type,icon,path) values ('详细','600102','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('作者','60010233','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('作者组','60010232','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('导入','600111','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('导出','600112','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','600123','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('练习','600190','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('多人考试','6002','20','','exam_paper_multionline__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','600201','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('详细','600202','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('作者','60020233','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('作者组','60020232','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('排名','60020240','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('作废','6002024023','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('导出','6002024012','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('导入','600211','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('导出','600212','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('修改','600222','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','600223','30','','');
 insert into basic_permission(name,code,type,icon,path) values ('截止','600290','30','../file/icon16x16/90.png','');
 insert into basic_permission(name,code,type,icon,path) values ('考试','600291','30','../file/icon16x16/91.png','');
 insert into basic_permission(name,code,type,icon,path) values ('做题记录','6003','20','../file/icon48x48/6003.png','exam_paper_log__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','600301','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('详细','600302','30','../file/icon16x16/02.png','');
 insert into basic_permission(name,code,type,icon,path) values ('批改','600391','30','../file/icon16x16/91.png','');
 insert into basic_permission(name,code,type,icon,path) values ('统计','600392','30','../file/icon16x16/92.png','');
 insert into basic_permission(name,code,type,icon,path) values ('错题本','6004','20','../file/icon48x48/6004.png','exam_question_log_wrongs__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','600401','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','600423','30','../file/icon16x16/23.png','');
 insert into basic_permission(name,code,type,icon,path) values ('复习','600491','30','../file/icon16x16/91.png','');
 insert into basic_permission(name,code,type,icon,path) values ('科目','6005','20','../file/icon48x48/6005.png','exam_subject__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','600501','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('详细','600502','30','../file/icon16x16/02.png','');
 insert into basic_permission(name,code,type,icon,path) values ('添加','600521','30','../file/icon16x16/21.png','');
 insert into basic_permission(name,code,type,icon,path) values ('修改','600522','30','../file/icon16x16/22.png','');
 insert into basic_permission(name,code,type,icon,path) values ('分配','600591','30','../file/icon16x16/91.png','');
 insert into basic_permission(name,code,type,icon,path) values ('删除','600523','30','../file/icon16x16/23.png','');
 insert into basic_permission(name,code,type,icon,path) values ('科目掌握度记录','6006','20','../file/icon48x48/6006.png','exam_subject_2_user_log__grid.html');
 insert into basic_permission(name,code,type,icon,path) values ('查询','600601','30','../file/icon16x16/01.png','');
 insert into basic_permission(name,code,type,icon,path) values ('统计','600692','30','../file/icon16x16/92.png','');
 insert into basic_permission(name,code,type,icon,path) values ('导出','600612','30','../file/icon16x16/12.png','');
 insert into basic_permission(name,code,type,icon,path) values ('关于本系统','99','20','../file/icon48x48/99.png','about.html');
 insert into basic_group_2_permission (permission_code,group_code) values('10','99');
 insert into basic_group_2_permission (permission_code,group_code) values('13','99');
 insert into basic_group_2_permission (permission_code,group_code) values('11','10');
 insert into basic_group_2_permission (permission_code,group_code) values('11','50');
 insert into basic_group_2_permission (permission_code,group_code) values('11','51');
 insert into basic_group_2_permission (permission_code,group_code) values('1123','10');
 insert into basic_group_2_permission (permission_code,group_code) values('1123','50');
 insert into basic_group_2_permission (permission_code,group_code) values('1123','51');
 insert into basic_group_2_permission (permission_code,group_code) values('1199','10');
 insert into basic_group_2_permission (permission_code,group_code) values('1199','50');
 insert into basic_group_2_permission (permission_code,group_code) values('1199','51');
 insert into basic_group_2_permission (permission_code,group_code) values('12','10');
 insert into basic_group_2_permission (permission_code,group_code) values('1201','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120101','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120121','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120122','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120123','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120140','10');
 insert into basic_group_2_permission (permission_code,group_code) values('1202','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120201','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120202','10');
 insert into basic_group_2_permission (permission_code,group_code) values('12020203','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120211','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120212','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120221','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120222','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120223','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120241','10');
 insert into basic_group_2_permission (permission_code,group_code) values('1203','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120301','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120321','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120323','10');
 insert into basic_group_2_permission (permission_code,group_code) values('120342','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60','50');
 insert into basic_group_2_permission (permission_code,group_code) values('60','51');
 insert into basic_group_2_permission (permission_code,group_code) values('6001','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6001','50');
 insert into basic_group_2_permission (permission_code,group_code) values('6001','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600101','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600101','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600101','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010101','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010101','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010102','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010102','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010103','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010103','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010104','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010104','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010105','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010105','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010106','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010106','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010107','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010107','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010108','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010108','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010109','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010109','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010110','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010110','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010150','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010150','50');
 insert into basic_group_2_permission (permission_code,group_code) values('60010150','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010151','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010151','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010152','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010152','50');
 insert into basic_group_2_permission (permission_code,group_code) values('60010152','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600102','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600102','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600102','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010233','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010233','50');
 insert into basic_group_2_permission (permission_code,group_code) values('60010233','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60010232','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60010232','50');
 insert into basic_group_2_permission (permission_code,group_code) values('60010232','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600111','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600111','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600112','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600112','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600123','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600123','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600190','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600190','50');
 insert into basic_group_2_permission (permission_code,group_code) values('6002','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6002','50');
 insert into basic_group_2_permission (permission_code,group_code) values('6002','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600201','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600201','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600201','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600202','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600202','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600202','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60020233','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60020233','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60020232','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60020232','51');
 insert into basic_group_2_permission (permission_code,group_code) values('60020240','10');
 insert into basic_group_2_permission (permission_code,group_code) values('60020240','51');
 insert into basic_group_2_permission (permission_code,group_code) values('6002024023','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6002024023','51');
 insert into basic_group_2_permission (permission_code,group_code) values('6002024012','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6002024012','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600211','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600211','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600212','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600212','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600222','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600222','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600223','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600223','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600290','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600290','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600291','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600291','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600292','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600292','51');
 insert into basic_group_2_permission (permission_code,group_code) values('6003','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6003','50');
 insert into basic_group_2_permission (permission_code,group_code) values('6003','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600301','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600301','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600301','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600302','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600302','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600302','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600391','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600391','51');
 insert into basic_group_2_permission (permission_code,group_code) values('600392','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600392','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600392','51');
 insert into basic_group_2_permission (permission_code,group_code) values('6004','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6004','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600401','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600401','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600423','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600423','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600491','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600491','50');
 insert into basic_group_2_permission (permission_code,group_code) values('6005','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600501','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600502','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600521','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600522','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600591','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600523','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6006','10');
 insert into basic_group_2_permission (permission_code,group_code) values('6006','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600601','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600601','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600692','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600692','50');
 insert into basic_group_2_permission (permission_code,group_code) values('600612','10');
 insert into basic_group_2_permission (permission_code,group_code) values('600612','50');
 insert into basic_group_2_permission (permission_code,group_code) values('99','10');
 insert into basic_group_2_permission (permission_code,group_code) values('99','99');
