//(c) Copyright 2017 youye. All Rights Reserved. 
(function(){
		var upFile=document.getElementById("upWork"),
			fileList=document.getElementById("fileList"),
			upListOL="<li><div>文件名</div><div>类型</div><div>大小</div><div>状态</div><div>操作</div></li>",
			formAction="PHPsystem/fileUpload.php",
			fileMD5Qurey="PHPsystem/fileMD5Qurey.php",
			mergeFilesAction="PHPsystem/mergeFiles.php",
			fileArray= [],//修改上传队列时的修改对象
			spark = new SparkMD5(),
			md5=[],
			fileChunk=2*1024*1024;//断点续传时文件的分割大小
		
		//绑定上传事件
		upFile.addEventListener("change",function(){
			fileList.innerHTML=upListOL;
			fileList.style.display="table";
			Array.prototype.push.apply(fileArray,upFile.files);
			for(var i=0;fileArray[i];i++){
				var fileInfo=fileArray[i];
					(function(fileInfo,i){
						var fileReader = new FileReader();
						fileReader.readAsBinaryString(fileInfo);
						fileReader.onload = function(e){
							spark.appendBinary(e.target.result);
							//md5.splice(i,0,spark.end());//用这种方法MD5的顺序会乱
							md5[i]=spark.end();
							createList(i,fileInfo.name,getFileType(fileInfo.type),getFileSize(fileInfo.size),"等待上传","取消");
						}
					})(fileInfo,i)
			}
			
			console.log(fileArray);
			console.log(md5);
			
		});
		function createList(i,fName,fType,fSize,message,buttonV){
				var fileListHTML=[
					"<li id=\"FL"+i+"\">",
					"<div>"+fName+"</div>",
					"<div>"+fType+"</div>",
					"<div>"+fSize+"</div>",
					"<div>"+message+"</div>",
					"<div><a href=\"javascript:;\" data-type=\"delete\" data-id=\"FL"+i+"\">"+buttonV+"</a></div>",
					"</li>"
				].join("");
				fileList.innerHTML+=fileListHTML;
		}
		function getFileType(type){
			switch(type){
				case "application/msword":
				case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
						return "<span class=\"icon-file-30px icon-file-30px-doc\"></span>";
						break;
				case "application/vnd.ms-powerpoint":
				case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
						return "<span class=\"icon-file-30px icon-file-30px-ppt\"></span>";
						break;
				case "application/vnd.ms-excel":
				case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
						return "<span class=\"icon-file-30px icon-file-30px-xls\"></span>";
						break;
				case "image/jpeg":
				case "image/gif":
				case "image/png":
						return "<span class=\"icon-file-30px icon-file-30px-img\"></span>";
						break;
				case "video/mp4":
				case "video/x-msvideo":
				case "video/mpeg":
				case "video/quicktime":
				case "audio/x-ms-wmv":
						return "<span class=\"icon-file-30px icon-file-30px-video\"></span>";
						break;
				case "text/plain":
						return "<span class=\"icon-file-30px icon-file-30px-txt\"></span>";
						break;
				case "application/zip":
				case "application/x-gzip":
				case "application/x-zip-compressed":
						return "<span class=\"icon-file-30px icon-file-30px-zip\"></span>";
						break;
				case "application/octet-stream":
						return "<span class=\"icon-file-30px icon-file-30px-rar\"></span>";
						break;
				default:
						return "<span class=\"icon-file-30px icon-file-30px-file\"></span>";
			}
		}
		function getFileSize(size){
				switch(true){
					case size<1000:
							return size+"B";
							break;
					case size<1000000:
							return Math.round(size*100/1024)/100+"KB";
							break;
					case size<1000000000:
							return Math.round(size*100/(1024*1024))/100+"MB";
							break;
					default:
							return "文件过大";
				}
		}
		//绑定上传列表操作事件(移除上传列表的文件)
		fileList.addEventListener("click",function(e){
			if(e.target.getAttribute("data-type")=="delete"){
				var dataID=e.target.getAttribute("data-id");
				var child=document.getElementById(dataID);
				fileList.removeChild(child);
				fileArray.splice(dataID.match(/\d+/),1);
				md5.splice(dataID.match(/\d+/),1);
				fileList.innerHTML=upListOL;
				for(var i=0;fileArray[i];i++){
					(function(i){
						createList(i,fileArray[i].name,fileArray[i].type,getFileSize(fileArray[i].size),"等待上传","取消");
					})(i);
				};
				console.log(fileArray,name);
			}
		});
		//提交表单
        document.getElementById("upWorkFile").onsubmit=function(){
        	for (var i=0,j=fileArray.length;i<j;i++) {
        		var successList=[],
        			successNumber=0,
        			sumNumber=fileArray.length,
        			failedFileList=[],
        			failedMD5=[];
        		/*闭包开始----为每个需要上传的文件建立一个单独命名空间*/
        		(function(i,size){
        			var tips=document.getElementById("FL"+i).getElementsByTagName("div")[3],
        				deleteButton=document.getElementById("FL"+i).getElementsByTagName("div")[4];
        			var uploadedSize=0,//服务器已有的文件大小
        				nowLoadSize=0,//当前已经传输了的大小
        				concurrentList=[];//同一个文件的块并发上传时，每个块的进度都存储在这
        			var notUpload=[],//未上传的文件片段ID
        				fileEndID=Math.ceil(size/fileChunk)-1,//最后一个文件片段的ID,从0开始计数
        				upComplete=0,//已经上传完成的片段数目
        				sumUp=0;//总共需要上传的数目
        			deleteButton.innerHTML="";
        			readyQuery();
        			function readyQuery(){
        				var queryData= new FormData();
	        			queryData.append("md5",md5[i]);
	        			queryData.append("fileEndID",fileEndID);
	        			sendAjax(fileMD5Qurey,queryData,readySendFile);
        			};
        			function readySendFile(queryData){
        				notUpload=queryData.match(/\d+/g);//取回未上传的ID作为数组
        				console.log(notUpload);
        				if(notUpload!=null){
        					sumUp=notUpload.length;
        					uploadedSize=sumUp>1?(fileEndID-sumUp+1)*fileChunk:0;
        					notUpload=notUpload.map(function(item){  
						    	return parseInt(item);
							});
                            while(notUpload[0]!=undefined){
                                var endSize=(notUpload[0]==fileEndID)?size:((notUpload[0]+1)*fileChunk),
                                    fileData= new FormData();
                                fileData.append("upFileList", fileArray[i].slice((notUpload[0]*fileChunk),endSize));
                                fileData.append("fileID",notUpload[0]);
                                fileData.append("md5",md5[i]);
                                notUpload.shift();
                                sendAjax(formAction,fileData,updataSuccess,updataFailed,getProgress);
                            };
                       }else{
                       		mergeFiles();//如果没有需要上传的片段，则直接合并文件
                       };
        			};
        			function updataSuccess(responseText){
        				if(responseText=="success"){
        					upComplete++;
        				};
        				if(upComplete==sumUp){
        					tips.innerHTML="<font color='#00f'>正在处理</font>";
        					mergeFiles();
        				}
        			};
        			function updataFailed(status){
        				console.log(status);
        				tips.innerHTML="<font color='#f00'>未响应</font>";
        			}
        			function getProgress(loaded){
        				concurrentList.push(loaded);
        				while(concurrentList[0]){
        					nowLoadSize+=concurrentList.pop();
        				}
        				var tem=Math.round((uploadedSize+nowLoadSize)/size*10000)/100;
		            	tips.innerHTML=tem>=100?"<font color='#00f'>正在处理</font>":tem+"%";
        			}
        			function mergeFiles(){
        				var command= new FormData();
        				command.append("fileName",fileArray[i].name);
                        command.append("fileEndID",fileEndID);
                        command.append("md5",md5[i]);
        				sendAjax(mergeFilesAction,command,mergeFilesSuccess,mergeFilesFailed)
        			}
        			function mergeFilesSuccess(responseText){
        				console.log(fileArray[i].name);
        				console.log(md5[i]);
        				console.log(responseText);
        				if(responseText=="校验成功"){
        					tips.innerHTML="<font color='#0f0'>上传成功</font>";
//								fileArray.splice(i,1);
//								md5.splice(i,1);
							successList[i]=true;
							successNumber++;
							if(successNumber==sumNumber){
								successList.forEach(function(item,index){
									if(!item){
										failedFileList.push(fileArray[index]);
										failedMD5.push(md5[index]);
									};
								});
								fileArray=[];
								md5=[];
								fileArray.concat(failedFileList);
								md5.concat(failedMD5);
							};
        				}else{
        					tips.innerHTML="<font color='#f00'>上传失败</font>";
        					successList[i]=false;
        				}
        			}
        			function mergeFilesFailed(){
        				tips.innerHTML="<font color='#f00'>失去响应</font>";
        			}
        			function sendAjax(url,data,success,failed,upload){
        				var xhr=new XMLHttpRequest;
        				xhr.open("post",url,true);
			            xhr.upload.addEventListener("progress",function(e){
			            	getProgress(e.loaded);
		            	},false);
			            xhr.onreadystatechange = function(e) {
			                if (xhr.readyState == 4) {
			                    if (xhr.status == 200) {
			                    	success(xhr.responseText);
			                	}else{
			                		failed(xhr.status);
			                	}
			            	}
			            };
			        	xhr.send(data);
        			};
        		})(i,fileArray[i].size);
			    /*闭包结束*/
			}
        	
        	return false;
        };
	})(window);