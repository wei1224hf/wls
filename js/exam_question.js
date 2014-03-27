
/**
 * 题目来源于一张卷子(paper);
 * 每一道题都有 题目说明;解题思路;答案 等属性
 * 还有 初始化DOM;显示解题思路 等函数;
 * 不过部分函数跟属性会在扩展题型中添加
 * 这里是父类;给出了一道题所必须要有的公共属性
 * */
var question = function() {

    this.id = null;               //索引编号;在一张卷子里的题目序号;比如 1 2 3 4 5
	this.id_parent = null;        //在'阅读理解';'完型填空';'短文听力'等大题中使用;让子题目指向母题目
	this.id_paper = null;    	  //这个题目属于哪张试卷.WLS系统中;每个题目都是属于某一张特定的试卷的;其值应该是 wls_quiz_paper表中的id
	
	this.answer = null;           //正确答案
	this.myAnswer = null;         //我选择的答案
	
	this.cent = 0;                //这个题目的分值
	this.cent_ = 0;               //用户答题后所获得的分值;一般而言;要么是0;要么就等于cent.但简答题则不同
	
	this.type = null;             //题型;字符串;可以是 单选题;多选题;判断题;填空题等
	this.paper = null;             //试卷对象.	
	
	this.markingmethod = 0;       //卷子批改方式=自动批改 或 教师人工批改
	
	this.layout = 'vertical';     //题目选项的排列方式;横向或纵向;默认为纵向;就是一个选项一行
	this.description = '';        //解题思路
	this.title = '';              //题目标题
	
	this.state = '';              //状态 submitted 已提交
	this.path_listen = null;      //听力文件;如果有听力的话
	this.mode = 1;				  // 1  单题模式,无后台交互 ; 2 单题模式,有后台交互 ; 3 试卷模式,无后台交互; 4 试卷模式,有后台交互
	
	//提交了试卷之后,显示 题目做错了 ,这时候用户不服气,觉得错的冤枉,就可以对这道题目做一次评论 '为什么我会错?'
	this.addWhyImWrong = function(){
		$('#w_qs_' + this.id)
				.append("<div class='WhyImWrong'>"
						+ "<table><tr style='color:red;font-size:11px;'>"
						+ "<td width='20%' >"
						+ ":&nbsp;&nbsp;</td>"
						+ "<td width='20%'><input type='radio' onchange='wls_question_saveComment(this)' value='1' name='"
						+ this.id
						+ "' />"
						+ "我的确不会"
						+ "</td>"
						+ "<td width='20%'><input type='radio' onchange='wls_question_saveComment(this)' value='2' name='"
						+ this.id
						+ "' />"
						+ "我会做得,但是我粗心了"
						+ "</td>"
						+ "<td width='20%'><input type='radio' onchange='wls_question_saveComment(this)' value='3' name='"
						+ this.id
						+ "' />"
						+ "我不能理解我为什么会错!"
						+ "</td>"
						+ "<td width='20%'><input type='radio' onchange='wls_question_saveComment(this)' value='4' name='"
						+ this.id + "' />" + "答案错了!我没有错!"
						+ "</td>" + "</tr></table>" + "</div>");
	}
	
	this.submitButton = function(){
		$('#wls_quiz_main').append("<br/><br/><input type='button' onclick='education_question.questionObj.getMyAnswer();education_question.questionObj.showDescription();' style='width:100px;' value='"+top.il8n.submit+"' class='l-button l-button-submit' />");
	}
};

//在试卷模式时,如果做完一道题目,试卷左侧的 题目导航条 会变色标注的
var question_done = function(id){
	$('#w_q_subQuesNav_' + id).attr('class','w_q_sn_done');	
}

//保存评论
var question_saveComment = function(dom) {
	$(".WhyImWrong", $("#w_qs_" + dom.name)).empty();
	$.ajax({
		url : "../../../../wls.php?controller=question&action=saveComment",
		data : {
			id : dom.name,
			value : dom.value
		},
		type : "POST",
		success : function(msg) {
			msg = jQuery.parseJSON(msg);

			var c1 = parseInt(msg.comment_ywrong_1);
			var c2 = parseInt(msg.comment_ywrong_2);
			var c3 = parseInt(msg.comment_ywrong_3);
			var c4 = parseInt(msg.comment_ywrong_4);

			var cc = [];
			cc.push(Math.floor((c1 * 100) / (c1 + c2 + c3 + c4)));
			cc.push(Math.floor((c2 * 100) / (c1 + c2 + c3 + c4)));
			cc.push(Math.floor((c3 * 100) / (c1 + c2 + c3 + c4)));
			cc.push(Math.floor((c4 * 100) / (c1 + c2 + c3 + c4)));
			var str = il8n.normal.statistic + ":";
			for (var i = 0; i < 4; i++) {
				if (i == 0) {
					str += "<span style='background-color:red;color:red' title='"
							+ "我的确不会" + "," + c1 + "'>";
				} else if (i == 1) {
					str += "<span style='background-color:blue;color:blue' title='"
							+ "我粗心了" + "," + c2 + "'>";
				} else if (i == 2) {
					str += "<span style='background-color:gray;color:gray' title='"
							+ "我不知道错在哪" + "," + c3 + "'>";
				} else if (i == 3) {
					str += "<span style='background-color:yellow;color:yellow' title='"
							+ "答案错了,我没错" + "," + c4 + "'>";
				}
				for (ii = 0; ii < cc[i]; ii++) {
					str += "|";
				}
				str += "</span>";
			}
			$(".WhyImWrong", $("#w_qs_" + dom.name)).append(str);
		}
	});
}

var question_imgUpload =  function(id){		
	$.ligerDialog.open({ 
		 content: "<iframe id='upload_if' style='display:none' name='send'><html><body>x</body></html></iframe><form id='xx' method='post' enctype='multipart/form-data' action="+config_path__exam_paper__upload_img+" target='send'><input name='file' type='file' /><input name='executor' value='"+top.basic_user.loginData.username+"' style='display:none' /><input name='session' value='"+top.basic_user.loginData.session+"' style='display:none' /><input type='submit' value='"+top.getIl8n('submit')+"' /></form>"
		,height: 150
		,width: 400
		,isHidden: false
	});

	$("#upload_if").load(function(){
        var d = $("#upload_if").contents();	        
        var s = $('body',d).html() ;
        if(s=='')return;
        eval("var obj = "+s);
        if(obj.status=='1'){
        	$("#"+id+"_").attr('src',obj.file);
        	$("#"+id+"_").show();
        	var arr = id.split('_');
        	question_done(arr[2]);
        }
    }); 
}

var question_mark =  function(id,cent){		
	var theResponse = window.prompt(top.getIl8n('exam_paper_log','mark'),"1");
	if(theResponse == null)return;
	if(isNaN(theResponse)){
		alert('Must be a Number');
		return;
	}
	if(theResponse>cent){
		alert('Must less than '+cent);
		return;
	}	
	for(var i=0;i<paper.questions.length;i++){
		if(paper.questions[i].id==id){
			paper.questions[i].cent_ = theResponse;
		}	
		$('#w_q_subQuesNav_' + id).attr('class','w_q_sn_markked');
		$("#w_qs_"+id+"_mark").html(top.getIl8n('exam_paper_log','mark')+" &nbsp;"+theResponse+" / &nbsp; "+cent);
	}
}