package com.ashkanans.taskify.controller;

import com.ashkanans.taskify.model.Tag;
import com.ashkanans.taskify.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tags")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public List<Tag> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        Optional<Tag> tag = tagService.getTagById(id);
        return tag.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Tag> createTag(@RequestParam String name) {
        Tag createdTag = tagService.createTag(name);
        return ResponseEntity.ok(createdTag);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @RequestBody Tag tag) {
        if (tagService.getTagById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        tag.setId(id);
        Tag updatedTag = tagService.saveTag(tag);
        return ResponseEntity.ok(updatedTag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        if (!tagService.getTagById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}
