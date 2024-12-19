package com.management.management.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.file.Path;

@Service
@Getter
@Setter
public class ExcelUpdateWatcherManager {
    private boolean isAppUpdatingFile = false;
}
