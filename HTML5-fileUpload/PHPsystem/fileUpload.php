<?php
    $fileID=$_POST["fileID"];
    $md5=$_POST["md5"];

    $temPath="../tem/";

if(is_uploaded_file($_FILES['upFileList']['tmp_name'])){
    move_uploaded_file($_FILES['upFileList']['tmp_name'],$temPath.$md5."/".$fileID);
    echo "success";
}
?>