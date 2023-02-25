package com.ez.service;

import com.ez.exception.EmailExistException;
import com.ez.exception.EmailNotFoundException;
import com.ez.entity.User;
import com.ez.exception.UserIsInactiveException;
import com.ez.exception.UserNotFoundException;

import javax.mail.MessagingException;
import java.util.List;

public interface UserService {

    // find user by user id
    User findById(Long id) throws UserNotFoundException;

    // search users by page and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, email, firstName, lastName, phone
    //  - role: '', 'ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN'
    //  - status: '', 'Active', 'Inactive'
    List<User> searchUsers(int pageNumber, int pageSize, String searchTerm, String role, String status);

    // find user by email
    User findUserByEmail(String email);

    User userIsInactive(String email) throws UserIsInactiveException;

    // calculate total of users based on the search criteria.
    // based on this total of users we can calculate total pages
    long getTotalOfUsers(String searchTerm, String role, String status);

    // create new user
    User createUser(User user) throws MessagingException, EmailExistException;

    // update existing user
    User updateUser(User user) throws MessagingException, EmailExistException, UserNotFoundException;

    // reset password in case user forgot his/her password
    void resetPassword(String email) throws MessagingException, EmailNotFoundException;

}
