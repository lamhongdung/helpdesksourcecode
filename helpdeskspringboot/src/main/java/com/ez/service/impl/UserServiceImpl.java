package com.ez.service.impl;

import com.ez.entity.*;
import com.ez.exception.EmailExistException;
import com.ez.exception.EmailNotFoundException;
import com.ez.exception.UserIsInactiveException;
import com.ez.exception.UserNotFoundException;
import com.ez.repository.UserRepository;
import com.ez.service.EmailService;
import com.ez.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.util.List;

import static com.ez.constant.EmailConstant.*;
import static com.ez.constant.UserImplConstant.*;

@Service
@Transactional
@Qualifier("userDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    // getClass() = UserServiceImpl.class
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

//    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, EmailService emailService) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.emailService = emailService;
//    }

    // get user info by email
    @Override
    public UserDetails loadUserByUsername(String email) {

        // get user by email
        User user = userRepository.findUserByEmail(email);

        // not found user by email
        if (user == null) {
            LOGGER.error(NO_USER_FOUND_BY_EMAIL + email);
            try {
                throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
            } catch (EmailNotFoundException e) {
                throw new RuntimeException(e);
            }
        } else { // found user by email

            UserPrincipal userPrincipal = new UserPrincipal(user);

            LOGGER.info(FOUND_USER_BY_EMAIL + email);
            return userPrincipal;
        }
    }

    // find user by id
    @Override
    public User findById(Long id) throws UserNotFoundException {

        // find user by user id
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(NO_USER_FOUND_BY_ID + id));
    }

    // reset password in case user forgot his/her password
    @Override
    public void resetPassword(String email) throws MessagingException, EmailNotFoundException {

        LOGGER.info("Reset password.");

        // use StringBuilder instead of String to save memory
        StringBuilder emailBody = new StringBuilder();

        // find user by email
        LOGGER.info("find user by email.");
        User user = userRepository.findUserByEmail(email);

        // if email has not found in the database
        if (user == null) {
            throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        }

        //
        // found user by email in the database
        //

        // generate new random password
        String password = generatePassword();

        // set new random password to user
        user.setPassword(encodePassword(password));

        // save new password into the database
        userRepository.save(user);

        LOGGER.info("Send email to inform reseting password.");

        // email body
        emailBody.append("Hello " + user.getLastName() + " " + user.getFirstName() + ",\n\n");
        emailBody.append("Your password was reset." + "\n\n");
        emailBody.append("Use the following information to access the Help Desk system:\n\n");
        emailBody.append("- Email: " + user.getEmail() + "\n");
        emailBody.append("- New password: " + password + "\n\n");
        emailBody.append("The Help Desk Team");

        LOGGER.info("Reset password. New password is: " + password);

        // send new password to user via his/her email
        emailService.sendEmail(EMAIL_SUBJECT_RESET_PASSWORD, emailBody.toString(), user.getEmail());
    }

    // search users by page and based on the search criteria
    @Override
    public List<User> searchUsers(int pageNumber, int pageSize, String searchTerm, String role, String status) {

        return userRepository.searchUsers(pageNumber, pageSize, searchTerm, role, status);

    }

    // find user by email
    @Override
    public User findUserByEmail(String email) {

        User user = userRepository.findUserByEmail(email);

        return user;
    }

    @Override
    public User userIsInactive(String email){

        User user = userRepository.userIsInactive(email);

//        if (user != null) {
//                throw new UserIsInactiveException(USER_IS_INACTIVE);
//        }

        return user;
    }

    // calculate total of users based on the search criteria
    @Override
    public long getTotalOfUsers(String searchTerm, String role, String status) {
        return userRepository.getTotalOfUsers(searchTerm, role, status);
    }

    // create new user
    @Override
    public User createUser(User user) throws MessagingException, EmailExistException {

        LOGGER.info("create new user");

        // use StringBuilder instead of String to save memory
        StringBuilder emailBody = new StringBuilder();
        ;

        // random password
        String password;

        // new user
        User newUser = new User();

        // if email already existed then inform to user "Email already exists. Please choose another email."
        if (existEmail(user.getEmail()))
            throw new EmailExistException(EMAIL_ALREADY_EXISTS);

        // set email
        newUser.setEmail(user.getEmail());

        // generate random password
        password = generatePassword();
        newUser.setPassword(encodePassword(password));

        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPhone(user.getPhone());
        newUser.setAddress(user.getAddress());
        newUser.setRole(user.getRole());
        newUser.setStatus(user.getStatus());

        // save new user into database
        userRepository.save(newUser);
        LOGGER.info("New user password: " + password);


        LOGGER.info("Send email to inform user that new account ");

        // email body
        emailBody.append("Hello " + user.getLastName() + " " + user.getFirstName() + ",\n\n");
        emailBody.append("Your new account has just created." + "\n\n");
        emailBody.append("Use the following information to access the Help Desk system:\n\n");
        emailBody.append("- Email: " + user.getEmail() + "\n");
        emailBody.append("- Password: " + password + "\n\n");
        emailBody.append("The Help Desk Team");

        // send email to inform user has just created
        LOGGER.info("send email to inform user has just created");
        emailService.sendEmail(EMAIL_SUBJECT_CREATE_NEW_USER, emailBody.toString(), user.getEmail());

        return newUser;
    }

    // update existing user
    @Override
    public User updateUser(User user) throws MessagingException, UserNotFoundException {

        LOGGER.info("Update user");

        // get existing user(persistent)
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException(NO_USER_FOUND_BY_ID + user.getId()));

        // set new values to existing user
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPhone(user.getPhone());
        existingUser.setAddress(user.getAddress());
        existingUser.setRole(user.getRole());
        existingUser.setStatus(user.getStatus());

        // update existing user(persistent)
        userRepository.save(existingUser);

        return existingUser;
    }

    // return:
    //  - true: email already existed before
    //  - false: email has not existed
    private boolean existEmail(String email) {

        User user = findUserByEmail(email);

        return user != null;
    }

    // encode password
    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    // generate random password
    private String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

}
