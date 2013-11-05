var server_path = "../php/install.php";
var language = {
		 "step":"步骤"
		,"steps":
			["检查系统环境,包括:检查 PHP版本,检查关键PHP参数是否准确,检查核心文件及文件夹的执行权限"
			 ,"配置安装模式,数据库连接参数,系统语言"
			 ,"初始化数据库表"
			 ,"初始化 权限,用户组,管理员帐号 等基础数据"
			 ,"<br/>已成功安装系统,直接登录系统首页: <a href='../html/desktop.html' target='_blank'>首页</a> 帐号密码都是 admin,<br/><br/>如果是初次接触此系统,建议先 <a href='../html/simulate.html' target='_blank'>模拟一下业务数据 ,以体验更为全面的性能 </a> "
			 ]
		 ,"database":{
	         "db":"数据库名称"
	         ,"port":"端口"
	         ,"unm":"帐号"
	         ,"pwd":"密码"
	         ,"host":"域名"
	         ,"mode":"安装模式"
	         ,"type":"数据库类型"
		 } 
		,"il8n":"语言"
	};
var init_dom = function(){	
	var buttons = $(".btn_step");
	for(var i=0;i<buttons.length;i++){
		$(buttons[i]).html(language.step+" "+(i+1));
		$($(".directions_step")[i]).html(language.steps[i]);
	}
	
	$('#mode').html(language.database.mode);
    $('#host').html(language.database.host);
    $('#unm').html(language.database.unm);
    $('#pwd').html(language.database.pwd);
    $('#db').html(language.database.db);
    $('#port').html(language.database.port);
    $('#il8n').html(language.il8n);
    $('#type').html(language.database.type);
}



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
}

var step1 = function() {
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[0]).attr("disabled", true);
    $.ajax({
            url : server_path+"?class=install&function=step1&rand="+Math.random(),
            dataType : 'json',
            type : "POST",
            data : {
                    executor : "",
                    session : ""
            },
            success : function(response) {
                    $(log_doms[0]).append(response.msg + "<br/>");
                    if (response.status == "1") {
                            $(btn_doms[0]).addClass("btn_done");
                            $(log_doms[0]).addClass("log_done");
                            $($("fieldset")[1]).addClass("f_step");
                    } else {
                            $(btn_doms[0]).attr("disabled", false);
                    }
            },
            error : function(response) {
                    $(log_doms[0]).append(response.responseText);
                    $(btn_doms[0]).attr("disabled", false);
                    $(btn_doms[0]).attr("class", "btn_step");
            }
    });
}

var step2 = function() {
    var status = 1;

    var host = $('[name=host]').val();
    if (host == null || host == "")status = 0;

    var unm = $('[name=unm]').val();
    if (unm == null || unm == "")status = 0;

    var pwd = $('[name=pwd]').val();
    //if(pwd==null||pwd=="")status = 0;

    var port = $('[name=port]').val();
    //if(port==null||port=="")status = 0;

    var db = $('[name=db]').val();
    if (db == null || db == "")status = 0;

    if (status == 0) {
            alert("Must input everything");
            return;
    }

    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[1]).attr("disabled", true);
    $.ajax({
            url : server_path+"?class=install&function=step2&rand="+Math.random(),
            dataType : 'json',
            type : "POST",
            data : {
                    executor : "",
                    session : "",
                    
                    unm : unm,
                    host : host,
                    pwd : pwd,
                    db : db,
                    port : port,
                    il8n : $('[name=il8n]').val(),
                    type : $('[name=type]').val(),
                    mode : $('[name=mode]').val()
            },
            success : function(response) {
                    $(log_doms[1]).append(response.msg + "<br/>");
                    if (response.status == "1") {
                            $(btn_doms[1]).attr("disabled", true);
                            $(btn_doms[1]).addClass("btn_done");
                            $(log_doms[1]).addClass("log_done");                           
                            var formItems = $("[name]",$("fieldset")[1]);
                            for(var i=0;i<formItems.length;i++){
                            	$(formItems[i]).attr("disabled","disabled");
                            }
                            $($("fieldset")[2]).addClass("f_step");
                    } else {
                            $(btn_doms[1]).attr("disabled", false);
                    }
            },
            error : function(response) {
                    $(log_doms[1]).append(response.responseText);
                    $(btn_doms[1]).attr("disabled", false);
                    $(btn_doms[1]).attr("class", "btn_step");
            }
    });
}

var step3 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[2]).attr("disabled", true);
	$.ajax({
		url: "../php/install.php?class=install&function=step3"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[2]).append(response.msg + "<br/>");
			if(response.status=="1"){
				sqls = response.sql;
				step3_2();
			}else{
				$(btn_doms[2]).attr("disabled", false);
			}			
		}
		,error : function(response){				
			alert("net error");
			$(btn_doms[2]).attr("disabled", false);
		}
	});	
}

var sqls = [];
var offset = 0;
var step3_2 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
	var sqls_ = [];
	for(var i=offset;(i<offset+20)&&(i<sqls.length-1);i++){
		sqls_.push(sqls[i]);
	}
	$.ajax({
		url: "../php/install.php?class=install&function=step3_2"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
			,sqls: $.ligerui.toJSON(sqls_)
        }         
        ,success : function(response) {
            $(log_doms[2]).append(response.msg + "<br/>");
            if (response.status == "1") {
   				offset +=20;
   				if(offset<=sqls.length-1){
   					step3_2();
   				}else{
                    $(btn_doms[2]).addClass("btn_done");
                    $(log_doms[2]).addClass("log_done");
   					$($("fieldset")[3]).addClass("f_step");
   				}                    
            } else {
            	$(btn_doms[2]).attr("disabled", false);
            }
	    }
	    ,error : function(response) {
	            $(log_doms[2]).append(response.responseText);
	            $(btn_doms[2]).attr("disabled", false);
	            $(btn_doms[2]).attr("class", "btn_step");
	    }
	});	
};

var step4 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    $(btn_doms[3]).attr("disabled", true);
	$.ajax({
		url: "../php/install.php?class=install&function=step4"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[3]).append(response.msg + "<br/>");
			if(response.status=="1"){
                $(btn_doms[3]).addClass("btn_done");
                $(log_doms[3]).addClass("log_done");
				$(log_doms[3]).append(language.steps[4] + "<br/>");
			}else{
				$(btn_doms[3]).attr("disabled", false);
			}			
		}
		,error : function(response){				
			alert("net error");
			$(btn_doms[3]).attr("disabled", false);
		}
	});	
}
