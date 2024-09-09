package com.ashkanans.taskify.service;

import com.ashkanans.taskify.model.RequestLog;
import com.ashkanans.taskify.repository.RequestLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequestLogService {

    private final RequestLogRepository requestLogRepository;

    public RequestLogService(RequestLogRepository requestLogRepository) {
        this.requestLogRepository = requestLogRepository;
    }

    public void logRequest(String username, String ipAddress, String requestUri) {
        RequestLog requestLog = new RequestLog(username, ipAddress, requestUri, LocalDateTime.now());
        requestLogRepository.save(requestLog);
    }
}
