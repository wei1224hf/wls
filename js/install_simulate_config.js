var server_path = "../php/install.php";
var language = {
		"zh-CN":{
			 "step":"步骤"
			,"steps":
				[
				  " "
				 ,"检查系统环境,包括:检查 服务端语言版本,检查关键服务端参数是否准确,检查核心文件及文件夹的执行权限"
				 ,"配置安装模式,数据库连接参数"
				 ,"初始化数据库表"
				 ,"初始化 权限,用户组,管理员帐号 等基础数据"
				 ,"<br/>已成功安装系统,直接登录系统首页: <a href='../html/layout_desktop.html' target='_blank'>首页</a> 帐号密码都是 admin,<br/><br/>如果是初次接触此系统,建议先 <a href='../html/simulate.html' target='_blank'>模拟一下业务数据 ,以体验更为全面的性能 </a> "
				 ]
			 ,"database":{
		          "name":"数据库名称"
		         ,"port":"端口"
		         ,"username":"帐号"
		         ,"password_":"密码"
		         ,"host":"域名"
		         ,"mode":"安装模式"
		         ,"type":"数据库类型"
			 }
		}
		,"en":{
			 "step":"Step"
			,"steps":
				[
				  " "
				 ,"Check the system's environment, including: <br/>" +
				 		"<br/> Check the version of the server-side language. " +
				 		"<br/> Check the accuracy of server's key parameters " +
				 		"<br/> Check the permissions of the core-files and core-folders"
				 ,"Set the System Mode and the Database connection information"
				 ,"Initialize database's tables"
				 ,"Initialize system's required data"
				 ,"<br/>Initialize compulated, You may login the system by: <a href='../html/layout_desktop.html' target='_blank'>首页</a> 帐号密码都是 admin,<br/><br/>Or , if you are new to the system , you may t <a href='../html/simulate.html' target='_blank'>simulate a large data for the system first </a> "
				 ]
			 ,"database":{
		          "name":"Name"
		         ,"port":"Port"
		         ,"username":"Username"
		         ,"password_":"Password"
		         ,"host":"Host"
		         ,"mode":"Install Mode"
		         ,"type":"Database Type"
			 }
		}
	};