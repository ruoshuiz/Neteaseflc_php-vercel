<?php
/*
 * @Author: 苏晓晴 - www.toubiec.cn
 * @Modified: Vercel部署版本
 * @Description: 搜索音乐实例
 */

require_once 'getMusicapi.php';

// 创建API实例（自动从环境变量读取cookie）
$api = new NeteaseMusicAPI();

$search = $_GET['keyword'] ?? '薛之谦'; // 从URL参数获取
$limit = intval($_GET['limit'] ?? 100);
$offset = intval($_GET['offset'] ?? 0);

try {
    $rawResult = $api->getSearchMusic($search, $limit, $offset);
    echo json_encode($rawResult, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ]);
}
?>