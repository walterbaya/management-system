package com.management.management.batchprocessing;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
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
    
    
    private final Path filePath = Paths.get("C:\\Users\\walte\\Documents\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\stock ejemplo.xlsx");

    public JobRunner(JobLauncher jobLauncher, Job importUserJob) {
        this.jobLauncher = jobLauncher;
        this.importUserJob = importUserJob;
    }

    @Override
    public void run(String... args) throws Exception {
        watchFile();
    }

    private void executeJob() {
        try {
        	excelProductReader.resetReader();
        
            // Agregar parámetros únicos para evitar conflictos
            JobParameters jobParameters = new JobParametersBuilder().toJobParameters();
            
            // Ejecutar el job
            jobLauncher.run(importUserJob, jobParameters);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void watchFile() {
        try (WatchService watchService = FileSystems.getDefault().newWatchService()) {
            filePath.getParent().register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

            while (true) {
                WatchKey key = watchService.take();
                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();

                    if (kind == StandardWatchEventKinds.ENTRY_MODIFY) {
                        Path changed = (Path) event.context();
                        if (changed.endsWith(filePath.getFileName())) {
                            // Agregar un pequeño retraso para evitar conflictos
                            Thread.sleep(500);
                            
                            
                            // Ejecutar el job nuevamente
                            executeJob();
                        }
                    }
                }
                key.reset();
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

}
