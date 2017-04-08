//(c) Copyright 2017 youye. All Rights Reserved. 
(function(window,undefined){
	console.log("HTML5-fileUpload version is v1.0.1")
	var $ = function(id){
		return document.getElementById(id);
	};
	var Ajax = function(obj){
		this.type = obj.type || "";
		this.url = obj.url || "";
		this.data = obj.data || "";
		this.success = obj.success || "";
		this.failed = obj.failed || "";
		this.progress = obj.progress || "";
	};
	Ajax.prototype.send = function(){
		var type=this.type,
			url=this.url,
			data=this.data,
			success=this.success,
			failed=this.failed,
			progress=this.progress;
		var xhr = new XMLHttpRequest;
		if(progress){
			xhr.upload.addEventListener("progress",function(obj){
				progress(obj);
			},false);
		}
		xhr.onreadystatechange = function(e){
			if(xhr.readyState==4){
				if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
					success(xhr.responseText);
				}else{
					failed(xhr.status);
				}
			}
		}
		if(type=="GET"||type=="get"){
			xhr.open(type,url,true);
			xhr.send(null);
		}else if(type=="POST"||type=="post"){
			xhr.open(type,url,true);
			xhr.send(data);
		}else{
			console.log("不支持的Ajax方法");
			return;
		}
	}
	var fileListCommand = {
		create : function(index,fileInfo){
			var fileListHTML=[
					"<tr id=\"FL"+index+"\">",
					"<td>"+fileInfo.name+"</td>",
					"<td>"+this.getTypeStype(fileInfo.type)+"</td>",
					"<td>"+this.getSize(fileInfo.size,"auto")+"</td>",
					"<td>等待上传</td>",
					"<td><a href=\"javascript:;\" data-type=\"delete\" data-id=\"FL"+index+"\">"+"取消"+"</a></td>",
					"</tr>"
				].join("");
				return fileListHTML;
		},
		getTypeStype : function(mimeType){
			var stypeMap = {
				"application/msword" : "doc",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "doc",
				"application/vnd.ms-powerpoint" : "ppt",
				"application/vnd.openxmlformats-officedocument.presentationml.presentation" : "ppt",
				"application/vnd.ms-excel" : "xls",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "xls",
				"image/jpeg" : "img",
				"image/gif" : "img",
				"image/png" : "img",
				"video/mp4" : "video",
				"video/x-msvideo" : "video",
				"video/mpeg" : "video",
				"video/quicktime" : "video",
				"audio/x-ms-wmv" : "video",
				"text/plain" : "txt",
				"application/zip" : "zip",
				"application/x-gzip" : "zip",
				"application/x-zip-compressed" : "zip",
				"application/octet-stream" : "rar",
				"default" : "file"
			};
			return "<span class=\"icon-file-30px icon-file-30px-"+(stypeMap[mimeType] || stypeMap["default"])+"\"></span>";
		},
		getSize : function(fileSize,type,isUnits){
			//接收三个参数，第一个：字节数(B)，第二个：数据转换的依据(例如输入KB则永远依照KB进行转换).第三个：返回值是否带单位(number or string)
				var result=0;//缓存复杂运算的结果
				var typeMap = {
					"B" : function(size,isUnits){
						return isUnits?(fileSize+"B"):fileSize;
					},
					"KB" : function(size,isUnits){
						result=Math.round(fileSize*100/1024)/100;
						return isUnits?(result+"KB"):result;
					},
					"MB" : function(size,isUnits){
						result=Math.round(size*100/(1024*1024))/100;
						return isUnits?(result+"MB"):result;
					},
					"auto" : function(size){
						switch(true){
							case size<1000:
									return size+" B";
									break;
							case size<1000000:
									return Math.round(size*100/1024)/100+" KB";
									break;
							case size<1000000000:
									return Math.round(size*100/(1024*1024))/100+" MB";
									break;
							default:
									return "文件过大";
						}
					},
					"default" : function(){
						return "第二个参数错误";
					}
				};
				return typeMap[type](fileSize,isUnits) || typeMap["default"](fileSize,isUnits);
		},
		getFielMD5 : function(fileInfo,callback){
			var fileReader = new FileReader,
				spark = new SparkMD5();
			var md5 = null;
			fileReader.readAsBinaryString(fileInfo);
			fileReader.onload = function(e){
				spark.appendBinary(e.target.result);
				md5=spark.end();
				if (typeof(callback) === "function"){
					callback(md5);
				}
			};
		}
	};
	window.UploadJS = function(obj){
		this.upWorkFileBox = obj.upWorkFileBox;
		this.fileMD5Qurey = obj.fileMD5Qurey;
		this.formAction = obj.formAction;
		this.mergeFilesAction = obj.mergeFilesAction;
		this.fileChunk = obj.fileChunk;
	};
	UploadJS.prototype.ready = function(){
		var upWorkFileBox = this.upWorkFileBox;
		var self = this;
		var fileArray = this.fileArray = [],//用户选择上传的文件列,会转换为dom供用户操作
			uploading = this.uploading = [];//确切要上传的文件，请确保由fileArray转化成
		upWorkFileBox.innerHTML = [
			"<form id=\"upWorkFileForm\"><input type=\"file\" class=\"file\" id=\"selectFile\" multiple />",
		    "<span class=\"file-select-info\">选择需要上传的文件</span><input type=\"submit\" value=\"上传文件\" /></form>",
		    "<table id=\"toBeUploaded\"></table>"
		    ].join("");
		var toBeUploadedOL="<tr><td>文件名</td><td>类型</td><td>大小</td><td>状态</td><td>操作</td></tr>";
		setTimeout(function(){
			var toBeUploaded = $("toBeUploaded");
			/*选择文件时的操作*/
			$("selectFile").addEventListener("change",function(){
				Array.prototype.push.apply(fileArray,this.files);
				if(fileArray.length>0){
					toBeUploaded.style.display = "block";
					updataList();
				}else{
					toBeUploaded.style = "";
				}
			});
			/*移除上传列表的文件*/
			toBeUploaded.addEventListener("click",function(e){
				if(e.target.getAttribute("data-type") == "delete"){
					var dataID = e.target.getAttribute("data-id");
					var index = dataID.match(/\d/g);
					fileArray.splice(index[0],1);
					if(!fileArray.length>0){
						toBeUploaded.style = "";
					}
					updataList();
				}
			})
			/*提交事件*/
			$("upWorkFileForm").addEventListener("submit",function(e){
				e.preventDefault();
				self.uploading = uploading;
				self.queryUploadedMD5();
			})
			function updataList(){//没想好怎么把它封装好，就暂时丢这里用着先
				uploading = [];
				toBeUploaded.innerHTML = toBeUploadedOL;
				fileArray.forEach(function(fileInfo,index){
					toBeUploaded.innerHTML += fileListCommand.create(index,fileInfo);
					fileListCommand.getFielMD5(fileInfo,function(md5){
						uploading.push({
							"fileInfo" : fileInfo,
							"md5" : md5,
							"DOM" : $("FL"+index)
						});
					});
				});
			}
		},0);
	};
	UploadJS.prototype.queryUploadedMD5 = function(){
		console.log(this);
		var self = this,
			uploading = this.uploading,
			fileChunk = this.fileChunk,
			fileMD5Qurey = this.fileMD5Qurey;
		if(uploading.length>0){
			uploading.forEach(function(info,index){
				(function(info,index){
					var queryData = new FormData(),
						size = info.fileInfo.size,
						fileEndID=Math.ceil(size/fileChunk)-1;//最后一个文件片段的ID,从0开始计数
					self.uploading[index].fileEndID = fileEndID;
					queryData.append("md5",info.md5);
					queryData.append("fileEndID",fileEndID);
					var queryUploaded = new Ajax({
						type : "post",
						url : fileMD5Qurey,
						data : queryData,
						success : function(data){
							self.uploadFile(data,index);
						}
					});
					queryUploaded.send();
				})(info,index);
			});
		};
	};
	UploadJS.prototype.uploadFile = function(data,index){
		(function(data,index){
			var notUpload = data.match(/\d+/g);//取回未上传的片段ID作为数组
			if(notUpload != undefined){
				notUpload=notUpload.map(function(item){  
			    	return parseInt(item);
				});
				var self = this;
				var dom = this.uploading[index].DOM,
					tips = dom.childNodes[3];
				var fileChunk = this.fileChunk,
					fileEndID = this.uploading[index].fileEndID,
					size = this.uploading[index].fileInfo.size,
					formAction = this.formAction;
				var upload = 0,
					needUpload = notUpload.length;
				var uploadedSize=needUpload>1?(fileEndID-needUpload+1)*fileChunk:0,
					concurrentList = [];//存储并发上传时各自的进度
				console.log(this.uploading);
				while(notUpload[0] !== undefined){
					var fileID = notUpload[0];
					(function(fileID,tips){
						var endSize=(notUpload[0]==fileEndID)?size:((notUpload[0]+1)*fileChunk),
		                	fileData= new FormData();
		                fileData.append("file", self.uploading[index].fileInfo.slice((notUpload[0]*fileChunk),endSize));
		                fileData.append("fileID",notUpload[0]);
		                fileData.append("md5",self.uploading[index].md5);
		                notUpload.shift();
		                var uploadFile = new Ajax({
							type : "post",
							url : formAction,
							data : fileData,
							success : function(data){
								upload++;
								if(upload == needUpload){
									uploadFile.progress = null;
									self.mergeFiles(index);
								}
							},
							failed : function(status){
								console.log(status);
							},
							progress : function(e){
								var nowLoadSize = 0;
								concurrentList[fileID] = e.loaded;
								concurrentList.forEach(function(uploadedSize){
									nowLoadSize+=uploadedSize;
								});
		        				var tem=Math.round((uploadedSize+nowLoadSize)/size*10000)/100;
		        				console.log(tips)
		        				console.log(index)
		        				console.log(tem)
				            	tips.innerHTML=tem>=100?"<font color='#00f'>正在处理</font>":tem+"%";
							}
						});
						uploadFile.send();
					})(fileID,tips)
	            };
			}else{
				this.mergeFiles(index);
			}
		}).call(this,data,index);
	};
	UploadJS.prototype.mergeFiles = function(index){
		var self = this;
		console.log(this.uploading[index])
		var dom = this.uploading[index].DOM;
			tips = dom.childNodes[3];
		var command= new FormData(),
			mergeFilesAction = this.mergeFilesAction;
		command.append("fileName",this.uploading[index].fileInfo.name);
        command.append("fileEndID",this.uploading[index].fileEndID);
        command.append("md5",this.uploading[index].md5);
        var mergeFilesCommand = new Ajax({
			type : "post",
			url : mergeFilesAction,
			data : command,
			success : function(data){
				tips.innerHTML = "<font color='#0f0'>上传成功</font>";
				console.log(self.uploading[index].fileInfo.name)
				console.log(tips)
				console.log(data);
			}
		});
		mergeFilesCommand.send();
	};
	})(window);