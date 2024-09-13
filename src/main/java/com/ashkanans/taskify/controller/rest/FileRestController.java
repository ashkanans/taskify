package com.ashkanans.taskify.controller.rest;

import com.ashkanans.taskify.service.FileMetaDataService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/files")
public class FileRestController {

    private final FileMetaDataService fileMetaDataService;

    public FileRestController(FileMetaDataService fileMetaDataService) {
        this.fileMetaDataService = fileMetaDataService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("taskId") Long taskId) {
        // Process each file
        for (MultipartFile file : files) {
            fileMetaDataService.uploadFile(file, taskId);
        }
        return ResponseEntity.ok("Files uploaded successfully");
    }


    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        return fileMetaDataService.downloadFile(fileName);
    }

    @DeleteMapping("/delete/{fileName:.+}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        return fileMetaDataService.deleteFile(fileName);
    }
}
