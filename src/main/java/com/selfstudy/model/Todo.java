package com.selfstudy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    private LocalDateTime deadline;

    private boolean completed;

    public Todo() {}

    public Todo(Long id, String content, LocalDateTime deadline) {
        this.id = id;
        this.content = content;
        this.deadline = deadline;
        this.completed = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getFormattedDeadline() {
        if (deadline == null) {
            return "";
        }
        return String.format("%04d-%02d-%02d %02d:%02d",
                deadline.getYear(),
                deadline.getMonthValue(),
                deadline.getDayOfMonth(),
                deadline.getHour(),
                deadline.getMinute());
    }
}
