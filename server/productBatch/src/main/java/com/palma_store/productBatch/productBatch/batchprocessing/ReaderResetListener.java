package com.palma_store.productBatch.productBatch.batchprocessing;

import com.management.management.batchprocessing.job.step1.ExcelProductReader;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReaderResetListener implements StepExecutionListener {

    @Autowired
    private ExcelProductReader excelProductReader;

    @Override
    public void beforeStep(StepExecution stepExecution) {
        excelProductReader.resetReader();  // Resetea el lector antes de ejecutar el step
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return null;
    }
}
