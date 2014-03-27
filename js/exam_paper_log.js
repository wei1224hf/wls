var exam_paper_log = {
		
	search: function(){
		var formD;
		if($.ligerui.get("formD")){
			formD = $.ligerui.get("formD");
			formD.show();
		}else{
			$(document.body).append("<form id='form' ></form>");
			$(form).ligerForm({
				inputWidth: 170
				,labelWidth: 90
				,space: 40
				,fields: [
					 { display: top.getIl8n('exam_paper_log','title'), name: "examp_paper__search_title", newline: false, type: "text" }
					,{ display: top.getIl8n('status'), name: "examp_paper__search_status", newline: true, type: "select", options :{data : basic_parameter_data.exam_paper_log__status, valueField : "code" , textField: "value" } }
					,{ display: top.getIl8n('type'), name: "examp_paper__search_type", newline: true, type: "select", options :{data : basic_parameter_data.exam_paper_log__type, valueField : "code" , textField: "value" } }
					//,{ display: top.getIl8n('exam_paper','subject'), name: "examp_paper__search_subject", newline: true, type: "select", options :{data : basic_parameter_data.exam_subject__code, valueField : "code" , textField: "value" } }
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('exam_paper_log','search')
				,buttons : [
				    //清空查询条件
					{text: top.getIl8n('exam_paper_log','clear'), onclick:function(){
						$.ligerui.get("exam_paper_log__grid").options.parms.search = "{}";
						$.ligerui.get("exam_paper_log__grid").loadData();
						
						$.ligerui.get("examp_paper__search_title").setValue('');
						$.ligerui.get("examp_paper__search_status").setValue('');
						$.ligerui.get("examp_paper__search_type").setValue('');
						$.ligerui.get("examp_paper__search_subject").setValue('');
					}},
					//提交查询条件
				    {text: top.getIl8n('exam_paper_log','search'), onclick:function(){
						var data = {};
						var  title =		$.ligerui.get("examp_paper__search_title").getValue()
						 	,status = 		$.ligerui.get("examp_paper__search_status").getValue()
						 	,type = 		$.ligerui.get("examp_paper__search_type").getValue()
						 	,subject_code =	$.ligerui.get("examp_paper__search_subject").getValue();
						
						if(title!="")data.title = title;
						if(status!="")data.status = status;
						if(type!="")data.type = type;
						if(subject_code!="")data.subject_code = subject_code;
						
						$.ligerui.get("exam_paper_log__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("exam_paper_log__grid").loadData();
				}}]
			});
		}
	}

	,grid: function(){
		var config = {
				id: 'exam_paper_log__grid'
				,height:'100%'
				,columns: [
				   
				     { display: top.getIl8n("exam_paper","subject_code"), name: 'subject_code', hide:true }
				    ,{ display: top.getIl8n("exam_paper","subject_name"), name: 'subject_name', width: 100 }
				    ,{ display: top.getIl8n("exam_paper_log","title"), name: 'title', width: 100 }
				    ,{ display: top.getIl8n("exam_paper_log","mycent"), name: 'mycent', width: 50 }
				    ,{ display: top.getIl8n("exam_paper_log","count_right"), name: 'count_right', width: 50 }
				    ,{ display: top.getIl8n("exam_paper_log","count_wrong"), name: 'count_wrong', width: 50 }
				    ,{ display: top.getIl8n("exam_paper_log","proportion"), name: 'proportion', width: 100, hide:true }				    
				    ,{ display: top.getIl8n("exam_paper_log","cent"), name: 'cent', width: 50 }
				    
				    ,{ display: top.getIl8n("exam_paper_log","id"), name: 'id', isSort: true, hide:true }
				    ,{ display: top.getIl8n("exam_paper_log","time_created"), name: 'time_created', width: 100 }
				    ,{ display: top.getIl8n("exam_paper_log","type"), name: 'type', isSort: false, hide:true  }
				    ,{ display: top.getIl8n("exam_paper_log","status"), name: 'status', isSort: false, hide:true  }
				    ,{ display: top.getIl8n("exam_paper_log","type"), name: 'type_', isSort: false, width: 100 }
				    ,{ display: top.getIl8n("exam_paper_log","status"), name: 'status_', isSort: false, width: 100 }		
				    ,{ display: top.getIl8n("exam_paper_log","creater_code"), name: 'creater_code', hide:true }
				    ,{ display: top.getIl8n("exam_paper_log","teacher_code"), name: 'teacher_code', hide:true }
				    ,{ display: top.getIl8n("exam_paper_log","creater_group_code"), name: 'creater_group_code', hide:true }
			    
				],  pageSize:20 ,rownumbers:true
				,parms : {
	                executor: top.basic_user.loginData.username
	                ,session: top.basic_user.loginData.session     
	                ,search: "{}"
				},
				url: config_path__exam_paper_log__grid,
				method: "POST",				
				toolbar: { items: []}
		};
		
		//配置列表表头的按钮,根据当前用户的权限来初始化
		var permission = [];
		for(var i=0;i<top.basic_user.permission.length;i++){
			if(top.basic_user.permission[i].code=='60'){
				permission = top.basic_user.permission[i].children;
				for(var j=0;j<permission.length;j++){
					if(permission[j].code=='6003'){
						permission = permission[j].children;
					}
				}				
			}
		}
		for(var i=0;i<permission.length;i++){
			var theFunction = function(){};
			if(permission[i].code=='600301'){
				theFunction = exam_paper_log.search;
			}else if(permission[i].code=='600391'){
				theFunction = function(){
					var selected = exam_paper_log.grid_getSelectOne();
					if(selected==null)return;	
					if(selected.status=='10'){
						alert(top.getIl8n('exam_paper_log','markedAlready'));
						return;
					}
					
					var id = selected.id;
					top.$.ligerDialog.open({ 
						url: 'exam_paper_log__do.html?id='+id+'&random='+Math.random()
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
						,id: 'exam_paper_log__do_'+id
					}).max();	
					
			        top.$.ligerui.get("exam_paper_log__do_"+id).close = function(){
			            var g = this;
			            top.$.ligerui.win.removeTask(this);
			            g.unmask();
			            g._removeDialog();
			            top.$.ligerui.remove(top.$.ligerui.get("exam_paper_log__do_"+id));
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
		if($.ligerui.get('exam_paper_log__grid').options.checkbox){
			selected = $.ligerui.get('exam_paper_log__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("exam_paper_log","selectOne") );
				return null;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('exam_paper_log__grid').getSelected();
			if(selected==null){
				alert(getIl8n("exam_paper_log","selectOne"));
				return null;
			}
		}	
		return selected;
	}
	
	
};

paper.readQuestions = function(afterAjax){
    var paperObj = this;
    $.ajax({
        url : config_path__exam_paper_log__questions,
        type : "POST",
        data : {
        	 id: getParameter("id", window.location.toString() )
        	 
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

paper.initQuestions = function() {
	
	var quesData = this.questions;
	var questions_ = [];
	
	var index = 1;
    for(var i=0;i<quesData.length;i++){
        var question = null;
        if(quesData[i].type==1){//单项选择题
        	continue;                   
        }
        else if(quesData[i].type==2){//多项选择题
        	continue;
        }
        else if(quesData[i].type==3){//判断题
        	continue;
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
        //console.debug(index+"     "+quesData[i].type);
        question.type = quesData[i].type;
        question.path_listen = quesData[i].path_listen;
        question.path_img = quesData[i].path_img;
        question.cent = quesData[i].cent;
        question.id = quesData[i].id;
        question.id_parent = quesData[i].id_parent;
        question.paper = this;

    	question.myAnswer = quesData[i].myanswer;
    	question.myanswer_img = quesData[i].img;
    	
    	question.answer = quesData[i].answer;
    	question.description = quesData[i].description;

        question.initDom();
        
        questions_.push(question);
    }    	
    for(var i=0;i<questions_.length;i++){
    	var question = questions_[i];
        if(question.type==4 || question.type==6){
        	question.showMark();
        	question.setMyAnswer();
        	question.setImg();
        	question.showDescription();
        }
    }
    this.questions = questions_;   	

	$('#wls_quiz_main').parent().css("overflow","auto");
 }
paper.initBrief = function(){}

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
    			mycent: this.questions[i].cent_
            };
        toSend.push(data);
        ids += this.questions[i].id+",";//搜集所有题目的编号
    }        
    ids = ids.substring(0,ids.length-1);//去掉最后一个 ,  TODO 
    var paperObj = this;
    
    $.ajax({
        url : config_path__exam_paper_log__submit,
        type : 'POST',
        data : {
              data: $.ligerui.toJSON(toSend)
        	 ,paper_log_id: getParameter("id", window.location.toString() )
        	 
             ,executor: top.basic_user.loginData.username
             ,session: top.basic_user.loginData.session
        }, 
        dataType: 'json',
        success : function(response) {
        	if(response.status!='1'){
        		alert(response.msg);
        	}else{
        		alert(top.getIl8n('exam_paper','cent_subjective')+" "+response.mycent);
        	}
            
            $('#submit').remove();
        }
    });
} 