package com.ez.service;

import com.ez.entity.EmailExistException;
import com.ez.entity.User;
import com.ez.entity.UserNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.mail.MessagingException;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

public interface UserService {

//    User register(String firstName, String lastName, String username, String email) throws UserNotFoundException, UsernameExistException, EmailExistException, MessagingException;

    // find user by user id
    User findById(Long id) throws UserNotFoundException;

    // search users by page and based on the search criteria.
    // parameters:
    //  - page: page number
    //  - size: page size
    //  - searchTerm: ID, email, firstName, lastName, phone
    //  - role: '', 'ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN'
    //  - status: '', 'Active', 'Inactive'
    List<User> searchUsers(int page, int size, String searchTerm, String role, String status);

    // find user by email
    User findUserByEmail(String email);

    // calculate total of users based on the search criteria.
    // based on this total of users we can calculate total pages
    long getTotalOfUsers(String searchTerm, String role, String status);

    // create new user
    User createUser(User user) throws MessagingException, EmailExistException;

    // update existing user
    User updateUser(User user) throws MessagingException, EmailExistException, UserNotFoundException;

//    void resetPassword(String email) throws MessagingException, EmailNotFoundException;

}
