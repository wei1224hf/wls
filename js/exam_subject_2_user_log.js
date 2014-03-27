var exam_subject_2_user_log = {
	
	search: function(){
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
			          	 { display: top.getIl8n('time_start'), name: "time_created__start", type: "date" }
			          	,{ display: top.getIl8n('time_stop'), name: "search_time_created__stop", type: "date" }
						,{ display: top.getIl8n('exam_paper','subject'), name: "subject_code", newline: true, type: "select", options :{data : [], valueField : "subject_code" , textField: "subject_name" } }
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
					{text: top.getIl8n('exam_paper','clear'), onclick:function(){
						$.ligerui.get("exam_subject_2_user_log__grid").options.parms.search = "{}";
						$.ligerui.get("exam_subject_2_user_log__grid").setOptions({newPage:1});
						$.ligerui.get("exam_subject_2_user_log__grid").loadData();
						
						var doms = $("[ligeruiid]",$('#form'));
						for(var i=0;i<doms.length;i++){
						    var theid = $(doms[i]).attr('ligeruiid');
						    $.ligerui.get(theid).setValue('');
						}
					}},
				    {text: top.getIl8n('exam_paper','search'), onclick:function(){
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
						
						$.ligerui.get("exam_subject_2_user_log__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_subject_2_user_log__grid").setOptions({newPage:1});
						$.ligerui.get("exam_subject_2_user_log__grid").loadData();
				}}]
			});
			
	        $.ajax({
	            url : config_path__exam_subject__getMy,
	            data : {
	                username: top.basic_user.loginData.username
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

	,grid: function(){
		var config = {
				id: 'exam_subject_2_user_log__grid'
				,height:'100%'
				,columns: [
				   
				     { display: top.getIl8n("exam_paper","subject_code"), name: 'subject_code', hide:true, width: 100 }
				    ,{ display: top.getIl8n("exam_paper","subject_name"), name: 'subject_name', width: 100 }

				    ,{ display: top.getIl8n("exam_subject_2_user_log","proportion"), name: 'proportion', isSort: true, width: 100}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","count_negative"), name: 'negative', isSort: true, width: 100}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","count_positive"), name: 'postive', isSort: true, width: 100}
				    ,{ display: top.getIl8n("exam_subject_2_user_log","count_log"), name: 'count_log', isSort: true, width: 100}
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
			var thecode = permission[i].code;
			var actioncode = thecode.substring(thecode.length-2,thecode.length);
			
			if(actioncode=='01'){
				theFunction = exam_subject_2_user_log.search;
			}
			else if(actioncode=='92'){
				theFunction = function(){
					if(top.$.ligerui.get("exam_subject_2_user_log__statistics")){
	                    top.$.ligerui.get("exam_subject_2_user_log__statistics").show();
	                    return;
	                }					
					var win = top.$.ligerDialog.open({ 
						url: 'exam_subject_2_user_log__statistics.html'
						,height: 450
						,width: 700
						,isHidden: false
						, showMax: true
						, showToggle: true
						, showMin: true	
						, modal: false
						, id: "exam_subject_2_user_log__statistics"
					});	
					win.doMax();
				}
			}			
			
			config.toolbar.items.push({line: true });
			config.toolbar.items.push({text: permission[i].name , img: permission[i].icon , click: theFunction });
		}
		
		$(document.body).ligerGrid(config);
	}
	
	,statistics: function(){
		//$(document.body).append("<div id='timeline' style='width:50%;height:300px;' />");
		var d = parent.$.ligerui.get("exam_subject_2_user_log__grid").data.Rows;
		var d2 = [];
		for(var i=0;i<d.length;i++){
			var date = new Date(d[i].time);
			d2.push([date.getTime(),parseInt(d[i].proportion)])
		}
		//console.debug(d2);return;
		$.plot("#timeline", [d2], {
			xaxis: { mode: "time" }
			,grid: {
				hoverable: true,
				clickable: true
			}
			,series: {
				lines: {
					show: true
				},
				points: {
					show: true
				}
			}		
		});
		
		$("<div id='tooltip'></div>").css({
			position: "absolute",
			display: "none",
			border: "1px solid #fdd",
			padding: "2px",
			"background-color": "#fee",
			opacity: 0.80
		}).appendTo("body");
		
		$("#timeline").bind("plothover", function (event, pos, item) {
			if (item) {
				var data = d[item.dataIndex];

				$("#tooltip").html(data.time+" : "+data.proportion)
					.css({top: item.pageY+5, left: item.pageX+5})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}

		});
		
		$("#timeline").bind("plotclick", function (event, pos, item) {
			if (item) {
				var data = d[item.dataIndex];
		        $.ajax({
		            url : config_path__exam_subject_2_user_log__getMySub,
		            data : {
		                executor: top.basic_user.loginData.username
		                ,session: top.basic_user.loginData.session     

	                	,username: top.basic_user.loginData.username
	                	,time: data.time
	                	,subject: data.subject_code
	                	,time_dimension: "day"

		            },
		            type : "POST",
		            dataType: 'json',    
		            success : function(data) {
		            	
		                var d1= [];
		                var d2 = [];
		                var d3 = [];
		                var lables = [];
		                for(var i=0;i<data.Rows.length;i++){
		                	d1.push([i,parseInt(data.Rows[i].proportion)]);
		                	d2.push([i,100]);
		                	d3.push([i,60]);
		                	lables.push({label:data.Rows[i].subject_name});
		                }
		                
		            	var data = [
		            			{ label: "mark", color:"green",data: d1, spider: {show: true, lineWidth: 12} }
		            			,{ label: " ", color:"black",data: d2, spider: {show: true, lineWidth: 1 ,pointSize: 3} }
		            			,{ label: " ", color:"red",data: d3, spider: {show: true, lineWidth: 2 ,pointSize: 2} }
		            		];
		            	var options = {
		            			series:{
		            				spider:{
		            					active: true
		            					,highlight: {mode: "area"}
		            					,legs: { 
		            						data:lables
		            						,legScaleMax: 1
		            						,legScaleMin:0.8
		            					}
		            					,spiderSize: 0.9
		            					//,pointSize: 100
		            	            }
		            			}
		            			,grid:{ hoverable: true,clickable: true,tickColor: "rgba(0,0,0,0.2)",mode: "radar"}
		            		};
		            	
		            	p1 = $.plot($("#spider"), data , options);
		            	$("#spider").bind("plotclick", function (event, pos, item) {
		        			if (item) {
		        				
		        			}
		            	});
		        		$("#spider").bind("plothover", function (event, pos, item) {
		        			if (item) {
		        				var data = d1[item.dataIndex];
		        				$("#tooltip").html(lables[item.dataIndex].label+" : "+data[1])
		        					.css({top: pos.pageY+5, left: pos.pageX+5})
		        					.fadeIn(200);
		        			} else {
		        				$("#tooltip").hide();
		        			}

		        		});
		            },
		            error : function(){
		                alert("net error");
		            }
		        });
			}
		});
	}
};