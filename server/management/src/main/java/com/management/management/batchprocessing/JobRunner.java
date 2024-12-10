package com.management.management.batchprocessing;

import com.management.management.service.ExcelUpdateWatcherManager;
import jakarta.annotation.PostConstruct;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.management.management.batchprocessing.job.step1.ExcelProductReader;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;

@Component
public class JobRunner implements CommandLineRunner {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job importUserJob;

    @Autowired
    private ExcelProductReader excelProductReader;

    @Autowired
    private ExcelUpdateWatcherManager excelUpdateWatcherManager;

    private WatchService watchService;
    private Path filePath = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\stock ejemplo.xlsx");

    public JobRunner(JobLauncher jobLauncher, Job importUserJob) {
        try {
            this.watchService = FileSystems.getDefault().newWatchService();
        } catch (IOException e) {
            throw new RuntimeException("Error initializing WatchService", e);
        }
        this.jobLauncher = jobLauncher;
        this.importUserJob = importUserJob;
    }

    @Override
    public void run(String... args) throws Exception {
        initWatchService();
    }

    private void initWatchService() throws IOException {
        watchService = FileSystems.getDefault().newWatchService();
        filePath.getParent().register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);
    }

    @Scheduled(fixedRate = 5000)
    public void watchFile() throws InterruptedException {
        WatchKey key;
        while ((key = watchService.poll()) != null) {
            for (WatchEvent<?> event : key.pollEvents()) {
                if (event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) {
                    Path changed = (Path) event.context();
                    if (changed.endsWith(filePath.getFileName()) && !excelUpdateWatcherManager.isAppUpdatingFile()) {
                        Thread.sleep(500); // Avoid concurrent operation conflicts
                        executeJob();
                    }
                }
            }
            // Reset the key after processing events
            key.reset();
        }
    }

    private void executeJob() {
        try {
            excelProductReader.resetReader();

            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis()) // Parámetro único
                    .toJobParameters();

            jobLauncher.run(importUserJob, jobParameters);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
