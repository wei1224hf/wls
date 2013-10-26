/**
 * 填空题现在不支持图片
 * 一道题里面,一般会有很多个填空输入框.
 * 填空题可以分为两个部分： 题干, 输入框
 * 因此填空题的题目都有 所属 关系,其 id_parent 字段很重要
 * 如果id_parent为0,说明这是一个题干,如果不为0,就说明是一个 输入框 
 *
 * @author wei1224hf@gmail.com QQgroup 135426431
 */
var question_blank = function() {
	//默认的 id_parent 为0,表示是题干,都是文字描述
	this.id_parent = 0;
	
	//在试卷页面上添加一个填空题
	this.initDom = function() {
		$("[class=w_qw_tool]",$("#w_qs_"+this.id_parent)).append(this.index+"&nbsp;");			
		var content = $("#w_qs_"+this.id_parent).html();
		content = content.replace("[__"+this.title+"__]","<input class='w_blank' index='"+this.title+"' id='w_qs_"+this.id+"'  name='w_qs_"+this.id+"' onchange='question_done("+this.id+")' />" +
				"&nbsp;<span onclick='question_imgUpload(\"w_qs_"+this.id+"_img\")' id='w_qs_"+this.id+"_img' class='l-button l-button-submit' style='width: 50px;display: inline;' >"+top.getIl8n('img')+"</span><img style='border: 3px solid #DDDDDD;display:none' id='w_qs_"+this.id+"_img_' />");
		$("#w_qs_"+this.id_parent).html(content);			
	};
	
	this.showMark = function(){
		$('#w_qs_'+this.id+'_img').after("&nbsp;<span onclick='question_mark("+this.id+","+this.cent+")' id='w_qs_"+this.id+"_mark' class='l-button l-button-submit' style='width: 50px;display: inline;' >"+top.getIl8n('exam_paper_log','mark')+" &nbsp; "+this.cent+"</span>");	
		$('#w_qs_'+this.id+'_img').remove();	
	}
	
	//显示解题说明
	this.showDescription = function() {
		if(this.id_parent==0)return;
		
		if(this.mode==3||this.mode==4){
			this.quiz.cent += parseFloat(this.cent);
			this.quiz.count.total++;
		}
		$('.w_qw_title',$("#w_qs_"+this.id_parent)).append("<div id='w_q_b_desc_"+this.id+"'>"+this.index+":"+this.description+"</div>");
		 

		//需要人工批改的题目,必定是需要服务端处理的,必定是试卷模式 就要在试卷左侧的题目导航处处理一下高亮
		$('#w_q_subQuesNav_' + this.id).addClass('w_q_sn_mark');
		$('#w_q_subQuesNav_' + this.id).attr('title','人工批改,分值:' + (this.cent));
	};

	this.getMyAnswer = function() {
		if(this.id_parent==0)return 'I_DONT_KNOW';
		var answer = '';
		var value = $('input[name=w_qs_' + this.id + ']').val();
		if (typeof(value) == 'undefined' || value=='') {
			answer = 'I_DONT_KNOW';
			if(this.mode==3||this.mode==4)this.quiz.count.giveup++;
		} else {
			answer = value;
		}
		return answer;
	};

	//在 查看做题记录 这个功能中,要使用这个函数
	this.setMyAnswer = function() {
		var myAnswer = this.myAnswer;
		if (myAnswer != 'I_DONT_KNOW') {
			var c = $("#w_qs_" + this.id);

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
question_blank.prototype = new question();