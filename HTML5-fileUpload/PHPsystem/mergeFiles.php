<?php
$fileName=$_POST["fileName"];
$fileEndID=$_POST["fileEndID"];
$md5=$_POST["md5"];

$temPath="../tem/";
$fullFilePath="../work/";

if(!file_exists($fullFilePath)){
    mkdir($fullFilePath,0777);
};


    unlink($fullFilePath.$fileName);
    fopen($fullFilePath.$fileName,"w+");

    for($i = 0;$i <= $fileEndID;$i++){
        file_put_contents($fullFilePath.$fileName,file_get_contents($temPath.$md5."/".$i),FILE_APPEND);
    }
    if($md5==md5_file($fullFilePath.$fileName)){
        echo "校验成功";
    }else{
        echo "校验失败\n";
        echo "文件名：".$fileName."\n";
        echo $md5."\n";
        echo "不等于\n";
        echo md5_file($fullFilePath.$fileName);
    };

	for($i=0;$i<=$fileEndID;$i++){
	            unlink($temPath.$md5."/".$i);
	};
	rmdir($temPath.$md5);