<?php
/*
 * @Author: 苏晓晴 - www.toubiec.cn
 * @Modified: Vercel部署版本
 * @Description: 歌词解析实例
 */

require_once 'getMusicapi.php';

// 创建API实例（自动从环境变量读取cookie）
$api = new NeteaseMusicAPI();

$singleId = $_GET['id'] ?? '2006535009'; // 从URL参数获取

try {
    // 直接调用，API类会自动从环境变量读取cookie
    $rawResult = $api->getLyric($singleId);
    
    $lyric['lrc'] = $rawResult['lrc']['lyric'] ?? ''; // 歌词
    $lyric['tlyric'] = $rawResult['tlyric']['lyric'] ?? ''; // 翻译歌词
    $lyric['romalrc'] = $rawResult['romalrc']['lyric'] ?? ''; // 罗马音歌词
    $lyric['klyric'] = $rawResult['klyric']['lyric'] ?? ''; // 滚动歌词
    $list['data'] = $lyric;
    
    echo json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ]);
}
?>