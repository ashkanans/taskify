package com.ashkanans.taskify.controller;

import com.ashkanans.taskify.service.FileMetaDataService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileMetaDataService fileMetaDataService;

    public FileController(FileMetaDataService fileMetaDataService) {
        this.fileMetaDataService = fileMetaDataService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("taskId") Long taskId) {
        return fileMetaDataService.uploadFile(file, taskId);
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
