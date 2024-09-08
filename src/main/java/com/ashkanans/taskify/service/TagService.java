package com.ashkanans.taskify.service;

import com.ashkanans.taskify.model.Tag;
import com.ashkanans.taskify.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public Tag createTag(String name) {
        Tag tag = new Tag();
        tag.setName(name);
        return tagRepository.save(tag);
    }

    public Optional<Tag> getTagById(Long id) {
        return tagRepository.findById(id);
    }

    public Tag getTagByName(String name) {
        return tagRepository.findByName(name);
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

    public List<Tag> getAllTags() { return tagRepository.findAll(); }

    public Tag saveTag(Tag tag) {  return this.tagRepository.save(tag); }
}
