(function(window,undefined){
	var maskOperate = {
		list : [],
		clearMask : function(parent,child){
			if(arguments[0] == undefined){
				var parent=document.body;
				var child=document.getElementById("maskBackground");
			}
			parent.removeChild(child);
			maskOperate.check();
		},
		addMask : function(html,callback,time){
			this.list.push({
				"html":html,
				"callback":callback,
				"time" : time
			});
			this.check();
		},
		check : function(){
			var mask = document.getElementById("maskBackground");
			if(mask == null && this.list.length > 0){
				var html = this.list[0].html,
					callback = this.list[0].callback,
					time = this.list[0].time;
				this.createMask(html);
				if(time == undefined){
					this.clickEvent(callback);
				}else{
					setTimeout(function(){
						maskOperate.clearMask();
						if(typeof(callback) == "function"){
							callback();
						}
					},time);
				}
				this.list.shift();
			}
		},
		createMask : function(html){
			var parent = document.body;
			var child=document.createElement("div");
			child.id="maskBackground";
			if(html){
				child.innerHTML = html;
			}
			parent.appendChild(child);
			return child;
		},
		clickEvent : function(callback){
			var parent=document.body;
			var mask=document.getElementById("maskBackground");
			mask.addEventListener("click",function(e){
				if(typeof(callback) == 'function'){
					if(e.target.value == "确定"){
						callback();
					}
				}
				if(e.target.type == "button"){
					this.removeEventListener("click",arguments.callee);
					maskOperate.clearMask(parent,mask);
				}
			},false);
		}
	};
	var maskLayer = {
		clearMask : function(){
			maskOperate.clearMask();
		},
		tips : function(message,type){
			type = type || "";
			var html = "<div class=\""+type+"\"><p>提示信息</p><p>"+message+"</p><span><input type=\"button\" value=\"确定\" /></span></div></div>";
			maskOperate.addMask(html);
		},
		warn : function(message,callback){
			var html = "<div class=\"failed\"><p>警告</p><p>"+message+"</p><span><input type=\"button\" value=\"确定\" /><input type=\"button\" value=\"取消\" /></span></div></div>";
			maskOperate.addMask(html,callback);
		},
		wait : function(message){ //该提示用户无法自行关闭(除了刷新)，请在合适的时候调用maskOperate.clearMask关闭
			var html = [
					"<div><p>"+message+"</p>",
					"<div id=\"preloader_1\"><span></span><span></span><span></span><span></span><span></span></div>",
					"</div></div>"].join("");
			maskOperate.addMask(html);
		},
		news : function(message,type,time,callback){
			var html = "<div class=\""+type+"\"><p>提示</p><p>"+message+"</p></div></div>";
			maskOperate.addMask(html,callback,time);
		}
	}
	window.maskLayer=maskLayer;
})(window);
