package com.management.management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

//@Service
class MyBackgroundJobScheduler {

/*    private static final Logger log = LoggerFactory.getLogger(MyBackgroundJobScheduler.class);

    @Autowired
    Job updateProductJob;

    @Scheduled(fixedRate = 1 , timeUnit = TimeUnit.DAYS)
    @Async
    public void executeJob() {
        try {
            updateProductJob.execute();
        } catch (Exception ex) {
            log.error("Error executing scheduled job", ex);
        }
    }
    */
}