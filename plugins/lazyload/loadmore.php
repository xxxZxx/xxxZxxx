<?php
 // 后端 php 测试接口文件
 header("Content-type: ");
 $start = $_GET['start'];
 $len = $_GET['len'];
 $items = array();

 for($i = 1; $i <= $len; $i++){
     array_push($items, '内容' . ($start+$i));
 }
 $ret = array('status'=>1, 'data'=>$items);
 sleep(0.5);
 echo json_encode($ret);