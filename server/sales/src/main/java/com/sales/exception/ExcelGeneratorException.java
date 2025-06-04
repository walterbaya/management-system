package com.sales.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ExcelGeneratorException extends RuntimeException {
    public ExcelGeneratorException(String message) {
        super(message);
    }
}


