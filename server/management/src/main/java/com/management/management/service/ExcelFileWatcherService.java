package com.management.management.service;

import jakarta.annotation.PostConstruct;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;

//@Service
public class ExcelFileWatcherService {

    /*
    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job updateProductJob;

    @PostConstruct
    public void watchDirectory() {
        // Ruta del archivo Excel que queremos monitorear
        Path path = Paths.get("ruta/a/tu/archivo/");
        try (WatchService watchService = FileSystems.getDefault().newWatchService()) {
            path.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

            WatchKey key;
            while ((key = watchService.take()) != null) {
                for (WatchEvent<?> event : key.pollEvents()) {
                    if (event.context().toString().equals("products.xlsx")) {
                        System.out.println("El archivo Excel ha sido modificado.");
                        launchBatchJob();
                    }
                }
                key.reset();
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void launchBatchJob() {
        try {
            // Aquí lanzamos el job de Spring Batch
            jobLauncher.run(updateProductJob, new JobParameters());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    */
}