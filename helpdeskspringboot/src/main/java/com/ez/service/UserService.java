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

//    List<User> getUsersByPage();
//    List<User> findAll();

    // find user by user id
    User findById(Long id) throws UserNotFoundException;

//    List<User> getUsersByPage(int page, int size);

    // search users by page and based on the search criteria
    List<User> searchUsers(int page, int size, String searchTerm, String role, String status);


    // find user by email
    User findUserByEmail(String email);

    // calculate total of users based on the search criteria
    long getTotalOfUsers(String searchTerm, String role, String status);

    // create new user
    User createUser(User user) throws MessagingException, EmailExistException;

    // update existing user
    User updateUser(User user) throws MessagingException, EmailExistException, UserNotFoundException;


//    User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException;
//    User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException;

//    User updateUser(String currentUsername, String newFirstName, String newLastName, String newUsername, String newEmail, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException;

    // can remove this part
//    void deleteUser(String username) throws IOException;

//    void resetPassword(String email) throws MessagingException, EmailNotFoundException;

//    User updateProfileImage(String username, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException;
}
