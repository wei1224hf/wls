var exam_paper_multionline = {


	grid: function(){
		var config = {
				id: 'exam_paper_multionline__grid'
				,height:'100%'
				,columns: [
				     { display: top.getIl8n("title"), name: 'title', width: 150, align: 'left' }
				    ,{ display: top.getIl8n("exam_paper","subject_code"), name: 'subject_code', hide:true }
				    ,{ display: top.getIl8n("exam_paper","subject_name"), name: 'subject_name', width: 100 }				    
				    ,{ display: top.getIl8n("exam_paper_multionline","count_total"), name: 'count_total', width: 50 }
				    ,{ display: top.getIl8n("exam_paper_multionline","time_start"), name: 'time_start', width: 100 }
				    ,{ display: top.getIl8n("exam_paper_multionline","time_stop"), name: 'time_stop', width: 100 }
				    
				],  pageSize:20 ,rownumbers:true
				,parms : {
	                executor: top.basic_user.loginData.username	
	                ,session: top.basic_user.loginData.session     
	                ,search: "{}"
				},
				url: config_path__exam_paper_multionline__grid,
				method: "POST",				
				toolbar: { items: []}
		};
		
		if(top.basic_user.loginData.type=='20'){
			var otherColumns = [
				 { display: top.getIl8n("exam_paper_log","mycent"), name: 'mycent', width: 100 }        
				,{ display: top.getIl8n("exam_paper_log","rank"), name: 'rank', width: 100 } 
			    ,{ display: top.getIl8n("status"), name: 'status2_', isSort: false, width: 100 }
			    ,{ display: top.getIl8n("type"), name: 'type_', isSort: false, width: 100}
			    ,{ display: top.getIl8n("status"), name: 'status_', isSort: false, width: 100 }
			                   ];
			for(var i=0;i<otherColumns.length;i++){
				config.columns.push( otherColumns[i] );
			}
		}else{
			var otherColumns = [
				 { display: top.getIl8n("exam_paper_multionline","count_giveup"), name: 'count_giveup', width: 100, hide: true }
				,{ display: top.getIl8n("exam_paper_multionline","count_failed"), name: 'count_failed', width: 100, hide: true }
			    ,{ display: top.getIl8n("status"), name: 'status_', isSort: false, width: 100 }
			    ,{ display: top.getIl8n("type"), name: 'type_', isSort: false, width: 100}
			    ,{ display: top.getIl8n("exam_paper_multionline","proportion"), name: 'proportion', width: 50, hide: true }
			                   ];
			for(var i=0;i<otherColumns.length;i++){
				config.columns.push( otherColumns[i] );
			}			
		}
		
		//配置列表表头的按钮,根据当前用户的权限来初始化
		var permission = [];
		for(var i=0;i<top.basic_user.permission.length;i++){
			if(top.basic_user.permission[i].code=='60'){
				permission = top.basic_user.permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='6002'){
						permission = permission[j].children;
					}
				}				
			}
		}
		
		for(var i=0;i<permission.length;i++){
			var theFunction = function(){alert(1)};
			if(permission[i].code=='600201'){
				theFunction = exam_paper_multionline.search;
			}else if(permission[i].code=='600202'){
				theFunction = function(){
					
					var selected = exam_paper_multionline.grid_getSelectOne();
					top.$.ligerDialog.open({ 
						url: 'exam_paper_multionline__view.html?id='+selected.pid+'&random='+Math.random()
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
						,id: 'exam_paper_multionline__view_'+selected.pid
					}).max();
					
			        top.$.ligerui.get("exam_paper_multionline__view_"+selected.pid).close = function(){
			            top.$.ligerui.win.removeTask(this);
			            this.unmask();
			            this._removeDialog();
			            top.$.ligerui.remove(this);
			        };
					
				};
			}else if(permission[i].code=='600211'){
				theFunction = exam_paper_multionline.upload;			
			}else if(permission[i].code=='600212'){
				theFunction = exam_paper_multionline.download;		
			}else if(permission[i].code=='600223'){
				config.checkbox = true;
				theFunction = exam_paper_multionline.remove;		
			}else if(permission[i].code=='600222'){
				theFunction = function(){					
					var selected = exam_paper_multionline.grid_getSelectOne();
					top.$.ligerDialog.open({ 
						url: 'exam_paper_multionline__modify.html?id='+selected.pid+'&random='+Math.random()
						,height: 340
						,width: 400
						,isHidden: false
						,title: top.getIl8n("modify")
						,id: 'exam_paper_multionline__modify_'+selected.pid
					});	
					
			        top.$.ligerui.get("exam_paper_multionline__modify_"+selected.pid).close = function(){
			            top.$.ligerui.win.removeTask(this);
			            this.unmask();
			            this._removeDialog();
			            top.$.ligerui.remove(this);
			        };					
				};
			}
			else if(permission[i].code=='600290'){
				config.checkbox = true;
				theFunction = exam_paper_multionline.close;		
			}
			else if(permission[i].code=='600291'){
				theFunction = function(){
					var selected = exam_paper_multionline.grid_getSelectOne();
					if(selected==null)return;	
					if(selected.status=='20'){
						alert( top.getIl8n("exam_paper_multionline","doneAlready").replace("__time_submitted__",selected.time_lastupdated) );
						return;
					}
					if(selected.time_stop < getFormattedDate(new Date())){
						alert( top.getIl8n("exam_paper_multionline","youMissedThis")  );
						return;
					}
					if(selected.time_start > getFormattedDate(new Date())){
						alert( top.getIl8n("exam_paper_multionline","notOpenYet")  );
						return;
					}					
				

					top.$.ligerDialog.open({ 
						url: 'exam_paper_multionline__do.html?exam_id='+selected.lid+'&id='+selected.pid+'&random='+Math.random()
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
						,id: 'exam_paper_multionline__do_'+selected.lid
					}).max();	
					
			        top.$.ligerui.get("exam_paper_multionline__do_"+selected.lid).close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_paper_multionline__do_"+selected.lid));
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
		if($.ligerui.get('exam_paper_multionline__grid').options.checkbox){
			selected = $.ligerui.get('exam_paper_multionline__grid').getSelecteds();
			if(selected.length!=1){ 
				alert( top.getIl8n("exam_paper_multionline","selectOne") );
				return null;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('exam_paper_multionline__grid').getSelected();
			if(selected==null){
				alert( top.getIl8n("exam_paper_multionline","selectOne"));
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
			$(document.body).append("<form id='form'></form>");
			$("#form").ligerForm({
				inputWidth: 170
				,labelWidth: 90
				,space: 40
				,fields: [
					 { display: top.getIl8n('title'), name: "examp_paper__search_title", newline: false, type: "text" }

				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('exam_paper_multionline','search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('exam_paper_multionline','clear'), onclick:function(){
						$.ligerui.get("exam_paper_multionline__grid").options.parms.search = "{}";
						$.ligerui.get("exam_paper_multionline__grid").loadData();
						
						$.ligerui.get("examp_paper__search_title").setValue('');
					}},
					//提交查询条件
				    {text: top.getIl8n('exam_paper_multionline','search'), onclick:function(){
						var data = {};
						var  title =		$.ligerui.get("examp_paper__search_title").getValue();
						
						if(title!="")data.title = title;
						
						$.ligerui.get("exam_paper_multionline__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_paper_multionline__grid").loadData();
				}}]
			});
		}
	}	
	
	,remove: function(){
		//判断 ligerGrid 中,被勾选了的数据
		var selected = $.ligerui.get('exam_paper_multionline__grid').getSelecteds();
		//如果一行都没有选中,就报错并退出函数
		if(selected.length==0){alert(top.getIl8n('noSelect'));return;}
		//弹框让用户最后确认一下,是否真的需要删除.一旦删除,数据将不可恢复
		if(confirm( top.getIl8n('sureToDelete') )){
			var ids = "";
			//遍历每一行元素,获得 id 
			for(var i=0; i<selected.length; i++){
				ids += selected[i].pid+",";
			}
			ids = ids.substring(0,ids.length-1);				
			
			$.ajax({
				url: config_path__exam_paper_multionline__remove,
				data: {
					ids: ids 
					
	                ,executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=="1"){
						$.ligerui.get('exam_paper_multionline__grid').loadData();
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
			 content: "<iframe id='exam_paper_upload_if' style='display:none' name='send'><html><body>x</body></html></iframe><form id='xx' method='post' enctype='multipart/form-data' action="+config_path__exam_paper_multionline__upload+" target='send'><input name='file' type='file' /><input name='executor' value='"+top.basic_user.loginData.username+"' style='display:none' /><input name='session' value='"+top.basic_user.loginData.session+"' style='display:none' /><input type='submit' value='"+top.getIl8n('exam_paper','submit')+"' /></form>"
			,height: 150
			,width: 400
			,isHidden: false
		});

		$("#exam_paper_upload_if").load(function(){
	        var d = $("#exam_paper_upload_if").contents();	        
	        var s = $('body',d).html() ;
	        if(s=='')return;
	        eval("var obj = "+s+";");
	        if(obj.status=='1'){
	        	$.ligerui.get("exam_paper_multionline__grid").loadData();
	        }else{
	        	alert(obj.msg);
	        }
	    });  
	}
		
	,download: function(){
		var select = exam_paper_multionline.grid_getSelectOne();
		if(select==null)return;
		
		$.ajax({
			url: config_path__exam_paper_multionline__download,
			data: {
				id: select.pid 
				
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

		//从服务端读取信息,填充表单内容
		$.ajax({
			url: config_path__exam_paper_multionline__view
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
				$.ligerui.get('time_start').setValue(data.time_start);				
				$.ligerui.get('time_stop').setValue(data.time_stop);
				$.ligerui.get('passline').setValue(data.passline);
			}
		});
			
		var config = {
				id: 'modify',
				fields: [
					 { display: top.getIl8n('exam_paper_multionline','time_start'), name: "time_start", type: "date" ,options:{ showTime: true}  }
					,{ display: top.getIl8n('exam_paper_multionline','time_stop'), name: "time_stop", type: "date" ,options:{ showTime: true}  }
					,{ display: top.getIl8n('exam_paper_multionline','passline'), name: "passline", type: "text" ,validate: { required:true, number: true} }			
				]
			};
			
		$(document.body).append("<form id='form'></form>");
		$('#form').ligerForm(config);			
		$('#form').append('<br/><br/><br/><br/><input type="submit" value="'+top.getIl8n('submit')+'" id="submit" class="l-button l-button-submit" />' );
		
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
					url: config_path__exam_paper_multionline__modify,
					data: {
		                 executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session
		                
						,data:$.ligerui.toJSON({
							 time_start: $('#time_start').val()
							,time_stop: $('#time_stop').val()
							,passline: $.ligerui.get('passline').getValue()
							,paper_id: getParameter("id", window.location.toString() )
						})
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						//服务端添加成功,修改 AJAX 通信状态,修改按钮的文字信息,读取反馈信息
						if(response.status=="1"){							
							exam_paper_multionline.ajaxState = false;
							alert( top.getIl8n('basic_user','done') );
							$("#submit").remove();
						//服务端添加失败
						}else{
							basic_user.ajaxState = false;
							$("#submit").attr("value",top.getIl8n('submit'));
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

    	$(document.body).html("<div id='menu'  ></div><div id='content' style='width:99%;margin-top:5px;'></div>");
    	var htmls = "";
    	$.ajax({
            url: config_path__exam_paper_multionline__view
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
                items.push({
                    text: top.getIl8n('exam_paper_multionline','order'), click : function(){        								
        					
    					var id = getParameter("id", window.location.toString() ) ;
    					top.$.ligerDialog.open({ 
    						url: 'exam_paper_multionline__order.html?id='+id
    						,height: 450
    						,width: 400
    						,title: top.getIl8n('exam_paper_multionline','order')
                            ,showMax: true
                            ,showToggle: true
                            ,showMin: true
                            ,isResize: true
                            ,modal: false
                            ,slide: false  
                            ,isHidden:false
    						,id: 'exam_paper_multionline__order_'+id
    					});	
    					
    			        top.$.ligerui.get("exam_paper_multionline__order_"+id).close = function(){
    			            var g = this;
    			            top.$.ligerui.win.removeTask(this);
    			            g.unmask();
    			            g._removeDialog();
    			            top.$.ligerui.remove(top.$.ligerui.get("exam_paper_multionline__order_"+id));
    			        };
    				}
                    
                });                   

            	$("#menu").ligerToolBar({
            		items:items
            	});

            }
            
            ,error : function(){               
                alert(top.il8n.disConnect);
            }
        });
	}
	
    ,order: function(){
		var config = {
				id: 'exam_paper_multionline__order'
				,height:'100%'
				,columns: [			    
				     { display: top.getIl8n("exam_paper_log","mycent"), name: 'mycent', width: 100 }
				    ,{ display: top.getIl8n("exam_paper_log","creater_code"), name: 'creater_code', width: 100 }
				    ,{ display: top.getIl8n("exam_paper_log","creater_group_code"), name: 'creater_group_code', width: 100 }
			    
				],  usePager: false ,rownumbers:true
				,parms : {
	                 executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session     
	                ,id: getParameter("id", window.location.toString() )
				},
				url: config_path__exam_paper_multionline__order,
				method: "POST"
		};
		
		$(document.body).ligerGrid(config);
	}
    
    ,close: function(){
		var select = exam_paper_multionline.grid_getSelectOne();
		if(select==null){
			alert( top.getIl8n('selectOne') );
			return;
		}
		
		$.ajax({
			url: config_path__exam_paper_multionline__close,
			data: {
				pid: select.pid 
				
                ,executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
			}
			,type: "POST"
			,dataType: 'json'
			,success: function(response) {
				if(response.status=="1"){
					alert("OK");
					$.ligerui.get("exam_paper_multionline__grid").loadData();
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
};

paper.submit = function(){    
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

    		data.img = this.questions[i].getImg()
    	}
        toSend.push(data);
        ids += this.questions[i].id+",";//搜集所有题目的编号
    }        
    ids = ids.substring(0,ids.length-1);//去掉最后一个 ,  TODO 
    var paperObj = this;
    
    $.ajax({
        url : config_path__exam_paper_multionline__submit,
        type : 'POST',
        data : {
              json: $.ligerui.toJSON(toSend)
        	 ,paper_id: getParameter("id", window.location.toString() )
        	 ,exam_id: getParameter("exam_id", window.location.toString() )
        	 
             ,executor: top.basic_user.loginData.username
             ,session: top.basic_user.loginData.session

        }, 
        dataType: 'json',
        success : function(response) {
        	alert(response.msg);            
            $('#submit').remove();
        }
    }); 
};