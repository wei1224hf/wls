var server_path = "simulate.php?f=b";
var language = {
		 "step":"步骤"
		,"steps":
			[
			  "模拟练习卷,"
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

var exam_paper__arr = [];
var exam_paper__current = 0;
var exam_paper__start = function(){
	
	$.ajax({
		url: server_path+"&function=exam_paper__start"
		,dataType: 'json'
        ,type: "POST"		     
		,success : function(response) {
			exam_paper__arr = response;
			exam_paper();
		}
		,error : function(response){		

		}
	});	
};

var exam_paper = function(){
	var data = exam_paper__arr[exam_paper__current];
	
	$.ajax({
		url: server_path+"&function=exam_paper"
		,dataType: 'json'
        ,type: "POST"		
        ,data: {json: $.ligerui.toJSON(data)}      
		,success : function(response) {
			exam_paper__current ++;
			$(".log").html(exam_paper__current);
			if(exam_paper__current>=exam_paper__arr.length)return;
			exam_paper();
		}
		,error : function(response){		

		}
	});	
};

