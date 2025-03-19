package com.palma_store.productBatch.productBatch.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
@Getter
@Setter
public class ExcelUpdateWatcherManager {
    private boolean isAppUpdatingFile = false;
}
