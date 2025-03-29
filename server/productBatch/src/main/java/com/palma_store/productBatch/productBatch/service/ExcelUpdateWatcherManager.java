package com.palma_store.productBatch.productBatch.service;

import lombok.Getter;
import lombok.Setter;

import java.nio.file.Path;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
@Getter
@Setter
public class ExcelUpdateWatcherManager {
    private Set<Path> appCurrentUpdatingFiles = new HashSet<Path>();
    private Set<Path> updatedPaths = new HashSet<Path>();

    public void setPath(Path path) {
    	this.updatedPaths.add(path);
    }
    
    public void deletePath(Path path) {
    	this.updatedPaths.remove(path);
    }
}
