var log_doms,btn_doms = null;

var on_mode_changed = function(){
	var value = $('#mode').val();
	if(value!='WLS'){
		$('#host').attr('disabled',true);
		$('#unm').attr('disabled',true);
		$('#pwd').attr('disabled',true);
		$('#port').attr('disabled',true);
		$('#db').attr('disabled',true);
	}else{
		$('#host').attr('disabled',false);
		$('#unm').attr('disabled',false);
		$('#pwd').attr('disabled',false);
		$('#port').attr('disabled',false);
		$('#db').attr('disabled',false);
	}	
	
	if(value=='BAIDU')$('#db').attr('disabled',false);
};

var step0 = function(){
	log_doms = $('.log');
	btn_doms = $('.btn_step');
	$(btn_doms[0]).attr("disabled","disabled");

	$('[name=language]').attr("disabled","disabled");	
	eval("language = language['"+$('[name=language]').val()+"'];");
	for(var i=1;i<btn_doms.length;i++){
		$(btn_doms[i]).html(language.step+" "+i);
		$($(".directions_step")[i]).html(language.steps[i]);
	}
	 $($("fieldset")[1]).addClass("f_step");
	$('#mode').html(language.database.mode);
    $('#host').html(language.database.host);
    $('#username').html(language.database.username);
    $('#password_').html(language.database.password_);
    $('#name').html(language.database.name);
    $('#port').html(language.database.port);
    $('#type').html(language.database.type);
};

var step1 = function() {
    $(btn_doms[1]).attr("disabled", true);
    $.ajax({
        url : server_path+"?function=step1&rand="+Math.random(),
        dataType : 'json',
        type : "POST",
        data : {
                executor : "",
                session : ""
        },
        success : function(response) {
                $(log_doms[1]).append(response.msg + "<br/>");
                if (response.status == "1") {
                        $(btn_doms[1]).addClass("btn_done");
                        $(log_doms[1]).addClass("log_done");
                        $($("fieldset")[2]).addClass("f_step");
                } else {
                        $(btn_doms[0]).attr("disabled", false);
                }
        },
        error : function(response) {
                $(log_doms[1]).append(response.responseText);
                $(btn_doms[1]).attr("disabled", false);
                $(btn_doms[1]).attr("class", "btn_step");
        }
    });
};

var step2 = function() {
    var status = 1;

    var host = $('[name=host]').val();
    if (host == null || host == "")status = 0;

    var username = $('[name=username]').val();
    if (username == null || username == "")status = 0;

    var password_ = $('[name=password_]').val();
    //if(pwd==null||pwd=="")status = 0;

    var port = $('[name=port]').val();
    //if(port==null||port=="")status = 0;

    var name = $('[name=name]').val();
    if (name == null || name == "")status = 0;

    if (status == 0) {
        alert("Must input everything");
        return;
    }

    $(btn_doms[2]).attr("disabled", "disabled");
    $.ajax({
            url : server_path+"?function=step2&rand="+Math.random(),
            dataType : 'json',
            type : "POST",
            data : {
                    executor : "",
                    session : "",
                    
                    username : username,
                    host : host,
                    password_ : password_,
                    name : name,
                    port : port,
                    il8n : $('[name=language]').val(),
                    type : $('[name=type]').val(),
                    mode : $('[name=mode]').val()
            },
            success : function(response) {
                    $(log_doms[2]).append(response.msg + "<br/>");
                    if (response.status == "1") {
                            $(btn_doms[2]).attr("disabled", true);
                            $(log_doms[2]).addClass("log_done");                           
                            var formItems = $("[name]",$("fieldset")[1]);
                            for(var i=0;i<formItems.length;i++){
                            	$(formItems[i]).attr("disabled","disabled");
                            }
                            $($("fieldset")[3]).addClass("f_step");
                    } else {
                            $(btn_doms[2]).attr("disabled", false);
                    }
            },
            error : function(response) {
                    $(log_doms[2]).append(response.responseText);
                    $(btn_doms[2]).attr("disabled", false);
                    $(btn_doms[2]).attr("class", "btn_step");
            }
    });
};

var step3 = function(){

    var btn_doms = $('.btn_step');
    $(btn_doms[3]).attr("disabled", true);
	$.ajax({
		url: server_path+"?function=step3"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[3]).append(response.msg + "<br/>");
			if(response.status=="1"){
				sqls = response.sql;
				step3_2();
			}else{
				$(btn_doms[3]).attr("disabled", false);
			}			
		}
		,error : function(response){				
			alert("net error");
			$(btn_doms[3]).attr("disabled", false);
		}
	});	
};

var sqls = [];
var offset = 0;
var step3_2 = function(){
	var sqls_ = [];
	for(var i=offset;(i<offset+20)&&(i<sqls.length-1);i++){
		sqls_.push(sqls[i]);
	}
	$.ajax({
		url: server_path+"?function=step3_2"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
			,sqls: $.ligerui.toJSON(sqls_)
        }         
        ,success : function(response) {
            $(log_doms[3]).append(response.msg + "<br/>");
            if (response.status == "1") {
   				offset +=20;
   				if(offset<=sqls.length-1){
   					step3_2();
   				}else{
                    $(btn_doms[3]).addClass("btn_done");
                    $(log_doms[3]).addClass("log_done");
   					$($("fieldset")[4]).addClass("f_step");
   				}                    
            } else {
            	$(btn_doms[3]).attr("disabled", false);
            }
	    }
	    ,error : function(response) {
	            $(log_doms[3]).append(response.responseText);
	            $(btn_doms[3]).attr("disabled", false);
	            $(btn_doms[3]).attr("class", "btn_step");
	    }
	});	
};

var step4_offset = 0;
var step4 = function(){
    if(step4_offset!=0){
        step4_2();
        return;
    }
    var btn_doms = $('.btn_step');
    $(btn_doms[4]).attr("disabled", true);
	$.ajax({
		url: server_path+"?function=step4"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[4]).append(response.msg + "<br/>");
			if(response.status=="1"){
                $(btn_doms[4]).addClass("btn_done");
                $(log_doms[4]).addClass("log_done");
                sqls = response.sqls;
                step4_offset = 0;
                step4_2();
			}else{
				$(btn_doms[4]).attr("disabled", false);
			}			
		}
		,error : function(response){				
			alert("net error");
			$(btn_doms[4]).attr("disabled", false);
		}
	});	
};

var step4_2 = function(){
	var sqls_ = [];
	for(var i=step4_offset;(i<step4_offset+1000)&&(i<sqls.length-1);i++){
		sqls_.push(sqls[i]);
	}
	$.ajax({
		url: server_path+"?function=step4_2"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
			,sqls: $.ligerui.toJSON(sqls_)
        }         
        ,success : function(response) {
            $(log_doms[4]).append(response.msg + "<br/>");
            if (response.status == "1") {
   				step4_offset +=1000;
   				if(step4_offset<=sqls.length-1){
   					step4_2();
   				}else{
    				$(log_doms[4]).append(language.steps[4] + "<br/>");                    
    				$(log_doms[4]).append(language.steps[5] + "<br/>");
    				
    				$.ajax({
    					url: server_path+"?function=step5"
    					,dataType: 'json'
    			        ,type: "POST"	
    			        ,success: function(){}
    				});
   				}                    
            } else {
            	$(btn_doms[4]).attr("disabled", false);
            }
	    }
	    ,error : function(response) {
	    	$(log_doms[4]).append(response.responseText);
	    	$(btn_doms[4]).attr("disabled", false);
	    }
	});	
};
