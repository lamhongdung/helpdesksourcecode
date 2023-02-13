package com.ez.service;

import com.ez.entity.User;

import java.util.List;

public interface UserService {

//    User register(String firstName, String lastName, String username, String email) throws UserNotFoundException, UsernameExistException, EmailExistException, MessagingException;

    List<User> getUsersByPage();
//    List<User> findAll();

    List<User> getUsersByPage(int page, int size);

//    User findUserByUsername(String username);

    User findUserByEmail(String email);

    long getTotalOfUsers();

//    User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException;
//    User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException;

//    User updateUser(String currentUsername, String newFirstName, String newLastName, String newUsername, String newEmail, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException;

    // can remove this part
//    void deleteUser(String username) throws IOException;

//    void resetPassword(String email) throws MessagingException, EmailNotFoundException;

//    User updateProfileImage(String username, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException;
}
