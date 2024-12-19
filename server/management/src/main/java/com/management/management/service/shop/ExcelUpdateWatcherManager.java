package com.management.management.service.shop;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
@Getter
@Setter
public class ExcelUpdateWatcherManager {
    private boolean isAppUpdatingFile = false;
}
