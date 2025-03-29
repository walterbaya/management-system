package com.palma_store.productBatch.productBatch.batchprocessing;

import com.palma_store.productBatch.productBatch.batchprocessing.job.step1.ExcelProductReader;
import com.palma_store.productBatch.productBatch.service.ExcelUpdateWatcherManager;

import lombok.extern.log4j.Log4j;

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
import java.util.Iterator;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

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
    private final ScheduledExecutorService executorService;
    private final Path filePathHombre = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx");
    private final Path filePathDama = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx");
    private final Path filePathPrecios = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\LISTA PRECIOS.xlsx");

    public JobRunner(JobLauncher jobLauncher, Job updateProductsJob, ScheduledExecutorService executorService) {
        this.jobLauncher = jobLauncher;
        this.updateProductsJob = updateProductsJob;
        this.executorService = executorService;
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
	public void watchFile() {
	    try {
	    	processWatchServiceEvents();
	        processUpdatedPaths();
	    } catch (Exception e) {
	        //log.error("Error en el monitoreo de archivos", e);
	    }
	}

	private void processWatchServiceEvents() {
	    WatchKey key;
	    while ((key = watchService.poll()) != null) {
	        try {
	            for (WatchEvent<?> event : key.pollEvents()) {
	                handleWatchEvent(event);
	            }
	        } finally {
	            key.reset();
	        }
	    }
	}

	private void handleWatchEvent(WatchEvent<?> event) {
	    if (event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) {
	        Path changedPath = ((WatchEvent<Path>) event).context();
	        handleFileChange(changedPath);
	    }
	}

	private void processUpdatedPaths() {
	    while (!excelUpdateWatcherManager.getUpdatedPaths().isEmpty()) {
	        Iterator<Path> iterator = excelUpdateWatcherManager.getUpdatedPaths().iterator();
	        if (iterator.hasNext()) {
	            Path path = iterator.next();
	            handleFileChange(path);
	            iterator.remove();
	        }
	    }
	}

	/**
	 * Dado el path cambiado lo que hace es lo setea en el excelManager si se esta actualizando la base de datos
	 * en otro caso tira la ejecucion del mismo.
	 * */
	private void handleFileChange(Path changedPath) {
	    if (excelUpdateWatcherManager.getAppCurrentUpdatingFiles().contains(changedPath)) {
	        excelUpdateWatcherManager.setPath(changedPath);
	        return;
	    }

	    if (isRelevantFile(changedPath)) {
	        scheduleJobExecution(changedPath);
	    }
	}

	/**
	 * dado el path devuelve si es uno de los paths que va a generar una corrida de los jobs*/
	private boolean isRelevantFile(Path path) {
	    return path.equals(filePathHombre.getFileName()) || 
	           path.equals(filePathDama.getFileName()) || 
	           path.equals(filePathPrecios.getFileName());
	}

	/**
	 * Path changedPath es el path que se modifico, entonces esto permite lanzar de forma concurrente varios
	 * hilos en los cuales se van a ir actualizando por medio de el executeJob la base de datos correspondiente
	 * se van a lanzar varios jobs en paralelo, por ejemplo para modificar los articulos ingresados en paralelo*/
	
	private void scheduleJobExecution(Path changedPath) {
	    executorService.schedule(() -> {
	        try {
	        	//borramos el path para que entonces no se vuelva a ejecutar infinitamente lo mismo
	        	excelUpdateWatcherManager.deletePath(changedPath);
	        	executeJob();
	        } catch (Exception e) {
	            //log.error("Error ejecutando job para archivo: {}", changedPath, e);
	        }
	    }, 500, TimeUnit.MILLISECONDS); // Delay para evitar conflictos
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
