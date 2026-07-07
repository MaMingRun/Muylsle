package com.selfstudy.service;

import com.selfstudy.model.User;
import com.selfstudy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 启动时创建演示账号（如果不存在）
    public UserService() {
    }

    public void initDemoUser() {
        if (!userRepository.existsByUsername("demo")) {
            User demo = new User();
            demo.setUsername("demo");
            demo.setPassword("123456");
            demo.setNickname("演示用户");
            demo.setBio("这是一个演示账号");
            demo.setAvatar("");
            userRepository.save(demo);
        }
    }

    public Map<String, Object> register(String username, String password, String nickname) {
        Map<String, Object> result = new HashMap<>();
        if (username == null || username.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "用户名和密码不能为空");
            return result;
        }
        if (userRepository.existsByUsername(username)) {
            result.put("success", false);
            result.put("message", "用户名已存在");
            return result;
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname(nickname == null || nickname.isEmpty() ? username : nickname);
        user.setBio("");
        user.setAvatar("");
        user = userRepository.save(user);
        result.put("success", true);
        result.put("user", toPublicInfo(user));
        return result;
    }

    public Map<String, Object> login(String username, String password) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            result.put("success", false);
            result.put("message", "用户不存在");
            return result;
        }
        if (!user.getPassword().equals(password)) {
            result.put("success", false);
            result.put("message", "密码错误");
            return result;
        }
        result.put("success", true);
        result.put("user", toPublicInfo(user));
        return result;
    }

    public Map<String, Object> updateProfile(Long userId, String nickname, String bio, String avatar) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            result.put("success", false);
            result.put("message", "用户不存在");
            return result;
        }
        if (nickname != null && !nickname.trim().isEmpty()) {
            user.setNickname(nickname);
        }
        if (bio != null) {
            user.setBio(bio);
        }
        if (avatar != null && !avatar.isEmpty()) {
            user.setAvatar(avatar);
        }
        user = userRepository.save(user);
        result.put("success", true);
        result.put("user", toPublicInfo(user));
        return result;
    }

    public Map<String, Object> getUserInfo(Long userId) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            result.put("success", false);
            result.put("message", "用户不存在");
            return result;
        }
        result.put("success", true);
        result.put("user", toPublicInfo(user));
        return result;
    }

    private Map<String, Object> toPublicInfo(User user) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("nickname", user.getNickname());
        info.put("bio", user.getBio());
        info.put("avatar", user.getAvatar());
        return info;
    }
}
