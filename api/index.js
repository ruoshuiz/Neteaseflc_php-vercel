const axios = require('axios');
const CryptoJS = require('crypto-js');

class NeteaseMusicAPI {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 NeteaseMusicDesktop/2.10.2.200154';
    this.aesKey = 'e82ckenh8dichen8';
    this.cookies = this.loadCookieFromEnv();
  }

  loadCookieFromEnv() {
    const cookies = {
      os: 'pc',
      appver: '',
      osver: '',
      deviceId: 'pyncm!'
    };
    
    const cookieStr = process.env.NETEASE_COOKIE || '';
    if (cookieStr) {
      cookieStr.split(';').forEach(pair => {
        const trimmed = pair.trim();
        if (trimmed) {
          const [key, ...values] = trimmed.split('=');
          if (key && values.length > 0) {
            cookies[key.trim()] = values.join('=').trim();
          }
        }
      });
    }
    
    return cookies;
  }

  getCookieString() {
    return Object.entries(this.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  }

  pkcs7Pad(data, blockSize) {
    const pad = blockSize - (data.length % blockSize);
    return data + String.fromCharCode(pad).repeat(pad);
  }

  aesEncrypt(data) {
    const padded = this.pkcs7Pad(data, 16);
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(padded),
      CryptoJS.enc.Utf8.parse(this.aesKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding
      }
    );
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  }

  md5Hex(text) {
    return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
  }

  async post(url, params) {
    try {
      const response = await axios({
        method: 'post',
        url: url,
        data: new URLSearchParams({ params }),
        headers: {
          'User-Agent': this.userAgent,
          'Referer': '',
          'Cookie': this.getCookieString(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      throw new Error(`HTTP请求失败: ${error.message}`);
    }
  }

  async simplePost(url, data) {
    try {
      const response = await axios({
        method: 'post',
        url: url,
        data: new URLSearchParams(data),
        headers: {
          'User-Agent': this.userAgent,
          'Referer': 'https://music.163.com/',
          'Cookie': this.getCookieString(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      throw new Error(`HTTP请求失败: ${error.message}`);
    }
  }

  async simpleGet(url) {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        headers: {
          'User-Agent': this.userAgent,
          'Referer': 'https://music.163.com/',
          'Cookie': this.getCookieString()
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      throw new Error(`HTTP请求失败: ${error.message}`);
    }
  }

  async getMusicUrl(id, level = 'standard') {
    const url = 'https://interface3.music.163.com/eapi/song/enhance/player/url/v1';
    const ids = Array.isArray(id) ? id : [id];
    
    const config = {
      os: 'pc',
      appver: '',
      osver: '',
      deviceId: 'pyncm!',
      requestId: Math.floor(Math.random() * 10000000 + 20000000).toString()
    };
    
    const payload = {
      ids: ids,
      level: level,
      encodeType: 'flac',
      header: JSON.stringify(config)
    };
    
    if (level === 'sky') {
      payload.immerseType = 'c51';
    }
    
    const url2 = url.replace('/eapi/', '/api/');
    const digest = this.md5Hex(`nobody${url2}use${JSON.stringify(payload)}md5forencrypt`);
    const params = `${url2}-36cd479b6b5-${JSON.stringify(payload)}-36cd479b6b5-${digest}`;
    const encrypted = this.aesEncrypt(params);
    
    return await this.post(url, encrypted);
  }

  async getLyric(id) {
    const url = 'https://interface3.music.163.com/eapi/song/lyric';
    
    const config = {
      os: 'pc',
      appver: '',
      osver: '',
      deviceId: 'pyncm!',
      requestId: Math.floor(Math.random() * 10000000 + 20000000).toString()
    };
    
    const payload = {
      id: id,
      cp: 'false',
      tv: '0',
      lv: '0',
      rv: '0',
      kv: '0',
      yv: '0',
      ytv: '0',
      yrv: '0',
      header: JSON.stringify(config)
    };
    
    const url2 = url.replace('/eapi/', '/api/');
    const digest = this.md5Hex(`nobody${url2}use${JSON.stringify(payload)}md5forencrypt`);
    const params = `${url2}-36cd479b6b5-${JSON.stringify(payload)}-36cd479b6b5-${digest}`;
    const encrypted = this.aesEncrypt(params);
    
    return await this.post(url, encrypted);
  }

  async getSongDetail(id) {
    const url = 'https://interface3.music.163.com/eapi/v3/song/detail';
    
    const config = {
      os: 'pc',
      appver: '',
      osver: '',
      deviceId: 'pyncm!',
      requestId: Math.floor(Math.random() * 10000000 + 20000000).toString()
    };
    
    const payload = {
      c: JSON.stringify([{ id: parseInt(id), v: 0 }]),
      header: JSON.stringify(config)
    };
    
    const url2 = url.replace('/eapi/', '/api/');
    const digest = this.md5Hex(`nobody${url2}use${JSON.stringify(payload)}md5forencrypt`);
    const params = `${url2}-36cd479b6b5-${JSON.stringify(payload)}-36cd479b6b5-${digest}`;
    const encrypted = this.aesEncrypt(params);
    
    return await this.post(url, encrypted);
  }

  async getAlbumDetail(albumId) {
    const url = `https://music.163.com/api/v1/album/${albumId}`;
    const result = await this.simpleGet(url);
    
    if (!result.album) {
      return null;
    }
    
    const album = result.album;
    const info = {
      id: album.id || null,
      name: album.name || '',
      coverImgUrl: album.pic ? `https://p3.music.126.net/${this.encryptId(String(album.pic))}/${album.pic}.jpg` : '',
      artist: album.artist?.name || '',
      publishTime: album.publishTime || null,
      description: album.description || '',
      songs: []
    };
    
    if (result.songs && Array.isArray(result.songs)) {
      info.songs = result.songs.map(song => ({
        id: song.id,
        name: song.name,
        artists: song.ar?.map(a => a.name).join('/') || '',
        album: song.al?.name || '',
        picUrl: song.al?.pic ? `https://p3.music.126.net/${this.encryptId(String(song.al.pic))}/${song.al.pic}.jpg` : ''
      }));
    }
    
    return info;
  }

  async getPlaylistDetail(playlistId) {
    const url = 'https://music.163.com/api/v6/playlist/detail';
    const result = await this.simplePost(url, { id: playlistId });
    
    if (!result.playlist) {
      return null;
    }
    
    const playlist = result.playlist;
    const info = {
      id: playlist.id || null,
      name: playlist.name || '',
      coverImgUrl: playlist.coverImgUrl || '',
      creator: playlist.creator?.nickname || '',
      trackCount: playlist.trackCount || 0,
      description: playlist.description || '',
      tracks: []
    };
    
    // 获取歌曲详情（简化版，只取前50首）
    const trackIds = playlist.trackIds?.slice(0, 50).map(t => String(t.id)) || [];
    
    for (const id of trackIds) {
      try {
        const songResult = await this.getSongDetail(id);
        if (songResult.songs && songResult.songs.length > 0) {
          const song = songResult.songs[0];
          info.tracks.push({
            id: song.id,
            name: song.name,
            artists: song.ar?.map(a => a.name).join('/') || '',
            album: song.al?.name || '',
            picUrl: song.al?.picUrl || ''
          });
        }
      } catch (e) {
        // 跳过获取失败的歌曲
      }
    }
    
    return info;
  }

  async search(keywords, limit = 30, offset = 0) {
    const url = 'https://interface3.music.163.com/eapi/cloudsearch/pc';
    
    const config = {
      os: 'pc',
      appver: '',
      osver: '',
      deviceId: 'pyncm!',
      requestId: Math.floor(Math.random() * 10000000 + 20000000).toString()
    };
    
    const payload = {
      s: keywords,
      type: 1,
      limit: limit,
      offset: offset,
      header: JSON.stringify(config)
    };
    
    const url2 = url.replace('/eapi/', '/api/');
    const digest = this.md5Hex(`nobody${url2}use${JSON.stringify(payload)}md5forencrypt`);
    const params = `${url2}-36cd479b6b5-${JSON.stringify(payload)}-36cd479b6b5-${digest}`;
    const encrypted = this.aesEncrypt(params);
    
    const result = await this.post(url, encrypted);
    
    const songs = [];
    if (result.result?.songs) {
      result.result.songs.forEach(item => {
        songs.push({
          id: item.id,
          name: item.name,
          artists: item.ar?.map(a => a.name).join('/') || '',
          album: item.al?.name || '',
          picUrl: item.al?.picUrl || '',
          duration: item.dt || 0
        });
      });
    }
    
    return {
      songs: songs,
      total: result.result?.songCount || 0
    };
  }

  encryptId(idStr) {
    const magic = '3go8&$8*3*3h0k(2)2';
    let chars = idStr.split('');
    
    for (let i = 0; i < chars.length; i++) {
      chars[i] = String.fromCharCode(
        chars[i].charCodeAt(0) ^ magic.charCodeAt(i % magic.length)
      );
    }
    
    const md5Bytes = CryptoJS.MD5(chars.join('')).toString(CryptoJS.enc.Base64);
    return md5Bytes.replace(/\//g, '_').replace(/\+/g, '-');
  }
}

// Vercel 入口
module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { action } = req.query;
  const api = new NeteaseMusicAPI();
  
  try {
    let result;
    
    switch (action) {
      case 'getMusicUrl':
        if (!req.query.id) throw new Error('缺少歌曲ID参数');
        result = await api.getMusicUrl(req.query.id, req.query.quality || 'standard');
        break;
        
      case 'getLyric':
        if (!req.query.id) throw new Error('缺少歌曲ID参数');
        result = await api.getLyric(req.query.id);
        break;
        
      case 'getSongDetail':
        if (!req.query.id) throw new Error('缺少歌曲ID参数');
        result = await api.getSongDetail(req.query.id);
        break;
        
      case 'getAlbumDetail':
        if (!req.query.id) throw new Error('缺少专辑ID参数');
        result = await api.getAlbumDetail(req.query.id);
        break;
        
      case 'getPlaylistDetail':
        if (!req.query.id) throw new Error('缺少歌单ID参数');
        result = await api.getPlaylistDetail(req.query.id);
        break;
        
      case 'search':
        if (!req.query.keyword) throw new Error('缺少搜索关键词');
        result = await api.search(
          req.query.keyword,
          parseInt(req.query.limit) || 30,
          parseInt(req.query.offset) || 0
        );
        break;
        
      default:
        throw new Error('未知操作: ' + action);
    }
    
    res.json({
      code: 200,
      data: result
    });
    
  } catch (error) {
    res.json({
      code: 500,
      message: error.message
    });
  }
};