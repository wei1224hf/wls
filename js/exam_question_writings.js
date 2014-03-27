/**
 * 填空题现在不支持图片
 * 一道题里面,一般会有很多个填空输入框.
 * 填空题可以分为两个部分： 题干, 输入框
 * 因此填空题的题目都有 所属 关系,其 id_parent 字段很重要
 * 如果id_parent为0,说明这是一个题干,如果不为0,就说明是一个 输入框 
 *
 * @author wei1224hf@gmail.com QQgroup 135426431
 */
var question_writings = function() {
	//默认的 id_parent 为0,表示是题干,都是文字描述
	this.id_parent = 0;
	
	//在试卷页面上添加一个填空题
	this.initDom = function() {
			$("[class=w_qw_tool]",$("#w_qs_"+this.id_parent)).append(this.index+"&nbsp;");			
			$("#wls_quiz_main").append("<div id='w_qs_" + this.id
					+ "'></div>");
			$("#w_qs_" + this.id).append("<textarea style='width:90%;height:150px;' id='w_qs_"+this.id+"' name='w_qs_"+this.id+"' onchange='question_done("+this.id+")' ></textarea>" +
					"&nbsp;<span id='w_qs_"+this.id+"_img' onclick='question_imgUpload(\"w_qs_"+this.id+"_img\")'  class='l-button l-button-submit' style='width: 50px;display: inline;' >"+top.getIl8n('img')+"</span><img style='border: 3px solid #DDDDDD;' id='w_qs_"+this.id+"_img_' style='display:none' />" );
			
	};
	
	this.showMark = function(){
		$('#w_qs_'+this.id+'_img').after("&nbsp;<span onclick='question_mark("+this.id+","+this.cent+")' id='w_qs_"+this.id+"_mark' class='l-button l-button-submit' style='width: 50px;display: inline;' >"+top.getIl8n('exam_paper_log','mark')+" &nbsp; "+this.cent+"</span>");	
		$('#w_qs_'+this.id+'_img').remove();
	}	
	
	//显示解题说明
	this.showDescription = function() {
		$('#w_qs_' + this.id).append("<div class='w_q_d'>"+ this.description + "</div>");
	};

	this.getMyAnswer = function() {
		var answer = '';
		var value = $('textarea[name=w_qs_' + this.id + ']').val();
		if (typeof(value) == 'undefined' || value=='') {
			answer = 'I_DONT_KNOW';
		} else {
			answer = value;
		}
		return answer;
	};

	//在 查看做题记录 这个功能中,要使用这个函数
	this.setMyAnswer = function() {
		var myAnswer = this.myAnswer;
		if (myAnswer != 'I_DONT_KNOW') {
			var c = $("textarea[name=w_qs_" + this.id + "]");
			c.attr("value",myAnswer);
		}
	}
	
	this.getImg = function() {
		var img = $('#w_qs_'+this.id+"_img_").attr('src');
		return img;
	};

	//在 查看做题记录 这个功能中,要使用这个函数
	this.setImg = function() {
		if( !(this.myanswer_img==null||this.myanswer_img=='' || (typeof(this.myanswer_img))=='undefined'||this.myanswer_img=='0'||this.myanswer_img==0) ){
			$("#w_qs_"+this.id+"_img_").attr('src',this.myanswer_img);
			$("#w_qs_"+this.id+"_img_").show();
		}
	}	
};

question_writings.prototype = new question();