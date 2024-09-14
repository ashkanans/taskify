package com.ashkanans.taskify.controller.rest;

import com.ashkanans.taskify.model.FileMetadata;
import com.ashkanans.taskify.model.Task;
import com.ashkanans.taskify.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskRestController {

    private final TaskService taskService;

    public TaskRestController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskService.getTaskById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-tag")
    public List<Task> getTasksByTag(@RequestParam String tagName) {
        return taskService.getTasksByTagName(tagName);
    }

    @GetMapping("/{taskId}/files")
    public ResponseEntity<List<FileMetadata>> getTaskFiles(@PathVariable Long taskId) {
        List<FileMetadata> files = taskService.getFilesByTaskId(taskId);
        return ResponseEntity.ok(files);
    }
}
