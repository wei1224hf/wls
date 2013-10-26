var exam_question_log_wrongs = {
	
	 config: null
	,loadConfig: function(afterAjax){
		$.ajax({
			url: config_path__exam_question_log_wrongs__loadConfig
			,dataType: 'json'
	        ,type: "POST"
	        ,data: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
	        } 			
			,success : function(response) {
				exam_question_log_wrongs.config = response;
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

	,grid: function(){
		var config = {
				id: 'exam_question_log_wrongs__grid'
				,height:'100%'
				,columns: [
				   
				     { display: getIl8n("exam_subject","exam_subject"), name: 'subject_code', hide:true }
				    ,{ display: getIl8n("exam_subject","exam_subject"), name: 'subject_name', width: 100 }
				    ,{ display: getIl8n("exam_question_log_wrongs","title"), name: 'title', width: 100 ,align: 'left' }			    
				    ,{ display: getIl8n("exam_question_log_wrongs","difficulty"), name: 'difficulty', width: 50 }
				    
				    ,{ display: getIl8n("exam_question_log_wrongs","id"), name: 'id', isSort: true, hide:true }
				    ,{ display: getIl8n("exam_question_log_wrongs","type"), name: 'type', isSort: false, hide:true  }
				    ,{ display: getIl8n("exam_question_log_wrongs","type"), name: 'type_', isSort: false, width: 100 }
			    
				],  pageSize:20 ,rownumbers:true
				,parms : {
	                executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session     
	                ,search: "{}"
				},
				url: config_path__exam_question_log_wrongs__grid,
				method: "POST",				
				toolbar: { items: []}
		};
		
		//配置列表表头的按钮,根据当前用户的权限来初始化
		var permission = top.basic_user.permission;
		for(var i=0;i<permission.length;i++){
			if(permission[i].code=='60'){
				permission = permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='6004'){
						permission = permission[j].children;
					}
				}				
			}
		}
		
		for(var i=0;i<permission.length;i++){
			var theFunction = function(){};
			if(permission[i].code=='600401'){
				theFunction = exam_question_log_wrongs.search;
			}if(permission[i].code=='600423'){
				config.checkbox = true;
				theFunction = exam_question_log_wrongs.remove;
			}else if(permission[i].code=='600491'){
				theFunction = function(){

					top.$.ligerDialog.open({ 
						url: 'exam_question_log_wrongs__do.html'
						,height: 350
						,width: 400
						,title: 'Wrongs'
                        ,showMax: true
                        ,showToggle: true
                        ,showMin: true
                        ,isResize: true
                        ,modal: false
                        ,slide: false  
                        ,isHidden:false
						,id: 'exam_question_log_wrongs__do'
					}).max();	
					
			        top.$.ligerui.get("exam_question_log_wrongs__do").close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_question_log_wrongs__do"));
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
		if($.ligerui.get('exam_question_log_wrongs__grid').options.checkbox){
			selected = $.ligerui.get('exam_question_log_wrongs__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("exam_question_log_wrongs","selectOne") );
				return null;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('exam_question_log_wrongs__grid').getSelected();
			if(selected==null){
				alert(getIl8n("exam_question_log_wrongs","selectOne"));
				return null;
			}
		}	
		return selected;
	}
	
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		var selected = $.ligerui.get('exam_question_log_wrongs__grid').getSelecteds();
		//如果一行都没有选中,就报错并退出函数
		if(selected.length==0){alert(top.getIl8n('noSelect'));return;}
		//弹框让用户最后确认一下,是否真的需要删除.一旦删除,数据将不可恢复
		if(confirm( top.getIl8n('sureToDelete') )){
			var ids = "";
			//遍历每一行元素,获得 id 
			for(var i=0; i<selected.length; i++){
				ids += selected[i].id+",";
			}
			ids = ids.substring(0,ids.length-1);				
			
			$.ajax({
				url: config_path__exam_question_log_wrongs__remove,
				data: {
					ids: ids 
					
	                ,executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=="1"){
						$.ligerui.get('exam_question_log_wrongs__grid').loadData();
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
					 { display: top.getIl8n('exam_paper','title'), name: "examp_paper__search_title", newline: false, type: "text" }
					,{ display: top.getIl8n('exam_paper','subject'), name: "examp_paper__search_subject", newline: true, type: "select", options :{data : exam_question_log_wrongs.config.exam_subject__code, valueField : "code" , textField: "value" } }
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('exam_question_log_wrongs','search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('exam_question_log_wrongs','clear'), onclick:function(){
						$.ligerui.get("exam_question_log_wrongs__grid").options.parms.search = "{}";
						$.ligerui.get("exam_question_log_wrongs__grid").loadData();
						
						$.ligerui.get("examp_paper__search_title").setValue('');
						$.ligerui.get("examp_paper__search_subject").setValue('');
					}},
					//提交查询条件
				    {text: top.getIl8n('exam_question_log_wrongs','search'), onclick:function(){
						var data = {};
						var title =		$.ligerui.get("examp_paper__search_title").getValue()
						 	,subject_code =	$.ligerui.get("examp_paper__search_subject").getValue();
						
						if(title!="")data.title = title;
						if(subject_code!="")data.subject_code = subject_code;
						
						$.ligerui.get("exam_question_log_wrongs__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_question_log_wrongs__grid").loadData();
				}}]
			});
		}
	}
};

var question_log_wrongs = paper;	    
question_log_wrongs.objName = 'question_log_wrongs',
question_log_wrongs.readQuestions = function(afterAjax){
	var paperObj = this;
    $.ajax({
        url : config_path__exam_question_log_wrongs__questions,
        type : "POST",
        data : {        	 
             executor: top.basic_user.loginData.username
            ,session: top.basic_user.loginData.session
        },
        dataType: 'json',
        success : function(responseData) {
            paperObj.questions = responseData
            
            if ( typeof(afterAjax) == "string" ){
                eval(afterAjax);
            }else if( typeof(afterAjax) == "function"){
                afterAjax();
            }		                
            
        },
        error : function(){
        	alert('error');
        }
    });
};
question_log_wrongs.submit = function(){    
    for(var i=0;i<this.questions.length;i++){        
    	this.questions[i].getMyAnswer();        
    }   	
    this.showDescription();    
    $('#submit').remove();
};