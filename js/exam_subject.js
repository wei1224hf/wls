var exam_subject = {
	grid: function(){		
		var config = {
			columns: [
			     { display: getIl8n("exam_subject","id"), name: 'id', isSort: true, hide:true }
			    ,{ display: getIl8n("exam_subject","name"), name: 'name', width:130 ,align: 'left' }	
			    ,{ display: getIl8n("exam_subject","code"), name: 'code' ,align: 'left' }
			    ,{ display: getIl8n("exam_subject","weight"), name: 'weight' }
			    ,{ display: getIl8n("exam_subject","type"), name: 'type', isSort: false, hide:true  }
			    ,{ display: getIl8n("exam_subject","type"), name: 'type_', isSort: false }

			]
			,rownumbers: true
			,height: '100%'
			,usePager: false
			,parms: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
                
                ,pagesize: 3000
                ,page: 1
                ,search: "{}"
			}
			,url: config_path__exam_subject__grid
			,method: "POST"
			,id : "exam_subject__grid"
			,toolbar: { items: [] }
		};		

		var permission = [];
		for(var i=0;i<top.basic_user.permission.length;i++){
			if(top.basic_user.permission[i].code=='60'){
				permission = top.basic_user.permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='6005'){
						permission = permission[j].children;
					}
				}				
			}
		}

		for(var i=0;i<permission.length;i++){	
			var theFunction = function(){alert(1)};
			if(permission[i].code=='600521'){
				theFunction = function(){
					top.$.ligerDialog.open({ 
						url: 'exam_subject__add.html?random='+Math.random()
						,height: 200
						,width: 300
						,title: top.getIl8n('add')
						,isHidden: false
					});					
				}
			}else if(permission[i].code=='600523'){
				theFunction = exam_subject.remove;				
			}else if(permission[i].code=='600591'){
				theFunction = function(){
					var selected = exam_subject.grid_getSelectOne();
					if(selected==null)return null;
					if(selected.type!='20'){
						alert('select subject please');
						return null;
					}
					top.$.ligerDialog.open({ 
						url: 'exam_subject__group_get.html?code='+selected.code+'&random='+Math.random()
						,height: 500
						,width: 400
						,title: top.getIl8n('modify')
						,id: "exam_subject__group_get__"+selected.code
						,isHidden: false
					});
					
			        top.$.ligerui.get("exam_subject__group_get__"+selected.code).close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_subject__group_get__"+selected.code));
			        };	
				}
			}
			config.toolbar.items.push({line: true });
			config.toolbar.items.push({text: permission[i].name , img: permission[i].icon , click: theFunction });
		}				
		
		$(document.body).ligerGrid(config);
	}
	
	,grid_getSelectOne: function(){
		var selected;
		if($.ligerui.get('exam_subject__grid').options.checkbox){
			selected = $.ligerui.get('exam_subject__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("selectOne") );
				return null;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('exam_subject__grid').getSelected();
			if(selected==null){
				alert(getIl8n("selectOne"));
				return null;
			}
		}	
		return selected;
	}	

	,add: function(){
		$(document.body).append("<form id='form'></form>");
		var config = {
			id: 'exam_subject__insert',
			fields: [
				 { display: top.getIl8n('name'), name: "exam_subject__name", type: "text",  validate: { required:true} }
				,{ display: top.getIl8n('exam_subject','weight'), name: "exam_subject__weight", type: "text",  validate: { required:true} }
				,{ display: top.getIl8n('type'), name: "exam_subject__type", type: "select" , options :{data: exam_subject.config.type, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
				,{ display: top.getIl8n('code'), name: "exam_subject__code", type: "text", validate: {required:true, digits:true, minlength:2, maxlength:10 } }
			]
		};
		var form = $('#form').ligerForm(config);		
		$('#form').append('<br/><br/><div id="buttons"><input type="submit" value="'+top.getIl8n('submit')+'" id="exam_subject__submit" class="l-button l-button-submit" /></div>' );
		
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
				if(exam_subject.ajaxState)return;
				exam_subject.ajaxState = true;
				$("#exam_subject__submit").attr("value",top.getIl8n('waitting'));
				
				basic_user.type = $.ligerui.get('exam_subject__type').getValue();
				$.ajax({
					url: config_path__exam_subject__add,
					data: {
						 executor: top.basic_user.loginData.username
						,session:top.basic_user.loginData.session					
						
						,data: $.ligerui.toJSON({
							 name: $.ligerui.get('exam_subject__name').getValue()
							,weight: $.ligerui.get('exam_subject__weight').getValue()
							,type: $.ligerui.get('exam_subject__type').getValue()
							,code: $.ligerui.get('exam_subject__code').getValue()							
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						$("#exam_subject__submit").attr("value",top.getIl8n('submit'));			
						exam_subject.ajaxState = false;
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
	
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		selected = $.ligerui.get('exam_subject__grid').getSelecteds();
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
				url: config_path__exam_subject__remove
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
						$.ligerui.get('exam_subject__grid').loadData();
					}
				}
				,error : function(){
					//网络通信失败,则删除按钮再也不能点了
					alert(top.getIl8n('disConnect'));
				}
			});				
		}	
	}
	
	,group_get: function(){
		$(document.body).append('<ul id="tree"></ul>');
		$('#tree').ligerTree({
			 id: 'exam_subject__group_get'
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

		});
		
		//清掉树形结构中的节点,然后异步读取服务端数据,再填充树形节点
		$.ligerui.get('exam_subject__group_get').clear();
		$.ligerui.get('exam_subject__group_get').loadData(null
				,config_path__exam_subject__group_get
				,{
					 code: getParameter("code", window.location.toString() )
					,executor: top.basic_user.loginData.username
					,session: top.basic_user.loginData.session
				}
		);
		
		$(document.body).append('<input value="'+top.getIl8n('submit')+'" type="button" onclick="exam_subject.group_set()" id="button" class="l-button l-button-submit" style="position:absolute;top:5px;left:200px;"  />' );
	}
	
	,group_set: function(){
		//如果正在与服务端的通信
		if(exam_subject.ajaxState)return;							
		
		var arr = $.ligerui.get('exam_subject__group_get').getChecked();
		var codes = "";
		if(arr.length != 0){
			for(var i=0;i<arr.length;i++){
				codes += arr[i].data.code_+",";
			}
			codes = codes.substring(0,codes.length-1);
		
			//修改AJAX的通信状态
			$('#button').attr("value",top.getIl8n('waitting'));
			exam_subject.ajaxState = true;
		}else{
			alert(top.getIl8n('selectOne'));
			return;
		}
		
		$.ajax({
			url: config_path__exam_subject__group_set,
			data: {
				 codes: codes 
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
				exam_subject.ajaxState = false;
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