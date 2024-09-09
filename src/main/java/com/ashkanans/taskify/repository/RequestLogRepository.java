package com.ashkanans.taskify.repository;

import com.ashkanans.taskify.model.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
}
