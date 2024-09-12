package com.ashkanans.taskify.service;

import com.ashkanans.taskify.model.FileMetadata;
import com.ashkanans.taskify.model.Task;
import com.ashkanans.taskify.repository.FileMetadataRepository;
import com.ashkanans.taskify.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class FileMetaDataService {

    private final TaskRepository taskRepository;
    private final FileMetadataRepository fileMetadataRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileMetaDataService(TaskRepository taskRepository, FileMetadataRepository fileMetadataRepository) {
        this.taskRepository = taskRepository;
        this.fileMetadataRepository = fileMetadataRepository;
    }

    public ResponseEntity<String> uploadFile(MultipartFile file, Long taskId) {
        String fileName = file.getOriginalFilename();
        Path path = Paths.get(uploadDir, fileName);

        try {
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            String fileDownloadUri = "/files/download/" + fileName;

            Optional<Task> taskOptional = taskRepository.findById(taskId);
            if (taskOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
            }

            Task task = taskOptional.get();

            FileMetadata fileMetadata = new FileMetadata();
            fileMetadata.setFileName(fileName);
            fileMetadata.setFileUrl(fileDownloadUri);
            fileMetadata.setTask(task);

            fileMetadataRepository.save(fileMetadata);

            return ResponseEntity.ok("File uploaded successfully: " + fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }

    public ResponseEntity<Resource> downloadFile(String fileName) {
        Path path = Paths.get(uploadDir, fileName);
        try {
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<String> deleteFile(String fileName) {
        Path path = Paths.get(uploadDir, fileName);
        try {
            // Delete the file from the filesystem
            Files.deleteIfExists(path);

            // Delete the file metadata from the database
            List<FileMetadata> fileMetadataOptional = fileMetadataRepository.findByFileName(fileName);
            if (!fileMetadataOptional.isEmpty()) {
                fileMetadataRepository.deleteAll(fileMetadataOptional);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File metadata not found");
            }

            return ResponseEntity.ok("File deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file");
        }
    }
}
