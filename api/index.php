<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'getMusicapi.php';

$api = new NeteaseMusicAPI();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getMusicUrl':
            $id = $_GET['id'] ?? '';
            $quality = $_GET['quality'] ?? 'standard';
            if (empty($id)) throw new Exception('缺少歌曲ID参数');
            $result = $api->getMusicUrl($id, $quality);
            break;
            
        case 'getLyric':
            $id = $_GET['id'] ?? '';
            if (empty($id)) throw new Exception('缺少歌曲ID参数');
            $result = $api->getLyric($id);
            break;
            
        case 'getSongDetail':
            $id = $_GET['id'] ?? '';
            if (empty($id)) throw new Exception('缺少歌曲ID参数');
            $result = $api->getSongDetail($id);
            break;
            
        case 'getAlbumDetail':
            $id = $_GET['id'] ?? '';
            if (empty($id)) throw new Exception('缺少专辑ID参数');
            $result = $api->getAlbumDetail($id);
            break;
            
        case 'getPlaylistDetail':
            $id = $_GET['id'] ?? '';
            if (empty($id)) throw new Exception('缺少歌单ID参数');
            $result = $api->getPlaylistDetail($id);
            break;
            
        case 'search':
            $keyword = $_GET['keyword'] ?? '';
            $limit = intval($_GET['limit'] ?? 30);
            $offset = intval($_GET['offset'] ?? 0);
            if (empty($keyword)) throw new Exception('缺少搜索关键词');
            $result = $api->getSearchMusic($keyword, $limit, $offset);
            break;
            
        default:
            throw new Exception('未知操作: ' . $action);
    }
    
    echo json_encode([
        'code' => 200,
        'data' => $result
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'code' => 500,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}