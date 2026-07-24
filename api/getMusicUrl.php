<?php
/*
 * @Author: 苏晓晴 - www.toubiec.cn
 * @Modified: Vercel部署版本
 * @Description: 歌曲解析实例
 */

require_once 'getMusicapi.php';

// 创建API实例（自动从环境变量读取cookie）
$api = new NeteaseMusicAPI();

$singleId = $_GET['id'] ?? '26608738,212233'; // 从URL参数获取
$quality = $_GET['quality'] ?? 'standard'; // 音质参数

try {
    // 直接调用，API类会自动从环境变量读取cookie
    $rawResult = $api->getMusicUrl($singleId, $quality);
    
    $list = [];
    if (isset($rawResult['data']) && is_array($rawResult['data'])) {
        foreach ($rawResult['data'] as $urls) {
            $temp = [];
            $temp['id'] = $urls['id'];
            $temp['url'] = str_replace("http://", "https://", $urls['url']);
            $temp['br'] = $urls['br'];
            $temp['level'] = $urls['level'];
            $temp['size'] = $urls['size'];
            $temp['md5'] = $urls['md5'];
            $list[] = $temp;
        }
    }
    
    echo json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ]);
}
?>