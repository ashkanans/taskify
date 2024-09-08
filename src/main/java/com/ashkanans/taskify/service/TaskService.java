package com.ashkanans.taskify.service;

import com.ashkanans.taskify.model.Tag;
import com.ashkanans.taskify.model.Task;
import com.ashkanans.taskify.repository.TagRepository;
import com.ashkanans.taskify.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final TagRepository tagRepository;

    public TaskService(TaskRepository taskRepository, TagRepository tagRepository) {
        this.taskRepository = taskRepository;
        this.tagRepository = tagRepository;
    }

    public List<Task> getTasksByTagName(String tagName) {
        return taskRepository.findByTagsName(tagName);
    }

    public List<Task> getAllTasks() {
        List<Task> list = taskRepository.findAll();
        return list;
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        if (task.getTags() != null) {
            Set<Tag> tags = task.getTags();
            for (Tag tag : tags) {
                if (tagRepository.findById(tag.getId()).isEmpty()) {
                    tagRepository.save(tag);
                }
            }
            task.setTags(tags);
        }
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task updateTask(Long id, Task task) {
        Optional<Task> t = taskRepository.findById(id);
        if(t.isPresent()){
            taskRepository.deleteById(id);
            taskRepository.save(task);
        }
        return task;
    }
}
