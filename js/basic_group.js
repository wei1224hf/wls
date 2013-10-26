var basic_group = {
	
	version: "2012X1"
	
	,config: null
	,loadConfig: function(afterAjax){
		$.ajax({
			url: config_path__basic_group__loadConfig
			,dataType: 'json'
	        ,type: "POST"
	        ,data: {
                executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
	        } 			
			,success : function(response) {
				basic_group.config = response;
				if ( typeof(afterAjax) == "string" ){
					eval(afterAjax);
				}else if( typeof(afterAjax) == "function"){
					afterAjax();
				}
			}
			,error : function(){				
				alert(top.getIl8n('disConnect'));
			}
		});	
	}	
	
	,grid: function(){		
		var config = {
			columns: [
			     { display: getIl8n("basic_group","id"), name: 'id', isSort: true, hide:true }
			    ,{ display: getIl8n("basic_group","code"), name: 'code' ,align: 'left' }
			    ,{ display: getIl8n("basic_group","name"), name: 'name', width: 320 ,align: 'left' }			    
			    ,{ display: getIl8n("basic_group","type"), name: 'type', isSort: false, hide:true  }
			    ,{ display: getIl8n("basic_group","status"), name: 'status', isSort: false, hide:true  }
			    ,{ display: getIl8n("basic_group","type"), name: 'type_', isSort: false }
			    ,{ display: getIl8n("basic_group","status"), name: 'status_', isSort: false }				    
			    ,{ display: getIl8n("basic_group","count_users"), name: 'count_users', width:100 }
			]
			,pageSize:20 ,rownumbers:true
			,height: '100%'
			,parms: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
                
                ,search: "{}"
			}
			,url: config_path__basic_group__grid
			,method: "POST"
			,id : "basic_group__grid"
			,toolbar: { items: [] }
		};
		

		var permission = top.basic_user.permission;
		for(var i=0;i<permission.length;i++){
			if(permission[i].code=='12'){
				permission = permission[i].children;				
			}
		}
		for(var i=0;i<permission.length;i++){
			if(permission[i].code=='1201'){
				permission = permission[i].children;				
			}
		}		
		for(var i=0;i<permission.length;i++){	
			var theFunction = function(){};
			if(permission[i].code=='120101'){
				theFunction = basic_group.search;
			}
			else if(permission[i].code=='120121'){
				theFunction = function(){
					top.$.ligerDialog.open({ 
						url: 'basic_group__add.html?random='+Math.random()
						,height: 200
						,width: 300
						,title: top.getIl8n('add')
						,isHidden: false
						,id: "basic_group__add"
						, modal: false
						});	
						
				        top.$.ligerui.get("basic_group__add").close = function(){
				            var g = this;
				            top.$.ligerui.win.removeTask(this);
				            g.unmask();
				            g._removeDialog();
				            top.$.ligerui.remove(top.$.ligerui.get("basic_group__add"));
				        };	
					};			
			}
			else if(permission[i].code=='120123'){
				theFunction = basic_group.remove;
			}else if(permission[i].code=='120122'){				
				//修改 	                					
				theFunction = function(){
	            	if(top.$.ligerui.get("basic_group__modify")){
	            		alert( getIl8n("closeSameWindowFirst") );return;
	            	}else{
						var selected = basic_group.grid_getSelectOne();
	            		var code = selected.code;
	            	}					
					
					top.$.ligerDialog.open({ 
						 url: 'basic_group__modify.html?code='+code+"&for=bar"
						,height: 400
						,width: 400
						,isHidden: false
						, showMax: true
						, showToggle: true
						, showMin: true	
						,id: "basic_group__modify"
						, modal: false
					});	
					
			        top.$.ligerui.get("basic_group__modify").close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("basic_group__modify"));
			        };						
				};				
				
			}else if(permission[i].code=='120140'){
				//修改权限
				theFunction = function(){
						var selected = basic_group.grid_getSelectOne();
						if(!selected)return;
						if(top.$.ligerui.get("basic_group__permission_get__"+selected.code))return;
						

						top.$.ligerDialog.open({ 
							url: 'basic_group__permission_get.html?code='+selected.code+'&random='+Math.random()
							,height: 500
							,width: 400
							,title: top.getIl8n('modify')
							,id: "basic_group__permission_get__"+selected.code
							,isHidden: false
						});
						
				        top.$.ligerui.get("basic_group__permission_get__"+selected.code).close = function(){
				            var g = this;
				            top.$.ligerui.win.removeTask(this);
				            g.unmask();
				            g._removeDialog();
				            top.$.ligerui.remove(top.$.ligerui.get("basic_group__permission_get__"+selected.code));
				        };							
					};
			}else if(permission[i].code=='120102'){
				//修改权限
				theFunction = function(){
					var selected = basic_group.grid_getSelectOne();
		        	
		        	var id = selected.id;
		            if(top.$.ligerui.get("win_basic_group__view_"+id)){
		                top.$.ligerui.get("win_basic_group__view_"+id).show();
		                return;
		            }
		            top.$.ligerDialog.open({
		                isHidden:false,
		                id : "win_basic_group__view_"+id +"&random="+Math.random()
		                ,height: 500
		                ,width: 650
		                ,url: "basic_group__view.html?id="+id  
		                ,showMax: true
		                ,showToggle: true
		                ,showMin: true
		                ,isResize: true
		                ,modal: false
		                ,title: selected.username
		                ,slide: false    
		            });
		            
			        top.$.ligerui.get("win_basic_group__view_"+selected.id).close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("win_basic_group__view_"+selected.id));
			        };					
				};
			}
			
			
				
			config.toolbar.items.push({line: true });
			config.toolbar.items.push({
				text: permission[i].name , img:permission[i].icon , click : theFunction , id: permission[i].code
			});				
		}				
		
		$(document.body).ligerGrid(config);
	}
	
	,grid_getSelectOne: function(){
		var selected;
		if($.ligerui.get('basic_group__grid').options.checkbox){
			selected = $.ligerui.get('basic_group__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("selectOne") );
				return;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('basic_group__grid').getSelected();
			if(selected==null){
				alert(getIl8n("selectOne"));
				return;
			}
		}	
		return selected;
	}	
	
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
					 { display: top.getIl8n('name'), name: "search_name", newline: false, type: "text" }
					,{ display: top.getIl8n('type'), name: "search_type", newline: true, type: "select", options :{data: basic_group.config.type, valueField : "code" , textField: "value" } }
					,{ display: top.getIl8n('code'), name: "search_code", newline: true, type: "text" }
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('clear'), onclick:function(){
						$.ligerui.get("basic_group__grid").options.parms.search = "{}";
						$.ligerui.get("basic_group__grid").loadData();
						
						$.ligerui.get("search_name").setValue('');
						$.ligerui.get("search_type").setValue('');
						$.ligerui.get("search_code").setValue('');
					}},
					//提交查询条件
				    {text: top.getIl8n('search'), onclick:function(){
						var data = {};
						var  name =		$.ligerui.get("search_name").getValue()
						 	,type = 		$.ligerui.get("search_type").getValue()
						 	,code = 		$.ligerui.get("search_code").getValue();
						
						if(name!="")data.name = name;
						if(type!="")data.type = type;
						if(code!="")data.code = code;
						
						$.ligerui.get("basic_group__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("basic_group__grid").loadData();
				}}]
			});
		}
	}	

	,add: function(){
		$(document.body).append("<form id='form'></form>");
		var config = {
			id: 'basic_group__insert',
			fields: [
				 { display: top.getIl8n('name'), name: "basic_group__name", type: "text",  validate: { required:true} }
				, { display: top.getIl8n('type'), name: "basic_group__type", type: "select", options: { data: basic_group.config.basic_group__type, valueField: "code", textField: "value", slide: false }, validate: { required: true } }
				,{ display: top.getIl8n('code'), name: "basic_group__code", type: "text", validate: {required:true, digits:true, minlength:2, maxlength:10 } }
			]
		};
		var form = $('#form').ligerForm(config);		
		$('#form').append('<br/><br/><div id="buttons"><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_group__submit" class="l-button l-button-submit" /></div>' );
		
		var v = $('#form').validate({
			debug: true,
			//JS前端验证错误
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-textarea")) {
				element.addClass("l-textarea-invalid");
				}
				else if (element.hasClass("l-text-field")) {
				element.parent().addClass("l-text-invalid");
				} 
			},
			//JS前端验证通过
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-textarea")) {
					element.removeClass("l-textarea-invalid");
				} else if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_group.ajaxState)return;
				basic_group.ajaxState = true;
				$("#basic_group__submit").attr("value",top.getIl8n('waitting'));
				
				basic_user.type = $.ligerui.get('basic_group__type').getValue();
				$.ajax({
					url: config_path__basic_group__add,
					data: {
						 executor: top.basic_user.loginData.username
						,session:top.basic_user.loginData.session					
						
						,data: $.ligerui.toJSON({
							 name: $.ligerui.get('basic_group__name').getValue()
							,type: $.ligerui.get('basic_group__type').getValue()
							,code: $.ligerui.get('basic_group__code').getValue()							
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						$("#basic_group__submit").attr("value",top.getIl8n('submit'));			
						basic_group.ajaxState = false;
						if(response.status=='1'){						
							alert(top.getIl8n('done'));
						//服务端添加失败
						}else if(response.status=="2"){							
							alert(response.msg);
						}
					},
					error : function(){
						alert(top.getIl8n('disConnect'));
					}
				});	
			}
		});			
	}
	
	,ajaxState: false 	
	,modify: function(){
		$(document.body).append("<form id='form'></form>");
		var config = {
			id: 'basic_group__modify',
			fields: [
				 { display: top.getIl8n('name'), name: "basic_group__name", type: "text",  validate: { required: true } }
				,{ display: top.getIl8n('type'), name: "basic_group__type", type: "select" , options: {disabled: true, data: basic_group.config.basic_group__type, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
				,{ display: top.getIl8n('status'), name: "basic_group__status", type: "select" , options: {data: basic_group.config.basic_group__status, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
				,{ display: top.getIl8n('code'), name: "basic_group__code", type: "text", options: {disabled: true} }
			]
		};
		var form = $('#form').ligerForm(config);		
		$('#form').append('<br/><br/><br/><br/><div id="buttons"><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_group__submit" class="l-button l-button-submit" /></div>' );
		
		var v = $('#form').validate({
			debug: true,
			//JS前端验证错误
			errorPlacement: function (lable, element) {
				if (element.hasClass("l-textarea")) {
				element.addClass("l-textarea-invalid");
				}
				else if (element.hasClass("l-text-field")) {
				element.parent().addClass("l-text-invalid");
				} 
			},
			//JS前端验证通过
			success: function (lable) {
				var element = $("[ligeruiid="+$(lable).attr('for')+"]",$("form"));
				if (element.hasClass("l-textarea")) {
					element.removeClass("l-textarea-invalid");
				} else if (element.hasClass("l-text-field")) {
					element.parent().removeClass("l-text-invalid");
				}
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_group.ajaxState)return;
				basic_group.ajaxState = true;
				$("#basic_group__submit").attr("value",top.getIl8n('waitting'));
				
				$.ajax({
					url: config_path__basic_group__modify,
					data: {
						 executor: top.basic_user.loginData.username
						,session: top.basic_user.loginData.session	
						
						,data: $.ligerui.toJSON({
							 name: $.ligerui.get('basic_group__name').getValue()
							,status: $.ligerui.get('basic_group__status').getValue()
							,code: $.ligerui.get('basic_group__code').getValue()							
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						$("#basic_group__submit").attr("value",top.getIl8n('submit'));			
						basic_group.ajaxState = false;
						if(response.status==1){						
							alert(top.getIl8n('done'));
						//服务端添加失败
						}else if(response.status=="2"){							
							alert(response.msg);
						}
					},
					error : function(){
						alert(top.getIl8n('disConnect'));
					}
				});	
			}
		});
		
		//从服务端读取信息,填充表单内容
		$.ajax({
			url: config_path__basic_group__view
			,data: {
				code: getParameter("code", window.location.toString() )
				
				//服务端权限验证所需
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session 
			}
			,type: "POST"
			,dataType: 'json'						
			,success: function(response) {	
				var data = response.data;
				
				$.ligerui.get("basic_group__name").setValue(data.name);
				$.ligerui.get("basic_group__code").setValue(data.code);
				$.ligerui.get("basic_group__type").setValue(data.type);
				$.ligerui.get("basic_group__status").setValue(data.status);
			}
		});
	}		
	
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		selected = $.ligerui.get('basic_group__grid').getSelecteds();
		//如果一行都没有选中,就报错并退出函数
		if(selected.length==0){alert(top.getIl8n("noSelect"));return;}
		//弹框让用户最后确认一下,是否真的需要删除.一旦删除,数据将不可恢复
		var codes = "";
		//遍历每一行元素,获得 id 
		for(var i=0; i<selected.length; i++){
			codes += selected[i].code+",";
		}
		codes = codes.substring(0,codes.length-1);		
		if(confirm(top.getIl8n("sureToDelete"))){			
			$.ajax({
				url: config_path__basic_group__remove
				,data: {
					codes: codes 
					
					//服务端权限验证所需
					,executor: top.basic_user.loginData.username
					,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=='1'){						
						$.ligerui.get('basic_group__grid').loadData();
					}
				}
				,error : function(){
					//网络通信失败,则删除按钮再也不能点了
					alert(top.getIl8n('disConnect'));
				}
			});				
		}	
	}
	
	,permission_get: function(){
		$(document.body).append('<ul id="tree"></ul>');
		$('#tree').ligerTree({
			 id: 'basic_group__permission_get'
			,autoCheckboxEven : false
			//先随便填充一个tree结构,tree的内容需要等tree初始化后异步填充
			,data: [
	                { name: "" , code: '1' },
	                { name: "" , code: '2' },
	                { name: "" , code: '3' },
	                { name: "" , code: '4' }
	            ]
			,textFieldName : 'name'
			,slide : true
			,nodeWidth : 140
			//鼠标右击操作,编辑 金币 积分 策略
			,onContextmenu: function(a,b,c){
				if( $(".l-checkbox-checked",$(a.target)).length == 0 ) {
					return false;
				}
				$("span:eq(0)",$(a.target)).html(a.data.name+"&nbsp;<input style='width:15px;' />&nbsp;<input style='width:15px;' />&nbsp;<input onclick='basic_group.permission_setCost("+a.data.treedataindex+","+a.data.id+")' type='button' style='width:15px;' />")
				return false;
			}
		    //勾选了一个节点,就初始化 金币 积分 策略,都是0
		    //如果是取消勾选,节点就只显示权限名称
			,onCheck: function (a,b,c) { 
				if(b==true){
					a.data.cost = a.data.credits = 0;
					$("span:eq(0)",$(a.target)).html(a.data.name+" 0 0");
				}else{
					$("span:eq(0)",$(a.target)).html(a.data.name);
				}
			}
		});
		
		//清掉树形结构中的节点,然后异步读取服务端数据,再填充树形节点
		$.ligerui.get('basic_group__permission_get').clear();

		$.ajax({
		    url: config_path__basic_group__permission_get,
		    data: {
		        code: getParameter("code", window.location.toString())
				, executor: top.basic_user.loginData.username
				, session: top.basic_user.loginData.session
		    },
		    type: "POST",
		    dataType: 'json',
		    success: function (response) {
		        $.ligerui.get('basic_group__permission_get').setData(response.permissions);
		    },
		    error: function () {
		        //网络通信失败,按钮将不可按,只能关闭窗口
		        alert(top.getIl8n('disConnect'));
		    }
		});

		
		$(document.body).append('<input type="button" onclick="basic_group.permission_set()" value="'+top.getIl8n('modify')+'" id="button" class="l-button l-button-submit" style="position:absolute;top:5px;left:200px;"  />' );
	}
	
	,permission_setCost: function(id,id_){
		var tree = $.ligerui.get('basic_group_2_permission__tree');
		var dom = tree.getNodeDom(id) ;
		var cost = $('input:eq(0)',dom).val();
		var credits = $('input:eq(1)',dom).val();
		
		//验证用户输入的,是否是数字
		if(cost=='' || credits=='' || parseInt(cost)=='NaN' || parseInt(credits)=='NaN'){
			
		}else{
			tree.update(dom,{cost:cost,credits:credits});
		}
		var data = tree.getDataByID(id_);
		$("span:eq(0)",dom).html(data.name+" "+data.cost+" "+data.credits);
	}
	
	,permission_set: function(){
		//如果正在与服务端的通信
		if(basic_group.ajaxState)return;							
		
		var arr = $.ligerui.get('basic_group__permission_get').getChecked();
		var codes = ""
		    ,cost_ = ""
		    ,credits_ = "";
		if(arr.length != 0){
			for(var i=0;i<arr.length;i++){
				codes += arr[i].data.code+",";
				cost_ += arr[i].data.cost+",";
				credits_ += arr[i].data.credits+",";
			}
			codes = codes.substring(0,codes.length-1);
			cost_ = cost_.substring(0,cost_.length-1);
			credits_ = credits_.substring(0,credits_.length-1);
		
			//修改AJAX的通信状态
			$('#button').attr("value",top.getIl8n('waitting'));
			basic_group.ajaxState = true;
		}else{
			alert(top.getIl8n('selectOne'));
			return;
		}
		
		$.ajax({
			url: config_path__basic_group__permission_set,
			data: {
				 codes: codes 
				,cost_: cost_ 
				,credits_: credits_ 
				,code: getParameter("code", window.location.toString() )
				
				//服务端权限验证所需
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			},
			type: "POST",
			dataType: 'json',
			success: function(response) {
				//修改成功,就不能再继续执行修改操作了,必须先关闭窗口,再打开
				$('#button').remove();
				basic_group.ajaxState = false;
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
	
	,view: function(){
		var id = getParameter("id", window.location.toString() );
    	$(document.body).html("<div id='menu'  ></div><div id='content' style='width:"+($(window).width()-170)+"px;margin-top:5px;'></div>");
    	var htmls = "";
    	$.ajax({
            url: config_path__basic_group__view+"&rand="+Math.random()
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

            		if(j=='id'||j=='remark'||j=='birthday')htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";            		

        			eval("var key = getIl8n('basic_group','"+j+"');");
            		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		
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
                    if(permission[i].code=='1201'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }   
                
                for(var i=0;i<permission.length;i++){
                    if(permission[i].code=='120102'){
                    	if(typeof(permission[i].children)=='undefined')return;
                        permission = permission[i].children;
                        break;
                    }
                }            
                
                for(var i=0;i<permission.length;i++){       
                	var theFunction = function(){};
                    
                    
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
};