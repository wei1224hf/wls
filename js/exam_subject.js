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
						,height: 250
						,width: 300
						,title: top.getIl8n('add')
                        ,isHidden: false
						,showMax: true
						,showToggle: true
						,showMin: true	
						,modal: false
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
						,height: 250
						,width: 300
						,title: top.getIl8n('modify')
						,id: "exam_subject__group_get__"+selected.code
                        ,isHidden: false
						,showMax: true
						,showToggle: true
						,showMin: true	
						,modal: false
					});	
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
				,{ display: top.getIl8n('type'), name: "exam_subject__type", type: "select" , options :{data: basic_parameter_data.exam_subject__type, valueField : "code" , textField: "value", slide: false }, validate: {required:true} }
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
		selected = $.ligerui.get('exam_subject__grid').getSelecteds();
		if(selected.length==0){alert(top.getIl8n("noSelect"));return;}
		var codes = "";
		for(var i=0; i<selected.length; i++){
			codes += selected[i].code+",";
		}
		codes = codes.substring(0,codes.length-1);		
		if(confirm(top.getIl8n("sureToDelete"))){			
			$.ajax({
				url: config_path__exam_subject__remove
				,data: {
					codes: codes 
					
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
					alert("net error");
				}
			});				
		}	
	}
	
	,group_set: function(codes,code){
		if(exam_subject.ajaxState)return;							
		exam_subject.ajaxState = true;
		
		$.ajax({
			url: config_path__exam_subject__group_set,
			data: {
				 codes: codes.join(",")
				,code: code
				
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			},
			type: "POST",
			dataType: 'json',
			success: function(response) {
				exam_subject.ajaxState = false;
				if(response.status!="1"){					
					alert(response.msg);
				}else{
					alert(top.getIl8n('done'));
				}
			},
			error : function(){
				alert("net error");
			}
		});
	}	

    ,treegrid: function(dom){

        if (typeof(dom) == "undefined")dom = document.body;
        var config = {
            columns: [   
                 { display: '名称', name: 'name', id:'name',width: 250 ,align: 'left' }
                ,{ display: '编码', name: 'code_', id:'code_',width: 250 ,align: 'left' }
                ,{ display: '权重', name: 'weight',width: 250 ,align: 'left' }
                ,{ display: '类型', name: 'type',width: 250 ,align: 'left' }
            ]
        	,id: "exam_subject__grid"
        	,width: '100%'
        	,height: '100%'
        	,tree: { columnId: 'name' }
        	,usePager: false
        	,onGroupExtend: function(rowdata){
        		var code = rowdata.code;
        		var children = rowdata.children;
        		if(children.length==0){
        	        $.ajax({
        	             url: config_path__exam_subject__treegrid
        	            ,data: {                    
        	                 upcode: rowdata.code_
        	                
        	                ,executor: top.basic_user.loginData.username
        	                ,session: top.basic_user.loginData.session
        	            }
        	            ,type: "POST"
        	            ,dataType: 'json'       
        	            ,success: function(response) {
        	            	var target = $.ligerui.get("exam_subject__grid").getRow(rowdata.__index);
        	            	for(var i=0;i<response.Rows.length;i++){
        	            		$.ligerui.get("exam_subject__grid").add(response.Rows[i],null,true,target);
        	            	}
        	            }           
        	            ,error : function(){               
        	                alert("net error");
        	            }
        	        });
        		}
        	}
            ,parms : {
                executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session     
                ,upcode: "0"
            }        	
        	,url: config_path__exam_subject__treegrid
        	,toolbar: { items: []}
        	,method: "POST"         
        };

        var permission = top.basic_user.permission;
        for(var i=0;i<permission.length;i++){
            if(permission[i].code=='60'){
                permission = permission[i].children;                
            }
        }
        for(var i=0;i<permission.length;i++){
            if(permission[i].code=='6005'){
                permission = permission[i].children;                
            }
        } 
        
        for(var i=0;i<permission.length;i++){   
            
            var theFunction = function(){};
            var thecode = permission[i].code;
            var actioncode = thecode.substring(thecode.length-2,thecode.length);
            
            if(actioncode=='01'){
            	continue;
                theFunction = exam_subject.search;
            }
            if(actioncode=='02'){
                theFunction = function(){
                    var selected = exam_subject.grid_getSelectOne();
                    if(selected==null)return;
                    if(selected.type=='10')return;

                    var id = selected.id;
                    if(top.$.ligerui.get("exam_subject__view_"+id)){
                        top.$.ligerui.get("exam_subject__view_"+id).show();
                        return;
                    }                   
                    var win = top.$.ligerDialog.open({ 
                        url: 'exam_subject__view.html?id='+selected.id+'&random='+Math.random()
                        ,height: 450
                        ,width: 700
                        ,title: selected.name
                        ,isHidden: false
                        , showMax: true
                        , showToggle: true
                        , showMin: true                     
                        , id: 'exam_subject__view_'+selected.id
                        , modal: false
                    }); 
                    win.doMax();
                };
            }           
            else if(actioncode =='11'){
                theFunction = exam_subject.upload;
            }
            else if(actioncode =='12'){
                theFunction = exam_subject.download;
            }   
            else if(actioncode =='23'){
                theFunction = exam_subject.remove;
                //config.checkbox = true;
            }           
            else if(actioncode=='21'){
                theFunction = function(){           
                        
                    var win = top.$.ligerDialog.open({ 
                         url: 'exam_subject__add.html'
                        ,height: 500
                        ,width: 400
                        ,isHidden: false
                        , showMax: true
                        , showToggle: true
                        , showMin: true 
                        , modal: false
                        , id: "exam_subject__add"
                        ,title:  getIl8n("exam_subject","exam_subject") + " " + getIl8n("add")
                    }); 
                   win.doMax();
                };
            }
            else if(actioncode=='22'){
                theFunction = function(){
                    var selected = exam_subject.grid_getSelectOne();
                    if(selected==null)return;
                    if(selected.type=='10')return;                    
                    var win = top.$.ligerDialog.open({ 
                         url: 'exam_subject__modify.html?random='+Math.random()+"&id="+selected.id
                        , height: 500
                        , width: 400
                        , title: il8n.basic_normal.modify+" "+selected.name
                        , isHidden: false
                        , showMax: true
                        , showToggle: true
                        , showMin: true 
                        , modal: false
                        , id: "exam_subject__modify"
                    });     
                    win.doMax();
                };          
            }           
            else if(actioncode=='23'){
                theFunction = exam_subject.remove;
            }
            else if(actioncode=='91'){
            	theFunction = function(){
            		top.topdata.nogroupsheader = true;
	                var selected = exam_subject.grid_getSelectOne();
	                if(selected==null)return;
	                if(selected.type!='20'){
	                	alert("type must be 20");
	                	return;                    
	                }
	                var win = $.ligerDialog.open({ 
	                     url: 'basic_group__treegrid.html?random='+Math.random()+"&id="+selected.id
	                    , height: 550
	                    , width: 600
	                    , title: il8n.basic_normal.modify+" "+selected.name
	                    , isHidden: false
	                    , modal: false
	                    , id: "basic_group__treegrid"
	                    ,buttons: [
                           { text: il8n.basic_normal.submit, onclick: function (item, dialog) { 
                        	   var groups = top.topdata.groups;
                        	   console.debug(top.topdata);
                        	   var codes = [];
                        	   var code = selected.code_;
                        	   for(var i=0;i<groups.length;i++){
                        		   var item = groups[i];
                        		   if(item.type != '99'){
                        			   codes.push(item.code_);
                        		   }              
                        	   }
                        	   
                        	   exam_subject.group_set(codes,code);
                           } },
	                    ]
	                });     
	               
            	};
            }            
                
            config.toolbar.items.push({line: true });
            config.toolbar.items.push({
                text: permission[i].name , img:permission[i].icon , click : theFunction , id: permission[i].code
            });             
        }         
        
        $(dom).ligerGrid(config);
    }
    
	,viewData: {}
	,view: function(){
		var id = getParameter("id", window.location.toString() );
    	$(document.body).html("<div id='menu'  ></div><div id='content' style='width:"+($(window).width()-170)+"px;margin-top:5px;'></div>");
    	var htmls = "";
    	$.ajax({
            url: config_path__exam_subject__view
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
            	exam_subject.viewData = response.data;
            	if(typeof(data.photo)=="undefined") data.photo = '../file/tavatar.gif';
            	
            	var tablename = "exam_subject";
            	for(var j in data){               		
            		if(j=='sql'||j=='type'||j=='status'||j=='used'||j=='structure'||j=='x')continue;
            		if(j=='photo'){
        				htmls += '<div style="position:absolute;right:5px;top:25px;background-color: rgb(220,250,245);width:166px;height:176px;"><img style="margin:2px;" src="'+data[j]+'" width="160" height="170" /></div>'
        				continue;
            		}
            		
            		if(j=="address"||j=="directions"||j=="remark"){
            			var key = il8n[tablename][j];
            			htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";
            			htmls += "<span class='view_lable' style='width:95%'>"+key+"</span><span style='width:95%' class='view_data'>"+data[j]+"</span>";
            			continue;
            		}     
            		
            		if(j=="level_net"||j=="floor"||j=="height_bottom"||j=="owner"){
            			htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";
            		}
       		
            		if(j=='id'){
            			tablename = "basic_normal";
            			htmls+="<div style='width:100%;float:left;display:block;margin-top:5px;'/>";
            		}           		

            		var key = il8n[tablename][j];
            		htmls += "<span class='view_lable'>"+key+"</span><span class='view_data'>"+data[j]+"</span>";
            	}; 
            	
            	$("#content").html(htmls);
            	            	
                var items = [];        
                var permission = [];
                var thepermissions = ","+top.basic_user.loginData.permissions+",";
                if(thepermissions.indexOf(",520422,")!=-1){
                    permission.push( {code:'22',icon:"../file/icon16X16/22.png","name": il8n.basic_normal.modify});  
                }
                if(thepermissions.indexOf(",520401,")!=-1){
                    permission.push( {code:'01',icon:"../file/icon16X16/01.png","name": il8n.basic_normal.search});  
                }               
                
                for(var i=0;i<permission.length;i++){        
                    var theFunction = function(){};
                    if(permission[i].code=='22'){
                        theFunction = function(){
                            var win = top.$.ligerDialog.open({ 
                                 url: 'company__modify.html?id='+data.id
                                , height: 500
                                , width: 700
                                , isHidden: false
                                , showMax: true
                                , showToggle: true
                                , showMin: true 
                                , title: data.name
                                , id: "company__modify"+data.code
                                , modal: false
                            }); 
                            win.doMax();
                        };
                    }  
                    else if(permission[i].code=='01'){
                        theFunction = function(){
                            if(top.$.ligerui.get("company__grid")){
                                top.$.ligerui.get("company__grid").active();
                                return;
                            }
                            var win = top.$.ligerDialog.open({ 
                                 url: 'company__grid.html'
                                , height: 500
                                , width: 700
                                , isHidden: false
                                , showMax: true
                                , showToggle: true
                                , showMin: true 
                                , title: il8n.company.company
                                , id: "company__grid"
                                , modal: false
                            }); 
                            win.doMax();
                        };
                    }                                        
                    else{
                        continue;
                    }
                    
                    items.push({line: true });	
					items.push({text: permission[i].name , img:permission[i].icon , click : theFunction});
                }                

                if(items.length>0){
	            	$("#menu").ligerToolBar({
	            		items:items
	            	});
                }else{
                	$('#menu').remove();
                }
                
                var resized = false;
                $(window).resize(function(){
                    if(resized==true)return;
                    var arr = $("[ligeruiid]");
                    for(var i=0;i<arr.length;i++){
                        var id = $(arr[i]).attr("ligeruiid");                        
                        $.ligerui.remove($.ligerui.get(id));
                    }
                    $(document.body).empty();
                    company.view();
                    resized = true;
                });

            },
            error : function(){               
                alert(il8n.basic_normal.disConnect);
            }
        });
	}
};