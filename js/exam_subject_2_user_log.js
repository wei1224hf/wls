var exam_subject_2_user_log = {
	
	
	 config: null
	,loadConfig: function(afterAjax){
		$.ajax({
			url: config_path__exam_subject_2_user_log__loadConfig
			,dataType: 'json'
	        ,type: "POST"
	        ,data: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
	        } 			
			,success : function(response) {
				exam_subject_2_user_log.config = response;
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

	,search: function(){
		var formD;
		if($.ligerui.get("formD")){
			formD = $.ligerui.get("formD");
			formD.show();
		}else{
			var form = $("<form id='form'></form>");
			var config = {
					inputWidth: 170
					,labelWidth: 90
					,space: 40
					,fields: [
			          	 { display: top.getIl8n('time_start'), name: "examp_paper__search_time_created__start", type: "date" }
			          	,{ display: top.getIl8n('time_stop'), name: "examp_paper__search_time_created__stop", type: "date" }
						,{ display: top.getIl8n('exam_paper','subject'), name: "examp_paper__search_subject", newline: true, type: "select", options :{data : exam_subject_2_user_log.config.subject, valueField : "code" , textField: "value" } }
						,{ display: top.getIl8n('time_dimension'), name: "time_dimension", newline: true, type: "select", options :{data : [{"code":"day","value":top.getIl8n('day')},{"code":"month","value":top.getIl8n('month')}], valueField : "code" , textField: "value" } }
					]
				};
			if(top.basic_user.loginData.type=='10'||top.basic_user.loginData.type=='30'){
				config.fields.push({ display: top.getIl8n("exam_subject_2_user_log","student"), name: "student",  type: "text"  });
				config.fields.push({ display: top.getIl8n("exam_subject_2_user_log","group"), name: "group",  type: "text"  });
			}
			$(form).ligerForm(config); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 250
				,content: form
				,title: top.getIl8n('exam_paper','search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('exam_paper','clear'), onclick:function(){
						$.ligerui.get("exam_subject_2_user_log__grid").options.parms.search = "{}";
						$.ligerui.get("exam_subject_2_user_log__grid").loadData();
						
						$.ligerui.get("examp_paper__search_time_created__start").setValue('');
						$.ligerui.get("examp_paper__search_time_created__stop").setValue('');
						$.ligerui.get("time_dimension").setValue('');
						$.ligerui.get("examp_paper__search_subject").setValue('');
					}},
					//提交查询条件
				    {text: top.getIl8n('exam_paper','search'), onclick:function(){
						var data = {};
						var  time_created__start =		$('#examp_paper__search_time_created__start').val()
						 	,time_created__stop = 		$('#examp_paper__search_time_created__stop').val()
						 	,time_dimension = 		$.ligerui.get("time_dimension").getValue()
						 	,subject_code =	$.ligerui.get("examp_paper__search_subject").getValue();
						
						if(time_created__start!="")data.time_created__start = time_created__start;
						if(time_created__stop!="")data.time_created__stop = time_created__stop;
						if(time_dimension!="")data.time_dimension = time_dimension;
						if(subject_code!="")data.subject_code = subject_code;
						
						$.ligerui.get("exam_subject_2_user_log__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_subject_2_user_log__grid").loadData();
				}}]
			});
		}
	}

	,grid: function(){
		var config = {
				id: 'exam_subject_2_user_log__grid'
				,height:'100%'
				,columns: [
				   
				     { display: top.getIl8n("exam_paper","subject_code"), name: 'subject_code', hide:true }
				    ,{ display: top.getIl8n("exam_paper","subject_name"), name: 'subject_name', width: 100 }

				    ,{ display: top.getIl8n("exam_subject_2_user_log","proportion"), name: 'proportion', isSort: true}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","count_negative"), name: 'negative', isSort: true}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","count_positive"), name: 'postive', isSort: true}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","count_log"), name: 'count_log', isSort: true}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","time_created"), name: 'time', width: 100 }
			    
				],  pageSize:20 ,rownumbers:true
				,parms : {
	                executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session     
	                ,search: "{}"
				},
				url: config_path__exam_subject_2_user_log__grid,
				method: "POST",				
				toolbar: { items: []}
		};
		
		//配置列表表头的按钮,根据当前用户的权限来初始化
		var permission = [];
		for(var i=0;i<top.basic_user.permission.length;i++){
			if(top.basic_user.permission[i].code=='60'){
				permission = top.basic_user.permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='6006'){
						permission = permission[j].children;
					}
				}				
			}
		}
		for(var i=0;i<permission.length;i++){
			var theFunction = function(){};
			if(permission[i].code=='600601'){
				theFunction = exam_subject_2_user_log.search;
			}else if(permission[i].code=='600692'){
				theFunction = function(){
					var selected = exam_subject_2_user_log.grid_getSelectOne();
					if(selected==null)return;	
					if(selected.status=='10'){
						alert(top.getIl8n('exam_subject_2_user_log','markedAlready'));
						return;
					}
					
					var id = selected.id;
					top.$.ligerDialog.open({ 
						url: 'exam_subject_2_user_log__do.html?id='+id+'&random='+Math.random()
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
						,id: 'exam_subject_2_user_log__do_'+id
					}).max();	
					
			        top.$.ligerui.get("exam_subject_2_user_log__do_"+id).close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_subject_2_user_log__do_"+id));
			        };
				}
			}
			
			config.toolbar.items.push({line: true });
			config.toolbar.items.push({text: permission[i].name , img: permission[i].icon , click: theFunction });
		}
		
		$(document.body).ligerGrid(config);
	}
	
	,initDom: function(){
		$('body').append("<form id='form'></form>");
		
		$('body').append('<div id="container" style="width: 99%; height: 400px; margin: 0 auto"></div>');		
		$("#form").ligerForm({
		    inputWidth: 170, labelWidth: 90, space: 40,
		    fields: [
			     { display: top.getIl8n("time_start"), name: "time_start",  type: "date", validate: {required:true} }
			    ,{ display: top.getIl8n("time_stop"), name: "time_stop",  type: "date" ,newline: false, validate: {required:true}  }
				,{ display: top.getIl8n('exam_paper','subject'), name: "subject", newline: true, type: "select", options: {data : exam_subject_2_user_log.config.subject, valueField : "code" , textField: "value" },  validate: {required:true}  }
				,{ display: top.getIl8n('time'), name: "gap", newline: true, type: "select", options: {data : [{'code':'day','value':top.getIl8n('day')},{'code':'month','value':top.getIl8n('month')}], valueField: "code" , textField: "value" }, newline: false, validate: {required:true}  }
				,{ display: top.getIl8n('type'), name: "type", newline: true, type: "select", options: {data : [{'code':'line','value':top.getIl8n('exam_subject_2_user_log','lineChart')},{'code':'rader','value':top.getIl8n('exam_subject_2_user_log','raderChart')}], valueField: "code" , textField: "value" }, newline: false, validate: {required:true}  }
		    ]
		});			
		
		$('#form').append('<br/><br/><input type="submit" value="'+top.getIl8n('statistic')+'" id="basic_user__submit" class="l-button l-button-submit" />' );
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
				exam_subject_2_user_log.statistics();
			}
		});		
	}
	
	,statistics: function(){
		var type = $.ligerui.get('type').getValue();
		if(type=='line'){		
			$.ajax({
			    url: config_path__exam_subject_2_user_log__statistics_time
			    ,dataType: 'json'
			    ,type: "POST"
			    ,data: {
			    	 executor: top.basic_user.loginData.username
			        ,time_start: $('#time_start').val()
			       	,time_stop: $('#time_stop').val()
			       	,gap: $.ligerui.get('gap').getValue()
			       	,subject: $.ligerui.get('subject').getValue()
			    }           
			    ,success : function(response) {
			    	var categories = [];
			    	var data = [];
			    	for(var i=0;i<response.data.length;i++){
			    		categories.push(response.data[i].time);
			    		data.push(response.data[i].data*1);
			    	}
			    	
			        $('#container').highcharts({
			        	title: '',
			            chart: {
			                type: 'line',
			                marginRight: 130,
			                marginBottom: 25
			            },
			            xAxis: {
			                categories: categories
			            },
			            yAxis: {min: 30, max: 100, title: {text: '成绩'}},
	
			            legend: {
			                layout: 'vertical',
			                align: 'right',
			                verticalAlign: 'top',
			                x: -10,
			                y: 100,
			                borderWidth: 0
			            },
			            series: [{
			                
			                data: data
			            }]
			        });
			        $('.highcharts-container').css('overflow','');
	
			    }
			    ,error : function(){                
			        alert(top.il8n.disConnect);
			    }
			});
		}else{
			$.ajax({
			    url: config_path__exam_subject_2_user_log__statistics_subject
			    ,dataType: 'json'
			    ,type: "POST"
			    ,data: {
			    	 executor: top.basic_user.loginData.username
			        ,time: $('#time_start').val()
			       	,subject: $.ligerui.get('subject').getValue()
			       	,gap: $.ligerui.get('gap').getValue()
			    }           
			    ,success : function(response) {
			    	var categories = [];
			    	var data = [];
			    	for(var i=0;i<response.data.length;i++){
			    		categories.push(response.data[i].subject_name);
			    		data.push(response.data[i].data*1);
			    	}
			    	
			        $('#container').highcharts({
			            
			    	    chart: {
			    	        polar: true
			    	    },
			    	    
			    	    title: {
			    	        text: ''
			    	    },
			    	    
			    	    pane: {
			    	        startAngle: 0,
			    	        endAngle: 360
			    	    },
			    	
			            xAxis: {
			    	        tickInterval: 1,
			    	        min: 0,
			    	        max: data.length,
			    	        labels: {
			    	        	formatter: function () {
			    	        		return categories[this.value];
			    	        	}
			    	        }
			            },
			    	        
			    	    yAxis: {
			    	        min: 20
			    	    },    
			    	    
			    	    series: [  {
			    	        type: 'area',
			    	        name: $('#subject').val(),
			    	        data: data
			    	    }]
			    	});
			        $('.highcharts-container').css('overflow','');
	
			    }
			    ,error : function(){                
			        alert(top.il8n.disConnect);
			    }
			});
		}
	}
};