var server_path = "../php/simulate.php";
var language = {
		 "step":"步骤"
		,"steps":
			[
			  "模拟整个高中<br/>所有科目,知识点;3个年级,每个年级 3到5个班级,每个班级 10到20个学生"
			 ,"模拟练习卷,"
			 ,"模拟学生练习记录"
			 ,"模拟多人考卷"
			 ,"多人考卷执行批改"
			 ]
		,simulate:{
			 year_start:"开始年份"
			,year_stop:"结束年份"
		}
		,"il8n":"语言"
	};


var init_dom = function(){
	var buttons = $(".btn_step");
	for(var i=0;i<buttons.length;i++){
		$(buttons[i]).html(language.step+" "+(i+1));
		$($(".directions_step")[i]).html(language.steps[i]);
	}
    
    $('#year_start').html(language.simulate.year_start);
    $('#year_stop').html(language.simulate.year_stop);
}

var urls_1 = [];
var step_1 = 0;
var step1 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    var fieldset_doms = $('fieldset');
	if(step_1==0){
		
		urls_1 = [
		 server_path+"?function=basic_group"
		,server_path+"?function=basic_user"
		,server_path+"?function=exam_subject"
		];

		$(log_doms[0]).append("<br/> AJAX operation: <span class='simulate_step'>0</span>/"+urls_1.length+", this may take a long long time <br/><br/>");
		$(btn_doms[0]).attr("disabled", true);
        $(btn_doms[0]).addClass("btn_done");
        $(log_doms[0]).addClass("log_done");
	}
	
	$.ajax({
		url: urls_1[step_1]
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[0]).append(response.msg+"<br/>");
			if(response.status=="1"){
				$('.simulate_step',$(log_doms[0])).html(step_1+1);
				if(step_1>=urls_1.length-1){
					$($("fieldset")[1]).addClass("f_step");
					return;
				}
				step_1++;				
				step1();
			}else{
				$(btn_doms[0]).attr("disabled", false);
			}
		}
		,error : function(response){		
			$(log_doms[0]).append(response);
			alert("net error");
			$(btn_doms[0]).attr("disabled", false);
		}
	});	
}

var urls_2 = [];
var step_2 = 0;
var year_start,year_stop;
var step2 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    var fieldset_doms = $('fieldset');
	if(step_2==0){
		year_start = $('[name=year_start]',fieldset_doms[1]).val();
		year_stop = $('[name=year_stop]',fieldset_doms[1]).val();
		if(parseInt(year_start)!=year_start){
			alert("year_start wrong! must input Integer");return;
		}
		if(parseInt(year_stop)!=year_stop){
			alert("year_stop wrong! must input Integer");return;
		}
		if(year_stop-year_start > 10){
			alert("Year gap too big , ensure it's smaller than 10");return;
		}
		if(year_stop < year_start){
			alert("year_stop must bigger than year_start");return;
		}		
		if(year_start<2000){
			alert("year start from 2000 please");return;
		}
		
		var dates = [];
		for(var year=year_start;year<=year_stop;year++){
			var date_start,date_stop;
			date_start = new Date(year,'02','04');
			date_stop = new Date(year,'06','12');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}

			date_start = new Date(year,'07','27');
			date_stop = new Date(year,'11','30');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}
		}
		
		var ddd = [];
		var len = 1;
		for(var i=0;i<dates.length;i+=len){
			var dd = [];
			for(var ii=i;ii<i+len;ii++){
				if(ii>=dates.length)break;
				dd.push(dates[ii])
			}
			ddd.push(dd);
		}

		urls_2 = [];

		for(var i=0;i<ddd.length;i++){
			for(var i2=0;i2<3;i2++){
				var theurl = server_path+"?function=exam_paper&dates="+$.ligerui.toJSON(ddd[i])+"&grade="+(i2+1);
				if(i==0&&i2==0)theurl+="&delete=1";
				urls_2.push(theurl);
			}

		}
		$(log_doms[1]).append("<br/> AJAX operation: <span class='simulate_step'>0</span>/"+urls_2.length+", this may take a long long time <br/><br/>");
		$(btn_doms[1]).attr("disabled", true);
        $(btn_doms[1]).addClass("btn_done");
        $(log_doms[1]).addClass("log_done");
	}
	
	$.ajax({
		url: urls_2[step_2]
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[1]).append(response.msg+"<br/>");
			if(response.status=="1"){
				$('.simulate_step',$(log_doms[1])).html(step_2+1);
				if(step_2>=urls_2.length-1){
					$($("fieldset")[2]).addClass("f_step");
					return;
				}
				step_2++;				
				step2();
			}else{
				$(btn_doms[1]).attr("disabled", false);
			}
		}
		,error : function(response){		
			$(log_doms[1]).append(response);
			alert("net error");
			$(btn_doms[1]).attr("disabled", false);
		}
	});	
}

var step_3 = 0;
var students_3 = null;
var urls_3 = [];
var step3 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    var fieldset_doms = $('fieldset');
	if(students_3==null){
		$.ajax({
			 url: server_path+"?function=exam_paper_log__get_students"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				students_3 = response.data;
				step3();
			}
			,error : function(response){				

			}
		});	
		return;
	}
	
	if(step_3==0){	
		var dates = [];
		year_start = $('[name=year_start]',fieldset_doms[1]).val();
		year_stop = $('[name=year_stop]',fieldset_doms[1]).val();		
		for(var year=year_start;year<=year_stop;year++){
			var date_start,date_stop;
			date_start = new Date(year,'02','04');
			date_stop = new Date(year,'06','12');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}

			date_start = new Date(year,'07','27');
			date_stop = new Date(year,'11','30');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}
		}

		var ddd = [];
		var len = 5;
		for(var i=0;i<dates.length;i+=len){
			var dd = [];
			for(var ii=i;ii<i+len;ii++){
				if(ii>=dates.length)break;
				dd.push(dates[ii])
			}
			ddd.push(dd);
		}

		for(var i=0;i<ddd.length;i++){
			for(var i2=0;i2<students_3.length;i2++){
				var theurl = server_path+"?function=exam_paper_log&dates="+$.ligerui.toJSON(ddd[i])+"&student="+students_3[i2];
				if(i==0&&i2==0)theurl+="&delete=1";
				urls_3.push(theurl);
			}
		}

		$(log_doms[2]).append("<br/> AJAX operation: <span class='simulate_step'>0</span>/"+urls_3.length+", this may take a long long time <br/><br/>");
		$(btn_doms[2]).attr("disabled", true);
        $(btn_doms[2]).addClass("btn_done");
        $(log_doms[2]).addClass("log_done");
	}
	
	$.ajax({
		url: urls_3[step_3]
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[2]).append(response.msg+"<br/>");
			if(response.status=="1"){
				$('.simulate_step',$(log_doms[2])).html(step_3+1);
				if(step_3>=urls_3.length-1){
					$($("fieldset")[3]).addClass("f_step");
					return;
				}
				step_3++;				
				step3();
			}else{
				$(btn_doms[2]).attr("disabled", false);
			}
		}
		,error : function(response){		
			$(log_doms[2]).append(response);
			alert("net error");
			$(btn_doms[2]).attr("disabled", false);
		}
	});	
}

var step_4 = 0;
var students_4 = null;
var subjects_4 = null;
var urls_4 = [];
var step4 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    var fieldset_doms = $('fieldset');
	if(students_4==null){
		$.ajax({
			 url: server_path+"?function=get_students"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				students_4 = response.data;
				step4();
			}
			,error : function(response){				

			}
		});	
		return;
	}
	
	if(subjects_4==null){
		$.ajax({
			 url: server_path+"?function=get_subjects"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				subjects_4 = response.data;
				step4();
			}
			,error : function(response){				

			}
		});	
		return;
	}
	
	if(step_4==0){	
		var dates = [];
		year_start = $('[name=year_start]',fieldset_doms[1]).val();
		year_stop = $('[name=year_stop]',fieldset_doms[1]).val();		
		for(var year=year_start;year<=year_stop;year++){
			var date_start,date_stop;
			date_start = new Date(year,'02','04');
			date_stop = new Date(year,'06','12');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}

			date_start = new Date(year,'07','27');
			date_stop = new Date(year,'11','30');
			for(var i=date_start.getTime();i<date_stop.getTime();i+=86400000){
				var d = new Date(i);
				dates.push(1900+d.getYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			}
		}

		var ddd = [];
		var len = 5;
		for(var i=0;i<dates.length;i+=len){
			var dd = [];
			for(var ii=i;ii<i+len;ii++){
				if(ii>=dates.length)break;
				dd.push(dates[ii])
			}
			ddd.push(dd);
		}
		
		var sssss = [];
		for(var i=0;i<students_4.length;i+=15){
			var ssss = [];
			for(var i2=i;i2<i+15;i2++){
				if(i2>=students_4.length)break;
				ssss.push(students_4[i2]);
			}
			sssss.push(ssss);
		}	
		
		var ttttt = [];
		for(var i=0;i<subjects_4.length;i+=5){
			var tttt = [];
			for(var i2=i;i2<subjects_4.length,i2<i+5;i2++){
				if(i2>=subjects_4.length)break;
				tttt.push(subjects_4[i2]);
			}
			ttttt.push(tttt);
		}

		for(var i=0;i<ddd.length;i++){
			for(var i2=0;i2<sssss.length;i2++){
				for(var i3=0;i3<ttttt.length;i3++){
					var theurl = server_path+"?function=exam_paper_multionline&dates="+$.ligerui.toJSON(ddd[i])+"&students="+$.ligerui.toJSON(sssss[i2])+"&subjects="+$.ligerui.toJSON(ttttt[i3]);
					if(i==0&&i2==0&&i3==0)theurl+="&delete=1";
					urls_4.push(theurl);
				}
			}
		}	

		$(log_doms[3]).append("<br/> AJAX operation: <span class='simulate_step'>0</span>/"+urls_4.length+", this may take a long long time <br/><br/>");
		$(btn_doms[3]).attr("disabled", true);
        $(btn_doms[3]).addClass("btn_done");
        $(log_doms[3]).addClass("log_done");
	}
	
	$.ajax({
		url: urls_4[step_4]
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[3]).append(response.msg+"<br/>");
			if(response.status=="1"){
				$('.simulate_step',$(log_doms[3])).html(step_4+1);
				if(step_4>=urls_4.length-1){
					$($("fieldset")[4]).addClass("f_step");
					return;
				}
				step_4++;				
				step4();
			}else{
				$(btn_doms[3]).attr("disabled", false);
			}
		}
		,error : function(response){		
			$(log_doms[3]).append(response);
			alert("net error");
			$(btn_doms[3]).attr("disabled", false);
		}
	});		
}

var step_5 = 0;
var urls_5 = [];
var exam_paper_multionline__close_ids = null;
var step5 = function(){
    var log_doms = $('.log');
    var btn_doms = $('.btn_step');
    var fieldset_doms = $('fieldset');
    
	if(exam_paper_multionline__close_ids==null){		
		$.ajax({
			 url: server_path+"?function=exam_paper_multionline__close_ids"
			,dataType: 'json'
	        ,type: "POST"		
	        ,data: {
				 executor: ""
				,session: ""
	        }         
			,success : function(response) {
				exam_paper_multionline__close_ids = response.data;
				step5();
			}
		});
		return;
	}
	
	if(step_5==0){
		var len = 10;
		for(var i=0;i<exam_paper_multionline__close_ids.length;i+=len){
			var ids = [];
			for(var i2=i;i2<i+len;i2++){
				if(i2>=exam_paper_multionline__close_ids.length)break;
				ids.push(exam_paper_multionline__close_ids[i2]);
			}
			
			urls_5.push(server_path+"?function=exam_paper_multionline__close&ids="+$.ligerui.toJSON(ids));
		}
		
		$(log_doms[4]).append("<br/> AJAX operation: <span class='simulate_step'>0</span>/"+urls_5.length+", this may take a long long time <br/><br/>");
		$(btn_doms[4]).attr("disabled", true);
        $(btn_doms[4]).addClass("btn_done");
        $(log_doms[4]).addClass("log_done");
    }
	
	$.ajax({
		url: urls_5[step_5]
		,dataType: 'json'
        ,type: "POST"		
        ,data: {
			 executor: ""
			,session: ""
        }         
		,success : function(response) {
			$(log_doms[4]).append(response.msg+"<br/>");
			if(response.status=="1"){
				$('.simulate_step',$(log_doms[4])).html(step_5+1);
				if(step_5>=urls_5.length-1){

					return;
				}
				step_5++;				
				step5();
			}else{
				$(btn_doms[4]).attr("disabled", false);
			}
		}
		,error : function(response){		
			$(log_doms[4]).append(response);
			alert("net error");
			$(btn_doms[4]).attr("disabled", false);
		}
	});			
}