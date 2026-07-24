<?php
/*
 * @Author: 苏晓晴 - www.toubiec.cn
 * @Modified: Vercel部署版本
 * @Description: 歌曲信息解析实例
 */

require_once 'getMusicapi.php';

// 创建API实例（自动从环境变量读取cookie）
$api = new NeteaseMusicAPI();

$singleId = $_GET['id'] ?? '2006535009'; // 从URL参数获取

try {
    $rawResult = $api->getSongDetail($singleId);
    
    $songdetail = [];
    if (isset($rawResult['songs'][0])) {
        $song = $rawResult['songs'][0];
        $songdetail['id'] = $song['id'] ?? '';
        $songdetail['name'] = $song['name'] ?? '';
        $songdetail['album'] = $song['al']['name'] ?? '';
        
        $artists = [];
        if (isset($song['ar']) && is_array($song['ar'])) {
            foreach ($song['ar'] as $artist) {
                $artists[] = $artist['name'];
            }
        }
        $songdetail['singer'] = implode('/', $artists);
        $songdetail['picimg'] = $song['al']['picUrl'] ?? '';
    }
    
    $list['data'] = $songdetail;
    echo json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ]);
}
?>