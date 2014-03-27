
var layout = {
	LINKWIDTH : 90,
	LINKHEIGHT : 90, 
	TASKBARHEIGHT : 43,
	links : [],
	isWindow : false,
	winheight: 0,
	winwidth: 0,

	f_open : function f_open(url, title, icon , type ,code) {
		

		if(top.$.ligerui.get("win_"+code)){
			top.$.ligerui.get("win_"+code).show();
			return;
		}
		
		var hei = null;
		var wid = null;
		var top_ = null;
		var left = null;
		
		if(type=='10'){//folder类型窗口
			var len = type.length;
			for(var i=0;i<top.basic_user.permission.length;i++){
				if(top.basic_user.permission[i].code==code){
					var thelength = top.basic_user.permission[i].children.length;
					if(thelength>3){
						var num = parseInt(thelength / 3);
						wid = 90 * (num+1) + 50;
						hei = 5 * 90 + 100;
					}else{
						wid = 200;
						hei = thelength * 100 + 100;
					}
				}
			}
		}
		else if(code=='10'){//登录
			hei = 220;
			wid = 340;
		}
		else if(code=='11'){//用户中心
			hei = 250;
			wid = 600;
		}
		else if(code=='4001'){//地图
			hei = top.layout.winheight - 35;
			wid = top.layout.winwidth - 250;
			top_ = 0;
			left = 250;
		}	

		var win = top.$.ligerDialog.open({ 
			id : "win_"+code
			, isHidden: false 
			, height:  hei
			, url: url
			, top: top_
			, left: left
			, width: wid
			, showMax: true
			, showToggle: true
			, showMin: true
			, isResize: true
			, modal: false
			, title: title
			, slide: false
		});
		
		if(hei==null){
			win.max();
		}
		
		return win;
	},
	
	onResize : function() {		
		var linksHeight = $(window).height() - this.TASKBARHEIGHT;
		var winlinks = $("#winlinks");
		winlinks.height(linksHeight);
		var colMaxNumber = parseInt(linksHeight / this.LINKHEIGHT);//一列最多显示几个快捷方式
		for (var i = 0, l = layout.links.length; i < l; i++) {
			
			var link = layout.links[i];
			var jlink = $("li[linkindex=" + i + "]", winlinks);

			var top = (i % colMaxNumber) * this.LINKHEIGHT, left = parseInt(i / colMaxNumber) * this.LINKWIDTH;
			if (isNaN(top) || isNaN(left)) continue;
			var css = { top: top, left: left };

			jlink.css(css);
		}

	},
	
	linksInit : function() {
		$("li",$('#winlinks')).remove();
		for (var i = 0, l = this.links.length; i < l; i++) {
			var link = this.links[i];
			var jlink;
			var jlink = $("<li></li>");
			jlink.attr("linkindex", i);
			jlink.append("<img src='" + link.icon + "' />");
			jlink.append("<span>" + link.title + "</span>");
			jlink.append("<div class='bg'></div>");
			jlink.hover(function () {
				$(this).addClass("l-over");
			}, function () {
				$(this).removeClass("l-over");
			}).click(function () {
				var linkindex = $(this).attr("linkindex");
				var link = layout.links[linkindex];
				layout.f_open(link.url, link.title, link.icon,link.type ,link.code);
			});
			jlink.appendTo($("#winlinks ul"));
		}
	},

	loadIcons : function(){
		
		var winheight = $(window).height();
		var winwidth = $(window).width();
		layout.winheight = winheight;
		layout.winwidth = winwidth;		
		
		layout.links = [];

		var permission = basic_user.permission ;
		for(var i=0;i<permission.length;i++){					
			if(permission[i].type=="10"){
				layout.links.push({icon: permission[i].icon,title: permission[i].name, url: 'layout_desktop_folder.html?id='+i,type:permission[i].type , code :permission[i].code });
			}else if(permission[i].type=="20"){
				layout.links.push({icon: permission[i].icon,title: permission[i].name, url: permission[i].path,type:permission[i].type , code :permission[i].code });
			}
		}
		$(window).resize(layout.onResize);
		$.ligerui.win.removeTaskbar = function () { }; //不允许移除
		$.ligerui.win.createTaskbar(); //页面加载时创建任务栏				
		layout.linksInit();
		layout.onResize();
		
		if(basic_user.username!='guest'){
			//1120分钟更新一次 session 
			setInterval("basic_user.updateSession()", 1120*60*1000);
		}
	},
	
	initDesktopDom : function(){
		$(document.body).attr('style','overflow: hidden; ');
		$(document.body).append('<img width="100%" height="100%" src="../file/background_big.jpg"/>');
		$(document.body).append('<div id="winlinks"><ul></ul></div>');
		var username = getCookie("myApp_username");
		var password = getCookie("myApp_password");
		
		var winheight = $(window).height();
		var winwidth = $(window).width();
		layout.winheight = winheight;
		layout.winwidth = winwidth;	
		
		if(username==null){
			basic_user.login("guest",MD5( MD5( "guest" ) +((new Date()).getHours())),layout.loadIcons);
		}else{
			basic_user.login(username,password,layout.loadIcons);
		}
	},
	
	initPanelDom: function(){
        $(function ()
        {
            $("#layout1").ligerLayout({
                minLeftWidth:80,
                minRightWidth:80
            });
        });
        var height = $(".l-layout-center").height();

        $("#framecenter").ligerTab({ height: height });


		var username = getCookie("myApp_username");
		var password = getCookie("myApp_password");
		if(username==null){
			basic_user.login("guest",MD5( MD5( "guest" ) +((new Date()).getHours())),"layout.loadIcons();");
		}else{
			basic_user.login(username,password,layout.initTopPanel);
		}
	},
	
	initLeftPanel: function(){
		var str = "";
		for(var i=0;i<basic_user.permission.length;i++){
			var item = basic_user.permission[i];
			if(item.type=="10"){
				str += "<div title='"+item.name+"'><ul>";
					for(var i2=0;i2<item.children.length;i2++){
						var item2 = item.children[i2];
						str += "<li class='l-link' path='"+item2.path+"' id='"+item2.code+"' onclick='layout.clickLeftPenlMenu(this)' name='"+item2.name+"' ><a href='#'>"+item2.name+"</a></li>";
					}
				str += "</ul></div>";
			}		
		}
		
		$("#leftpanel").append(str);
		var toph = $(".l-layout-top").height();
        $("#leftpanel").ligerAccordion( {
           height: $(window).height() - toph - 36
        });
        $(".l-link").hover(function ()
                {
                    $(this).addClass("l-link-over");
                }, function ()
                {
                    $(this).removeClass("l-link-over");
                });
        
	},
	
	initTopPanel: function(){
		var str = "<table>";
		var strr1 = "<tr><td id='toppanel_left' width='400px'>&nbsp;&nbsp;<span style='font-size:30px;'>某某某后台系统</span></td>";
		var strr2 = "<tr><td ></td>";
		var strr1_ = "";
		var strr2_ = "";
		var count = 0;
		for(var i=0;i<basic_user.permission.length;i++){
			var item = basic_user.permission[i];
			if(item.type=="20"){
				count ++;
				strr1_ += "<td width='70px;' align='center'><img src='"+item.icon+"' style='heigth:34px;width:34px;' /></td>";
				strr2_ += "<td align='center'>"+item.name+"</td>";
			}			
		}
		strr1_ += "</tr>";
		strr2_ += "</tr>";
		str = str + strr1 + strr1_ + strr2 + strr2_ + "</table>";
		$("#toppanel").append(str);
		$("#toppanel").css("background-color","rgb(30,62,123)");
		$("#toppanel_left").attr("width",$(window).width() - 70*count - 80);
		
		layout.initLeftPanel();
	},
	
	clickLeftPenlMenu: function(dom){
		var path = $(dom).attr("path");
		var tabid = "win_"+$(dom).attr("id");
		$.ligerui.get("framecenter").addTabItem({ tabid : tabid,text: $(dom).attr("name"), url: path,height: $(window).height() -  $(".l-layout-top").height() - 36 });
	},
	
	initFolder : function(){
		this.isWindow = true;
		var id = getParameter( "id" , window.location.toString() );
		$(document.body).attr('style','overflow: hidden; ');
		$(document.body).attr('style','overflow: hidden; background: url(../file/background_small.gif) ');
		$(document.body).append('<div id="winlinks"><ul></ul></div>');
		
		var permission = top.basic_user.permission;

		permission = permission[id].children;
		for(var i=0;i<permission.length;i++){

			layout.links.push({icon:permission[i].icon,title: permission[i].name, url: permission[i].path, code :permission[i].code });
			
		}
		
		layout.linksInit();
		layout.onResize();	
	}
	
	,initTreeGIS: function(){
        $("#layout1").ligerLayout({
            minLeftWidth:80,
            minRightWidth:80
        });
        
        
	}
};