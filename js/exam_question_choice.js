/**
 * 单项选择题
 * 只能有一个正确答案,可以有多个备选答案
 * 有一行题目描述.
 * 答案的布局,可以纵向排列(一个选项一行),
 * 也可以横向排列(所有选项都一排),比如在完型填空中,就需要用 横向排列
 * */
var question_choice = function(){
	
	this.option_length = 4; //单项选择题中的备选的答案个数,默认为 4,就是 A B C D四个选项
	this.options = [];     //选项的具体内容,一个包含一堆字符串的数组,可能会有一个空元素(因此需要 opentionLength 字段描述真实长度)
	
	/**
	 * 初始化页面控件
	 * 住页面必须有这个元素: <div id = 'wls_quiz_main'>
	 * */
	this.initDom = function() {
		$("#wls_quiz_main").append("<div id='w_qs_" + this.id + "'></div>");
		if( !(this.path_img==null||this.path_img==''||this.path_img=='0') ){
			this.title = "<img src='"+this.path_img+"' /><br/>" + this.title;
		}
		//备选答案是 水平排列的,比如完型填空题中的选择题,使用 SPAN 标签
		if(this.layout == '1'){
			$("#w_qs_" + this.id).append("<div class='w_qw_title'>"
					+ this.index + "&nbsp;<span class='w_qw_tool'></span>"
					+ this.title + "</div>");
			
			//为了确保每个选项都是等长,使用 TABLE 标签控制
			$("#w_qs_" + this.id).append("<span class='w_qw_options' ></span>");
			var str = "<table width='90%'><tr>";
			for (var i = 0; i < parseInt(this.option_length); i++) {
				if(this.options[i]==null)this.options[i]="";
				var optionStr = "<td width='"+parseInt(100/this.option_length)+"%' onclick=\"$('input:eq(0)',$(this)).attr('checked','checked');question_done("+this.id+"); \" >" 
									+ String.fromCharCode(i + 65) // A B C D ...
									+ ":&nbsp;<input type='radio' id='w_qs_" + this.id +'_'+ String.fromCharCode(i + 65) + "' "
									+ " onclick='question_done("+this.id+")' " //选项点击之后,改变颜色,并设置 选择答案
									+ " name='w_qs_" + this.id + "' value='" + String.fromCharCode(i + 65) + "' />&nbsp;<a href='#' >" 
									+ this.options[i]+"</a></td>";
									
				str += optionStr;
			}					
			str += "</tr></table>";
			$(".w_qw_options", "#w_qs_" + this.id).append(str);
			
		}else{
			//默认题目是纵向排列的,就用DIV标签
			$("#w_qs_" + this.id).append("<div class='w_qw_title'>"
					+ this.index + "&nbsp;<span class='w_qw_tool'></span>"
					+ this.title + "</div>");
			$("#w_qs_" + this.id).append("<span class='w_qw_options'></span>");
			
			for (var i = 0; i < parseInt(this.option_length); i++) {
				if(this.options[i]==null)this.options[i]="";
				var str = "<div  onclick=\"$('input:eq(0)',$(this)).attr('checked','checked');question_done("+this.id+"); \" >" + String.fromCharCode(i + 65) // A B C D
						+ ":&nbsp;<input type='radio' "
						+ " onclick='question_done("+this.id+")' name='w_qs_" //选项点击之后,改变颜色,并设置 选择答案
						+ this.id + "' value='"
						+ String.fromCharCode(i + 65) + "' />&nbsp;"
						+ "<a href='#'>"+this.options[i]+"</a>";
				if (i != parseInt(this.option_length) - 1) {
					str += "</div>";
				}
				$(".w_qw_options", "#w_qs_" + this.id).append(str);
			}
		}
	};	
	
	/* 如果做对了,题目导航处变蓝
	 *     做错了,题目导航处变红
	 *     弃权了,题目导航处变黄
	 * */	
	this.showDescription = function() { 
		$('#w_qs_' + this.id).append("<div class='w_q_d'>"+ this.description + "</div>");
		if(this.mode==3||this.mode==4){
			this.paper.cent += parseFloat(this.cent);
			this.paper.count.total++;
		}
		if(this.myAnswer==this.answer){//做对了
			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_r');
			$('#w_q_subQuesNav_' + this.id).attr('title',
				'对,分值:' + (this.cent));
			
			this.cent_ = this.cent;
			$(".w_q_d",$('#w_qs_' + this.id)).prepend("<span style='color:red;font-size:30px;'>  √  </span>");
		}else if (this.myAnswer == 'I_DONT_KNOW') {
				$(":radio[value='" + this.answer + "']",
						$("#w_qs_" + this.id)).parent()
						.addClass('w_qs_q_w');
	
				$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_g');
				$('#w_q_subQuesNav_' + this.id).attr('title',
						'放弃,分值:' + (this.cent));
		}else{
			//做错了,将正确答案高亮显示
			$(":radio[value='" + this.answer + "']",
					$("#w_qs_" + this.id)).parent()
					.addClass('w_qs_q_w');
			//在题目导航处,修改背景颜色,并设置标签描述
			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_w');
			$('#w_q_subQuesNav_' + this.id).attr('title',
					'错,分值:' + (this.cent));
			$(".w_q_d",$('#w_qs_' + this.id)).prepend("<span style='color:red;font-size:35px;'>  ×  </span>");
		}
	}
	
	this.getMyAnswer = function() {
		if(this.state=='submitted')return;
		this.state = 'submitted';
		
		var answer = '';
		var value = $('input[name=w_qs_' + this.id + ']:checked').val();
		if (typeof(value) == 'undefined' || value=='') {
			answer = 'I_DONT_KNOW';
			if(this.mode==3||this.mode==4)this.paper.count.giveup++;
		} else {
			answer = value;
		}
		this.myAnswer = answer;
		return answer;
	};

	//在 查看做题记录 这个功能中,要使用这个函数
	this.setMyAnswer = function() {
		var myAnswer = this.myAnswer;
		if (myAnswer != 'I_DONT_KNOW') {
			//var c = $("input[name=w_qs_" + this.id + "][value='"+myAnswer+"']");
			var c = $("#w_qs_"+this.id+"_"+myAnswer);
			c.attr("checked","checked");
		}
	}	
}

question_choice.prototype = new question();