package com.ashkanans.taskify.repository;

import com.ashkanans.taskify.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByTaskId(Long id);
    List<FileMetadata> findByFileName(String fileName);
}
