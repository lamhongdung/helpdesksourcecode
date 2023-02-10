package com.ez.exception.domain;

// exception for email has not found(function of update user)
public class EmailNotFoundException extends Exception {
    public EmailNotFoundException(String message) {
        super(message);
    }
}
