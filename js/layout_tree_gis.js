var path_login = "login.html";
var sys_top_window = 1;
var layout_tree_gis = {
	LINKWIDTH : 90,
	LINKHEIGHT : 90, 
	TASKBARHEIGHT : 43,
	links : [],
	isWindow : false,
	winheight: 0,
	winwidth: 0,

	
	
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

	}	

	,initTreeGIS: function(){
        $("#layout1").ligerLayout({
            leftWidth: 180
        });
        
        basic_user.login("session","session",layout_tree_gis.initTree);     
        $('.l-layout-top').css("background-color","rgb(240, 240, 235)");
	}
	
	,initTree: function(){
		var tree = $("#tree").ligerTree({
			 data: basic_user.permission
			,textFieldName: 'name'
			,idFieldName: 'code'
			,id: "menutree"
			,isLeaf: function(node){
				if( node.type == '20'){
					return true;
				}
				if( node.children ){
					return false;
				}
				return true;
			}
			,checkbox: false
			,nodeWidth: 180
			,onClick: function(node){
				if(node.data.type!='20')return;
				
				var h = $(window).height();
				var w = $(window).width();
				var win = $.ligerDialog.open({ 
			         url: node.data.path
			        ,height: h - 55 - 35
			        ,width: w - 183
			        ,left: 183
			        ,top: 55
			        ,title: node.data.name
					,isHidden: false                
					,showMax: true
					,showToggle: true
					,showMin: true
					,isResize: true
			        ,id: node.data.code
					,modal: false                
			    });  
				
			}
		});
		
		$('.l-layout-left').css("background-color","rgb(240, 240, 235)");
	}
};