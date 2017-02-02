<?php
	$md5=$_POST["md5"];
    $fileEndID=$_POST["fileEndID"];

    $temPath="../tem/";
    $fileChunkList=[];
    $notUpload=[];

    if(!file_exists($temPath)){
        mkdir($temPath,0777);
    }
    if(!file_exists($temPath.$md5)){
        mkdir($temPath.$md5,0777);
    }
    $fileChunkList = range(0,$fileEndID);
header("Content-Type: text/html;charset=utf-8");
    for($i=0;$i<=$fileEndID;$i++){
        if(!file_exists($temPath.$md5."/".$i)){
            array_push($notUpload,$i);
        }
    };
    asort($notUpload); //排序
    echo json_encode($notUpload,JSON_UNESCAPED_UNICODE);
