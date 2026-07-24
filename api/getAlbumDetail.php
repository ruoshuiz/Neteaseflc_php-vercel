<?php
/*
 * @Author: 苏晓晴 - www.toubiec.cn
 * @Modified: Vercel部署版本
 * @Description: 专辑解析实例
 */

require_once 'getMusicapi.php';

// 创建API实例（自动从环境变量读取cookie）
$api = new NeteaseMusicAPI();

$singleId = $_GET['id'] ?? '2532181'; // 从URL参数获取

try {
    $rawResult = $api->getAlbumDetail($singleId);
    echo json_encode($rawResult, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ]);
}
?>