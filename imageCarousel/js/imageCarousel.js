(function(window,undefined) {
	window.ImageCarousel = function(obj){
		this.dom = obj.dom;
		this.width = obj.width || 800;
		this.height = obj.height || 450;
		this.imageList = obj.imageList;
		this.hrefList = obj.hrefList;
		this.titleList = obj.titleList;
		this.path = obj.path;
		this.speed = obj.speed;
		this.sleep = obj.sleep;
		this.hiddenTitle = (obj.hiddenTitle == true)? true : false;
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
			hiddenTitle = this.hiddenTitle
		var imageCacheCompleteAmount = 0;
		var that = this;
		dom.style.width = width +"px";
		dom.style.height = height +"px";
		imageList.forEach(function(url,index){
			var img = new Image();
			img.src = url;
			if(img.complete){
				imageCacheCompleteAmount++;
				console.log("cache:",img)
				return ;
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
			dom.classList +=" imageCarousel";
			var domImage = "",
				domImageSwith = "";
			imageList.forEach(function(url,index){
				domImage += "<li><a href="+hrefList[index]+"><img src="+url+"></a></li>";
				if(index ==0){
					domImageSwith += "<span class=\"activeImg\">"+(index+1)+"</span>";
				}else{
					domImageSwith += "<span>"+(index+1)+"</span>";
				}
			});
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
			if(!hiddenTitle){
				dom.childNodes[2].style.bottom ="0";
			}
			console.log("%O",dom)
			var switchImage = dom.childNodes[1];
			that.animation();//初始化方法，以便惰性选择CSS动画或是JS动画
			that.carousel();
			/* 有关何时暂停轮播 start */
			dom.addEventListener("mouseover",function(){
				that.carousel("stop");
			});
			dom.addEventListener("mouseout",function(){
				that.carousel();
			});
			document.addEventListener("visibilitychange",function(e){
				if(document.hidden){
					that.carousel("stop");
				}
				else{
					that.carousel();
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
			length = this.imageList.length,
			speed = this.speed;
		var currentIndex = 0;
		if(animationType =="CSS"){
			dom.childNodes[0].style.transition = "all "+speed+"ms";
			dom.childNodes[0].style.left = "0px"
			this.animation = function(index){
				if(index == undefined){
					if(currentIndex < length-1){
						currentIndex++;
					}else{
						currentIndex = 0;
					}
				}else{
					currentIndex = index-1;
				}
				dom.childNodes[0].style.left = -currentIndex*width+"px";
				this.switchStyle(currentIndex)
			}
		}else{
			this.animation = function(index){
				console.log("JS",index)
			}
		}
	};
	ImageCarousel.prototype.switchStyle = function(index){
		var dom = this.dom,
			switchButton = dom.childNodes[1];
		[].forEach.call(switchButton.children,function(child,index){
			child.classList = "";
		});
		switchButton.childNodes[index].classList = "activeImg";
	};
	ImageCarousel.prototype.carousel = function(){
		var sleep = this.sleep,
			that = this;
		var timers;
		this.carousel = function(){
			if(arguments[0] != "stop"){
				timers = window.setInterval(function(){
					that.animation();
				},sleep)
			}else{
				window.clearInterval(timers);
			}
		};
	};
})(window)