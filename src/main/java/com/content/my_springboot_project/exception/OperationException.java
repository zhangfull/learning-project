package com.content.my_springboot_project.exception;

public class OperationException extends RuntimeException {
    private final Integer code;
    public OperationException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }
}
