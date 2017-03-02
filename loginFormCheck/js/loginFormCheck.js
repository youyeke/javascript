(function(window,undefined){
	window.FormCheck = function FormCheck(obj){
		this.obj = obj.formObj;
				this.callback = obj.callback;
				this.bindList = [];
	}
	FormCheck.prototype.bind = function(index,regexp,requiredMessage,failedMessage){
		//未来需求：当文本框失去焦点后触发ajax
		var obj = this.obj,
			bindList = this.bindList;
		obj[index].index=index;//该元素于form中的位置，用于下面的委托事件
		bindList.push({
			bindObj : obj[index],
			Regexp : regexp,
			requiredMessage : requiredMessage,
			failedMessage : failedMessage
		});
	};
	FormCheck.prototype.check = function(input){
		var	data =input.bindObj.value;
		var statu ={};
		if(data==""){
			statu.result=false;
			statu.message=input.requiredMessage;
			console.log(input.requiredMessage);
			return statu;
		}else{
			var regexpselect = {
				"" : function(){
					statu.result=true;
					return statu;
				},
				"mail" : function(){
					var Reg = new RegExp(/^\w+[@]\w+[\.]\w+$/);
					console.log(Reg)
					return check(Reg);
				},
				"default" : function(){
					var Reg = new RegExp(input.Regexp);
					return check(Reg);
				}
			};
			var check = function(Reg){
				if(Reg.test(data)){
					statu.result=true;
					return statu;
				}else{
					console.log(input.failedMessage);
					statu.result=false;
					statu.message=input.failedMessage;
					return statu;
				};
			};
			return (regexpselect[input.Regexp] || regexpselect["default"])();
		};
	};
	FormCheck.prototype.addClass = function(input,meaObj){
		input.bindObj.classList="input-error";
		var parent = input.bindObj.parentNode,
			child =document.createElement("label");
		var repeat=false;
		parent.childNodes.forEach(function(item,index){//避免重复添加
			if(item["localName"]=="label"){
				repeat=true;
			}
		});
		if(!repeat){
			child.innerHTML = meaObj.message;
			child.classList = "input-error-Message";
			parent.appendChild(child);
		}
	};
	FormCheck.prototype.removeClass = function(input){
		var parent = input.bindObj.parentNode;
		input.bindObj.classList="";
		parent.childNodes.forEach(function(item,index){
			if(item["localName"]=="label"){
				parent.removeChild(parent.childNodes[index]);
			}
		});
	}
	FormCheck.prototype.ready = function(e){
		var obj = this.obj,
			bindList = this.bindList,
			instantiation = this;
		obj.addEventListener("submit",function(e){
			e.preventDefault();
			var result=bindList.every(function(item,index){
				var checkresult = instantiation.check(bindList[index]);
				if(!checkresult.result){
					instantiation.addClass(bindList[index],checkresult);
				};
				return checkresult.result;
			});
			if(result){
				var callback=instantiation.callback;
				callback();
			}
		});
		obj.addEventListener("focusin",function(e){
			var input=bindList[e.target.index];
			if(input!=undefined){
				instantiation.removeClass(input);
			};
		});
		obj.addEventListener("focusout",function(e){
			var input=bindList[e.target.index];
			if(input!=undefined){
				instantiation.removeClass(input);
				var result = instantiation.check(input);
				if(!result.result){
					instantiation.addClass(input,result);
				};
			};
		},false);
	};
})(window);
