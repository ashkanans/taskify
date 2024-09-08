package com.ashkanans.taskify.controller;

import com.ashkanans.taskify.model.Tag;
import com.ashkanans.taskify.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/tags")
public class TagRestController {

    @Autowired
    private TagService tagService;

    @PostMapping
    public Tag createTag(@RequestParam String name) {
        return tagService.createTag(name);
    }

    @GetMapping("/{id}")
    public Optional<Tag> getTag(@PathVariable Long id) {
        return tagService.getTagById(id);
    }

    @GetMapping("/name")
    public Tag getTagByName(@RequestParam String name) {
        return tagService.getTagByName(name);
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
    }
}