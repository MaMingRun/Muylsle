package com.selfstudy.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class TimeService {

    private static final String BEIJING_TIMEZONE = "Asia/Shanghai";
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy年M月d日 EEEE");

    public Map<String, String> getBeijingTime() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of(BEIJING_TIMEZONE));
        Map<String, String> timeMap = new HashMap<>();
        timeMap.put("time", now.format(TIME_FORMATTER));
        timeMap.put("date", now.format(DATE_FORMATTER));
        timeMap.put("city", "北京本地时间");
        return timeMap;
    }
}
