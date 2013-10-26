/**
 * 多项选择题
 * 必须先引用 question.js,
 * 因为这个question_multichoice类要继承 question 这个对象
 * 
 * @author wei1224hf
 * */
var question_multichoice = function(){

	this.option_length = 4; //单项选择题中的备选的答案个数,默认为 4,就是 A B C D四个选项
	this.options = [];     //选项的具体内容,一个包含一堆字符串的数组,可能会有一个空元素(因此需要 opentionLength 字段描述真实长度)
	
	/**
	 * 初始化页面元素
	 */
	this.initDom = function() {
		$("#wls_quiz_main").append("<div id='w_qs_" + this.id + "'></div>");
		if( !(this.path_img==null||this.path_img==''||this.path_img=='0') ){
			this.title = "<img src='"+this.path_img+"' /><br/>" + this.title;
		}
		if(this.layout == '1'){
			$("#w_qs_" + this.id).append("<div class='w_qw_title'>"
					+ this.index + "&nbsp;<span class='w_qw_tool'></span>"
					+ this.title + "</div>");
			
			//为了确保每个选项都是等长,使用 TABLE 标签控制
			$("#w_qs_" + this.id).append("<span class='w_qw_options'></span>");
			var str = "<table width='90%'><tr>";
			
			for (var i = 0; i < parseInt(this.option_length); i++) {
				var optionStr = "<td width='"+parseInt(100/this.option_length)+"%' onclick='question_done("+this.id+");'>" 
									+ String.fromCharCode(i + 65) // A B C D ...
									+ ":&nbsp;<input type='checkbox' name='w_qs_"
				+ this.id + "_" + i + "' value='"
				+ String.fromCharCode(i + 65) + "' />&nbsp;<a href='#' onclick=\"$('input:eq(0)',$(this).parent()).attr('checked',(-1)*($('input:eq(0)',$(this).parent()).attr('checked')-1));\" >" 
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
				var str = "<div  onclick=\"$('input:eq(0)',$(this)).attr('checked',(-1)*($('input:eq(0)',$(this)).attr('checked')-1));question_done("+this.id+"); \" >" + String.fromCharCode(i + 65) // A B C D
						+ ":&nbsp;<input type='checkbox' name='w_qs_"
				+ this.id + "_" + i + "' value='"
				+ String.fromCharCode(i + 65) + "' />&nbsp;"
						+ "<a href='#'>"+this.options[i]+"</a>";
				if (i != parseInt(this.option_length) - 1) {
					str += "</div>";
				}
				$(".w_qw_options", "#w_qs_" + this.id).append(str);
			}
		}			
	};	
	
	this.getMyAnswer = function(){
		if(this.state=='submitted')return;
		this.state = 'submitted';
		
		var answer = '';
		var valueList = [];
		for (var i = 0; i < this.option_length; i++) {
			var value = $('input[name=w_qs_' + this.id + "_" + i
					+ ']:checked').val();
			if (typeof(value) == 'undefined') {

			} else {
				valueList.push(value);
			}
		}

		if (valueList.length == 0) {
			this.myAnswer = 'I_DONT_KNOW';
			return 'I_DONT_KNOW';
		} else {
			answer = valueList.join(',');
			this.myAnswer = answer;
			return answer;
		}
	};	
	
	/**
	 * 如果做对了,题目导航处变蓝
	 *     做错了,题目导航处变红
	 *     弃权了,题目导航处变黄
	 * */
	this.showDescription = function(){		
		//显示解题思路
		$('#w_qs_' + this.id).append("<div class='w_q_d'>"+ this.description + "</div>");
			
		if(this.myAnswer==this.answer){//做对了
			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_r');
			$('#w_q_subQuesNav_' + this.id).attr('title',
				"正确" + ',' + "分值" + ':' + (this.cent));
			
			this.cent_ = this.cent;
			$(".w_q_d",$('#w_qs_' + this.id)).prepend("<span style='color:red;font-size:30px;'>  √  </span>");
			return 'RIGHT';
		}else if (this.myAnswer == 'I_DONT_KNOW') {
			var answerList = this.answer.split(',');
			for (var i = 0; i < answerList.length; i++) {
				$(":checkbox[value='" + answerList[i] + "']",
						$("#w_qs_" + this.id)).parent()
						.addClass('w_qs_q_w');
			}

			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_g');
			$('#w_q_subQuesNav_' + this.id).attr('title',
					'放弃,分值:' + (this.cent));
		}else{
			//做错了,将正确答案高亮显示
			var answerList = this.answer.split(',');
			for (var i = 0; i < answerList.length; i++) {
				$(":checkbox[value='" + answerList[i] + "']",
						$("#w_qs_" + this.id)).parent()
						.addClass('w_qs_q_w');
			}
			
			//在题目导航处,修改背景颜色,并设置标签描述
			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_w');
			$('#w_q_subQuesNav_' + this.id).attr('title',
					"错" + ',' + "分值" + ':' + (this.cent));
			$(".w_q_d",$('#w_qs_' + this.id)).prepend("<span style='color:red;font-size:35px;'>  ×  </span>");
			
			return 'WRONG';
		}		
	};
	
	this.setMyAnswer = function() {
		var myAnswer = this.myAnswer;
		if (myAnswer != 'I_DONT_KNOW') {
			var answerList = this.myAnswer.split(',');
			for (var i = 0; i < answerList.length; i++) {
				$(":checkbox[value='" + answerList[i] + "']",
						$("#w_qs_" + this.id)).attr('checked',
						'checked');;
			}
		}
	}
};

question_multichoice.prototype = new question();