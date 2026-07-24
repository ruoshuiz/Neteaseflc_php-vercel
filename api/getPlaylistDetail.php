<?php
/*
 * @Author: 苏晓晴 - www.toubiec.cn
 * @Modified: Vercel部署版本
 * @Description: 歌单解析实例
 */

require_once 'getMusicapi.php';

// 创建API实例（自动从环境变量读取cookie）
$api = new NeteaseMusicAPI();

$singleId = $_GET['id'] ?? '5202687076'; // 从URL参数获取

try {
    $rawResult = $api->getPlaylistDetail($singleId);
    
    $getPlaylistDetail['id'] = $rawResult['id'] ?? '';
    $getPlaylistDetail['name'] = $rawResult['name'] ?? '';
    $getPlaylistDetail['coverImgUrl'] = $rawResult['coverImgUrl'] ?? '';
    $getPlaylistDetail['trackCount'] = $rawResult['trackCount'] ?? '';
    $getPlaylistDetail['creator'] = $rawResult['creator'] ?? '';
    $getPlaylistDetail['tracks'] = $rawResult['tracks'] ?? '';
    $list['data'] = $getPlaylistDetail;
    
    echo json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ]);
}
?>