package com.sales.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<String> handleHttpClientError(HttpClientErrorException ex) {
        HttpStatus status = (HttpStatus) ex.getStatusCode();
        String body = ex.getResponseBodyAsString();

        if (status == HttpStatus.BAD_REQUEST) {
            return ResponseEntity.status(status).body("BAD_REQUEST: " + body);
        } else if (status == HttpStatus.NOT_FOUND) {
            return ResponseEntity.status(status).body("NOT_FOUND: " + body);
        } else {
            return ResponseEntity.status(status).body("INTERNAL_SERVER_ERROR: " + body);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Ocurrió un error inesperado: " + ex.getMessage());
    }
}

