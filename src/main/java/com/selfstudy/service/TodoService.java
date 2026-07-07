package com.selfstudy.service;

import com.selfstudy.model.Todo;
import com.selfstudy.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Todo addTodo(String content, LocalDateTime deadline) {
        Todo todo = new Todo();
        todo.setContent(content);
        todo.setDeadline(deadline);
        todo.setCompleted(false);
        return todoRepository.save(todo);
    }

    public boolean deleteTodo(Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Todo getTodoById(Long id) {
        return todoRepository.findById(id).orElse(null);
    }
}
