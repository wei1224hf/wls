var exam_paper = {
	
	mode: ""
		
	,grid_search_default: {}
	,grid_can_check: false
		
	,grid: function(){
		var toolbar = exam_paper.grid_toolbar();
		var config = {
			id: 'exam_paper__grid'
			,height:'100%'
			,columns: [
			     { display: getIl8n("exam_paper","title"), name: 'title', width: 200, align: 'left' }
			    ,{ display: getIl8n("exam_paper","subject_name"), name: 'subject_name', width: 100 }				    
			    ,{ display: getIl8n("exam_paper","cent"), name: 'cent', width: 50 }
			    ,{ display: getIl8n("exam_paper","time_created"), name: 'time_created', width: 100 }
			    ,{ display: getIl8n("exam_paper","count_question"), name: 'count_question', width: 100 }   
			    ,{ display: getIl8n("exam_paper","cent_top"), name: 'cent_top', isSort: false, width: 100,hide: true }
			    ,{ display: getIl8n("exam_paper","count_used"), name: 'count_used', isSort: false, width: 100,hide: true  }
			],  pageSize:20 ,rownumbers:true
			,parms : {
                executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session     
                ,search: "{}"
			}
            ,checkbox: exam_paper.grid_can_check
            ,selectRowButtonOnly: exam_paper.grid_can_check			
			,url: config_path__exam_paper__grid,
			method: "POST",				
			toolbar: { items: toolbar }
		};
		
		if(top.basic_user.loginData.type=='20'){
			var otherColumns = [
				 { display: getIl8n("exam_paper","cost"), name: 'cost', width: 50 }      
			                   ];
			for(var i=0;i<otherColumns.length;i++){
				config.columns.push( otherColumns[i] );
			}
		}else if(top.basic_user.loginData.type=='30'){
			var otherColumns = [
				 { display: getIl8n("status"), name: 'statuse_', isSort: false, width: 100, hide:true }
				,{ display: getIl8n("creater_code"), name: 'creater_code', isSort: false, width: 100, hide:true }
				,{ display: getIl8n("creater_group_code"), name: 'creater_group_code', isSort: false, width: 100, hide:true }
				//,{ display: getIl8n("exam_paper","cent_avg"), name: 'cent_avg', isSort: false, width: 100 }
				,{ display: getIl8n("exam_paper","count_subjective"), name: 'count_subjective', isSort: false, width: 100 }
				,{ display: getIl8n("exam_paper","cent_subjective"), name: 'cent_subjective', isSort: false, width: 100 }
			                   ];
			for(var i=0;i<otherColumns.length;i++){
				config.columns.push( otherColumns[i] );
			}			
		}		
		
		var search = exam_paper.grid_search_default;
		config.parms.search = $.ligerui.toJSON(search);
		
		$(document.body).ligerGrid(config);
	}
	
	,grid_toolbar: function(){
		//配置列表表头的按钮,根据当前用户的权限来初始化
		var permission = [];
		for(var i=0;i<top.basic_user.permission.length;i++){
			if(top.basic_user.permission[i].code=='60'){
				permission = top.basic_user.permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='6001'){
						permission = permission[j].children;
					}
				}				
			}
		}
		
		var items = [];
		for(var i=0;i<permission.length;i++){
			var theFunction = function(){alert(1)};
			if(permission[i].code=='600101'){
				theFunction = exam_paper.search;
			}else if(permission[i].code=='600102'){
				theFunction = function(){					
					var selected = exam_paper.grid_getSelectOne();
					var win = top.$.ligerDialog.open({ 
						 url: '../html/exam_paper__view.html?id='+selected.id+'&random='+Math.random()
						,height: 560
						,width: 550
						,title: top.getIl8n("view")
                        ,showMax: true
                        ,showToggle: true
                        ,showMin: true
                        ,isResize: true
                        ,modal: false
                        ,slide: false  
                        ,isHidden:false
						,id: 'exam_paper__view_'+selected.id
					}).max();
					
					top.$.ligerui.get("exam_paper__view_"+selected.id).close = function(){
			            top.$.ligerui.win.removeTask(this);
			            this.unmask();
			            this._removeDialog();
			            top.$.ligerui.remove(this);
			        };					
				};
			}else if(permission[i].code=='600111'){
				theFunction = exam_paper.upload;			
			}else if(permission[i].code=='600112'){
				theFunction = exam_paper.download;		
			}else if(permission[i].code=='600123'){
				exam_paper.grid_can_check = true;
				theFunction = exam_paper.remove;		
			}else if(permission[i].code=='600122'){
				theFunction = function(){
					
					var selected = exam_paper.grid_getSelectOne();
					top.$.ligerDialog.open({ 
						url: '../html/exam_paper__modify.html?id='+selected.id+'&random='+Math.random()
						,height: 240
						,width: 400
						,isHidden: false
						,title: top.getIl8n("modify")
						,id: 'exam_paper__modify_'+selected.id
					});	
					
				}
			}else if(permission[i].code=='600190'){
				theFunction = function(){
					var selected = exam_paper.grid_getSelectOne();
					if(selected==null)return;	
					
					var id = selected.id;
					top.$.ligerDialog.open({ 
						url: '../html/exam_paper__do.html?id='+id+'&random='+Math.random()
						,height: 350
						,width: 400
						,title: selected.title
                        ,showMax: true
                        ,showToggle: true
                        ,showMin: true
                        ,isResize: true
                        ,modal: false
                        ,slide: false  
                        ,isHidden:false
						,id: 'exam_paper__do_'+id
					}).max();	
				}
			}
			
			items.push({line: true });
			items.push({text: permission[i].name , img: permission[i].icon , click: theFunction });
			
		}
		return items;
	}
	
	,grid_getSelectOne: function(){
		var selected;
		if($.ligerui.get('exam_paper__grid').options.checkbox){
			selected = $.ligerui.get('exam_paper__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("exam_paper","selectOne") );
				return null;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('exam_paper__grid').getSelected();
			if(selected==null){
				alert(getIl8n("exam_paper","selectOne"));
				return null;
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
			$(document.body).append("<form id='form' ></form>");
			var config = {
					inputWidth: 170
					,labelWidth: 90
					,space: 40
					,fields: [
						 { display: top.getIl8n('title'), name: "title", newline: false, type: "text" }
					]
				};
			
			var permission = top.basic_user.permission;
			for(var i=0;i<permission.length;i++){
				if(permission[i].code=='60'){
					permission = permission[i].children;
					for(var i1=0;i1<permission.length;i1++){
						if(permission[i1].code=='6001'){
							permission = permission[i1].children;
							for(var i2=0;i2<permission.length;i2++){
								if(permission[i2].code=='600101'){
									permission = permission[i2].children;
								}
							}
						}
					}				
				}
			}
			
			for(var i=0;i<permission.length;i++){
				if(permission[i].code=='60010104'){
					config.fields.push({ display: top.getIl8n('creater_group_code'), name: "creater_group_code", type: "text" });
				}
				else if(permission[i].code=='60010105'){
					config.fields.push({ display: top.getIl8n('creater_code'), name: "creater_code", type: "text" });
				}
				else if(permission[i].code=='60010106'){
					config.fields.push({ display: top.getIl8n('time_created')+"-"+top.getIl8n('big'), name: "time_created__big", type: "date" });
					config.fields.push({ display: top.getIl8n('time_created')+"-"+top.getIl8n('small'), name: "time_created__small", type: "date" });
				}	
				else if(permission[i].code=='60010108'){
					config.fields.push({ display: top.getIl8n('status'), name: "status", type: "select", options :{data : basic_parameter_data.exam_paper__status , valueField : "code" , textField: "value" } });
				}
				else if(permission[i].code=='60010150'){
					config.fields.push({ display: top.getIl8n('exam_paper','cost')+"-"+top.getIl8n('big'), name: "cost__big", type: "text" });
					config.fields.push({ display: top.getIl8n('exam_paper','cost')+"-"+top.getIl8n('small'), name: "cost__small", type: "text" });
				}	
				else if(permission[i].code=='60010151'){
					config.fields.push({ display: top.getIl8n('exam_paper','count_used'), name: "search__count_used", type: "text" });
				}	
				else if(permission[i].code=='60010152'){
					if( typeof( exam_paper.grid_search_default['subject_code'] )!= 'undefined' ) continue;
					config.fields.push({ display: top.getIl8n('exam_paper','subject_code'), name: "subject_code", type: "select", options :{data : [] , valueField : "subject_code" , textField: "subject_name" } });
				}				
			}
			
			$("#form").ligerForm(config); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: config.fields.length * 28 + 50
				,content: form
				,title: top.getIl8n('exam_paper','search')
				,buttons : [
					{text: top.getIl8n('exam_paper','clear'), onclick:function(){
						
                        eval("var data ="+ $.ligerui.get("exam_paper__grid").options.parms.search );
                        var doms = $("input[ligeruiid]",$('#form'));
                        for(var i=0;i<doms.length;i++){
                            var theid = $(doms[i]).attr('ligeruiid');                            
                            if(data[theid])delete data[theid];                         

                            $.ligerui.get(theid).setValue('');                            
                        } 
                        
                        $.ligerui.get("exam_paper__grid").options.parms.search= $.ligerui.toJSON(data);
                        $.ligerui.get("exam_paper__grid").setOptions({newPage:1});
                        $.ligerui.get("exam_paper__grid").loadData();  
					}}
				    ,{text: top.getIl8n('exam_paper','search'), onclick:function(){
				    	var data = {};
						var doms = $("[ligeruiid]",$('#form'));
						for(var i=0;i<doms.length;i++){
						    var theid = $(doms[i]).attr('ligeruiid');                                                
					        var thevalue = "";
					        
					        if($.ligerui.get(theid).type=="DateEditor"){
					        	thevalue = $('[ligeruiid='+theid+']').val();
					        }
					        else{
					        	thevalue = $.ligerui.get(theid).getValue();
					        }
						    if(thevalue!="" && thevalue!=0 && thevalue!="0" && thevalue!=null){
						        data[theid]=thevalue;
						    }
						}
						
						$.ligerui.get("exam_paper__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_paper__grid").setOptions({newPage:1});
						$.ligerui.get("exam_paper__grid").loadData();
				}}]
			});
			
	        $.ajax({
	            url : config_path__exam_subject__getMy,
	            data : {
	                executor: top.basic_user.loginData.username
					,session: ''
	            },
	            type : "POST",
	            dataType: 'json',    
	            success : function(data) {
	                $.ligerui.get("subject_code").setData(data);
	            },
	            error : function(){
	                $.ligerDialog.error('net error');
	            }
	        });
		}
	}	
	
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		var selected = $.ligerui.get('exam_paper__grid').getSelecteds();
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
				url: config_path__exam_paper__remove,
				data: {
					ids: ids 
					
	                ,executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=="1"){
						$.ligerui.get('exam_paper__grid').loadData();
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
	
	,upload: function(){		
		$.ligerDialog.open({ 
			 content: "<iframe id='exam_paper_upload_if' style='display:none' name='send'><html><body>x</body></html></iframe><form id='xx' method='post' enctype='multipart/form-data' action="+config_path__exam_paper__upload+" target='send'><input name='file' type='file' /><input name='executor' value='"+top.basic_user.loginData.username+"' style='display:none' /><input name='session' value='"+top.basic_user.loginData.session+"' style='display:none' /><input type='submit' value='"+top.getIl8n('exam_paper','submit')+"' /></form>"
			,height: 150
			,width: 400
			,isHidden: false
		});

		$("#exam_paper_upload_if").load(function(){
	        var d = $("#exam_paper_upload_if").contents();	        
	        var s = $('body',d).html() ;
	        if(s=='')return;
	        eval("var obj = "+s+";");
	        if(obj.status==1){
	        	$.ligerui.get("exam_paper__grid").loadData();
	        }
	        else{
	        	alert(obj.msg);
	        }
	    }); 
	}
		
	,download: function(){
		var select = exam_paper.grid_getSelectOne();
		if(select==null)return;
		
		$.ajax({
			url: config_path__exam_paper__download,
			data: {
				id: select.id 
				
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
			}
			,type: "POST"
			,dataType: 'json'
			,success: function(response) {
				if(response.status=="1"){
					top.$.ligerDialog.open({ 
						 content: "<a href='"+response.file+"' target='_blank' >download</a>"
						,height: 150
						,width: 400
					});
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
	
	//AJAX 通信状态,如果为TRUE,则表示服务端还在通信中	
	,ajaxState: false 	
	,modify: function(){

		$.ajax({
			url: config_path__exam_paper__view
			,data: {
				id: getParameter("id", window.location.toString() )
				
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			}
			,type: "POST"
			,dataType: 'json'						
			,success: function(response) {	
			    var data = response.data;
				$.ligerui.get('exam_paper__cost').setValue(data.cost);				
			}
		});
			
		var config = {
				id: 'exam_paper__add',
				fields: [
					 { display: getIl8n("exam_paper","cost"), name: "exam_paper__cost", type: "text",  validate: { required:true, number: true} }
				]
			};
			
		$(document.body).append("<form id='form_modify'></form>");
		$('#form_modify').ligerForm(config);			
		$('#form_modify').append('<br/><br/><br/><br/><input type="submit" value="'+top.getIl8n('submit')+'" id="exam_paper__submit" class="l-button l-button-submit" />' );
		
		var v = $('#form_modify').validate({
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
				$("#exam_paper__submit").attr("value",top.getIl8n('waitting'));
				
				var data = {
						 cost: $.ligerui.get('exam_paper__cost').getValue()
						 ,id: getParameter("id", window.location.toString() )
						};
				
				$.ajax({
					url: config_path__exam_paper__modify,
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
							alert( top.getIl8n('done') );
							$("#exam_paper__submit").remove();
						//服务端添加失败
						}else{
							basic_user.ajaxState = false;
							$("#exam_paper__submit").attr("value",top.getIl8n('submit'));
							alert(response.msg);
						}
					},
					error : function(){
						alert( top.getIl8n('disConnect') );
					}
				});	
			}
		});
	}	
	
	,view: function(){
		
		$(document.body).html("<div id='menu'></div><div id='content' style='width:99%;margin-top:5px;'></div>");
    	var htmls = "";
    	$.ajax({
            url: config_path__exam_paper__view
            ,data: {
                id: getParameter("id", window.location.toString() ) 
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            },
            type: "POST",
            dataType: 'json',
            success: function(response) {
            	if(response.status!="1")return;
            	var data = response.data;
            	for(var j in data){   

            		if(j=='id'||j=='title'||j=='time_start'||j=='students'||j=='remark')htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";
            		
            		if(j=='title'||j=='subject_code'||j=='subject_name'||j=='cent'||j=='cent_all'||j=='cent_subjective'||j=='cent_objective'
            		   ||j=='count_question'||j=='count_subjective'||j=='count_objective'||j=='count_used'||j=='cent_all'||j=='cent_subjective'||j=='cent_objective'){
	            		eval("var key = top.getIl8n('exam_paper','"+j+"');");
	            		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		}
            		
            		if(j=='id'||j=='creater_code'||j=='creater_group_code'||j=='time_created'||j=='time_lastupdated'||j=='count_updated'||j=='status'||j=='type'){
	            		eval("var key = top.getIl8n('"+j+"');");
	            		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		}
            		
            		if(j=='time_start'||j=='time_stop'||j=='passline'||j=='count_total'||j=='count_giveup'||j=='count_passed'||j=='count_failed'||j=='proportion'){
            			eval("var key = top.getIl8n('exam_paper_multionline','"+j+"');");
            			htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            		}
            		
            		if(j=='remark'||j=='students'){
            			eval("var key = top.getIl8n('exam_paper_multionline','"+j+"');");
            			htmls += "<span class='view_lable' style='width:95%'>"+key+"</span><span style='width:95%' class='view_data'>"+data[j]+"</span>";
            		}            		
            	}; 
            	
            	$("#content").html(htmls);
            	            	
            	//查看详细,页面上也有按钮的
            	var items = [];   
        		var permission = top.basic_user.permission;
        		for(var i=0;i<permission.length;i++){
        			if(permission[i].code=='60'){
        				permission = permission[i].children;
        				for(var i2=0;i2<permission.length;i2++){
        					if(permission[i2].code=='6001'){
        						permission = permission[i2].children;
                				for(var i3=0;i3<permission.length;i3++){
                					if(permission[i3].code=='600102'){
                						permission = permission[i3].children;
                					}
                				}	
        					}
        				}				
        			}
        		}
        		if(permission.length>0){
            		for(var i=0;i<permission.length;i++){
            			var theFunction = function(){alert(1)};
            			if(permission[i].code=='60010233'){
            				//theFunction = exam_paper.search;
            			}
            			if(permission[i].code=='60010232'){
            				//theFunction = exam_paper.search;
            			}
            			
            			items.push({line: true });
            			items.push({text: permission[i].name , img: permission[i].icon , click: theFunction });
            		} 
            		
                	$("#menu").ligerToolBar({
                		items:items
                	});
        		}
        	}
            
            ,error : function(){               
                alert(top.il8n.disConnect);
            }
        });
	}
};

var paper = {
	    
	objName: 'paper',
    questions : [],   //题目集
    count : {
        giveup : 0,   //漏题数量,放弃不做的
        right : 0,    //作对数
        wrong : 0,    //做错
        total : 0,     //题目总数
        byTeacher : 0  //需要教师批改的题目总数
    },

    state : '',       //试卷状态 
    mode : 'server',  //服务端模式或者 client 单机模式
    cent : 0,         //卷子总分
    cent_ : 0,        //我的得分
    
    brief: {}
   
    ,wls_quiz_nav : function(id) {
        $("#wls_quiz_main").parent().scrollTop($("#wls_quiz_main").parent().scrollTop() * (-1));
        var target = $('#wls_quiz_main').find('#w_qs_'+id);
        $("#wls_quiz_main").parent().scrollTop($(target).offset().top-30);
    }

    ,initLayout : function() {
		 $(document.body).append(''+
		 '<div id="layout1"> '+ 
		 ' <div position="left" title="'+top.getIl8n('exam_paper','navigation')+'"> '+
		 ' <table><tr><td> '+
		 ' <div id="navigation" ></div> '+
		 ' </td></tr> '+
		 ' <tr><td> '+
		 ' <br/> '+
		 ' <div id="paperBrief" style=" background-color: #FAFAFA; border: 1px solid #DDDDDD;" ></div>'+
		 ' </td></tr> '+
		 ' <tr><td> '+
		 ' <br/> '+
		 ' <input id="submit" style="width:100px;" class="l-button l-button-submit" onclick="'+this.objName+'.submit();" value="'+top.getIl8n('exam_paper','submit')+'"></input> '+
		 ' </td></tr> '+
		 ' </table> '+
		 ' </div> '+
		 ' <div position="center" title="'+top.getIl8n('exam_paper','title')+'" ><div type="submit" id="wls_quiz_main" class="w_q_container"></div></div> '+
		 '</div> '+
		 '');
        
        $("#layout1").ligerLayout(); 
    }  
    
    ,initQuestions : function() {
    	
    	var quesData = this.questions;
    	var questions_ = [];
    	
    	var index = 1;
        for(var i=0;i<quesData.length;i++){
            var question = null;
            if(quesData[i].type==1){//单项选择题
                question = new question_choice();
                question.option_length = quesData[i].option_length;
                question.options = [];
                for(var ii=1;ii<=parseInt(quesData[i].option_length);ii++){
                    eval("question.options.push(quesData[i].option_"+ii+")");
                }
                question.index = index;index++;
                question.layout = quesData[i].layout;
                question.title = quesData[i].title;                       
            }
            else if(quesData[i].type==2){//多项选择题
                question = new question_multichoice();
                question.option_length = quesData[i].option_length;
                question.index = index;index++;
                question.layout = quesData[i].layout;
                question.title = quesData[i].title;
                question.options = [];
                for(var ii=1;ii<=parseInt(quesData[i].option_length);ii++){
                    eval("question.options.push(quesData[i].option_"+ii+")");
                }
            }
            else if(quesData[i].type==3){//判断题
                question = new question_check();
                question.index = index;index++;
                question.layout = quesData[i].layout;
                question.title = quesData[i].title;
                question.options = [quesData[i].option1,quesData[i].option2];
            }else if(quesData[i].type==7){//大题, 不需要题编号
                question = new question_big();
                question.title = quesData[i].title;
            }else if(quesData[i].type==4){//填空题
                question = new question_blank();
                question.index = index;index++;
                question.title = quesData[i].title;
            }else if(quesData[i].type==5){//组合题, 不需要题编号
                question = new question_mixed();
                question.title = quesData[i].title;
            }else if(quesData[i].type==6){//简答题
            	question = new question_writings();
            	question.index = index;index++;
            }else{
                continue;
            }

            question.type = quesData[i].type;
            question.path_listen = quesData[i].path_listen;
            question.path_img = quesData[i].path_img;
            question.cent = quesData[i].cent;
            question.id = quesData[i].id;
            question.id_parent = quesData[i].id_parent;
            question.paper = this;
            if(quesData[i].answer){
            	question.answer = quesData[i].answer;
            	question.description = quesData[i].description;
            }
            question.initDom();
            questions_.push(question);
        }    	
        this.questions = questions_;   	

    	$('#wls_quiz_main').parent().css("overflow","auto");
     }
     
    ,initNavigation : function() {
         var str = '';
         var index = 1;
         for (var i = 0; i < this.questions.length; i++) {
             var type = this.questions[i].type;

             if( type==1||type==2||type==3||type==4||type==6){
            	 var css_class = "w_q_sn_undone";
            	 if(type==4 || type==6){
            		 css_class = "w_q_sn_mark";
            	 }
                 str += "<div class='"+css_class+"' id='w_q_subQuesNav_"
                         + this.questions[i].id
                         + "' onclick='paper.wls_quiz_nav("
                         + this.questions[i].id
                         + ")' style='height:18px;'><a href='#' style='border:0px;font-size:10px;margin-top:2px;' >"
                         + index + "</a></div>";
                 index ++;
             }
         }
         $("#navigation").append(str);
    }
    
    ,initBrief: function(){   
    	$(".l-layout-header",$(".l-layout-center")).html( this.title );
    	var htmlStr = "";

    	for(var j in this.brief){    
    		
    		eval("var value = this.brief."+j);
    		eval("var key = top.getIl8n('exam_"+this.objName+"','"+j+"')");
    		htmlStr += "<span class='brief' style='width:50px;'>"+key+"</span><span class='brief'>&nbsp;"+value+"</span><br/>";
    	}; 
    	
        $('#paperBrief').html(htmlStr);
        //setInterval($('#paperBrief').fadeOut(500).fadeIn(500),2000);
    }
    
    ,readPaper: function(afterAjax){
        var id = getParameter("id", window.location.toString() );
        this.id_paper = id;
        var paperObj = this;
        $.ajax({
             url: config_path__exam_paper__view
            ,type: "POST"
            ,data: {
            	 id: getParameter("id", window.location.toString() )
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            }      
            ,dataType: 'json'
            ,success : function(response) {
            	var data = response.data;

            	paperObj.title = data.title;
            	paperObj.brief = {
     		       subject_name: data.subject_name
     		       ,cost: data.cost
    		       ,count_question: data.count_question
    		       ,creater_code: data.creater_code
    		       ,cent: data.cent
            	};
                
                if ( typeof(afterAjax) == "string" ){
	                eval(afterAjax);
	            }else if( typeof(afterAjax) == "function"){
	                afterAjax();
	            }				
            }
            ,error : function(){
                alert('error');
            }
        });
    }   
    
    ,readQuestions: function(afterAjax){
        var paperObj = this;
        $.ajax({
            url : config_path__exam_paper__questions,
            type : "POST",
            data : {
            	 paper_id: getParameter("id", window.location.toString() )
            	 
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
            },
            dataType: 'json',
            success : function(responseData) {
                if(responseData.status!='1'){
                    alert(responseData.msg);return;
                }

                paperObj.questions = responseData.data;
                
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
    }
    
    ,submit: function(){
    	if(this.mode=='client'){
    		this.showDescription();
    		return;
    	}
    	/*
    	if(top.basic_user.loginData.type!='2'){
    		alert("only student can submit");
    		return;
    	}
    	*/
        if(this.state=='submitted'){
            alert("paper has submitted arleady");
            return;
        }
        this.state = 'submitted';
        $('#submit').val(top.getIl8n('exam_paper','waitting'));

        var toSend = [];
        var ids = "";
        for(var i=0;i<this.questions.length;i++){
        	var data = {
        			question_id: this.questions[i].id,
                    myanswer: this.questions[i].getMyAnswer()
                };
        	if(this.questions[i].type=='4' || this.questions[i].type=='6'){
        		data.img = this.questions[i].getImg();
        	}
            toSend.push(data);
            ids += this.questions[i].id+",";//搜集所有题目的编号
        }        
        ids = ids.substring(0,ids.length-1);//去掉最后一个 ,  TODO 
        var paperObj = this;
        
        $.ajax({
            url : config_path__exam_paper__submit,
            type : 'POST',
            data : {
                  json: $.ligerui.toJSON(toSend)
            	 ,paper_id: getParameter("id", window.location.toString() )
            	 
                 ,executor: top.basic_user.loginData.username
                 ,session: top.basic_user.loginData.session
            }, 
            dataType: 'json',
            success : function(response) {
            	if(response.status!='1'){
            		alert(response.msg);
            		return;
            	}
                var questions = response.answers;
                for(var i=0;i < questions.length;i++){
                	paperObj.questions[i].answer = questions[i].answer;
                	paperObj.questions[i].description = questions[i].description;                    
                }                
                paperObj.showDescription();
                
                paperObj.brief = {
	        		 mycent: response.result.mycent
	        		,cent: response.result.cent
	        		,mycent_objective: response.result.mycent_objective
	        		,count_right: response.result.right
	        		,count_wrong: response.result.wrong
                };
                paperObj.objName = "paper_log";
                paperObj.initBrief();
                
                $('#submit').remove();
            }
        });
    } 
    
    ,showDescription : function(){
        for(var i=0;i < this.questions.length;i++){
        	this.questions[i].showDescription();
        }    	
    }    
};