/**
 * 用户模块,前端JS操作
 * 用户的 增删改查,用户组设置,密码修改,列表
 * 
 * @author wei1224hf@gmail.com
 * @license http://www.apache.org/licenses/LICENSE-2.0.html	APACHE2
 * @requires http://code.google.com/p/ligerui/ ligerui
 * @requires myApp.js mylib.js
 * */
var basic_user = {

	 loginData: {}
	,permission: []
	,config: null
	,loadConfig: function(afterAjax){
		$.ajax({
			url: config_path__basic_user__loadConfig
			,dataType: 'json'
	        ,type: "POST"
	        ,data: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
	        } 			
			,success : function(response) {
				basic_user.config = response;
				if ( typeof(afterAjax) == "string" ){
					eval(afterAjax);
				}else if( typeof(afterAjax) == "function"){
					afterAjax();
				}
			}
			,error : function(){				
				alert(top.il8n.disConnect);
			}
		});	
	}	

	/**
	 * 在页面前端提供一个登陆框跟注册框
	 * */
	,loginForm : function(){
		$(document.body).append('<form id="form"></form>');
		
		$("#form").ligerForm({
			inputWidth: 170, labelWidth: 90, space: 40,
			fields: [
			{ display: top.il8n.basic_user.username, name: "username",  type: "text",  validate : {required:true,minlength:3,maxlength:40} },
			{ display: top.il8n.basic_user.password, name: "password",  type: "password", validate : {required:true,minlength:3,maxlength:40} }
			]
		});
		$("#form").append('<br/><br/><br/><table style="width:280px"><tr><td style="width:50%"><!--input type="button" value="'+top.il8n.basic_user.register+'" name="reg" onclick="basic_user.add_register_win()" class="l-button l-button-submit" /--></td>'
				+'<td  style="width:50%"><input type="submit" value="'+top.il8n.basic_user.login+'" class="l-button l-button-submit" style="width:119px;" /></td></tr></table>' );
		
		var v = $("#form").validate({
			debug: true,
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-textarea")) {
				element.addClass("l-textarea-invalid");
				}
				else if (element.hasClass("l-text-field")) {
				element.parent().addClass("l-text-invalid");
				} 
			},
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-textarea")) {
					element.removeClass("l-textarea-invalid");
				} else if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			submitHandler: function () {
				basic_user.login($('#username').val(), MD5( MD5( $('#password').val() ) +((new Date()).getHours())) ,"top.desktop.loadIcons();top.$.ligerui.get('win_10').close();");
			}
		});
	}
	
	,login : function(username,password,afterAjax){
		if(this.ajaxState==true)return;
		this.ajaxState = true;

		$.ajax({
			url : config_path__basic_user__login,
			data : {
				username: username,
				password: password,
				executor: "",
				session: ""
			},
			type : "POST",
			dataType: 'json',
			success : function(data) {	
				
				basic_user.ajaxState = false;
				if(data.status!='2'){
					if(data.status=='3')alert(data.msg);
					top.basic_user.loginData = data.logindata;					
					top.basic_user.permission = data.permissions;					
					top.il8n = data.il8n;					

					SetCookie("myApp_username",username,0.5);
					SetCookie("myApp_password",password,0.5); 
					
					if ( typeof(afterAjax) == "string" ){
						eval(afterAjax);
					}else if( typeof(afterAjax) == "function"){
						afterAjax();
					}		
				}else{
					alert(data.msg);
					delCookie("myApp_username");
					delCookie("myApp_password");
				}
			},
			error : function(){
				$.ligerDialog.error('net error');
			}
		});
	}
	
	,updateSession: function(){
		$.ajax({
			url : config_path__basic_user__updateSession,
			data : {
				executor: top.basic_user.loginData.username,
				session: top.basic_user.loginData.session
			},
			type : "POST",
			dataType: 'json',	
			success : function(data) {
				top.basic_user.loginData.session = data.session;				
			},
			error : function(){
				$.ligerDialog.error('net error');
			}
		});
	}
	
	,add_register: function(){
		var config = {
				id: 'basic_user__add',
				fields: [
					 { display: top.il8n.basic_user.username, name: "basic_user__username", type: "text",  validate: { required:true, minlength:3, maxlength:10} }
					,{ display: top.il8n.basic_user.password, name: "basic_user__password", type: "password", validate: { required:true } }
				]
			};
			
		$(document.body).append("<form id='form'></form>");
		$('#form').ligerForm(config);			
		$('#form').append('<br/><br/><br/><br/><input type="submit" value="'+top.il8n.basic_normal.submit+'" id="basic_user__submit" class="l-button l-button-submit" />' );
		
		var v = $('#form').validate({
			debug: true,
			//JS前端验证错误
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-text-field")) {
					element.parent().addClass("l-text-invalid");
				} 
			},
			//JS前端验证通过
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_user.ajaxState)return;
				basic_user.ajaxState = true;
				
				$.ajax({
					url: config_path__basic_user__add_register,
					data: {		                
						data:$.ligerui.toJSON({
							 executor: $.ligerui.get('basic_user__username').getValue()
							,password: $.ligerui.get('basic_user__password').getValue()
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						if(response.status=="1"){
							basic_user.ajaxState = false;
							alert(response.msg);
							$("#basic_user__submit").remove();
						//服务端添加失败
						}else{
							basic_user.ajaxState = false;
							alert(response.msg);
						}
					},
					error : function(){
						alert('disConnect');
					}
				});	
			}
		});
	}
	
	/**
	 * 初始化页面列表
	 * 需要依赖一个空的 document.body 
	 * */
	,grid: function(){
		var config = {
				id: 'basic_user__grid'
				,height:'100%'
				,columns: [
				     { display: getIl8n("basic_user","id"), name: 'id', isSort: true, hide:true }
				    ,{ display: getIl8n("basic_user","username"), name: 'username', width:120 }
				    ,{ display: getIl8n("basic_user","money"), name: 'money' }
				    ,{ display: getIl8n("basic_user","credits"), name: 'credits', hide:true }
				    ,{ display: getIl8n("basic_user","time_created"), name: 'time_created', hide:true }
				    ,{ display: getIl8n("basic_user","type"), name: 'type', isSort: false, hide:true  }
				    ,{ display: getIl8n("basic_user","status"), name: 'status', isSort: false, hide:true  }
				    ,{ display: getIl8n("basic_user","type"), name: 'type_', isSort: false }
				    ,{ display: getIl8n("basic_user","status"), name: 'status_', isSort: false }				    
				    ,{ display: getIl8n("basic_user","group_name"), name: 'group_name', isSort: false, width:120 }
				    ,{ display: getIl8n("basic_user","group_code"), name: 'group_code', width:80 }				    
				],  pageSize:20 ,rownumbers:true
				,parms : {
	                executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session     
	                ,search: "{}"
				},
				url: config_path__basic_user__grid,
				method: "POST",				
				toolbar: { items: []}
		};
		
		//配置列表表头的按钮,根据当前用户的权限来初始化
		var permission = [];
		for(var i=0;i<top.basic_user.permission.length;i++){
			if(top.basic_user.permission[i].code=='12'){
				permission = top.basic_user.permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='1202'){
						permission = permission[j].children;
					}
				}				
			}
		}
		for(var i=0;i<permission.length;i++){
			if(permission[i].code=='120201'){
				config.toolbar.items.push({line: true });
				config.toolbar.items.push({
					text: permission[i].name , img:permission[i].icon , click : function(){
						basic_user.search();
					}
				});
			}else if(permission[i].code=='120223'){
				//若可以执行删除操作,则必定是多选批量删除,则列表右侧应该提供多选勾选框
				config.checkbox = true;
				config.toolbar.items.push({line: true });
				config.toolbar.items.push({
					text: permission[i].name , img:permission[i].icon , click : function(){
						basic_user.remove();
					}
				});
			}else if(permission[i].code=='120222'){
				//拥有 修改一个用户 的权限
				config.toolbar.items.push({line: true });
				config.toolbar.items.push({
					text: permission[i].name, img:permission[i].icon, click : function(){

						var selected = basic_user.grid_getSelectOne();
						top.$.ligerDialog.open({ 
							url: 'basic_user__modify.html?id='+selected.id+'&random='+Math.random()
							,height: 350
							,width: 400
							,title: selected.username
							,isHidden: false
							,id: 'basic_user__modify_'+selected.id
						});	
						
				        top.$.ligerui.get("basic_user__modify_"+selected.id).close = function(){
				            var g = this;
				            top.$.ligerui.win.removeTask(this);
				            g.unmask();
				            g._removeDialog();
				            top.$.ligerui.remove(top.$.ligerui.get("basic_user__modify_"+selected.id));
				        };
					}
				});
			}else if(permission[i].code=='120221'){
				//拥有 添加一个用户 的权限
				config.toolbar.items.push({line: true });
				config.toolbar.items.push({
					text: permission[i].name , img:permission[i].icon , click : function(){
						//basic_user.insert();
						top.$.ligerDialog.open({ 
							url: 'basic_user__add.html?random='+Math.random()
							,height: 400
							,width: 400
							,title: getIl8n("basic_user","add")
							,isHidden: false
							,id: "basic_user__add"
						});
						
				        top.$.ligerui.get("basic_user__add").close = function(){
				            var g = this;
				            top.$.ligerui.win.removeTask(this);
				            g.unmask();
				            g._removeDialog();
				            top.$.ligerui.remove(top.$.ligerui.get("basic_user__add"));
				        };						
					}
				});
			}else if(permission[i].code=='120202'){
				//查看用户信息
				config.toolbar.items.push({line: true });
				config.toolbar.items.push({
					text: permission[i].name , img:permission[i].icon , click : function(){
						var selected = basic_user.grid_getSelectOne();
                    	
                    	var id = selected.id;
                        if(top.$.ligerui.get("win_basic_user__view_"+id)){
                            top.$.ligerui.get("win_basic_user__view_"+id).show();
                            return;
                        }
                        top.$.ligerDialog.open({
                            isHidden:false,
                            id : "win_basic_user__view_"+id +"&random="+Math.random()
                            ,height: 500
                            ,width: 650
                            ,url: "basic_user__view.html?id="+id  
                            ,showMax: true
                            ,showToggle: true
                            ,showMin: true
                            ,isResize: true
                            ,modal: false
                            ,title: selected.username
                            ,slide: false    
                        });
                        
				        top.$.ligerui.get("win_basic_user__view_"+selected.id).close = function(){
				            var g = this;
				            top.$.ligerui.win.removeTask(this);
				            g.unmask();
				            g._removeDialog();
				            top.$.ligerui.remove(top.$.ligerui.get("win_basic_user__view_"+selected.id));
				        };
					}
				});
			} else if (permission[i].code == '120241') {
				//修改用户组
				config.toolbar.items.push({line: true });
				config.toolbar.items.push({
					text: permission[i].name , img:permission[i].icon , click : function(){
                    	var selected = basic_user.grid_getSelectOne();
						
						top.$.ligerDialog.open({ 
							 url: 'basic_user__group_get.html?username='+selected.username+'&random='+Math.random()
							,height: 400
							,width: 400
							,title: selected.username
							,isResize: true
							,isHidden: false
						});	
					}
				});
			}
		}
		
		$(document.body).ligerGrid(config);
	}
	
	,grid_getSelectOne: function(){
		var selected;
		if($.ligerui.get('basic_user__grid').options.checkbox){
			selected = $.ligerui.get('basic_user__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("basic_user","selectOne") );
				return;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('basic_user__grid').getSelected();
			if(selected==null){
				alert(getIl8n("basic_user","selectOne"));
				return;
			}
		}	
		return selected;
	}
	
	/**
	 * 用户中心
	 * 登陆用户可以看到自己的用户状态,可以看到的内容有:
	 *  用户名 姓名 用户状态 用户组(组织结构组) 金币 积分
	 *  头像
	 *  待办事务数量(点击后,可以直接处理待办事务)
	 *  最后一次登录时间
	 * 
	 * 可以执行的操作有
	 *  修改账号 充值 更换皮肤 退出系统
	 *  
	 * 其中的 待办事务数量 ,来自 basic_workflow 工作流模块
	 * 
	 * 是否需要考虑不同的用户组,可以看到不同的内容?
	 *  不需要
	 * */
	,center: function(){
		$(document.body).html("<div id='menu'></div><div id='content' style='width:"+($(window).width()-250)+"px;margin-top:5px;'></div>");
		var htmls = "";
		
		var data = top.basic_user.loginData;
		if(typeof(data.photo)=="undefined") data.photo = '../file/tavatar.gif';
		il8n_ = "basic_user";
    	for(var j in data){   
    		if(j=='session'||j=='status'||j=='type'||j=='group_code'||j=='group_all'||j=='id'||j=='session'||j=='client')continue;        		
			if(j=='photo'){
				htmls += '<div style="position:absolute;right:5px;top:25px;background-color: rgb(220,250,245);width:166px;height:176px;"><img style="margin:2px;" src="'+data[j]+'" width="160" height="170" /></div>'
				continue;
			}
    		
    		eval("var key = getIl8n('"+il8n_+"','"+j+"');");
    		if(j=='group_name'){
        		htmls += "<span class='view_lable' style='width:95%'>"+key+"</span><span style='width:95%' class='view_data'>"+data[j]+"</span>";
    		}else{
        		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
    		}    		
    		
    	}; 
    	$("#content").html(htmls);
        var permission = top.basic_user.permission;
       
        for(var i=0;i<permission.length;i++){
            if(permission[i].code=='11'){
            	if(typeof(permission[i].children)=='undefined')return;
                permission = permission[i].children;
                break;
            }
        }     
        
		var items = []; 
		for(var i=0;i<permission.length;i++){
			items.push({line:true});
			var config = {text:permission[i].name,img:permission[i].icon};
			if(permission[i].code == "1199"){
				//当前登录用户自己退出系统
				config.click = function(){
					top.basic_user.logout();
				};
			}else if(permission[i].code == "1123"){
				//当前登录用户修改自己信息
				config.click = function(){
	                top.$.ligerDialog.open({
	                    isHidden: false
	                    ,id: "win_user_modify_myself" 
	                    ,height: 200
	                    ,width: 400
	                    ,url: "basic_user__modify_myself.html"
	                    ,showMax: true
	                    ,showToggle: true
	                    ,showMin: true
	                    ,isResize: true
	                    ,modal: true
	                    ,slide: false    
	                    ,title: getIl8n('modify')
	                });
	                	
			        top.$.ligerui.get("win_user_modify_myself").close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("win_user_modify_myself"));
			        };	            
				};
			}
			items.push(config);
		}

		$("#menu").ligerToolBar({
			items: items
		});
	}	
	
	/**
	 * 退出 注销 系统
	 * 清掉浏览器端的 cookie 
	 * 然后向服务端传达退出指令,服务端再删除数据库session表中的内容
	 * */
	,logout: function(){
		
		delCookie("myApp_username");
		delCookie("myApp_password");
		$.ajax({
			url: config_path__basic_user__logout,
			dataType: "json",
			data : {
				executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			},
			type : "POST",
			success : function(msg) {
				top.window.location.reload();
			}
        });
	}
	
	/**
	 * 删除一个或多个用户
	 * 如果用户拥有 删除权限 
	 * 则前端列表必定是一个带 checkBox 的
	 * */
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		var selected = $.ligerui.get('basic_user__grid').getSelecteds();
		//如果一行都没有选中,就报错并退出函数
		if(selected.length==0){alert(top.getIl8n('noSelect'));return;}
		//弹框让用户最后确认一下,是否真的需要删除.一旦删除,数据将不可恢复
		if(confirm( top.getIl8n('sureToDelete') )){
			var usernames = "";
			//遍历每一行元素,获得 id 
			for(var i=0; i<selected.length; i++){
				usernames += selected[i].username+",";
			}
			usernames = usernames.substring(0,usernames.length-1);				
			
			$.ajax({
				url: config_path__basic_user__remove,
				data: {
					usernames: usernames 
					
					//服务端权限验证所需
	                ,executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=="1"){
						$.ligerui.get('basic_user__grid').loadData();
					}else{
						alert(response.msg);
					}
				},
				error : function(){
					//net error,则删除按钮再也不能点了
					alert(top.getIl8n('disConnect'));
				}
			});				
		}		
	}
	
	/**
	 * 添加一个用户
	 * 前端以表单的形式向后台提交数据,服务端AJAX解析入库,
	 * 服务端还会反馈一些数据,比如 用户编号 等
	 * */
	,add: function(){
		var config = {
			id: 'basic_user__add',
			fields: [
				 { display: top.getIl8n('basic_user','username'), name: "basic_user__username", type: "text",  validate: { required:true, minlength:3, maxlength:10} }
				,{ display: top.getIl8n('basic_user','password'), name: "basic_user__password", type: "password", validate: { required:true } }
				,{ display: top.getIl8n('basic_user','group'), name: "basic_user__group", type: "select", options :{data : basic_user.config.group, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }				
				, { display: top.getIl8n('type'), name: "basic_user__type", type: "select", options: { data: basic_user.config.basic_user__type, valueField: "code", textField: "value", slide: false }, validate: { required: true } }
				, { display: top.getIl8n('status'), name: "basic_user__status", type: "select", options: { data: basic_user.config.basic_user__status, valueField: "code", textField: "value", slide: false }, validate: { required: true } }
			]
		};
		
		$(document.body).append("<form id='form'></form>");
		$('#form').ligerForm(config);			
		$('#form').append('<br/><br/><br/><br/><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_user__submit" class="l-button l-button-submit" />' );
		
		var v = $('#form').validate({
			debug: true,
			//JS前端验证错误
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-text-field")) {
					element.parent().addClass("l-text-invalid");
				} 
			},
			//JS前端验证通过
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_user.ajaxState)return;
				basic_user.ajaxState = true;
				$("#basic_user__submit").attr("value",top.getIl8n('basic_user','waitting'));
				
				$.ajax({
					url: config_path__basic_user__add,
					data: {
		                 executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session
		                
						,data:$.ligerui.toJSON({
							 username: $.ligerui.get('basic_user__username').getValue()
							,password: MD5($.ligerui.get('basic_user__password').getValue())
							,group_code: $.ligerui.get('basic_user__group').getValue()
							,group_all: $.ligerui.get('basic_user__group').getValue()
							,type: $.ligerui.get('basic_user__type').getValue()
							,status: $.ligerui.get('basic_user__status').getValue()
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						if(response.status=="1"){
							basic_user.ajaxState = false;
							alert(top.getIl8n('done'));
							$("#basic_user__submit").remove();
						//服务端添加失败
						}else{
							alert(response.msg);
							basic_user.ajaxState = false;
							$("#basic_user__submit").attr("value", top.getIl8n('submit') );
						}
					},
					error : function(){
						alert(top.il8n.disConnect);
					}
				});	
			}
		});
	}
	
	,add_register_win: function(){
        top.$.ligerDialog.open({
            isHidden: false
            ,id: "win_user__add_register_win" 
            ,height: 200
            ,width: 400
            ,url: "basic_user__add_register.html"
            ,showMax: true
            ,showToggle: true
            ,showMin: true
            ,isResize: true
            ,modal: true
            ,slide: false    
            ,title: getIl8n('register')
        });
        
        top.$.ligerui.get('win_user__add_register_win').close = function(){
            var g = this;
            top.$.ligerui.win.removeTask(this);
            g.unmask();
            g._removeDialog();
            top.$.ligerui.remove(top.$.ligerui.get('win_user__add_register_win'));
        };
	}
	
	//AJAX 通信状态,如果为TRUE,则表示服务端还在通信中	
	,ajaxState: false 	
	,modify: function(){

		//从服务端读取信息,填充表单内容
		$.ajax({
			url: config_path__basic_user__view
			,data: {
				id: getParameter("id", window.location.toString() )
				
				//服务端权限验证所需
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			}
			,type: "POST"
			,dataType: 'json'						
			,success: function(response) {	
			    var data = response.data;
				$.ligerui.get('basic_user__username').setValue(data.username);				
				$.ligerui.get('basic_user__type').setValue(data.type);
				$.ligerui.get('basic_user__money').setValue(data.money);
				$.ligerui.get('basic_user__group').setValue(data.group_code);				
				$.ligerui.get('basic_user__status').setValue(data.status);			
				
				$.ligerui.get('basic_user__type').setDisabled();
				$.ligerui.get('basic_user__username').setDisabled();
			}
		});
			
		var config = {
				id: 'basic_user__add',
				fields: [
					 { display: top.getIl8n('basic_user','username'), name: "basic_user__username", type: "text",  validate: { required:true, minlength:3, maxlength:10} }
					,{ display: top.getIl8n('basic_user','password'), name: "basic_user__password", type: "password", validate: { minlength:3, maxlength:10 } }
					,{ display: top.getIl8n('basic_user','money'), name: "basic_user__money", type: "text", validate: { required:true } }
					,{ display: top.getIl8n('basic_user','group'), name: "basic_user__group", type: "select", options :{data : basic_user.config.group, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }				
					, { display: top.getIl8n('type'), name: "basic_user__type", type: "select", options: { data: basic_user.config.basic_user__type, valueField: "code", textField: "value", slide: false }, validate: { required: true } }
					, { display: top.getIl8n('status'), name: "basic_user__status", type: "select", options: { data: basic_user.config.basic_user__status, valueField: "code", textField: "value", slide: false }, validate: { required: true } }
				]
			};
			
		$(document.body).append("<form id='form'></form>");
		$('#form').ligerForm(config);			
		$('#form').append('<br/><br/><br/><br/><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_user__submit" class="l-button l-button-submit" />' );
		
		var v = $('#form').validate({
			debug: true,
			//JS前端验证错误
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-text-field")) {
					element.parent().addClass("l-text-invalid");
				} 
			},
			//JS前端验证通过
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_user.ajaxState)return;
				basic_user.ajaxState = true;
				$("#basic_user__submit").attr("value",top.getIl8n('basic_user','waitting'));
				
				var data = {
						 username: $.ligerui.get('basic_user__username').getValue()
							,password: MD5($.ligerui.get('basic_user__password').getValue())
							,money: $.ligerui.get('basic_user__money').getValue()
							,group_code: $.ligerui.get('basic_user__group').getValue()
							,status: $.ligerui.get('basic_user__status').getValue()
						};
				if($.ligerui.get('basic_user__password').getValue()!=null){
					data.password = MD5($.ligerui.get('basic_user__password').getValue());
				}
				
				$.ajax({
					url: config_path__basic_user__modify,
					data: {
		                 executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session
		                
						,data:$.ligerui.toJSON(data)
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						if(response.status=="1"){
							basic_user.ajaxState = false;
							alert( top.getIl8n('basic_user','done') );
							$("#basic_user__submit").remove();
						//服务端添加失败
						}else{
							basic_user.ajaxState = false;
							$("#basic_user__submit").attr("value",top.getIl8n('basic_user','submit'));
							alert(response.msg);
						}
					},
					error : function(){
						alert( top.getIl8n('basic_user','disConnect') );
					}
				});	
			}
		});
	}	
	
	/**
	 * 当前登录用户修改自己的个人信息
	 * */
	,modify_myself: function(){
		var config = {
			 id: 'basic_user__addForm'
			,fields: [
				 { display: top.il8n.basic_user.username, name: "basic_user__username", type: "text", options:{ disabled: true, value: top.basic_user.loginData.username } }
				,{ display: top.il8n.basic_user.password_old, name: "basic_user__password_old", type: "password", validate: { required:true } }
				,{ display: top.il8n.basic_user.password, name: "basic_user__password", type: "password", validate: { required:true } }
			]
		};
		
		$(document.body).append("<form id='form'></form>");
		$('#form').ligerForm(config);			
		$('#form').append('<br/><br/><br/><br/><table style="width:80%"><tr><td style="width:25%"><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_user__submit" class="l-button l-button-submit" /></td></tr></table>' );
	
		var v = $('#form').validate({
			debug: true,
			//JS前端验证错误
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-text-field")) {
					element.parent().addClass("l-text-invalid");
				} 
			},
			//JS前端验证通过
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_user.ajaxState)return;
				basic_user.ajaxState = true;
				$("#basic_user__submit").attr("value",top.getIl8n('basic_user','waitting'));
				$.ajax({
					url: config_path__basic_user__modify_myself,
					data: {						
						executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session
		                
						,data:$.ligerui.toJSON({
							 password_old: MD5($.ligerui.get('basic_user__password_old').getValue())
							,password: MD5($.ligerui.get('basic_user__password').getValue())		
						})                
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						basic_user.ajaxState = false;
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						if(response.status=="1"){
							alert(top.getIl8n('done'));
							$("#basic_user__submit").remove();
						//服务端添加失败
						}else{
							$("#basic_user__submit").attr("value",top.getIl8n('submit'));
							alert(top.getIl8n('faild'));
						}
					},
					error : function(){
						alert(top.getIl8n('disConnect'));
					}
				});	
			}
		});	
	}
	
	//页面列表ligerUI控件	
	,searchOptions: {}	
	/**
	 * 与表格功能对应的 查询条件 
	 * 
	 * 查询条件有 用户名关键字,状态,类型,金币,用户组关键字
	 * */
	,search: function(){
		var formD;
		if($.ligerui.get("formD")){
			formD = $.ligerui.get("formD");
			formD.show();
		}else{
			var form = $("<form id='form'></form>");
			$(form).ligerForm({
				inputWidth: 170
				,labelWidth: 90
				,space: 40
				,fields: [
					 { display: top.getIl8n('basic_user','username'), name: "basic_user__search_username", newline: false, type: "text" }
					,{ display: top.getIl8n('basic_user','type'), name: "basic_user__search_type", newline: true, type: "select", options :{data : basic_user.config.basic_user__type, valueField : "code" , textField: "value" } }
					,{ display: top.getIl8n('basic_user','status'), name: "basic_user__search_status", newline: true, type: "select", options :{data : basic_user.config.basic_user__status, valueField : "code" , textField: "value" } }
					,{ display: top.getIl8n('basic_user','group_code'), name: "basic_user__search_group_code", newline: true, type: "text" }
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('basic_user','search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('basic_user','clear'), onclick:function(){
						$.ligerui.get("basic_user__grid").options.parms.search = "{}";
						$.ligerui.get("basic_user__grid").loadData();
						
						$.ligerui.get("basic_user__search_username").setValue('');
						$.ligerui.get("basic_user__search_type").setValue('');
						$.ligerui.get("basic_user__search_status").setValue('');
						$.ligerui.get("basic_user__search_group_code").setValue('');
					}},
					//提交查询条件
				    {text: top.getIl8n('basic_user','search'), onclick:function(){
						var data = {};
						var  username =		$.ligerui.get("basic_user__search_username").getValue()
						 	,type = 		$.ligerui.get("basic_user__search_type").getValue()
						 	,status = 		$.ligerui.get("basic_user__search_status").getValue()
						 	,group_code = 	$.ligerui.get("basic_user__search_group_code").getValue();
						
						if(username!="")data.username = username;
						if(type!="")data.type = type;
						if(status!="")data.status = status;
						if(group_code!="")data.group_code = group_code;
						
						$.ligerui.get("basic_user__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("basic_user__grid").loadData();
				}}]
			});
		}
	}
	
	/**
	 * 查看一个用户信息
	 * */
	,view: function(){
		var id = getParameter("id", window.location.toString() );
    	$(document.body).html("<div id='menu'  ></div><div id='content' style='width:"+($(window).width()-170)+"px;margin-top:5px;'></div>");
    	var htmls = "";
    	$.ajax({
            url: config_path__basic_user__view+"&rand="+Math.random()
            ,data: {
                id: id 
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            },
            type: "POST",
            dataType: 'json',
            success: function(response) {
            	if(response.status!="1")return;
            	var data = response.data;
            	if(typeof(data.photo)=="undefined") data.photo = '../file/tavatar.gif';
            	for(var j in data){   
            		if(j=='sql')continue;
            		if(j=='photo'){
        				htmls += '<div style="position:absolute;right:5px;top:25px;background-color: rgb(220,250,245);width:166px;height:176px;"><img style="margin:2px;" src="'+data[j]+'" width="160" height="170" /></div>'
        				continue;
            		}
            		if(j=='id'||j=='remark'||j=='birthday')htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";            		
            		if(j=='gender'||j=='degree_school'||j=='birthday'||j=='address'||j=='ismarried'||j=='degree'||j=='politically'){
	            		eval("var key = getIl8n('basic_person','"+j+"');");
	            		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		}if(j=='remark'||j=='session'||j=='client'){
	            		eval("var key = getIl8n('basic_user','"+j+"');");
	            		htmls += "<span class='view_lable' style='width:95%'>"+key+"</span><span style='width:95%' class='view_data'>"+data[j]+"</span>";
            		}else{
            			eval("var key = getIl8n('basic_user','"+j+"');");
                		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		}
            	}; 
            	
            	$("#content").html(htmls);
            	            	
            	//查看详细,页面上也有按钮的
            	var items = [];            	//TODO
                var permission = top.basic_user.permission;
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='12'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }      
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='1202'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }   
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='120202'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }            
                
                for(var i=0;i<permission.length;i++){       
                	var theFunction = function(){};
                    if(permission[i].code=='12020203'){
                    	//权限
                    	theFunction = function(){
                                
                        };
                    }else if(permission[i].code=='12020223'){
                    	//删除
                    	theFunction = function(){
                    		if(!confirm( top.getIl8n('sureToDelete') ))return;
                    		
                			$.ajax({
                				url: config_path__basic_user__remove,
                				data: {
                					usernames: data.username
                					
                	                ,executor: top.basic_user.loginData.username
                	                ,session: top.basic_user.loginData.session
                				}
                				,type: "POST"
                				,dataType: 'json'
                				,success: function(response) {                					
            						alert(response.msg);
                				},
                				error : function(){
                					alert(top.getIl8n('disConnect'));
                				}
                			});	
                        };
                    }else if(permission[i].code=='12020222'){
                    	//修改
                    	theFunction = function(){
    						top.$.ligerDialog.open({ 
    							url: 'basic_user__modify.html?id='+data.id+'&random='+Math.random()
    							,height: 350
    							,width: 400
    							,title: data.username
    							,isHidden: false
    							,id: 'basic_user__modify_'+data.id
    						});	
    						
    				        top.$.ligerui.get("basic_user__modify_"+data.id).close = function(){
    				            var g = this;
    				            top.$.ligerui.win.removeTask(this);
    				            g.unmask();
    				            g._removeDialog();
    				            top.$.ligerui.remove(top.$.ligerui.get("basic_user__modify_"+data.id));
    				        };
                        };
                    }
                    
                    items.push({line: true });	
					items.push({text: permission[i].name , img:permission[i].icon , click : theFunction});                    
                }                

            	$("#menu").ligerToolBar({
            		items:items
            	});

            },
            error : function(){               
                alert(top.il8n.disConnect);
            }
        });
	}
	
	,group_get: function(){
		$(document.body).append('<ul id="tree"></ul>');
		$('#tree').ligerTree({
			 id: 'basic_user___group_get'
			,autoCheckboxEven : false
			//先随便填充一个tree结构,tree的内容需要等tree初始化后异步填充
			,data: [
	                { name: "test" , code: '1' },
	                { name: "test2" , code: '2' }
	            ]
			,textFieldName : 'name'
			,slide : true
			,idFieldName : 'code_'
			,nodeWidth : 140
		});
		
		//清掉树形结构中的节点,然后异步读取服务端数据,再填充树形节点
		$.ligerui.get('basic_user___group_get').clear();

		$.ajax({
		    url: config_path__basic_user__group_get,
		    data: {
		        executor: top.basic_user.loginData.username
				, session: top.basic_user.loginData.session
				, username: getParameter("username", window.location.toString())
		    },
		    type: "POST",
		    dataType: 'json',
		    success: function (response) {
		        $.ligerui.get('basic_user___group_get').setData(response.groups);
		    },
		    error: function () {
		        //网络通信失败,按钮将不可按,只能关闭窗口
		        alert(top.getIl8n('disConnect'));
		    }
		});
		
		$(document.body).append('<input type="button" onclick="basic_user.group_set()" value="'+top.getIl8n('modify')+'" id="button" class="l-button l-button-submit" style="position:absolute;top:5px;left:200px;"  />' );
	}
	
	,group_set: function(){
		//如果正在与服务端的通信
		if(basic_user.ajaxState)return;							
		
		var arr = $.ligerui.get('basic_user___group_get').getChecked();
		var codes = "";
		if(arr.length != 0){
			for(var i=0;i<arr.length;i++){
				codes += arr[i].data.code_+",";
			}
			codes = codes.substring(0,codes.length-1);
		
			//修改AJAX的通信状态
			$('#button').attr("value",top.getIl8n('waitting'));
			basic_user.ajaxState = true;
		}else{
			alert(top.getIl8n('selectOne'));
			return;
		}
		
		$.ajax({
			url: config_path__basic_user__group_set,
			data: {
				group_codes: codes 
				,username: getParameter("username", window.location.toString() )
				
				//服务端权限验证所需
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			},
			type: "POST",
			dataType: 'json',
			success: function(response) {
				//修改成功,就不能再继续执行修改操作了,必须先关闭窗口,再打开
				$('#button').remove();
				basic_user.ajaxState = false;
				if(response.status!="1"){					
					//如果服务端操作失败,弹框显示服务端提示信息
					alert(response.msg);
				}else{
					//服务端操作成功
					alert(top.getIl8n('done'));
				}
			},
			error : function(){
				//网络通信失败,按钮将不可按,只能关闭窗口
				alert(top.getIl8n('disConnect'));
			}
		});
	}
};