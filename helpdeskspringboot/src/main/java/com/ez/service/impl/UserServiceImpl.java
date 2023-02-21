package com.ez.service.impl;

import com.ez.entity.*;
import com.ez.enumeration.Role;
import com.ez.repository.UserRepository;
import com.ez.service.EmailService;
//import com.ez.service.LoginAttemptService;
import com.ez.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

import static com.ez.constant.FileConstant.*;
import static com.ez.constant.UserImplConstant.*;

@Service
@Transactional
@Qualifier("userDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    // getClass() = UserServiceImpl.class
    private Logger LOGGER = LoggerFactory.getLogger(getClass());
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;
//    private LoginAttemptService loginAttemptService;
    private EmailService emailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
//        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
    }

    // get user info by email
    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    public UserDetails loadUserByUsername(String email) {

        // get user by email
        User user = userRepository.findUserByEmail(email);

        // not found user by email
        if (user == null) {
            LOGGER.error(NO_USER_FOUND_BY_EMAIL + email);
//            throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
            try {
                throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
            } catch (EmailNotFoundException e) {
                throw new RuntimeException(e);
            }
        } else { // found user by email

            // update value of lastLoginDate and lastLoginDateDisplay
//            userRepository.save(user);

            UserPrincipal userPrincipal = new UserPrincipal(user);

            LOGGER.info(FOUND_USER_BY_EMAIL + email);
            return userPrincipal;
        }
    }

    @Override
    public User findById(Long id) throws UserNotFoundException {

        // find user by user id
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(NO_USER_FOUND_BY_ID + id));
    }

//    @Override
//    public User register(String firstName, String lastName, String username, String email) throws UserNotFoundException, UsernameExistException, EmailExistException, MessagingException {
//        validateNewEmail(EMPTY, username, email);
//        User user = new User();
////        user.setUserId(generateUserId());
//        String password = generatePassword();
//        user.setFirstName(firstName);
//        user.setLastName(lastName);
////        user.setUsername(username);
//        user.setEmail(email);
//        user.setJoinDate(new Date());
//        user.setPassword(encodePassword(password));
//        user.setActive(true);
////        user.setNotLocked(true);
//        user.setRole(ROLE_CUSTOMER.name());
////        user.setAuthorities(ROLE_USER.getAuthorities());
////        user.setProfileImageUrl(getTemporaryProfileImageUrl(username));
//        userRepository.save(user);
//        LOGGER.info("New user password: " + password);
//        emailService.sendNewPasswordEmail(firstName, password, email);
//        return user;
//    }

//    @Override
//    public void resetPassword(String email) throws MessagingException, EmailNotFoundException {
//        User user = userRepository.findUserByEmail(email);
//        if (user == null) {
//            throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
//        }
//        String password = generatePassword();
//        user.setPassword(encodePassword(password));
//        userRepository.save(user);
//        LOGGER.info("New user password: " + password);
//        emailService.sendNewPasswordEmail(user.getFirstName(), password, user.getEmail());
//    }

//    @Override
//    public List<User> findAll() {
//        return user;
//    }

//    @Override
//    public List<User> getUsersByPage(int page, int numOfLinesPerPage) {
//        return userRepository.getUsersByPage(page, numOfLinesPerPage);
//    }

    // search users by page and based on the search criteria
    @Override
    public List<User> searchUsers(int page, int pageSize, String searchTerm, String role, String status) {
        return userRepository.searchUsers(page, pageSize, searchTerm, role, status);
    }

    // find user by email
    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    // calculate total of users based on the search criteria
    @Override
    public long getTotalOfUsers(String searchTerm, String role, String status){
        return userRepository.getTotalOfUsers(searchTerm, role, status);
    }

    // create new user
    @Override
    public User createUser(User user) throws MessagingException, EmailExistException {

        LOGGER.info("create new user");

        // random password
        String password;

        // new user
        User newUser = new User();

        // check whether email is existing or not
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

        LOGGER.info("Send random password to user via email");
        // send an email to user has just created
        emailService.sendNewPasswordEmail(user.getFirstName(), password, user.getEmail());

        return newUser;
    }

    // update existing user
    @Override
    public User updateUser(User user) throws MessagingException, UserNotFoundException {

        // get current user(persistent)
        User existingUser = userRepository.findById(user.getId()).orElseThrow(() -> new UserNotFoundException(NO_USER_FOUND_BY_ID + user.getId()));

        // set new values to existing user
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPhone(user.getPhone());
        existingUser.setAddress(user.getAddress());
        existingUser.setRole(user.getRole());
        existingUser.setStatus(user.getStatus());

        userRepository.save(existingUser);

        LOGGER.info("Updated user with user id: " + existingUser.getId());

        return existingUser;
    }

    // return:
    //  - true: email already existed before
    //  - false: email has not existed
    private boolean existEmail(String email) {

        User userByEmail = findUserByEmail(email);

        return userByEmail != null;
    }

//    private Role getRoleEnumName(String role) {
//        return Role.valueOf(role.toUpperCase());
//    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

}
