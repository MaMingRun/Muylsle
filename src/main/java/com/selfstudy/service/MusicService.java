package com.selfstudy.service;

import com.selfstudy.model.MusicPlatform;
import com.selfstudy.model.Song;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MusicService {

    private final List<MusicPlatform> platforms = new ArrayList<>();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MusicService() {
        MusicPlatform netease = new MusicPlatform("网易云音乐", "netease", "☁️");
        platforms.add(netease);
    }

    public List<MusicPlatform> getAllPlatforms() {
        return new ArrayList<>(platforms);
    }

    /**
     * 搜索网易云歌曲（代理调用，解决跨域）
     */
    public List<Song> searchSongs(String keyword) {
        List<Song> result = new ArrayList<>();
        if (keyword == null || keyword.trim().isEmpty()) {
            return result;
        }
        try {
            String encodedKeyword = URLEncoder.encode(keyword.trim(), StandardCharsets.UTF_8);
            String url = "https://music.163.com/api/search/get/web?s=" + encodedKeyword
                    + "&type=1&offset=0&total=true&limit=20";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .header("Referer", "https://music.163.com")
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode songs = root.path("result").path("songs");

            if (songs.isArray()) {
                for (JsonNode songNode : songs) {
                    long id = songNode.path("id").asLong();
                    String name = songNode.path("name").asText("");
                    // 歌手可能多个
                    StringBuilder artist = new StringBuilder();
                    JsonNode artists = songNode.path("artists");
                    if (artists.isArray()) {
                        for (int i = 0; i < artists.size(); i++) {
                            if (i > 0) artist.append("/");
                            artist.append(artists.get(i).path("name").asText(""));
                        }
                    }
                    String album = songNode.path("album").path("name").asText("");
                    String coverUrl = songNode.path("album").path("picUrl").asText("");
                    // 时长（秒）
                    int durationSec = songNode.path("duration").asInt(0) / 1000;
                    String duration = String.format("%d:%02d", durationSec / 60, durationSec % 60);

                    Song song = new Song(name, artist.toString(), duration);
                    song.setId(id);
                    song.setAlbum(album);
                    song.setCoverUrl(coverUrl);
                    result.add(song);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
