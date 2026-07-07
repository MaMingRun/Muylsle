package com.selfstudy.controller;

import com.selfstudy.model.MusicPlatform;
import com.selfstudy.model.Song;
import com.selfstudy.model.Todo;
import com.selfstudy.service.MusicService;
import com.selfstudy.service.TimeService;
import com.selfstudy.service.TodoService;
import com.selfstudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class StudyController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private MusicService musicService;

    @Autowired
    private TimeService timeService;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String index(Model model) {
        List<Todo> todos = todoService.getAllTodos();
        List<MusicPlatform> platforms = musicService.getAllPlatforms();
        Map<String, String> beijingTime = timeService.getBeijingTime();

        model.addAttribute("todos", todos);
        model.addAttribute("platforms", platforms);
        model.addAttribute("beijingTime", beijingTime);
        model.addAttribute("defaultMinutes", 25);

        return "index";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/profile")
    public String profilePage() {
        return "profile";
    }

    @GetMapping("/api/time")
    @ResponseBody
    public Map<String, String> getBeijingTime() {
        return timeService.getBeijingTime();
    }

    @GetMapping("/api/todos")
    @ResponseBody
    public List<Todo> getTodos() {
        return todoService.getAllTodos();
    }

    @PostMapping("/api/todos")
    @ResponseBody
    public Map<String, Object> addTodo(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String content = request.get("content");
            String deadlineStr = request.get("deadline");

            if (content == null || content.trim().isEmpty()) {
                result.put("success", false);
                result.put("message", "任务内容不能为空");
                return result;
            }

            LocalDateTime deadline = null;
            if (deadlineStr != null && !deadlineStr.trim().isEmpty()) {
                deadline = LocalDateTime.parse(deadlineStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            }
            Todo todo = todoService.addTodo(content.trim(), deadline);

            result.put("success", true);
            result.put("todo", todo);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "添加失败: " + e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/api/todos/{id}")
    @ResponseBody
    public Map<String, Object> deleteTodo(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        boolean deleted = todoService.deleteTodo(id);
        result.put("success", deleted);
        result.put("message", deleted ? "删除成功" : "任务不存在");
        return result;
    }

    @GetMapping("/api/music/platforms")
    @ResponseBody
    public List<MusicPlatform> getMusicPlatforms() {
        return musicService.getAllPlatforms();
    }

    @GetMapping("/api/music/search")
    @ResponseBody
    public Map<String, Object> searchSongs(@RequestParam String keyword) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Song> songs = musicService.searchSongs(keyword);
            result.put("success", true);
            result.put("songs", songs);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "搜索失败: " + e.getMessage());
        }
        return result;
    }

    @PostMapping("/api/register")
    @ResponseBody
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        return userService.register(
                request.get("username"),
                request.get("password"),
                request.get("nickname"));
    }

    @PostMapping("/api/login")
    @ResponseBody
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        return userService.login(request.get("username"), request.get("password"));
    }

    @GetMapping("/api/user/{id}")
    @ResponseBody
    public Map<String, Object> getUserInfo(@PathVariable Long id) {
        return userService.getUserInfo(id);
    }

    @PostMapping("/api/user/{id}/update")
    @ResponseBody
    public Map<String, Object> updateProfile(@PathVariable Long id,
                                              @RequestBody Map<String, String> request) {
        return userService.updateProfile(id,
                request.get("nickname"),
                request.get("bio"),
                request.get("avatar"));
    }
}
