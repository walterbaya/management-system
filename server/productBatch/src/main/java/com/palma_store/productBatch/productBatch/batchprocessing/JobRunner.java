package com.palma_store.productBatch.productBatch.batchprocessing;

import com.palma_store.productBatch.productBatch.batchprocessing.job.step1.ExcelProductReader;
import com.palma_store.productBatch.productBatch.service.ExcelUpdateWatcherManager;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;

@Component
public class JobRunner implements CommandLineRunner {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private ExcelProductReader excelProductReader;

//    @Autowired
//    private ExcelProductPriceReader excelProductPriceReader;

    @Autowired
    private Job updateProductsJob;

    @Autowired
    private Job updatePreciosJob;

    @Autowired
    private ExcelUpdateWatcherManager excelUpdateWatcherManager;

    private WatchService watchService;
    private final Path filePathHombre = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx");
    private final Path filePathDama = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx");
    private final Path filePathPrecios = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\LISTA PRECIOS.xlsx");

    public JobRunner(JobLauncher jobLauncher, Job updateProductsJob) {
        this.jobLauncher = jobLauncher;
        this.updateProductsJob = updateProductsJob;
    }

    @Override
    public void run(String... args) throws Exception {
        initWatchService();
    }

    private void initWatchService() {
        try {
            this.watchService = FileSystems.getDefault().newWatchService();
            registerPathsForMonitoring(watchService, 
                filePathHombre.getParent(),
                filePathDama.getParent(),
                filePathPrecios.getParent()
            );
        } catch (IOException e) {
            throw new RuntimeException("Error inicializando el WatchService", e);
        }
    }

    private void registerPathsForMonitoring(WatchService watchService, Path... paths) {
        for (Path path : paths) {
            try {
                if (path != null) {
                    path.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);
                }
            } catch (IOException e) {
                throw new RuntimeException("Error registrando path " + path + " en WatchService", e);
            }
        }
    }

    @Scheduled(fixedRate = 800)
    public void watchFile() throws InterruptedException {
        WatchKey key;
        while ((key = watchService.poll()) != null) {
            for (WatchEvent<?> event : key.pollEvents()) {
                if (event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) {
                    Path changed = (Path) event.context();
                    if (changed.endsWith(filePathHombre.getFileName()) && changed.endsWith(filePathDama.getFileName()) && !excelUpdateWatcherManager.isAppUpdatingFile()) {
                        Thread.sleep(500); // Avoid concurrent operation conflicts
                        executeJob();
                    }
//                    if(changed.endsWith(filePathPrecios.getFileName())){
//                        Thread.sleep(500); // Avoid concurrent operation conflicts
//                        executeJobPrecios();
//                    }
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

            jobLauncher.run(updateProductsJob, jobParameters);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void executeJobPrecios() {
        try {
            //excelProductPriceReader.resetReader();

            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis()) // Parámetro único
                    .toJobParameters();

            jobLauncher.run(updatePreciosJob, jobParameters);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
