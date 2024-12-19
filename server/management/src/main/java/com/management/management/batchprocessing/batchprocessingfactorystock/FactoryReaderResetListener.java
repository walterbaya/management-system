package com.management.management.batchprocessing.batchprocessingfactorystock;

import com.management.management.batchprocessing.batchprocessingfactorystock.step1.ExcelFactoryProductReader;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FactoryReaderResetListener implements StepExecutionListener {

    @Autowired
    private ExcelFactoryProductReader excelProductReader;

    @Override
    public void beforeStep(StepExecution stepExecution) {
        excelProductReader.resetReader();  // Resetea el lector antes de ejecutar el step
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return null;
    }
}
