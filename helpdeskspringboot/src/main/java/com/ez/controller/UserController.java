package com.ez.controller;

import com.ez.entity.*;
import com.ez.exception.ExceptionHandling;
import com.ez.service.UserService;
import com.ez.utility.JWTTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.List;

import static com.ez.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.OK;


@RestController
//@RequestMapping(path = {"/", "/user"})
public class UserController extends ExceptionHandling {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    public static final String EMAIL_SENT = "An email with a new password was sent to: ";

    // no need this feature
//    public static final String USER_DELETED_SUCCESSFULLY = "User deleted successfully";
    private AuthenticationManager authenticationManager;
    private UserService userService;
    private JWTTokenProvider jwtTokenProvider;

    @Autowired
    public UserController(AuthenticationManager authenticationManager, UserService userService, JWTTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        // if username or password is invalid then throw an exception
        authenticate(user.getEmail(), user.getPassword());

        // authenticate success(username and password are correct)
//        User loginUser = userService.findUserByUsername(user.getUsername());
        User loginUser = userService.findUserByEmail(user.getEmail());

        // get the generated JWT and send back to client
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }
//    @GetMapping("/user-list")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    // parameters:
//    // - page: page number(1st, 2nd, 3rd,...,)
//    // - size: number of users per a page(default = 5)
//    public ResponseEntity<List<User>> getUsersByPage(@RequestParam int page, @RequestParam int size) {
//        List<User> users = userService.getUsersByPage(page, size);
//        return new ResponseEntity<>(users, OK);
//    }

    // search users by page based on the search criteria
    // parameters:
    //  - page: page number
    //  - size: page size(default = 5)
    //  - searchTerm: word to search
    //  - role: user role. = empty for all roles
    //  - status: user status. = empty for all status
    @GetMapping("/user-search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> searchUsers(@RequestParam int page,
                                                  @RequestParam int size,
                                                  @RequestParam(defaultValue = "") String searchTerm,
                                                  @RequestParam(defaultValue = "") String role,
                                                  @RequestParam(defaultValue = "") String status) {
        List<User> users = userService.searchUsers(page, size, searchTerm, role, status);

        return new ResponseEntity<>(users, OK);
    }

    // calculate total of users based on the search criteria.
    // use this total of users value to calculate total of pages for pagination.
    @GetMapping("/total-of-users")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfUsers(@RequestParam(defaultValue = "") String searchTerm,
                                                @RequestParam(defaultValue = "") String role,
                                                @RequestParam(defaultValue = "") String status) {

        // calculate total of users based on the search criteria
        long totalOfUsers = userService.getTotalOfUsers(searchTerm, role, status);

        return new ResponseEntity<Long>(totalOfUsers, HttpStatus.OK);
    }

    // create new user
    @PostMapping("/user-create")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user) throws EmailExistException, MessagingException {
        User newUser = userService.createUser(user);
        return new ResponseEntity<>(newUser, OK);
    }

    // find user by id
    @GetMapping("/user-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<User> findById(@PathVariable Long id) throws UserNotFoundException {

        LOGGER.info("find user by id: " + id) ;

        User user = userService.findById(id);

        return new ResponseEntity<>(user, OK);
    }

    // edit existing user
    @PutMapping("/user-edit")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<User> editUser(@RequestBody User user) throws EmailExistException, MessagingException, UserNotFoundException {

        User currentUser = userService.updateUser(user);
        return new ResponseEntity<>(currentUser, OK);
    }

//    @PostMapping("/register")
//    public ResponseEntity<User> register(@RequestBody User user) throws UserNotFoundException, UsernameExistException, EmailExistException, MessagingException {
//
//        // if register successful than send random password to register via email
//        User newUser = userService.register(user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail());
//        return new ResponseEntity<>(newUser, OK);
//    }

    // need to make a similar "/users"
//    @PostMapping("/add")
//    public ResponseEntity<User> addNewUser(@RequestParam("firstName") String firstName,
//                                           @RequestParam("lastName") String lastName,
//                                           @RequestParam("username") String username,
//                                           @RequestParam("email") String email,
//                                           @RequestParam("role") String role,
//                                           @RequestParam("isActive") String isActive
////                                           @RequestParam("isNonLocked") String isNonLocked,
////                                           @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
//    ) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException {
////        User newUser = userService.addNewUser(firstName, lastName, username, email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
//        User newUser = userService.addNewUser(firstName, lastName, username, email, role, Boolean.parseBoolean(isActive));
//        return new ResponseEntity<>(newUser, OK);
//    }

//    @PostMapping("/update")
//    public ResponseEntity<User> update(@RequestParam("currentUsername") String currentUsername,
//                                       @RequestParam("firstName") String firstName,
//                                       @RequestParam("lastName") String lastName,
//                                       @RequestParam("username") String username,
//                                       @RequestParam("email") String email,
//                                       @RequestParam("role") String role,
//                                       @RequestParam("isActive") String isActive,
//                                       @RequestParam("isNonLocked") String isNonLocked,
//                                       @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
//        User updatedUser = userService.updateUser(currentUsername, firstName, lastName, username, email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
//        return new ResponseEntity<>(updatedUser, OK);
//    }

//    @GetMapping("/find/{username}")
//    public ResponseEntity<User> getUser(@PathVariable("username") String username) {
//        User user = userService.findUserByUsername(username);
//        return new ResponseEntity<>(user, OK);
//    }


//    @GetMapping("/resetpassword/{email}")
//    public ResponseEntity<HttpResponse> resetPassword(@PathVariable("email") String email) throws MessagingException, EmailNotFoundException {
//        userService.resetPassword(email);
//        return response(OK, EMAIL_SENT + email);
//    }

//    @DeleteMapping("/delete/{username}")
//    // The @PreAuthorize annotation checks the given expression before entering the method
////    @PreAuthorize("hasAnyAuthority('user:delete')")
////    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
////    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("username") String username) throws IOException {
//        userService.deleteUser(username);
//        return response(OK, USER_DELETED_SUCCESSFULLY);
//    }

//    @PostMapping("/updateProfileImage")
//    public ResponseEntity<User> updateProfileImage(@RequestParam("username") String username, @RequestParam(value = "profileImage") MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
//        User user = userService.updateProfileImage(username, profileImage);
//        return new ResponseEntity<>(user, OK);
//    }

//    @GetMapping(path = "/image/{username}/{fileName}", produces = IMAGE_JPEG_VALUE)
//    public byte[] getProfileImage(@PathVariable("username") String username, @PathVariable("fileName") String fileName) throws IOException {
//        // ex: "user.home" + "/supportportal/user/dunglh/dunglh.jpg"
//        return Files.readAllBytes(Paths.get(USER_FOLDER + username + FORWARD_SLASH + fileName));
//    }

//    @GetMapping(path = "/image/profile/{username}", produces = IMAGE_JPEG_VALUE)
//    public byte[] getTempProfileImage(@PathVariable("username") String username) throws IOException {
//        URL url = new URL(TEMP_PROFILE_IMAGE_BASE_URL + username);
//        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//        try (InputStream inputStream = url.openStream()) {
//            int bytesRead;
//            byte[] chunk = new byte[1024];
//            while ((bytesRead = inputStream.read(chunk)) > 0) {
//                // read each 1024 bytes: 0 - 1024, 0 - 1024, 0 - 1024,...
//                byteArrayOutputStream.write(chunk, 0, bytesRead);
//            }
//        }
//        return byteArrayOutputStream.toByteArray();
//    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(),
                message), httpStatus);
    }

    private HttpHeaders getJwtHeader(UserPrincipal user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(user));
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
}

