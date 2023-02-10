package com.ez.exception.domain;

// exception for email already existed(function of create user)
public class EmailExistException extends Exception {
    public EmailExistException(String message) {
        super(message);
    }
}
