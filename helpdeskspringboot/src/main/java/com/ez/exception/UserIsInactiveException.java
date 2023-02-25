package com.ez.exception;

public class UserIsInactiveException extends Exception {

    public UserIsInactiveException(String message) {
        super(message);
    }

}