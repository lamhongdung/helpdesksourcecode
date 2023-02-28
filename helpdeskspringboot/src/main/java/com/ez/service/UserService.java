package com.ez.service;

import com.ez.dto.ChangePassword;
import com.ez.dto.EditProfile;
import com.ez.exception.*;
import com.ez.entity.User;

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

    User isInactiveUser(String email) throws InactiveUserException;

    // calculate total of users based on the search criteria.
    // based on this total of users we can calculate total pages
    long getTotalOfUsers(String searchTerm, String role, String status);

    // create new user
    User createUser(User user) throws MessagingException, EmailExistException;

    // update existing user
    User updateUser(User user) throws MessagingException, EmailExistException, UserNotFoundException;

    // update user profile
    User updateProfile(EditProfile editProfile) throws MessagingException, UserNotFoundException;

    // reset password in case user forgot his/her password
    void resetPassword(String email) throws MessagingException, EmailNotFoundException;
    void changePassword(ChangePassword changePassword) throws MessagingException, EmailNotFoundException, OldPasswordIsNotMatchException, NewPasswordIsNotMatchException;

}
