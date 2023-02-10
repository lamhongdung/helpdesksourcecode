package com.ez.service.impl;

import com.ez.domain.User;
import com.ez.domain.UserPrincipal;
import com.ez.enumeration.Role;
import com.ez.exception.domain.*;
import com.ez.repository.UserRepository;
import com.ez.service.EmailService;
import com.ez.service.LoginAttemptService;
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
    private LoginAttemptService loginAttemptService;
    private EmailService emailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, LoginAttemptService loginAttemptService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
    }

    // get user info by email id
    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    public UserDetails loadUserByUsername(String email) {
//        User user = userRepository.findUserByUsername(username);

        // get user by email id
        User user = userRepository.findUserByEmail(email);

        // not found user by email
        if (user == null) {
            LOGGER.error(NO_USER_FOUND_BY_EMAIL + email);
//            throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
            throw new UsernameNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        } else { // found user by email
//            validateLoginAttempt(user);

            user.setLastLoginDateDisplay(user.getLastLoginDate());

            // update last login date is on current date
            user.setLastLoginDate(new Date());

            // update value of lastLoginDate and lastLoginDateDisplay
            userRepository.save(user);

            UserPrincipal userPrincipal = new UserPrincipal(user);

            LOGGER.info(FOUND_USER_BY_EMAIL + email);
            return userPrincipal;
        }
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
////    public User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException {
//    public User addNewUser(String email, String firstName, String lastName, String phone, String address, String role, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException {
////        validateNewEmail(EMPTY, username, email);
//        validateNewEmail(EMPTY, email);
//        User user = new User();
//        user.setEmail(email);
//        String password = generatePassword();
//        user.setPassword(encodePassword(password));
////        user.setUserId(generateUserId());
//        user.setFirstName(firstName);
//        user.setLastName(lastName);
//        user.setPhone(phone);
//        user.setAddress(address);
//        user.setRole(getRoleEnumName(role).name());
//        user.setActive(isActive);
//
//        user.setJoinDate(new Date());
////        user.setUsername(username);
////        user.setNotLocked(isNonLocked);
////        user.setAuthorities(getRoleEnumName(role).getAuthorities());
////        user.setProfileImageUrl(getTemporaryProfileImageUrl(username));
//        userRepository.save(user);
////        saveProfileImage(user, profileImage);
//        LOGGER.info("New user password: " + password);
//        emailService.sendNewPasswordEmail(firstName, password, email);
//        return user;
//    }

//    @Override
//    public User updateUser(String currentEmail, String newFirstName, String newLastName, String newPhone, String newAddress, String newRole, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
////        public User addNewUser(String email, String firstName, String lastName, String phone, String address, String role, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException {
//
//        User currentUser = validateNewEmail(currentEmail, newEmail);
//        currentUser.setFirstName(newFirstName);
//        currentUser.setLastName(newLastName);
//        currentUser.setUsername(newUsername);
//        currentUser.setEmail(newEmail);
//        currentUser.setActive(isActive);
////        currentUser.setNotLocked(isNonLocked);
//        currentUser.setRole(getRoleEnumName(role).name());
////        currentUser.setAuthorities(getRoleEnumName(role).getAuthorities());
//        userRepository.save(currentUser);
//        saveProfileImage(currentUser, profileImage);
//        return currentUser;
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
//    public User updateProfileImage(String username, MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
//        User user = validateNewEmail(username, null, null);
//        saveProfileImage(user, profileImage);
//        return user;
//    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

//    @Override
//    public User findUserByUsername(String username) {
//        return userRepository.findUserByUsername(username);
//    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

//    @Override
//    public void deleteUser(String username) throws IOException {
//        User user = userRepository.findUserByUsername(username);
//        Path userFolder = Paths.get(USER_FOLDER + user.getUsername()).toAbsolutePath().normalize();
//        FileUtils.deleteDirectory(new File(userFolder.toString()));
//        userRepository.deleteById(user.getId());
//    }

//    private void saveProfileImage(User user, MultipartFile profileImage) throws IOException, NotAnImageFileException {
//        if (profileImage != null) { // ex: user/home/supportportal/user/rick
//            if(!Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE).contains(profileImage.getContentType())) {
//                throw new NotAnImageFileException(profileImage.getOriginalFilename() + NOT_AN_IMAGE_FILE);
//            }
//            Path userFolder = Paths.get(USER_FOLDER + user.getUsername()).toAbsolutePath().normalize();
//            if(!Files.exists(userFolder)) {
//                Files.createDirectories(userFolder);
//                LOGGER.info(DIRECTORY_CREATED + userFolder);
//            }
//            Files.deleteIfExists(Paths.get(userFolder + user.getUsername() + DOT + JPG_EXTENSION));
//            Files.copy(profileImage.getInputStream(), userFolder.resolve(user.getUsername() + DOT + JPG_EXTENSION), REPLACE_EXISTING);
////            user.setProfileImageUrl(setProfileImageUrl(user.getUsername()));
//            userRepository.save(user);
//            LOGGER.info(FILE_SAVED_IN_FILE_SYSTEM + profileImage.getOriginalFilename());
//        }
//    }

    private String setProfileImageUrl(String username) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(USER_IMAGE_PATH + username + FORWARD_SLASH
        + username + DOT + JPG_EXTENSION).toUriString();
    }

    private Role getRoleEnumName(String role) {
        return Role.valueOf(role.toUpperCase());
    }

    private String getTemporaryProfileImageUrl(String username) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(DEFAULT_USER_IMAGE_PATH + username).toUriString();
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

    private String generateUserId() {
        return RandomStringUtils.randomNumeric(10);
    }

    //
    // can remove this part
    //
//    private void validateLoginAttempt(User user) {
//        if(user.isNotLocked()) {
//            if(loginAttemptService.hasExceededMaxAttempts(user.getUsername())) {
//                user.setNotLocked(false);
//            } else {
//                user.setNotLocked(true);
//            }
//        } else {
//            loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
//        }
//    }

//    private User validateNewEmail(String currentEmail, String newEmail) throws UserNotFoundException, UsernameExistException, EmailExistException {
////        User userByNewUsername = findUserByUsername(newUsername);
//        User userByNewEmail = findUserByEmail(newEmail);
//        if(StringUtils.isNotBlank(currentEmail)) {
//            User currentUser = findUserByUsername(currentEmail);
//            if(currentUser == null) {
//                throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + currentEmail);
//            }
//            if(userByNewUsername != null && !currentUser.getId().equals(userByNewUsername.getId())) {
//                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
//            }
//            if(userByNewEmail != null && !currentUser.getId().equals(userByNewEmail.getId())) {
//                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
//            }
//            return currentUser;
//        } else {
//            if(userByNewUsername != null) {
//                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
//            }
//            if(userByNewEmail != null) {
//                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
//            }
//            return null;
//        }
//    }

}
