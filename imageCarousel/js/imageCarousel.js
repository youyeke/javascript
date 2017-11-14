(function(window,undefined) {
	/*
	* by : youyeke
	* GItHub : https://github.com/youyeke/javascript/tree/master/imageCarousel
	*/ 
	window.ImageCarousel = function(obj){
		this.dom = obj.dom;
		this.width = obj.dom.clientWidth;
		this.height = obj.dom.clientHeight;
		this.imageList = obj.imageList;
		this.hrefList = obj.hrefList;
		this.titleList = obj.titleList || [];
		this.path = obj.path;
		this.speed = obj.speed;
		this.sleep = obj.sleep;
		this.titleType = obj.titleType || "show";
		this.animationType = obj.animationType || "JS";
	};
	ImageCarousel.prototype.ready = function(){
		//把图片载入缓存，并绘制dom
		var dom = this.dom,
			width = this.width,
			height = this.height,
			imageList = this.imageList,
			hrefList = this.hrefList,
			titleList = this.titleList;
			titleType = this.titleType
		var imageCacheCompleteAmount = 0;
		var that = this;
		dom.style.width = width +"px";
		dom.style.height = height +"px";
		this.carousel();
		imageList.forEach(function(url,index){
			var img = new Image();
			img.src = url;
			if(img.complete){
				//imageCacheCompleteAmount++;
				console.log("cache:",img)
				//return ;
			}
			img.onload = function(){
				imageCacheCompleteAmount++;
				if(imageCacheCompleteAmount === imageList.length){
					createDom();
				}
				return ;
			}
		});
		function createDom(){
			dom.className +=" imageCarousel";
			//dom.style.width = imageList.length * width +'px';
			var domImage = "",
				domImageSwith = "";
			imageList.forEach(function(url,index){
				domImage += '<li style="width:'+ width +'px"><a href="'+ hrefList[index] +'"><img src="'+ url +'"></a></li>';
				if(index ==0){
					domImageSwith += "<span class=\"activeImg\">"+(index+1)+"</span>";
				}else{
					domImageSwith += "<span>"+(index+1)+"</span>";
				}
			});
			var cache = dom.innerHTML;
			dom.innerHTML = [
				"<ul>",
					domImage,
				"</ul>",
				"<div class=\"IC-switchImg\">",
					domImageSwith,
				"</div>",
				"<div class=\"IC-title\">",
	    		"<p>"+titleList[0]+"</p>",
	    		"</div>"
			].join("");
			dom.innerHTML += cache;
			dom.childNodes[0].style.left ="0";
			var switchImage = dom.childNodes[1];
			var titleMap = {
				"show" : function(){
					dom.childNodes[2].style.bottom ="0";
				},
				"hide" : function(){
				},
				"none" : function(){
					dom.childNodes[2].removeChild(dom.childNodes[2].childNodes[0]);
				},
				"default" : function(){
					console.warn("titleType arguments error! must be 'show' or 'hede' or 'none' ");
				}
			};
			(titleMap[titleType] || titleType["default"])();
			that.animation();//初始化方法，以便惰性选择CSS动画或是JS动画
			/* 有关何时暂停轮播 start */
			dom.addEventListener("mouseover",function(){
				that.carousel();
			});
			dom.addEventListener("mouseout",function(){
				if(that.status == "start"){
					that.carousel("start");
				}
			});
			document.addEventListener("visibilitychange",function(e){
				if(document.hidden){
					that.carousel();
				}
				else{
					if(that.status == "start"){
						that.carousel("start");
					}
				}
			});
			/* 有关何时暂停轮播 end */
			switchImage.addEventListener("click",function(e){
				if(e.target.tagName == "SPAN"){
					that.animation(e.target.innerHTML);
					that.switchStyle(e.target.innerHTML-1);
				}
			})
		}
	};
	ImageCarousel.prototype.animation = function(){
		var animationType = this.animationType,
			dom = this.dom,
			width = this.width,
			length = this.imageList.length-1,
			speed = this.speed;
		var currentIndex = 0;
		if(animationType =="CSS"){
			dom.childNodes[0].style.transition = "all "+speed+"ms";
			this.animation = function(index){
				var action = {
					"last" : function(){
						if(currentIndex > 0){
							currentIndex--;
						}
					},
					"default" : function(){
						if(index == undefined || index == "next"){
							if(currentIndex < length){
								currentIndex++;
							}else{
								currentIndex = 0;
							}
						}else{
							currentIndex = index-1;
						};
					}
				};
				( action[arguments[0]] || action["default"] )();
				dom.childNodes[0].style.left = -currentIndex*width+"px";
				this.switchStyle(currentIndex);
			}
		}else{
			var framePosition =0,
				position = 0;
			this.animation = function(index){
				console.log("JS",index);
				var i = 60;
				var action = {
					"last" : function(){
						if(currentIndex > 0){
							currentIndex--;
						}
					},
					"default" : function(){
						if(index == undefined || index == "next"){
							if(currentIndex < length){
								currentIndex++;
							}else{
								currentIndex = 0;
							}
						}else{
							currentIndex = index-1;
						};
					}
				};
				( action[arguments[0]] || action["default"] )();
				this.switchStyle(currentIndex);
				framePosition =  currentIndex == 0 ?(length*width/60):-width/60;
				var execAnimate=function(){
					position+=framePosition;
					dom.childNodes[0].style.left= position +"px";
					if(--i){
						requestAnimationFrame(execAnimate);
					}
				}
				execAnimate();
			}
		}
	};
	ImageCarousel.prototype.switchStyle = function(index){
		var dom = this.dom,
			titleList = this.titleList,
			titleType = this.titleType,
			switchButton = dom.childNodes[1];
		[].forEach.call(switchButton.children,function(child,index){
			child.className = "";
		});
		switchButton.childNodes[index].className = "activeImg";
		if(titleType !="none"){
			dom.childNodes[2].childNodes[0].innerHTML = titleList[index];
		}
	};
	ImageCarousel.prototype.carousel = function(){
		var sleep = this.sleep,
			that = this;
		var timers;
		this.carousel = function(){
			var carouselMap = {
				"start" : function(){
					that.status = "start";
					timers = window.setInterval(function(){
							that.animation();
					},sleep)
				},
				"stop" : function(){
					that.status = "stop";
					window.clearInterval(timers);
				},
				"default" : function(){
					window.clearInterval(timers);
				}
			};
			( carouselMap[arguments[0]] || carouselMap["default"] )();
		};
	};
})(window)