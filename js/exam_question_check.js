/**
 * 判断题
 * 
 * @author wei1224hf
 * */
var question_check = function(){

	this.initDom = function() {
		$("#wls_quiz_main").append("<div id='w_qs_" + this.id + "'></div>");
		$("#w_qs_" + this.id).append("<div class='w_qw_title'>" + this.index + "&nbsp;<span class='w_qw_tool'></span>"
				+ this.title + "</div>");
		$("#w_qs_" + this.id).append("<div class='w_qw_options' style='width:100%;height:17px;' ></div>");
		$(".w_qw_options", "#w_qs_" + this.id).append("<div style='display:block;float:left;width:50%;cursor:hand' onclick=\"$('input:eq(0)',$(this)).attr('checked','checked');question_done("+this.id+"); \" ><input type='radio' name='w_qs_" 
						+ this.id + "' value='A' />&nbsp;&nbsp;对&nbsp;&nbsp;</div>");
		$(".w_qw_options", "#w_qs_" + this.id)
				.append("<div style='display:block;float:left;width:50%;cursor:hand'  onclick=\"$('input:eq(0)',$(this)).attr('checked','checked');question_done("+this.id+"); \" ><input type='radio'  name='w_qs_"
						+ this.id + "' value='B' />&nbsp;&nbsp;错&nbsp;&nbsp;</div>");
	},	
	
	this.getMyAnswer = function(){
		if(this.state=='submitted')return;
		this.state = 'submitted';
		if(this.mode==3||this.mode==4){
			this.quiz.cent += parseFloat(this.cent);
			this.quiz.count.total++;
		}
		this.myAnswer = $('input[name=w_qs_' + this.id + ']:checked').val();
		if ( typeof(this.myAnswer) == 'undefined') {
			this.myAnswer = 'I_DONT_KNOW'; 
		}
		return this.myAnswer;
	},
	
	this.showDescription = function(){		
		//显示解题思路
		$('#w_qs_' + this.id).append("<div class='w_q_d'>"+ this.description + "</div>");

		if ( this.myAnswer == this.answer ){
			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_r');
			$('#w_q_subQuesNav_' + this.id).attr('title',
				'对,分值:' + (this.cent));
			$(".w_q_d",$('#w_qs_' + this.id)).prepend("<span style='color:red;font-size:30px;'>  √  </span>");
			this.cent_ = this.cent;
		}else if (this.myAnswer == 'I_DONT_KNOW') {
			$(":radio[value='" + this.answer + "']",
				$("#w_qs_" + this.id)).parent()
				.addClass('w_qs_q_w');

			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_g');
			$('#w_q_subQuesNav_' + this.id).attr('title',
					'放弃,分值:' + (this.cent));
		} else {
			$(":radio[value='" + this.answer + "']",
				$("#w_qs_" + this.id)).parent()
				.addClass('w_qs_q_w');
			$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_w');
			$('#w_q_subQuesNav_' + this.id).attr('title',
					'错:' + (this.cent));
			$(".w_q_d",$('#w_qs_' + this.id)).prepend("<span style='color:red;font-size:35px;'>  ×  </span>");
		}
	},
	
	this.setMyAnswer = function() {
		var myAnswer = this.myAnswer;
		if (myAnswer != 'I_DONT_KNOW') {
			var temp = {
				A : 0,
				B : 1
			};
			var c = $("input[name=w_qs_" + this.id + "]");
			eval("c[temp." + myAnswer + "].checked = true");
		}
	}
};
question_check.prototype = new question();