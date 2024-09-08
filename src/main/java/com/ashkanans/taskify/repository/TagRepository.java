package com.ashkanans.taskify.repository;

import com.ashkanans.taskify.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Tag findByName(String name);
}