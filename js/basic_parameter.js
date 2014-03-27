var basic_parameter = {

     mode: ""
		
	 ,grid: function(){		
		var config = {
			columns: [
			     { display: il8n.basic_normal.code, name: 'code'}
			    ,{ display: il8n.basic_normal.name, name: 'value'}			    
			    ,{ display: il8n.basic_normal.remark, name: 'reference', isSort: false, width: 200 }
			    ,{ display: il8n.basic_normal.message+"1", name: 'extend1', hide:true }
			    ,{ display: il8n.basic_normal.message+"2", name: 'extend2', hide:true }
			    ,{ display: il8n.basic_normal.message+"3", name: 'extend3', hide:true }
			    ,{ display: il8n.basic_normal.message+"4", name: 'extend4', hide:true }
			    ,{ display: il8n.basic_normal.message+"5", name: 'extend5', hide:true }
			    ,{ display: il8n.basic_normal.message+"6", name: 'extend6', hide:true }
		    
			]
			,height: '100%'
			,pageSize:20 ,rownumbers:true
			,parms: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
                
                ,search: "{}"
			}
			,url: config_path__basic_parameter__grid
			,method: "POST"
			,id : "basic_parameter__grid"
			,toolbar: { items: [] }
		};		

		var permission = top.basic_user.permission;
		for(var i=0;i<permission.length;i++){
			if(permission[i].code=='12'){
				permission = permission[i].children;				
			}
		}
		for(var i=0;i<permission.length;i++){
			if(permission[i].code=='1203'){
				permission = permission[i].children;				
			}
		}	

		for(var i=0;i<permission.length;i++){	
			var theFunction = function(){};
			
			if(permission[i].code=='120301'){
				theFunction = basic_parameter.search;
			}else if(permission[i].code=='120321'){
				theFunction = function(){
						top.$.ligerDialog.open({ 
							url: 'basic_parameter__add.html?random='+Math.random()
							,height: 400
							,width: 300
							,title: top.getIl8n('add')
							,isHidden: false
						});
					};
			}else if(permission[i].code=='120323'){
				theFunction = basic_parameter.remove;
			}else if(permission[i].code=='120342'){
				theFunction = basic_parameter.resetMemory;
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
		if($.ligerui.get('basic_parameter__grid').options.checkbox){
			selected = $.ligerui.get('basic_parameter__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("selectOne") );
				return;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('basic_parameter__grid').getSelected();
			if(selected==null){
				alert(getIl8n("selectOne"));
				return;
			}
		}	
		return selected;
	}	

	,ajaxState: false
	,add: function(){
		$(document.body).append("<form id='form'></form>");
		var config = {
			id: 'basic_parameter__add',
			fields: [
			     { display: il8n.basic_normal.id, name: "id", type: "text" ,  validate: { required:true} }
				,{ display: il8n.basic_normal.code, name: "code", type: "text",  validate: { required:true} }
				,{ display: il8n.basic_normal.name, name: "value", type: "text" ,  validate: { required:true} }
				,{ display: il8n.basic_normal.remark, name: "reference", type: "text", validate: { required:true} }
				,{ display: il8n.basic_normal.message+"1", name: "extend1", type: "text", validate: { digits:true } }
				,{ display: il8n.basic_normal.message+"2", name: "extend2", type: "text", validate: { digits:true } }
				,{ display: il8n.basic_normal.message+"3", name: "extend3", type: "text", validate: { digits:true } }
				,{ display: il8n.basic_normal.message+"4", name: "extend4", type: "text" }
				,{ display: il8n.basic_normal.message+"5", name: "extend5", type: "text" }
				,{ display: il8n.basic_normal.message+"6", name: "extend6", type: "text" }
			]
		};
		var form = $('#form').ligerForm(config);		
		$('#form').append('<br/><br/><div id="buttons"><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_parameter__submit" class="l-button l-button-submit" /></div>' );
		
		var v = $('#form').validate({
			debug: true,
            errorPlacement: function (lable, element) {         	
                element.parent().addClass("l-text-invalid");
                $(element).removeAttr("title").ligerHideTip();
                $(element).attr("title", lable.html()).ligerTip();
            },
            success: function (lable,element) {            	
                $(element).parent().removeClass("l-text-invalid");
			},
			//提交表单,在表单内 submit 元素提交之后,要与后台通信
			submitHandler: function () {
				if(basic_parameter.ajaxState)return;
				basic_parameter.ajaxState = true;
				$("#basic_parameter__submit").attr("value", il8n.basic_normal.waitting );

				$.ajax({
					url: config_path__basic_parameter__add,
					data: {
						 executor: top.basic_user.loginData.username
						,session:top.basic_user.loginData.session					
						
						,data: $.ligerui.toJSON({
							 code: $.ligerui.get('code').getValue()
							,value: $.ligerui.get('value').getValue()
							,reference: $.ligerui.get('reference').getValue()		
							
							,extend1: $.ligerui.get('extend1').getValue()		
							,extend2: $.ligerui.get('extend2').getValue()		
							,extend3: $.ligerui.get('extend3').getValue()		
							,extend4: $.ligerui.get('extend4').getValue()		
							,extend5: $.ligerui.get('extend5').getValue()		
							,extend6: $.ligerui.get('extend6').getValue()		
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						$("#basic_parameter__submit").attr("value",top.getIl8n('submit'));			
						basic_parameter.ajaxState = false;
						if(response.status=='1'){						
							alert(top.getIl8n('done'));
						//服务端添加失败
						}else if(response.status=="2"){							
							alert(response.msg);
						}
					},
					error : function(){
						alert( il8n.basic_normal.disConnect );
					}
				});	
			}
		});			
	}	
	
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		selected = $.ligerui.get('basic_parameter__grid').getSelecteds();
		//如果一行都没有选中,就报错并退出函数
		if(selected.length==0){alert(top.getIl8n("noSelect"));return;}
		//弹框让用户最后确认一下,是否真的需要删除.一旦删除,数据将不可恢复
		var ids = "";
		//遍历每一行元素,获得 id 
		for(var i=0; i<selected.length; i++){
			ids += selected[i].id+",";
		}
		ids = ids.substring(0,ids.length-1);		
		if(confirm(top.getIl8n("sureToDelete"))){			
			$.ajax({
				url: config_path__basic_parameter__remove
				,data: {
					ids: ids 
					
					//服务端权限验证所需
					,executor: top.basic_user.loginData.username
					,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=='1'){						
						$.ligerui.get('basic_parameter__grid').loadData();
					}
				}
				,error : function(){
					//网络通信失败,则删除按钮再也不能点了
					alert(top.getIl8n('disConnect'));
				}
			});				
		}	
	}
	
	,resetMemory: function(){
		$.ajax({
			url: config_path__basic_parameter__resetMemory
			,data: { 
				 executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			}
			,type: "POST"
			,dataType: 'json'
			,success: function(response) {
				if(response.status=='1'){						
					alert(top.getIl8n('done'));
				}
			}
			,error : function(){
				alert(top.getIl8n('disConnect'));
			}
		});	
	}
	
	,search: function(){
		var formD;
		if($.ligerui.get("formD")){
			formD = $.ligerui.get("formD");
			formD.show();
		}else{
			$(document.body).append("<form id='form'></form>");
			$("#form").ligerForm({
				inputWidth: 170
				,labelWidth: 90
				,space: 40
				,fields: [
					 { display: top.getIl8n('remark'), name: "search_name", newline: false, type: "text" }
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 80
				,content: form
				,title: top.getIl8n('search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('clear'), onclick:function(){
						$.ligerui.get("basic_parameter__grid").options.parms.search = "{}";
						$.ligerui.get("basic_parameter__grid").loadData();
						
						$.ligerui.get("search_name").setValue('');

					}},
					//提交查询条件
				    {text: top.getIl8n('search'), onclick:function(){
						var data = {};
						var  name =		$.ligerui.get("search_name").getValue();
						
						if(name!="")data.name = name;
						
						$.ligerui.get("basic_parameter__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("basic_parameter__grid").loadData();
				}}]
			});
		}
	}	

    ,grid_type_tree: function(jqdom,gridid,property,upcode,codelen,hasall,reference){
        var url = config_path__basic_parameter__typetree
		+"&reference="+reference
		+"&upcode="+upcode
		+"&hasall="+hasall
		+"&codelen="+codelen
		+"&executor=0";
        
        $(jqdom).ligerTree({
             nodeWidth: 500
            ,url: url
            ,textFieldName : 'value'
            ,idFieldName : 'code'
            ,checkbox: false
            ,idFieldName: 'code'
            ,slide: false
            ,onSelect:  function(item){
                var code = item.data.code_;
                eval("var search = "+ $.ligerui.get(gridid).options.parms.search );
                search[property] = code;
                $.ligerui.get(gridid).options.parms.search= $.ligerui.toJSON(search);
                $.ligerui.get(gridid).setOptions({newPage:1});
                $.ligerui.get(gridid).loadData();     
            }
        }); 
    }
};