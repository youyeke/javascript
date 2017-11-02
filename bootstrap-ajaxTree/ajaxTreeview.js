(function(w,undefined){
	w.AjaxTreeview = function(oDOM){
		this.bandDOM = oDOM;
	}
	AjaxTreeview.prototype.initData = function(oData){
		this.draw(this.bandDOM,oData);
		this.bindEvent();
	}
	AjaxTreeview.prototype.bindEvent = function(){
		var _this = this;
		this.bandDOM.addEventListener('click',function(e){
			if(e.target.tagName !== 'I' && e.target.tagName !== 'UI'){
				//选中某一节点
				var oLi = e.target;
				while(!oLi.dataset.id){
					oLi = oLi.parentElement;
				}
				var action = document.querySelector('.treeview .action') || {};
				action.className = '';
				oLi.className = 'action';
			}
			if(e.target.tagName === "I" && e.target.tagName !== 'UI'){
				if(e.target.className !== 'unfolded'){
					//展开节点
					e.target.className = 'unfolded';
					_this.unfoldTree(e.target.parentElement.parentElement);
				}else{
					//收拢节点
					e.target.className = '';
					_this.removeTree(e.target.parentElement.parentElement);
				}
			}
		});
		this.bandDOM.addEventListener('dblclick',function(e){
			var oEventDOM = e.target;
			console.log("%O",oEventDOM)
			if(oEventDOM.tagName === 'DIV'){
				oEventDOM = oEventDOM.childNodes[0];
			}
			if(oEventDOM.tagName === 'SPAN'){
				oEventDOM = oEventDOM.previousElementSibling;
			}
			if(oEventDOM.tagName === 'I'){
				if(oEventDOM.className !== 'unfolded'){
					//展开节点
					oEventDOM.className = 'unfolded';
					_this.unfoldTree(oEventDOM.parentElement.parentElement);
				}else{
					//收拢节点
					oEventDOM.className = '';
					_this.removeTree(oEventDOM.parentElement.parentElement);
				}
			}
		});
	}
	AjaxTreeview.prototype.draw = function(oDOM,oData){
		html = '<ul class="treeview">';
		for(var i in oData){
			html += '<li data-id="'+ oData[i].id +'"><div><i></i><span>'+ oData[i].title + '</span></div></li>';
		}
		html += '</ul>';
		oDOM.innerHTML += html;
	}
	AjaxTreeview.prototype.unfoldTree = function(oLi){
		//展开节点
		this.showLoad(oLi);
		this.ajax(oLi,oLi.dataset.id);
	}
	AjaxTreeview.prototype.showLoad = function(oLi){
		var oDiv = document.createElement('div');
		oDiv.className = 'loadTree';
		oDiv.innerText = '加载中……';
		oLi.appendChild(oDiv);
		var _this = this;
	}
	AjaxTreeview.prototype.removeLoad = function(oLi){
		var oDiv = document.querySelector('.loadTree');
		oLi.removeChild(oDiv);
	}
	AjaxTreeview.prototype.ajax = function(oLi,key){
		var _this = this;
		$.ajax({
   			url: 'getBookClass',
   			type: 'get',
   			data:{key:key},
   			success: function(d){
   				_this.removeLoad(oLi);
   				_this.draw(oLi,d.data);
   			}
   		});
	}
	AjaxTreeview.prototype.removeTree = function(oLi){
		var child = oLi.querySelector('.treeview');
		oLi.removeChild(child);
	}
})(window);