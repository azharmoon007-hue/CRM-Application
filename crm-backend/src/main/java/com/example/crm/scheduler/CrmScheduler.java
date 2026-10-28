package com.example.crm.scheduler;

import com.example.crm.repository.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
public class CrmScheduler {
    private final TaskRepository taskRepository;

    public CrmScheduler(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Scheduled(cron = "${crm.scheduler.overdue-tasks-cron:0 0 * * * *}")
    public void markOverdueTasks() {
        log.debug("Checking for overdue tasks");
    }

    @Scheduled(cron = "${crm.scheduler.task-reminders-cron:0 0/15 * * * *}")
    public void sendTaskReminders() {
        log.debug("Sending task reminders");
    }

    @Scheduled(cron = "${crm.scheduler.token-cleanup-cron:0 0 3 * * *}")
    public void cleanupTokens() {
        log.debug("Cleaning up expired tokens");
    }
}
