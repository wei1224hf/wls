var question_big = function(){
	this.initDom = function() {
		$("#wls_quiz_main").append("<div id='w_qs_" + this.id
				+ "'></div>");
		if( !(this.path_img==null||this.path_img=='' || (typeof(this.path_img))=='undefined'||this.path_img=='0'||this.path_img==0) ){
			this.title =  this.title + "<br/><img src='"+this.path_img+"' />";
		}
		if( !(this.path_listen==null||this.path_listen=='' || (typeof(this.path_listen))=='undefined'||this.path_listen=='0'||this.path_listen==0) ){
			
			var str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="150" height="20" '
				   + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"> '
				   + '<param name="movie" value="../libs/singlemp3player.swf?file='+this.path_listen+'&autoStart=false&backColor=000000&frontColor=ffffff&songVolume=90" /> '
				   + '<param name="wmode" value="transparent" /> '
				   + '<embed wmode="transparent" width="150" height="20" src="../libs/singlemp3player.swf?file='+this.path_listen+'&autoStart=false&backColor=000000&frontColor=ffffff&songVolume=90" '
				   + 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /> '
				   + '</object> ';	
			this.title = str+"<br/>" + this.title;
		}		
		$("#w_qs_" + this.id).append("<div class='w_qw_title'>&nbsp;<span class='w_qw_tool'></span>"
				+ this.title + "</div>");
	}
	this.getMyAnswer = function(){return 'I_DONT_KNOW';	}
	
	this.showDescription = function(){}
	
	this.setMyAnswer = function(){}
};
question_big.prototype = new question();