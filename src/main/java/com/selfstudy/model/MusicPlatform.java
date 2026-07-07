package com.selfstudy.model;

import java.util.ArrayList;
import java.util.List;

public class MusicPlatform {
    private String name;
    private String key;
    private String icon;
    private List<Song> songs;

    public MusicPlatform(String name, String key, String icon) {
        this.name = name;
        this.key = key;
        this.icon = icon;
        this.songs = new ArrayList<>();
    }

    public void addSong(Song song) {
        this.songs.add(song);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public List<Song> getSongs() {
        return songs;
    }

    public void setSongs(List<Song> songs) {
        this.songs = songs;
    }
}
