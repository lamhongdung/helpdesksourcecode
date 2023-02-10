package com.ez.exception.domain;

// exception for username already existed(function of create user)
public class UsernameExistException extends Exception {
    public UsernameExistException(String message) {
        super(message);
    }
}
