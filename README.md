# 自习空间 - Java Web应用

基于Spring Boot + Thymeleaf开发的自习网页应用。

## 功能特性

- 🍅 **番茄钟**：倒计时功能，支持自定义时间、暂停、重置
- 📝 **学习清单**：添加/删除待办事项，支持设置截止时间
- 🎵 **音乐播放器**：支持QQ音乐、网易云音乐、酷狗音乐、汽水音乐
- ⏰ **北京时间**：实时显示北京本地时间
- 🎨 **主题切换**：浅色模式、深色模式、自定义背景图片

## 技术栈

- Java 17
- Spring Boot 3.2.0
- Spring Web
- Thymeleaf
- Lombok

## 项目结构

```
self-study-java/
├── pom.xml
└── src/
    └── main/
        ├── java/com/selfstudy/
        │   ├── SelfStudyApplication.java      # 主启动类
        │   ├── controller/
        │   │   └── StudyController.java       # 控制器
        │   ├── model/
        │   │   ├── Todo.java                  # 待办事项模型
        │   │   ├── MusicPlatform.java         # 音乐平台模型
        │   │   └── Song.java                  # 歌曲模型
        │   └── service/
        │       ├── TodoService.java           # 待办事项服务
        │       ├── MusicService.java          # 音乐服务
        │       └── TimeService.java           # 时间服务
        └── resources/
            ├── application.properties         # 配置文件
            ├── templates/
            │   └── index.html                 # Thymeleaf模板
            └── static/
                ├── css/
                │   └── style.css              # 样式文件
                └── js/
                    └── app.js                 # 前端脚本
```

## 运行方式

### 方式一：使用Maven运行

```bash
cd self-study-java
mvn spring-boot:run
```

### 方式二：打包后运行

```bash
cd self-study-java
mvn clean package
java -jar target/self-study-1.0.0.jar
```

### 访问地址

启动后访问：http://localhost:8080

## API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 首页 |
| GET | `/api/time` | 获取北京时间 |
| GET | `/api/todos` | 获取所有待办 |
| POST | `/api/todos` | 添加待办 |
| DELETE | `/api/todos/{id}` | 删除待办 |
| GET | `/api/music/platforms` | 获取所有音乐平台 |
| GET | `/api/music/{platform}/songs` | 获取平台歌曲列表 |
