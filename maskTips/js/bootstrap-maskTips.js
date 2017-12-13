(function(window,undefined){
	var maskOperate = {
		list : [],
		clearMask : function(){
			if(arguments[0] == undefined){
				var body=document.body;
				var mask=document.getElementById("maskBackground");
				if(mask && mask.childNodes.length === 0) body.removeChild(mask);
			}
		},
		addMask : function(type,className,message,callback,time){
			this.list.push({
				"tipsType" : type,
				"className": className,
				"message": message,
				"callback":callback,
				"time" : time
			});
			this.check();
		},
		tipsTypePopupMap : {
			'news' : function(oTips){
				this.popupNews(oTips);
			},
			'tips' : function(oTips){
				this.popupTips(oTips);
			}
		},
		tipsTypeCloseMap : {
			'news' : function(oTips,config){
				var _this = this;
				setTimeout(function(){
					if(typeof(config.callback) === 'function') config.callback();
					_this.closeNews(oTips);
				},config.time);
			},
			'tips': function(oTips,config){
				var _this = this;
				this.bandClickEvent(oTips,config.callback,function(){
					setTimeout(function(){
						_this.closeTips(oTips);
					},config.time);
				});
			}
		},
		check : function(){
			if(this.list.length > 0){
				var tipsType = this.list[0].tipsType;

				var oTips = this.createMask(this.list[0]);
				(this.tipsTypePopupMap[tipsType]).call(this,oTips);
				(this.tipsTypeCloseMap[tipsType]).call(this,oTips,this.list[0]);

				this.list.shift();
			}else{
				this.clearMask();
			}
		},
		createMask : function(config){
			var maskDOM = document.getElementById('maskBackground');
			var oDiv = document.createElement('div');
				oDiv.className = config.className;
				oDiv.innerHTML = config.message;

			if(!maskDOM){
				var body = document.body;
					maskDOM = document.createElement("div");
					maskDOM.id = "maskBackground";
					
					body.appendChild(maskDOM);
				}

			maskDOM.appendChild(oDiv);
			
			return oDiv;
		},
		popupNews : function(oTips){
			setTimeout(function(){
				oTips.style.top = 0;
				oTips.style.opacity = 1;
				document.getElementById("maskBackground").style.height = 'auto';
			},20);
		},
		closeNews : function(oTips){
			var _this = this;
			setTimeout(function(){
				oTips.style.top = '-4em';
				oTips.style.opacity = 0;
				oTips.style.height = 0;
				document.getElementById("maskBackground").style.height = '100%';
			},20);
			setTimeout(function(){
				document.getElementById("maskBackground").removeChild(oTips);
				document.getElementById("maskBackground").style.height = '';
				_this.clearMask();
			},500);
		},
		popupTips : function(oTips){
		    var cancelBut = $('#maskBackground button[value="cancel"]');
		    if(cancelBut.length === 0){
		        $('#maskBackground button[value="confirm"]').focus();
		    }else{
		        cancelBut.focus();
		    }
			setTimeout(function(){
				oTips.style.marginLeft = window.innerWidth/2 - oTips.clientWidth/2 +'px';
				oTips.style.transform = 'scale(1)';
				oTips.style.zoom = 1;
				document.getElementById("maskBackground").style.background = 'hsla(0,0%,0%,0.5)';
			},20);
		},
		closeTips : function(oTips){
			var _this = this;
			setTimeout(function(){
				oTips.style.marginLeft = window.innerWidth +'px';
				oTips.style.transform = 'scale(0)';
				oTips.style.opacity = 0;
				oTips.style.height = 0;
				document.getElementById("maskBackground").style.background = 'transparent';
			},20);
			setTimeout(function(){
				document.getElementById("maskBackground").removeChild(oTips);
				_this.clearMask();
			},500);
		},
		bandClickEvent : function(DOM,callback,close){
			DOM.addEventListener("click",function(e){
				if(typeof(callback) == 'function'){
					if(e.target.value === "confirm"){
						callback();
					}
				}
				if(e.target.type == "button"){
					this.removeEventListener("click",arguments.callee);
					close();
				}
			},false);
		}
	};
	var maskLayer = {
		clearMask : function(){
			maskOperate.clearMask();
		},
		news : function(config,callback){
			if(typeof(config) ==='string'){
				config = {message: config};
			}
			config.className = config.className || 'alert alert-'+(config.type || "info");
			config.message = config.message || '';
			config.time = config.time || 1500;
			maskOperate.addMask('news',config.className,config.message,callback, config.time || 1500);
		},
		tips : function(config,callback){
			if(typeof(config) ==='string'){
				config = {message: config};
			}
			config.title = config.title || '提示';
			config.type = config.type || 'primary';
			config.confirm = config.confirm || '确定';

			var className = 'modal-dialog modal-sm tips';
			var message = [
				'<div class="modal-dialog modal-sm">',
					'<div class="modal-content">',
						'<div class="modal-header">',
							'<h4 class="modal-title">'+ config.title +'</h4>',
						'</div>',
						'<div class="modal-body">'+ config.message +'</div>',
						'<div class="modal-footer">',
							'<button type="button" value="confirm" class="btn btn-'+ config.type +'">'+ config.confirm +'</button>',
						'</div>',
					'</div>',
				'</div>'
			].join('');
			maskOperate.addMask('tips',className,message,callback);
		},
		warn : function(config,callback){
			if(typeof(config) ==='string'){
				config = {message: config};
			}
			config.title = config.title || '警告';
			config.type = config.type || 'danger';
			config.cancel = config.cancel || '取消';
			config.confirm = config.confirm || '确定';

			var className = 'modal-dialog modal-sm tips';
			var message = [
				'<div class="modal-dialog modal-sm">',
					'<div class="modal-content">',
						'<div class="modal-header">',
							'<h4 class="modal-title">'+ config.title +'</h4>',
						'</div>',
						'<div class="modal-body">'+ config.message +'</div>',
						'<div class="modal-footer">',
							'<button type="button" value="cancel" class="btn btn-default">'+ config.cancel +'</button>',
							'<button type="button" value="confirm" class="btn btn-'+ config.type +'">'+ config.confirm +'</button>',
						'</div>',
					'</div>',
				'</div>'
			].join('');
			maskOperate.addMask('tips',className,message,callback);
		}
	}
	window.maskLayer = maskLayer;
})(window);
