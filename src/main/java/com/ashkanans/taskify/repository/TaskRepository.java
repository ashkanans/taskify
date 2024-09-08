package com.ashkanans.taskify.repository;


import com.ashkanans.taskify.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTagsName(String tagName);
}
