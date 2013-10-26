/**
 * WLS,We-Like-Study,在线考试学习系统
 * 组合题题型,
 * 可能包含有听力题,使用FALSH播放器实现
 * 
 * @author wei1224hf
 * @version 2011-06-01
 * */
var question_mixed = function() {
	this.initDom = function() {
		$("#wls_quiz_main").append("<div id='w_qs_" + this.id
				+ "'></div>");
		$("#w_qs_" + this.id).append("<div class='w_qw_title'>&nbsp;<span class='w_qw_tool'></span>"
				+ this.title + "</div>");
		if(parseInt(this.path_listen)!=0){
			var str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="150" height="20" '
				   + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"> '
				   + '<param name="movie" value="../libs/singlemp3player.swf?file=../libs/'+this.path_listen+'&autoStart=false&backColor=000000&frontColor=ffffff&songVolume=90" /> '
				   + '<param name="wmode" value="transparent" /> '
				   + '<embed wmode="transparent" width="150" height="20" src="../libs/singlemp3player.swf?file=../libs/'+this.path_listen+'&autoStart=false&backColor=000000&frontColor=ffffff&songVolume=90" '
				   + 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /> '
				   + '</object> ';
			$(".w_qw_tool", "#w_qs_" + this.id).append(str);
		}
	}
	
	this.submit = function(){}
	
	this.getMyAnswer = function(){return 'I_DONT_KNOW';	}
	
	this.showDescription = function(){}
};